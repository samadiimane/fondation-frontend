"use client";

import { memo, useCallback } from "react";
import BasePagination from "@/components/Pagination";

const Pagination = ({ page, hasNext, setPage, loading, content }) => {
  const handleChange = useCallback(
    (nextPage) => {
      setPage?.(nextPage);
    },
    [setPage]
  );

  return (
    <BasePagination
      page={page}
      hasNext={hasNext}
      onPageChange={handleChange}
      isLoading={loading}
      labels={content.pagination}
    />
  );
};

export default memo(Pagination);
