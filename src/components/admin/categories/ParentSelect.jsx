"use client";

import {useEffect, useMemo, useState} from "react";
import {useTranslations} from "next-intl";
import {useQuery} from "@tanstack/react-query";

import {CATEGORY_LIST_QUERY_KEY, listCategories} from "@/lib/api/adminCategories";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
import {ScrollArea} from "@/components/ui/scroll-area";

const formatOptionLabel = (item) => {
  if (!item.path?.length) {
    return item.name;
  }
  return item.path.map((fragment) => fragment.name).join(" / ");
};

const NONE_VALUE = "__none";

const ParentSelect = ({value, onChange, kind, disabled, label}) => {
  const t = useTranslations("admin.categories");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
  }, [kind]);

  const queryEnabled = Boolean(kind) && !disabled;
  const parentQuery = useQuery({
    queryKey: [...CATEGORY_LIST_QUERY_KEY, {q: search, kind, page: 1}],
    queryFn: ({signal}) =>
      listCategories({
        q: search,
        kind: kind ?? undefined,
        page: 1,
        pageSize: 50,
        sort: "name",
        signal,
      }),
    enabled: queryEnabled,
    staleTime: 5 * 60_000,
  });

  const options = useMemo(() => parentQuery.data?.items ?? [], [parentQuery.data]);

  const handleSelect = (nextValue) => {
    if (nextValue === NONE_VALUE) {
      onChange(null);
      return;
    }
    const parsed = Number(nextValue);
    onChange(Number.isNaN(parsed) ? null : parsed);
  };

  return (
    <div className="space-y-2">
      {label ? <Label>{label}</Label> : null}
      <Input
        type="search"
        placeholder={t("parent.searchPlaceholder")}
        value={search}
        disabled={!queryEnabled}
        onChange={(event) => setSearch(event.target.value)}
      />
      <Select
        value={value === null || value === undefined ? NONE_VALUE : String(value)}
        onValueChange={handleSelect}
        disabled={!queryEnabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("parent.placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>{t("parent.none")}</SelectItem>
          <ScrollArea className="max-h-64">
            {parentQuery.isLoading ? (
              <div className="p-2">
                <Skeleton className="h-6 w-full" />
              </div>
            ) : options.length ? (
              options.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {formatOptionLabel(option)}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">{t("parent.empty")}</div>
            )}
          </ScrollArea>
        </SelectContent>
      </Select>
      {search ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="px-2 text-xs text-muted-foreground"
          onClick={() => setSearch("")}
        >
          {t("parent.clearSearch")}
        </Button>
      ) : null}
    </div>
  );
};

export default ParentSelect;
