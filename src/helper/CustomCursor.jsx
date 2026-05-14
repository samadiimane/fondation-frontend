"use client";

import { useEffect, useRef, useState } from "react";

const HOVER_SELECTOR = "a, button, .cursor-pointer, [role='button'], input, select, textarea, summary";

const supportsCustomCursor = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

const addMediaChangeListener = (query, listener) => {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }

  query.addListener(listener);
  return () => query.removeListener(listener);
};

const CustomCursor = () => {
  const cursorOuterRef = useRef(null);
  const cursorInnerRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateAvailability = () => {
      setEnabled(supportsCustomCursor());
    };

    updateAvailability();

    const removePointerListener = addMediaChangeListener(pointerQuery, updateAvailability);
    const removeMotionListener = addMediaChangeListener(reducedMotionQuery, updateAvailability);

    return () => {
      removePointerListener();
      removeMotionListener();
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const cursorOuter = cursorOuterRef.current;
    const cursorInner = cursorInnerRef.current;

    if (!cursorOuter || !cursorInner) return;

    let mouseX = 0;
    let mouseY = 0;
    let animationFrame = 0;
    let isVisible = false;

    const applyCursorPosition = () => {
      animationFrame = 0;
      const transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      cursorInner.style.transform = transform;
      cursorOuter.style.transform = transform;

      if (!isVisible) {
        cursorInner.style.visibility = "visible";
        cursorOuter.style.visibility = "visible";
        isVisible = true;
      }
    };

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(applyCursorPosition);
      }
    };

    const addHoverClass = () => {
      cursorInner.classList.add("cursor-hover");
      cursorOuter.classList.add("cursor-hover");
    };

    const removeHoverClass = () => {
      cursorInner.classList.remove("cursor-hover");
      cursorOuter.classList.remove("cursor-hover");
    };

    const handlePointerOver = (event) => {
      if (event.target?.closest?.(HOVER_SELECTOR)) {
        addHoverClass();
      }
    };

    const handlePointerOut = (event) => {
      const interactiveElement = event.target?.closest?.(HOVER_SELECTOR);
      const relatedTarget = event.relatedTarget;
      if (!interactiveElement) return;
      if (relatedTarget instanceof Node && interactiveElement.contains(relatedTarget)) return;
      removeHoverClass();
    };

    document.addEventListener("pointermove", moveCursor, { passive: true });
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      document.removeEventListener("pointermove", moveCursor);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div ref={cursorOuterRef} className='mouseCursor cursor-outer'></div>
      <div ref={cursorInnerRef} className='mouseCursor cursor-inner'></div>
    </>
  );
};

export default CustomCursor;
