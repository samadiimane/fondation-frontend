const JournalsHero = ({ eyebrow, title, description, stats, cta }) => {
  return (
    <section className="journals-hero">
      <div className="journals-hero__backdrop" aria-hidden="true" />
      <div className="journals-hero__shell">
        <div className="journals-hero__content">
          {eyebrow && <span className="journals-hero__eyebrow">{eyebrow}</span>}
          <h1 className="journals-hero__title">{title}</h1>
          <p className="journals-hero__description">{description}</p>
          {cta?.href && (
            <a
              className="journals-hero__cta"
              href={cta.href}
              target={cta.external ? "_blank" : undefined}
              rel={cta.external ? "noreferrer" : undefined}
            >
              <span>{cta.text}</span>
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
          )}
        </div>

        {Array.isArray(stats) && stats.length > 0 && (
          <div className="journals-hero__stats">
            {stats.map((stat) => (
              <div key={stat.id} className="journals-hero__stat">
                <span className="journals-hero__stat-value">{stat.value}</span>
                <span className="journals-hero__stat-label">{stat.label}</span>
                {stat.helper && <span className="journals-hero__stat-helper">{stat.helper}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JournalsHero;
