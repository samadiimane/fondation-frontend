"use client";

import { useMemo, useState } from "react";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryToolbar from "@/components/category/CategoryToolbar";
import Pagination from "@/components/search/Pagination";
import { Link } from "@/i18n/navigation";
import useCategoryDocuments from "@/hooks/useCategoryDocuments";

const formatType = (value) => {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatLanguage = (value) => {
  if (!value) return "—";
  return value.toString().toUpperCase();
};

const formatPages = (value) => {
  if (!value) return "—";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  return `${numeric}`;
};

const formatSummary = ({ loading, hasLoadedOnce, total, page }) => {
  if (loading && !hasLoadedOnce) {
    return "Loading documents for this collection…";
  }
  if (loading && hasLoadedOnce) {
    return "Refreshing documents…";
  }
  if (!loading && hasLoadedOnce && total === 0) {
    return "No documents matched the current filters.";
  }
  if (!loading && total > 0) {
    return `${total} document${total === 1 ? "" : "s"} available — page ${page}`;
  }
  return "Browse documents associated with this collection.";
};

const CollectionClient = ({ category, slug }) => {
  const [typeFilterValue, setTypeFilterValue] = useState("");

  const {
    items,
    total,
    page,
    pageSize,
    loading,
    error,
    q,
    setQ,
    sort,
    setSort,
    setPage,
    hasNext,
    hasLoadedOnce,
  } = useCategoryDocuments(slug, { includeDescendants: false });

  const filteredItems = useMemo(() => {
    if (!typeFilterValue) return items;
    return items.filter((item) => (item.type ?? "").toLowerCase() === typeFilterValue.toLowerCase());
  }, [items, typeFilterValue]);

  const uniqueTypes = useMemo(() => {
    const values = new Set(
      items
        .map((item) => (item.type ?? "").toLowerCase())
        .filter((value) => value && value.trim().length > 0),
    );
    if (values.size === 0) return [];
    return [
      { value: "", label: "All types" },
      ...Array.from(values)
        .sort()
        .map((value) => ({ value, label: formatType(value) })),
    ];
  }, [items]);

  const summaryLabel = formatSummary({ loading, hasLoadedOnce, total: filteredItems.length, page });

  const handleReset = () => {
    setQ("");
    setSort("title_asc");
    setPage(1);
    setTypeFilterValue("");
  };

  return (
    <>
      <CategoryHeader
        title={category?.name}
        description={category?.description}
        meta={
          <span>
            {total} document{total === 1 ? "" : "s"} catalogued
          </span>
        }
      />

      <CategoryToolbar
        q={q}
        setQ={setQ}
        sort={sort}
        setSort={setSort}
        summaryLabel={summaryLabel}
        onReset={handleReset}
        typeFilter={
          uniqueTypes.length > 0
            ? {
                value: typeFilterValue,
                onChange: (value) => {
                  setTypeFilterValue(value);
                  setPage(1);
                },
                options: uniqueTypes,
              }
            : undefined
        }
      />

      <section className="category-documents__results">
        {loading && !hasLoadedOnce && (
          <div className="category-table category-table--skeleton" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="category-table__skeleton-row">
                {Array.from({ length: 5 }).map((__, colIndex) => (
                  <span key={`col-${colIndex}`} className="shimmer" />
                ))}
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="category-table category-table--empty" role="alert">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            <h3>We could not load documents for this collection.</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && hasLoadedOnce && (
          <div className="category-table category-table--empty" role="status">
            <i className="fa-solid fa-folder-open" aria-hidden="true"></i>
            <h3>No documents match your current filters.</h3>
            <p>Try adjusting your search term or clearing the filters.</p>
          </div>
        )}

        {!error && filteredItems.length > 0 && (
          <div className="category-table__wrapper">
            <table className="category-table" aria-label="Collection documents">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Year</th>
                  <th scope="col">Type • Language</th>
                  <th scope="col">Pages</th>
                  <th scope="col" className="category-table__actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((document) => (
                  <tr key={document.id ?? document.title}>
                    <td data-label="Title">
                      <span className="category-table__title">{document.title ?? "Untitled"}</span>
                      {document.abstract && (
                        <p className="category-table__abstract">
                          {document.abstract.length > 180
                            ? `${document.abstract.slice(0, 177)}…`
                            : document.abstract}
                        </p>
                      )}
                    </td>
                    <td data-label="Year">{document.year ?? "—"}</td>
                    <td data-label="Type • Language">
                      <span>{formatType(document.type)}</span>
                      <span className="category-table__muted">{formatLanguage(document.language ?? document.lang)}</span>
                    </td>
                    <td data-label="Pages">{formatPages(document.pages)}</td>
                    <td data-label="Actions" className="category-table__actions">
                      {document.id ? (
                        <Link href={`/documents/${document.id}`} className="category-table__action">
                          See details
                        </Link>
                      ) : (
                        <span className="category-table__action category-table__action--disabled">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasLoadedOnce && (filteredItems.length > 0 || hasNext) && !error && (
          <Pagination page={page} hasNext={hasNext} setPage={setPage} loading={loading} />
        )}
      </section>
    </>
  );
};

export default CollectionClient;
