"use client";

import { useState } from "react";

const ExpandableText = ({ text, strings, clampLines = 6 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  return (
    <div className={`expandable-text ${expanded ? "is-expanded" : ""}`} style={{ "--clamp": clampLines }}>
      <p>{text}</p>
      <button
        type="button"
        className="expandable-text__toggle"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? strings.less : strings.more}
      </button>
    </div>
  );
};

export default ExpandableText;
