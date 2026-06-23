"use client";

import { isRtlLocale } from "@/i18n/config";

const JournalHeader = ({ journal, strings, locale }) => {
  const metaItems = [
    journal.issn ? {label: strings.meta.issn, value: journal.issn, dir: "ltr"} : null,
    journal.publisher ? {label: strings.meta.publisher, value: journal.publisher} : null,
    journal.language ? {label: strings.meta.language, value: journal.language} : null,
    journal.country ? {label: strings.meta.country, value: journal.country} : null,
  ].filter(Boolean);

  return (
    <header className="journal-header" id="overview" lang={locale} dir={isRtlLocale(locale) ? "rtl" : "ltr"}>
      <div>
        <div className="section__header">
          <h1 className="title-animation_inner mt-0"><span>{strings.eyebrow} :</span> {journal.name}</h1>
        </div>

        {/* {metaItems.length > 0 ? (
          <ul className="journal-header__meta mb-3">
            {metaItems.map((item) => (
              <li key={item.label} title={typeof item.value === "string" ? item.value : undefined}>
                <span className="label">{item.label} :</span>
                <span dir={item.dir}>{item.value}</span>
              </li>
            ))}
          </ul>
        ) : null} */}
      </div>
    </header>
  );
};

export default JournalHeader;
