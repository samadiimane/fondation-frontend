'use client';
import styles from './Pagination.module.scss';

// Simple prev/next pagination tailored for API-backed listings.
const Pagination = ({ page, hasNext, onPageChange, isLoading }) => {
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
    <nav className={styles.pagination} aria-label='Pagination'>
      <button
        type='button'
        className={styles.button}
        onClick={handlePrev}
        disabled={page <= 1 || isLoading}
        aria-label='Previous page'
      >
        Previous
      </button>
      <span className={styles.pageIndicator} aria-live='polite'>
        Page {page}
      </span>
      <button
        type='button'
        className={styles.button}
        onClick={handleNext}
        disabled={!hasNext || isLoading}
        aria-label='Next page'
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
