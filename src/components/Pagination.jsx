'use client';
import styles from './Pagination.module.scss';

// Simple prev/next pagination tailored for API-backed listings.
const Pagination = ({ page, hasNext, onPageChange, isLoading, labels }) => {
  const aria = labels?.aria ?? "Pagination";
  const prevLabel = labels?.prev ?? "Previous";
  const nextLabel = labels?.next ?? "Next";
  const pageLabel = labels?.page ? labels.page(page) : `Page ${page}`;
  const ariaPrev = labels?.prev ? `${prevLabel}` : "Previous page";
  const ariaNext = labels?.next ? `${nextLabel}` : "Next page";

  const handlePrev = () => {
    if (page > 1 && !isLoading) {
      onPageChange?.(page - 1);
    }
  };

  const handleNext = () => {
    if (hasNext && !isLoading) {
      onPageChange?.(page + 1);
    }
  };

  return (
    <nav className={styles.pagination} aria-label={aria}>
      <button
        type='button'
        className={styles.button}
        onClick={handlePrev}
        disabled={page <= 1 || isLoading}
        aria-label={ariaPrev}
      >
        {prevLabel}
      </button>
      <span className={styles.pageIndicator} aria-live='polite'>
        {pageLabel}
      </span>
      <button
        type='button'
        className={styles.button}
        onClick={handleNext}
        disabled={!hasNext || isLoading}
        aria-label={ariaNext}
      >
        {nextLabel}
      </button>
    </nav>
  );
};

export default Pagination;
