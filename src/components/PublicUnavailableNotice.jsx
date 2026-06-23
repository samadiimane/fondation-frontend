import {getPublicUnavailableContent} from "@/content/publicUnavailable";
import {isRtlLocale, normalizeLocale} from "@/i18n/config";

const PublicUnavailableNotice = ({locale}) => {
  const normalizedLocale = normalizeLocale(locale);
  const copy = getPublicUnavailableContent(normalizedLocale);
  const isRtl = isRtlLocale(normalizedLocale);

  return (
    <section
      className="public-unavailable"
      dir={isRtl ? "rtl" : "ltr"}
      lang={normalizedLocale}
      role="status"
      aria-live="polite"
    >
      <div className="public-unavailable__panel">
        <h2>{copy.title}</h2>
        <p>{copy.message}</p>
      </div>
    </section>
  );
};

export default PublicUnavailableNotice;
