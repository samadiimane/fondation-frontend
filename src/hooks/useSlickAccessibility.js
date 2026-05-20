"use client";

import {useEffect} from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "audio[controls]",
  "video[controls]",
  "[contenteditable='true']",
  "[tabindex]"
].join(",");

const STORED_TAB_INDEX = "data-slick-a11y-tabindex";

const patchSlideFocus = (slide) => {
  const isHidden = slide.getAttribute("aria-hidden") === "true";
  const focusableElements = slide.querySelectorAll(FOCUSABLE_SELECTOR);

  if (isHidden) {
    slide.setAttribute("inert", "");
    focusableElements.forEach((element) => {
      if (!element.hasAttribute(STORED_TAB_INDEX)) {
        element.setAttribute(STORED_TAB_INDEX, element.getAttribute("tabindex") ?? "");
      }
      element.setAttribute("tabindex", "-1");
    });
    return;
  }

  slide.removeAttribute("inert");
  focusableElements.forEach((element) => {
    if (!element.hasAttribute(STORED_TAB_INDEX)) return;

    const previousTabIndex = element.getAttribute(STORED_TAB_INDEX);
    if (previousTabIndex) {
      element.setAttribute("tabindex", previousTabIndex);
    } else {
      element.removeAttribute("tabindex");
    }
    element.removeAttribute(STORED_TAB_INDEX);
  });
};

const restoreSlideFocus = (root) => {
  root.querySelectorAll(".slick-slide").forEach((slide) => {
    slide.removeAttribute("inert");
    slide.querySelectorAll(`[${STORED_TAB_INDEX}]`).forEach((element) => {
      const previousTabIndex = element.getAttribute(STORED_TAB_INDEX);
      if (previousTabIndex) {
        element.setAttribute("tabindex", previousTabIndex);
      } else {
        element.removeAttribute("tabindex");
      }
      element.removeAttribute(STORED_TAB_INDEX);
    });
  });
};

export const useSlickAccessibility = (rootRef, enabled = true) => {
  useEffect(() => {
    const root = rootRef?.current;
    if (!enabled || !root) return undefined;

    let frameId;
    let timeoutId;

    const patch = () => {
      root.querySelectorAll(".slick-slide").forEach(patchSlideFocus);
    };

    const schedulePatch = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(patch);
    };

    schedulePatch();
    timeoutId = window.setTimeout(schedulePatch, 100);

    const observer = new MutationObserver(schedulePatch);
    observer.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-hidden", "class"]
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      observer.disconnect();
      restoreSlideFocus(root);
    };
  }, [enabled, rootRef]);
};
