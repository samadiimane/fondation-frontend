import { Link } from "@/i18n/navigation";
import { isRtlLocale } from "@/i18n/config";

const Breadcrumbs = ({ items, ariaLabel = "Breadcrumb", locale }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const isRtl = isRtlLocale(locale);

  return (
    <nav
      aria-label={ariaLabel}
      className="breadcrumb-nav"
      lang={locale}
      dir={isRtl ? "rtl" : undefined}
    >
      <ol className="breadcrumb-nav__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href ?? item.label} className="breadcrumb-nav__item">
              {isLast || item.current ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
