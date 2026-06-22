"use client";

import { memo } from "react";
import SearchBar from "./SearchBar";

const splitTitle = (value) => {
  const title = typeof value === "string" ? value.trim() : "";
  const splitIndex = title.indexOf(" ");
  return {
    lead: splitIndex > 0 ? title.slice(0, splitIndex) : title,
    rest: splitIndex > 0 ? title.slice(splitIndex + 1) : "",
  };
};

const SearchHero = ({ query, setQuery, loading, content, textAlign, isRtl }) => {
  const titleParts = splitTitle(content.heroTitle);

  return (
    <section className="library-search__hero">
      <div className='section__header title-animation library-search__header'>
        <h1 className='title-animation_inner mt-0'>
          {isRtl ? (
            content.heroTitle
          ) : (
            <>
              <span>{titleParts.lead || content.heroTitle}</span>
              {titleParts.rest ? ` ${titleParts.rest}` : ""}
            </>
          )}
        </h1>
      </div>
      <SearchBar
        value={query}
        onChange={setQuery}
        loading={loading}
        placeholder={content.search.placeholder}
        ariaLabel={content.search.aria}
        submitSr={content.search.submitSr}
        isRtl={isRtl}
      />
    </section>
  );
};

export default memo(SearchHero);
