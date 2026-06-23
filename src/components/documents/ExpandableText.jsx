"use client";

import { useId, useState } from "react";

const ExpandableText = ({ text, strings, clampLines = 6 }) => {
  const [expanded, setExpanded] = useState(false);
  const textId = useId();

  if (!text) return null;

  return (
    <div className={`expandable-text ${expanded ? "is-expanded" : ""}`} style={{ "--clamp": clampLines }}>
      <p id={textId}>{text}</p>
      <button
        type="button"
        className="expandable-text__toggle"
        aria-controls={textId}
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? strings.less : strings.more}
      </button>
    </div>
  );
};

export default ExpandableText;
