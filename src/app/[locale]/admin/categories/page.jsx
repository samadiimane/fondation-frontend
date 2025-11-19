"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {useTranslations} from "next-intl";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import CategoryToolbar from "@/components/admin/categories/CategoryToolbar";
import CategoryTreePanel from "@/components/admin/categories/CategoryTreePanel";
import CategoryInspector from "@/components/admin/categories/CategoryInspector";
import MoveCategoryDialog from "@/components/admin/categories/MoveCategoryDialog";
import {
  CATEGORY_CHILDREN_QUERY_KEY,
  CATEGORY_LIST_QUERY_KEY,
  CATEGORY_TREE_QUERY_KEY,
  createCategory,
  deleteCategory,
  getCategoryChildren,
  getCategoryTree,
  listCategories,
  moveCategory,
  reorderCategories,
  updateCategory,
} from "@/lib/api/adminCategories";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {Badge} from "@/components/ui/badge";
import useNotify from "@/hooks/useNotify";
import useAdminCapabilities from "@/hooks/useAdminCapabilities";
import useAuth from "@/hooks/useAuth";

const PAGE_SIZE = 20;
const TREE_DEPTH = 2;

const cacheKeyForParent = (parentId) => (parentId === null || parentId === undefined ? "root" : String(parentId));

const cloneNode = (node) => ({
  ...node,
  children: node?.children ? cloneNodes(node.children) : node?.children,
});

const cloneNodes = (nodes = []) => nodes.map((node) => cloneNode(node));

const clampIndex = (value, length) => {
  if (value === undefined || value === null) return length;
  if (!Number.isFinite(value)) return length;
  return Math.max(0, Math.min(length, value));
};

const applyInsertIntoTree = (nodes, parentId, newNode, order) => {
  if (parentId === null || parentId === undefined) {
    nodes.splice(clampIndex(order, nodes.length), 0, newNode);
    return true;
  }
  for (const node of nodes) {
    if (node.id === parentId) {
      const children = node.children ? node.children : (node.children = []);
      children.splice(clampIndex(order, children.length), 0, newNode);
      return true;
    }
    if (node.children && applyInsertIntoTree(node.children, parentId, newNode, order)) {
      return true;
    }
  }
  return false;
};

const applyUpdateInTree = (nodes, nodeId, updater) => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      updater(node);
      return true;
    }
    if (node.children && applyUpdateInTree(node.children, nodeId, updater)) {
      return true;
    }
  }
  return false;
};

const applyReplaceInTree = (nodes, nodeId, replacement) => {
  return applyUpdateInTree(nodes, nodeId, (node) => {
    const preservedChildren = node.children;
    Object.assign(node, replacement);
    if (preservedChildren && !node.children) {
      node.children = preservedChildren;
    }
  });
};

const applyRemoveFromTree = (nodes, nodeId, currentParentId = null) => {
  const index = nodes.findIndex((node) => node.id === nodeId);
  if (index !== -1) {
    const [removed] = nodes.splice(index, 1);
    return {removed, parentId: currentParentId};
  }
  for (const node of nodes) {
    if (node.children) {
      const result = applyRemoveFromTree(node.children, nodeId, node.id);
      if (result) {
        if (node.children.length === 0) {
          node.children = undefined;
        }
        return result;
      }
    }
  }
  return null;
};

const insertIntoList = (list, node, order) => {
  list.splice(clampIndex(order, list.length), 0, node);
  return true;
};

const updateListNode = (list, nodeId, updater) => {
  const index = list.findIndex((entry) => entry.id === nodeId);
  if (index === -1) return false;
  list[index] = updater(list[index]);
  return true;
};

const removeFromList = (list, nodeId) => {
  const index = list.findIndex((entry) => entry.id === nodeId);
  if (index === -1) return {removed: null};
  const [removed] = list.splice(index, 1);
  return {removed};
};

const reorderList = (list, orderItems) => {
  if (!Array.isArray(orderItems) || !orderItems.length) return false;
  const orderMap = new Map(orderItems.map((item) => [item.id, item.order]));
  list.sort((a, b) => {
    const aOrder = orderMap.has(a.id) ? orderMap.get(a.id) : a.order ?? 0;
    const bOrder = orderMap.has(b.id) ? orderMap.get(b.id) : b.order ?? 0;
    return aOrder - bOrder;
  });
  list.forEach((node, index) => {
    node.order = index;
  });
  return true;
};

const applyReorderInTree = (nodes, parentId, orderItems) => {
  if (!Array.isArray(orderItems) || !orderItems.length) {
    return false;
  }
  if (parentId === null || parentId === undefined) {
    return reorderList(nodes, orderItems);
  }
  for (const node of nodes) {
    if (node.id === parentId && node.children) {
      return reorderList(node.children, orderItems);
    }
    if (node.children && applyReorderInTree(node.children, parentId, orderItems)) {
      return true;
    }
  }
  return false;
};

const AdminCategoriesPage = () => {
  const t = useTranslations("admin.categories");
  const notify = useNotify();
  const {logout} = useAuth();
  const queryClient = useQueryClient();
  const {data: adminCapabilities} = useAdminCapabilities();

  const [kindFilter, setKindFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [listPage, setListPage] = useState(1);
  const [expanded, setExpanded] = useState(() => new Set());
  const [childCache, setChildCache] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);

  const restoreChildCache = useCallback(
    (parentId, nodes) => {
      const key = cacheKeyForParent(parentId);
      setChildCache((prev) => {
        if (nodes === undefined) {
          if (!(key in prev)) return prev;
          const {[key]: _removed, ...rest} = prev;
          return rest;
        }
        return {...prev, [key]: nodes};
      });
    },
    [setChildCache],
  );

  const canTreeRead = adminCapabilities?.categories?.treeRead !== false;
  const canTreeWrite = adminCapabilities?.categories?.treeWrite !== false;
  const canReorder = adminCapabilities?.categories?.reorder !== false && canTreeWrite;

  const kindOptions = useMemo(
    () => [
      {value: "all", label: t("kinds.all")},
      {value: "section", label: t("kinds.section")},
      {value: "journal", label: t("kinds.journal")},
      {value: "archive_collection", label: t("kinds.archive_collection")},
      {value: "topic", label: t("kinds.topic")},
    ],
    [t],
  );

  const kindParam = kindFilter === "all" ? undefined : kindFilter;

  const treeQueryKey = useMemo(() => [...CATEGORY_TREE_QUERY_KEY, kindFilter, TREE_DEPTH], [kindFilter]);

  const treeQuery = useQuery({
    queryKey: treeQueryKey,
    queryFn: ({signal}) =>
      getCategoryTree({kind: kindParam, maxDepth: TREE_DEPTH, includeCounts: true, signal}),
    staleTime: 5 * 60_000,
    enabled: canTreeRead,
  });

  const rootNodes = treeQuery.data ?? [];

  useEffect(() => {
    setExpanded(new Set());
    setSelectedId(null);
    setChildCache({});
    setMoveTarget(null);
  }, [kindFilter]);

  const listQueryKey = useMemo(
    () => [...CATEGORY_LIST_QUERY_KEY, {q: searchQuery, kind: kindFilter, page: listPage}],
    [searchQuery, kindFilter, listPage],
  );

  const listQuery = useQuery({
    queryKey: listQueryKey,
    queryFn: ({signal}) =>
      listCategories({
        q: searchQuery,
        kind: kindParam,
        page: listPage,
        pageSize: PAGE_SIZE,
        sort: "name",
        signal,
      }),
    enabled: Boolean(searchQuery.trim()) && canTreeRead,
    keepPreviousData: true,
  });

  const getChildrenQueryKey = useCallback(
    (parentId) => [...CATEGORY_CHILDREN_QUERY_KEY, parentId ?? null],
    [],
  );

  const nodeIndex = useMemo(() => {
    const map = new Map();
    const visit = (nodes = []) => {
      nodes.forEach((node) => {
        map.set(node.id, node);
        if (Array.isArray(node.children)) {
          visit(node.children);
        }
      });
    };
    visit(rootNodes);
    Object.values(childCache).forEach((nodes) => visit(nodes));
    return map;
  }, [rootNodes, childCache]);

  useEffect(() => {
    if (selectedId && !nodeIndex.has(selectedId)) {
      setSelectedId(null);
    }
  }, [selectedId, nodeIndex]);

  const selectedNode = selectedId ? nodeIndex.get(selectedId) ?? null : null;

  const hasNodeChildren = useCallback(
    (nodeId) => {
      if (!nodeId) return false;
      const cached = childCache[cacheKeyForParent(nodeId)];
      if (Array.isArray(cached) && cached.length > 0) {
        return true;
      }
      const node = nodeIndex.get(nodeId);
      return Boolean(node?.children?.length);
    },
    [childCache, nodeIndex],
  );

  const deleteDisabled =
    !selectedNode || selectedNode.document_count > 0 || hasNodeChildren(selectedNode.id);
  const deleteTooltip = deleteDisabled ? t("delete.disabledHint") : "";

  const handleApiError = useCallback(
    (error, fallbackKey = "errors.generic") =>
      notify.handleError(error, t(fallbackKey), {
        onSessionExpired: () => logout?.(),
        sessionExpiredMessage: t("errors.sessionExpired"),
        forbiddenMessage: t("errors.forbidden"),
        networkMessage: t("errors.network"),
      }),
    [logout, notify, t],
  );

  const getChildren = useCallback(
    (parentId) => childCache[cacheKeyForParent(parentId)],
    [childCache],
  );

  const loadChildren = useCallback(
    async (parentId) => {
      const cacheKey = cacheKeyForParent(parentId);
      if (childCache[cacheKey]) return;
      try {
        const nodes = await queryClient.fetchQuery({
          queryKey: getChildrenQueryKey(parentId),
          queryFn: ({signal}) => getCategoryChildren({parentId, signal}),
        });
        setChildCache((prev) => ({...prev, [cacheKey]: nodes}));
      } catch (error) {
        handleApiError(error, "errors.loadChildren");
      }
    },
    [childCache, getChildrenQueryKey, queryClient, handleApiError],
  );

  const invalidateCategories = useCallback(() => {
    queryClient.invalidateQueries({queryKey: CATEGORY_TREE_QUERY_KEY});
    queryClient.invalidateQueries({queryKey: CATEGORY_CHILDREN_QUERY_KEY});
    queryClient.invalidateQueries({queryKey: CATEGORY_LIST_QUERY_KEY});
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: createCategory,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({queryKey: treeQueryKey});
      const parentId = variables.parent_id ?? null;
      const tempId = `temp-${Date.now()}`;
      const optimisticNode = {
        id: tempId,
        name: variables.name,
        slug: variables.slug || variables.name,
        kind: variables.kind,
        parent_id: parentId,
        order: variables.order ?? 0,
        document_count: 0,
      };

      const previousTree = queryClient.getQueryData(treeQueryKey);
      let treeChanged = false;
      if (previousTree) {
        const cloned = cloneNodes(previousTree);
        treeChanged = applyInsertIntoTree(cloned, parentId, optimisticNode, variables.order ?? null);
        if (treeChanged) {
          queryClient.setQueryData(treeQueryKey, cloned);
        }
      }

      const previousChildren =
        parentId !== null ? queryClient.getQueryData(getChildrenQueryKey(parentId)) : undefined;
      let childrenChanged = false;
      if (previousChildren) {
        const clonedChildren = cloneNodes(previousChildren);
        insertIntoList(clonedChildren, optimisticNode, variables.order ?? null);
        childrenChanged = true;
        queryClient.setQueryData(getChildrenQueryKey(parentId), clonedChildren);
        setChildCache((prev) => ({
          ...prev,
          [cacheKeyForParent(parentId)]: clonedChildren,
        }));
      }

      return {tempId, parentId, previousTree, previousChildren, treeChanged, childrenChanged};
    },
    onError: (error, _variables, context) => {
      if (context?.treeChanged) {
        queryClient.setQueryData(treeQueryKey, context.previousTree);
      }
      if (context?.childrenChanged && context.parentId !== null) {
        queryClient.setQueryData(getChildrenQueryKey(context.parentId), context.previousChildren);
        restoreChildCache(context.parentId, context.previousChildren);
      }
      handleApiError(error, "errors.create");
    },
    onSuccess: (result, _variables, context) => {
      const serverNode = cloneNode(result);
      if (context?.treeChanged) {
        queryClient.setQueryData(treeQueryKey, (current) => {
          if (!current) return current;
          const cloned = cloneNodes(current);
          applyReplaceInTree(cloned, context.tempId, serverNode);
          return cloned;
        });
      }
      if (context?.childrenChanged && context.parentId !== null) {
        queryClient.setQueryData(getChildrenQueryKey(context.parentId), (current) => {
          if (!current) return current;
          const cloned = cloneNodes(current);
          updateListNode(cloned, context.tempId, () => serverNode);
          return cloned;
        });
        setChildCache((prev) => {
          const key = cacheKeyForParent(context.parentId);
          const existing = prev[key];
          if (!existing) return prev;
          const next = existing.map((node) => (node.id === context.tempId ? serverNode : node));
          return {...prev, [key]: next};
        });
      }
      notify.success(t("toast.created"));
    },
    onSettled: () => invalidateCategories(),
  });

  const updateMutation = useMutation({
    mutationFn: ({id, patch}) => updateCategory({id, patch}),
    onMutate: async ({id, patch, parentId}) => {
      await queryClient.cancelQueries({queryKey: treeQueryKey});
      await queryClient.cancelQueries({queryKey: listQueryKey});
      const previousTree = queryClient.getQueryData(treeQueryKey);
      let treeChanged = false;
      if (previousTree) {
        const cloned = cloneNodes(previousTree);
        treeChanged = applyUpdateInTree(cloned, id, (node) => {
          if (patch.name !== undefined) node.name = patch.name;
          if (patch.slug !== undefined) node.slug = patch.slug;
        });
        if (treeChanged) {
          queryClient.setQueryData(treeQueryKey, cloned);
        }
      }

      const previousChildren =
        parentId !== null ? queryClient.getQueryData(getChildrenQueryKey(parentId)) : undefined;
      let childrenChanged = false;
      if (previousChildren) {
        const clonedChildren = cloneNodes(previousChildren);
        childrenChanged = updateListNode(clonedChildren, id, (node) => ({
          ...node,
          name: patch.name ?? node.name,
          slug: patch.slug ?? node.slug,
        }));
        if (childrenChanged) {
          queryClient.setQueryData(getChildrenQueryKey(parentId), clonedChildren);
          setChildCache((prev) => ({
            ...prev,
            [cacheKeyForParent(parentId)]: clonedChildren,
          }));
        }
      }

      const previousList = queryClient.getQueryData(listQueryKey);
      let listChanged = false;
      if (previousList) {
        let listUpdated = false;
        const nextItems = previousList.items.map((item) => {
          if (item.id !== id) {
            return item;
          }
          listUpdated = true;
          return {
            ...item,
            name: patch.name ?? item.name,
            slug: patch.slug ?? item.slug,
          };
        });
        if (listUpdated) {
          listChanged = true;
          queryClient.setQueryData(listQueryKey, {...previousList, items: nextItems});
        }
      }

      return {
        previousTree,
        treeChanged,
        previousChildren,
        childrenChanged,
        parentId,
        previousList,
        listChanged,
      };
    },
    onError: (error, _variables, context) => {
      if (context?.treeChanged) {
        queryClient.setQueryData(treeQueryKey, context.previousTree);
      }
      if (context?.childrenChanged && context.parentId !== null) {
        queryClient.setQueryData(getChildrenQueryKey(context.parentId), context.previousChildren);
        setChildCache((prev) => ({
          ...prev,
          [cacheKeyForParent(context.parentId)]: context.previousChildren,
        }));
      }
      if (context?.listChanged) {
        queryClient.setQueryData(listQueryKey, context.previousList);
      }
      handleApiError(error, "errors.update");
    },
    onSuccess: () => {
      notify.success(t("toast.updated"));
    },
    onSettled: () => invalidateCategories(),
  });

  const moveMutation = useMutation({
    mutationFn: ({id, parentId, order}) => moveCategory(id, {parentId, order}),
    onMutate: async ({id, parentId, order, previousParentId}) => {
      await queryClient.cancelQueries({queryKey: treeQueryKey});
      const previousTree = queryClient.getQueryData(treeQueryKey);
      let removedNode;
      let treeChanged = false;
      if (previousTree) {
        const cloned = cloneNodes(previousTree);
        const removal = applyRemoveFromTree(cloned, id);
        removedNode = removal?.removed;
        if (removedNode) {
          removedNode.parent_id = parentId ?? null;
          treeChanged = applyInsertIntoTree(cloned, parentId, removedNode, order ?? null);
        }
        if (treeChanged) {
          queryClient.setQueryData(treeQueryKey, cloned);
        }
      }

      const previousSourceChildren =
        previousParentId !== null ? queryClient.getQueryData(getChildrenQueryKey(previousParentId)) : undefined;
      if (previousSourceChildren) {
        const cloned = cloneNodes(previousSourceChildren);
        removeFromList(cloned, id);
        queryClient.setQueryData(getChildrenQueryKey(previousParentId), cloned);
        setChildCache((prev) => ({
          ...prev,
          [cacheKeyForParent(previousParentId)]: cloned,
        }));
      }

      const previousTargetChildren =
        parentId !== null ? queryClient.getQueryData(getChildrenQueryKey(parentId)) : undefined;
      if (previousTargetChildren) {
        const cloned = cloneNodes(previousTargetChildren);
        insertIntoList(
          cloned,
          removedNode || nodeIndex.get(id) || {id, parent_id: parentId, order: order ?? 0},
          order ?? null,
        );
        queryClient.setQueryData(getChildrenQueryKey(parentId), cloned);
        setChildCache((prev) => ({
          ...prev,
          [cacheKeyForParent(parentId)]: cloned,
        }));
      }

      return {
        previousTree,
        treeChanged,
        previousSourceChildren,
        previousTargetChildren,
        previousParentId,
        parentId,
      };
    },
    onError: (error, _variables, context) => {
      if (context?.treeChanged) {
        queryClient.setQueryData(treeQueryKey, context.previousTree);
      }
      if (context?.previousSourceChildren && context.previousParentId !== null) {
        queryClient.setQueryData(
          getChildrenQueryKey(context.previousParentId),
          context.previousSourceChildren,
        );
        restoreChildCache(context.previousParentId, context.previousSourceChildren);
      }
      if (context?.previousTargetChildren && context.parentId !== null) {
        queryClient.setQueryData(getChildrenQueryKey(context.parentId), context.previousTargetChildren);
        restoreChildCache(context.parentId, context.previousTargetChildren);
      }
      handleApiError(error, "errors.update");
    },
    onSuccess: () => {
      notify.success(t("toast.updated"));
    },
    onSettled: () => invalidateCategories(),
  });

  const reorderMutation = useMutation({
    mutationFn: reorderCategories,
    onMutate: async ({parentId, items}) => {
      await queryClient.cancelQueries({queryKey: treeQueryKey});
      const previousTree = queryClient.getQueryData(treeQueryKey);
      let treeChanged = false;
      if (previousTree) {
        const cloned = cloneNodes(previousTree);
        treeChanged = applyReorderInTree(cloned, parentId, items);
        if (treeChanged) {
          queryClient.setQueryData(treeQueryKey, cloned);
        }
      }
      const previousChildren =
        parentId !== null ? queryClient.getQueryData(getChildrenQueryKey(parentId)) : undefined;
      if (previousChildren) {
        const cloned = cloneNodes(previousChildren);
        reorderList(cloned, items);
        queryClient.setQueryData(getChildrenQueryKey(parentId), cloned);
        setChildCache((prev) => ({
          ...prev,
          [cacheKeyForParent(parentId)]: cloned,
        }));
      }
      return {previousTree, treeChanged, previousChildren, parentId};
    },
    onError: (error, _variables, context) => {
      if (context?.treeChanged) {
        queryClient.setQueryData(treeQueryKey, context.previousTree);
      }
      if (context?.previousChildren && context.parentId !== null) {
        queryClient.setQueryData(getChildrenQueryKey(context.parentId), context.previousChildren);
        restoreChildCache(context.parentId, context.previousChildren);
      }
      handleApiError(error, "errors.reorder");
    },
    onSuccess: () => {
      notify.success(t("toast.reordered"));
    },
    onSettled: () => invalidateCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: ({id}) => deleteCategory(id),
    onMutate: async ({id, parentId}) => {
      await queryClient.cancelQueries({queryKey: treeQueryKey});
      const previousTree = queryClient.getQueryData(treeQueryKey);
      if (previousTree) {
        const cloned = cloneNodes(previousTree);
        const result = applyRemoveFromTree(cloned, id);
        if (result?.removed) {
          queryClient.setQueryData(treeQueryKey, cloned);
        }
      }
      const previousChildren =
        parentId !== null ? queryClient.getQueryData(getChildrenQueryKey(parentId)) : undefined;
      if (previousChildren) {
        const cloned = cloneNodes(previousChildren);
        removeFromList(cloned, id);
        queryClient.setQueryData(getChildrenQueryKey(parentId), cloned);
        setChildCache((prev) => ({
          ...prev,
          [cacheKeyForParent(parentId)]: cloned,
        }));
      }
      return {previousTree, previousChildren, parentId};
    },
    onError: (error, _variables, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(treeQueryKey, context.previousTree);
      }
      if (context?.previousChildren && context.parentId !== null) {
        queryClient.setQueryData(getChildrenQueryKey(context.parentId), context.previousChildren);
        restoreChildCache(context.parentId, context.previousChildren);
      }
      handleApiError(error, "errors.delete");
    },
    onSuccess: () => {
      notify.success(t("toast.deleted"));
      setSelectedId(null);
    },
    onSettled: () => invalidateCategories(),
  });


  const handleCreate = async (payload) => {
    await createMutation.mutateAsync(payload);
  };

  const handleSave = async ({id, ...patch}) => {
    const parentId = nodeIndex.get(id)?.parent_id ?? null;
    if (!patch || Object.keys(patch).length === 0) return;
    await updateMutation.mutateAsync({id, patch, parentId});
  };

  const handleDelete = async (id) => {
    const parentId = nodeIndex.get(id)?.parent_id ?? null;
    await deleteMutation.mutateAsync({id, parentId});
  };

  const handleMove = async ({id, parentId, order}) => {
    const previousParentId = nodeIndex.get(id)?.parent_id ?? null;
    await moveMutation.mutateAsync({id, parentId, order, previousParentId});
    if (moveTarget) {
      setMoveTarget(null);
    }
  };

  const handleReorder = (nodeId, direction) => {
    const node = nodeIndex.get(nodeId);
    if (!node) {
      return;
    }
    const parentId = node.parent_id ?? null;
    const siblings =
      parentId === null
        ? rootNodes
        : getChildren(parentId) ?? nodeIndex.get(parentId)?.children ?? [];
    if (!siblings || !siblings.length) {
      return;
    }
    const ordered = [...siblings].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const currentIndex = ordered.findIndex((item) => item.id === nodeId);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= ordered.length) return;
    const swapped = [...ordered];
    const [removed] = swapped.splice(currentIndex, 1);
    swapped.splice(targetIndex, 0, removed);
    const items = swapped.map((item, index) => ({id: item.id, order: index}));
    reorderMutation.mutate({parentId, items});
  };

  const searchResults = listQuery.data?.items ?? [];
  const hasSearch = Boolean(searchQuery.trim());

  if (!canTreeRead) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t("errors.noAccess")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <p className="text-sm uppercase text-primary/80">{t("title")}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{t("subtitle")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </header>

      <CategoryToolbar
        query={searchQuery}
        onQueryChange={(value) => {
          setSearchQuery(value);
          setListPage(1);
        }}
        kind={kindFilter}
        onKindChange={(value) => {
          setKindFilter(value);
          setListPage(1);
        }}
        canCreate={canTreeWrite}
        isCreating={createMutation.isPending}
        onCreateCategory={handleCreate}
        kindOptions={kindOptions}
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <CategoryTreePanel
          title={t("tree.title")}
          nodes={rootNodes}
          isLoading={treeQuery.isLoading}
          expanded={expanded}
          onToggle={(nodeId) =>
            setExpanded((prev) => {
              const next = new Set(prev);
              if (next.has(nodeId)) {
                next.delete(nodeId);
              } else {
                next.add(nodeId);
              }
              return next;
            })
          }
          onSelect={setSelectedId}
          selectedId={selectedId}
          getChildren={getChildren}
          onLoadChildren={loadChildren}
          canReorder={canReorder}
          onMove={handleReorder}
          canWrite={canTreeWrite}
          onRequestMove={(node) => setMoveTarget(node)}
          moveLabel={t("actions.move")}
        />
        <div className="space-y-4">
          <CategoryInspector
            node={selectedNode}
            canWrite={canTreeWrite}
            onSave={handleSave}
            isSaving={updateMutation.isPending}
            onMove={handleMove}
            isMoving={moveMutation.isPending}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
            canDelete={!deleteDisabled}
            deleteTooltip={deleteTooltip}
          />
          {hasSearch ? (
            <Card className="rounded-3xl border bg-white p-4 shadow">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">{t("searchResults.title")}</h3>
                <div className="text-xs text-muted-foreground">
                  {listQuery.data
                    ? t("searchResults.summary", {
                        total: listQuery.data.total,
                        page: listQuery.data.page,
                      })
                    : null}
                </div>
              </div>
              {listQuery.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : searchResults.length ? (
                <div className="space-y-3">
                  {searchResults.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className="w-full rounded-2xl border border-border px-3 py-2 text-left hover:bg-muted"
                    >
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>{item.name}</span>
                        <Badge variant="outline" className="capitalize">
                          {item.kind}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.path.map((fragment) => fragment.name).join(" / ")}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t("searchResults.empty")}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setListPage((prev) => Math.max(prev - 1, 1))}
                  disabled={listPage <= 1 || listQuery.isLoading}
                >
                  {t("pagination.previous")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setListPage((prev) => prev + 1)}
                  disabled={listQuery.isLoading || !listQuery.data?.hasNext}
                >
                  {t("pagination.next")}
                </Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
      <MoveCategoryDialog
        node={moveTarget}
        open={Boolean(moveTarget)}
        onOpenChange={(open) => {
          if (!open) setMoveTarget(null);
        }}
        onSubmit={handleMove}
        isSubmitting={moveMutation.isPending}
      />
    </div>
  );
};

export default AdminCategoriesPage;
