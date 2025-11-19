"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useTranslations} from "next-intl";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import ParentSelect from "@/components/admin/categories/ParentSelect";

const MoveCategoryDialog = ({node, open, onOpenChange, onSubmit, isSubmitting}) => {
  const t = useTranslations("admin.categories");
  const [parentId, setParentId] = useState(null);
  const [order, setOrder] = useState("");
  const orderInputRef = useRef(null);

  useEffect(() => {
    if (open && node) {
      setParentId(node.parent_id ?? null);
      setOrder(node.order !== undefined && node.order !== null ? String(node.order) : "");
      // Delay focus to ensure dialog content mounts.
      requestAnimationFrame(() => orderInputRef.current?.focus());
    } else if (!open) {
      setParentId(null);
      setOrder("");
    }
  }, [node, open]);

  const kind = node?.kind ?? null;
  const orderValue = useMemo(() => {
    if (!order.trim()) return undefined;
    const parsed = Number(order);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [order]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!node) return;
    await onSubmit({
      id: node.id,
      parentId,
      order: orderValue,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("moveDialog.title")}</DialogTitle>
          <DialogDescription>{t("moveDialog.description")}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>{t("moveDialog.parentLabel")}</Label>
            <ParentSelect
              value={parentId}
              onChange={setParentId}
              kind={kind}
              disabled={!kind}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="move-order-input">{t("moveDialog.orderLabel")}</Label>
            <Input
              id="move-order-input"
              type="number"
              value={order}
              onChange={(event) => setOrder(event.target.value)}
              placeholder={t("moveDialog.orderPlaceholder")}
              ref={orderInputRef}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("moveDialog.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("actions.working") : t("moveDialog.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MoveCategoryDialog;
