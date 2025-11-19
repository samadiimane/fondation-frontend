"use client";

import {useMemo} from "react";
import {ArrowDown, ArrowUp, ChevronDown, ChevronRight} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

const TreeRow = ({
  node,
  depth,
  isExpanded,
  onToggle,
  onSelect,
  isSelected,
  canReorder,
  onMove,
  onRequestMove,
  moveLabel,
  canWrite,
}) => (
  <div
    className={`flex items-center gap-2 rounded-xl px-2 py-1 text-sm ${
      isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
    }`}
    style={{paddingLeft: `${depth * 16}px`}}
  >
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-6 w-6 shrink-0"
      onClick={() => onToggle(node)}
      aria-label="Toggle children"
    >
      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
    <button
      type="button"
      className="flex flex-1 flex-col items-start text-left"
      onClick={() => onSelect(node.id)}
    >
      <span className="font-medium">{node.name}</span>
      <span className="text-xs text-muted-foreground">{node.slug}</span>
    </button>
    <Badge variant="outline" className="text-xs">
      {node.document_count ?? 0}
    </Badge>
    <div className="flex items-center gap-1">
      {canReorder ? (
        <>
          <Button type="button" size="icon" variant="ghost" onClick={() => onMove(node.id, "up")}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => onMove(node.id, "down")}>
            <ArrowDown className="h-4 w-4" />
          </Button>
        </>
      ) : null}
      {canWrite ? (
        <Button type="button" size="sm" variant="ghost" onClick={() => onRequestMove?.(node)}>
          {moveLabel}
        </Button>
      ) : null}
    </div>
  </div>
);

const CategoryTreePanel = ({
  title = "Category tree",
  nodes,
  isLoading,
  expanded,
  onToggle,
  onSelect,
  selectedId,
  getChildren,
  onLoadChildren,
  canReorder,
  onMove,
  onRequestMove,
  moveLabel,
  canWrite,
}) => {
  const topLevel = useMemo(() => nodes ?? [], [nodes]);

  const resolveChildren = (node) => {
    const cached = getChildren(node.id);
    if (Array.isArray(cached)) {
      return cached;
    }
    if (Array.isArray(node.children)) {
      return node.children;
    }
    return [];
  };

  const handleToggle = (node) => {
    const nodeId = node.id;
    const currentlyExpanded = expanded.has(nodeId);
    if (!currentlyExpanded) {
      const cached = getChildren(nodeId);
      const eagerChildren = Array.isArray(node.children) && node.children.length > 0;
      if (!cached && !eagerChildren) {
        onLoadChildren(nodeId);
      }
    }
    onToggle(nodeId);
  };

  const renderTree = (items, depth = 0) =>
    items.map((item) => {
      const expandedState = expanded.has(item.id);
      const children = resolveChildren(item);
      return (
        <div key={item.id}>
          <TreeRow
            node={item}
            depth={depth}
            isExpanded={expandedState}
            onToggle={handleToggle}
            onSelect={onSelect}
            isSelected={item.id === selectedId}
            canReorder={canReorder}
            onMove={onMove}
            onRequestMove={onRequestMove}
            moveLabel={moveLabel}
            canWrite={canWrite}
          />
          {expandedState && children.length ? renderTree(children, depth + 1) : null}
        </div>
      );
    });

  return (
    <Card className="h-full rounded-3xl border bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 space-y-1 overflow-y-auto">
        {isLoading ? (
          Array.from({length: 6}).map((_, index) => <Skeleton key={index} className="h-8 w-full" />)
        ) : topLevel.length ? (
          renderTree(topLevel)
        ) : (
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        )}
      </div>
    </Card>
  );
};

export default CategoryTreePanel;
