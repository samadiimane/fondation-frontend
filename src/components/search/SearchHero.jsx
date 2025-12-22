"use client";

import { memo } from "react";
import SearchBar from "./SearchBar";

const SearchHero = ({ query, setQuery, loading, content, textAlign, isRtl }) => (
  <section className="library-search__hero" data-aos="fade-up" data-aos-delay="100">
    <div
      className='section__header'
    >
      <h2 className={`title-animation_inner text-center ${textAlign}`}>{content.heroTitle}</h2>
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

export default memo(SearchHero);
