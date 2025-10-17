"use client";

import { memo } from "react";
import SearchBar from "./SearchBar";

const SearchHero = ({ query, setQuery, loading }) => (
  <section className="library-search__hero" data-aos="fade-up" data-aos-delay="100">
    <div
      className='section__header'
    >
      <h2 className='title-animation_inner text-center'>Explore the Foundation Library</h2>
    </div>
    <SearchBar value={query} onChange={setQuery} loading={loading} />
  </section>
);

export default memo(SearchHero);
