"use client";

import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import ParentSelect from "@/components/admin/categories/ParentSelect";

const CategoryInspector = ({
  node,
  canWrite,
  onSave,
  isSaving,
  onMove,
  isMoving,
  onDelete,
  isDeleting,
  canDelete = true,
  deleteTooltip = "",
}) => {
  const t = useTranslations("admin.categories");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState(null);
  const [order, setOrder] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!node) {
      setName("");
      setSlug("");
      setParentId(null);
      setOrder("");
      return;
    }
    setName(node.name ?? "");
    setSlug(node.slug ?? "");
    setParentId(node.parent_id ?? null);
    setOrder(node.order?.toString() ?? "");
  }, [node]);

  const currentKind = node?.kind ?? null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!node || !canWrite) return;
    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();
    const nextParentId = parentId;
    const nextOrder = order ? Number(order) : undefined;

    const patch = {};
    if (trimmedName && trimmedName !== node.name) {
      patch.name = trimmedName;
    }
    if (trimmedSlug && trimmedSlug !== node.slug) {
      patch.slug = trimmedSlug;
    }
    const parentChanged = (nextParentId ?? null) !== (node.parent_id ?? null);
    const orderChanged = nextOrder !== undefined && nextOrder !== (node.order ?? 0);

    if (Object.keys(patch).length > 0) {
      await onSave({
        id: node.id,
        ...patch,
      });
    }
    if (onMove && (parentChanged || orderChanged)) {
      await onMove({
        id: node.id,
        parentId: nextParentId,
        order: nextOrder,
      });
    }
  };

  return (
    <Card className="rounded-3xl border bg-white shadow">
      <CardHeader>
        <CardTitle>{t("inspector.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {node ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Alert>
              <AlertTitle>{t("inspector.metaTitle")}</AlertTitle>
              <AlertDescription className="flex flex-col gap-1 text-sm">
                <span>
                  {t("fields.kind")}:{" "}
                  <Badge variant="outline" className="capitalize">
                    {node.kind}
                  </Badge>
                </span>
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>{t("fields.name")}</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} disabled={!canWrite} />
            </div>
            <div className="space-y-2">
              <Label>{t("fields.slug")}</Label>
              <Input value={slug} onChange={(event) => setSlug(event.target.value)} disabled={!canWrite} />
            </div>
            <ParentSelect
              value={parentId}
              onChange={setParentId}
              kind={currentKind}
              disabled={!canWrite || !currentKind}
              label={t("fields.parent")}
            />
            <div className="space-y-2">
              <Label>{t("fields.order")}</Label>
              <Input
                type="number"
                value={order}
                onChange={(event) => setOrder(event.target.value)}
                disabled={!canWrite}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!canWrite || isSaving || isMoving}>
                {isSaving || isMoving ? t("actions.working") : t("actions.save")}
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={!canDelete || isDeleting}
                    onClick={() => setConfirmOpen(true)}
                  >
                    {isDeleting ? t("actions.working") : t("actions.delete")}
                  </Button>
                </TooltipTrigger>
                {!canDelete && deleteTooltip ? (
                  <TooltipContent>{deleteTooltip}</TooltipContent>
                ) : null}
              </Tooltip>
            </div>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">{t("inspector.empty")}</p>
        )}
      </CardContent>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("delete.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">{t("delete.confirmMessage", {name: node?.name ?? ""})}</p>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!node) return;
                await onDelete(node.id);
                setConfirmOpen(false);
              }}
              disabled={isDeleting}
            >
              {t("actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CategoryInspector;
