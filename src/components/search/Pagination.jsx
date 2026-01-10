"use client";

import { memo, useCallback } from "react";
import BasePagination from "@/components/Pagination";

const DEFAULT_LABELS = {
  aria: "Pagination",
  prev: "Previous",
  next: "Next",
  page: (page) => `Page ${page}`,
};

const Pagination = ({ page, hasNext, setPage, loading, content }) => {
  const handleChange = useCallback(
    (nextPage) => {
      setPage?.(nextPage);
    },
    [setPage]
  );

  const labels = content?.pagination || DEFAULT_LABELS;

  return (
    <BasePagination
      page={page}
      hasNext={hasNext}
      onPageChange={handleChange}
      isLoading={loading}
      labels={labels}
    />
  );
};

export default memo(Pagination);
