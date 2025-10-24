const JournalsPagination = ({ page, hasNext, onNavigate, strings, disabled }) => {
  const handlePrev = () => {
    if (page > 1 && !disabled) {
      onNavigate(page - 1);
    }
  };

  const handleNext = () => {
    if (hasNext && !disabled) {
      onNavigate(page + 1);
    }
  };

  return (
    <nav className="journals-pagination" aria-label={strings.ariaLabel}>
      <button
        type="button"
        onClick={handlePrev}
        disabled={disabled || page <= 1}
        className="journals-pagination__btn"
      >
        <i className="fa-solid fa-arrow-left" aria-hidden="true" />
        <span>{strings.previous}</span>
      </button>
      <span className="journals-pagination__page">
        {strings.pageTemplate.replace("{page}", String(page))}
      </span>
      <button
        type="button"
        onClick={handleNext}
        disabled={disabled || !hasNext}
        className="journals-pagination__btn"
      >
        <span>{strings.next}</span>
        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
      </button>
    </nav>
  );
};

export default JournalsPagination;
