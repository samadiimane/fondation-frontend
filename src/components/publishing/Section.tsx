"use client";

import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

const Section = ({ id, title, children }: SectionProps) => (
  <section id={id} className="publishing-section" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`} className="publishing-toc__title">
      {title}
    </h3>
    {children}
  </section>
);

export default Section;
