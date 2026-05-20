"use client";

import {useCallback, useEffect, useRef, useState} from "react";

import {useSlickAccessibility} from "@/hooks/useSlickAccessibility";

let sliderImportPromise;

const importSlider = async () => {
  if (!sliderImportPromise) {
    sliderImportPromise = import("react-slick");
  }
  const module = await sliderImportPromise;
  return module.default ?? module;
};

export const useDeferredSlider = ({
  enabled = true,
  idleDelay = 200,
  idleTimeout = 1500,
  rootMargin = "600px"
} = {}) => {
  const containerRef = useRef(null);
  const [SliderComponent, setSliderComponent] = useState(null);

  useSlickAccessibility(containerRef, enabled && Boolean(SliderComponent));

  const loadSlider = useCallback(async () => {
    if (!enabled || SliderComponent) return;
    const component = await importSlider();
    setSliderComponent(() => component);
  }, [enabled, SliderComponent]);

  useEffect(() => {
    if (!enabled || SliderComponent) return undefined;

    let cancelled = false;
    let timeoutId;
    let idleCallbackId;
    let observer;

    const loadWhenIdle = () => {
      if (cancelled) return;

      const run = async () => {
        if (cancelled) return;
        const component = await importSlider();
        if (!cancelled) {
          setSliderComponent(() => component);
        }
      };

      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        if ("requestIdleCallback" in window) {
          idleCallbackId = window.requestIdleCallback(run, {timeout: idleTimeout});
        } else {
          run();
        }
      }, idleDelay);
    };

    const node = containerRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      loadWhenIdle();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            loadWhenIdle();
          }
        },
        {rootMargin}
      );
      observer.observe(node);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      if (idleCallbackId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
      observer?.disconnect();
    };
  }, [enabled, idleDelay, idleTimeout, rootMargin, SliderComponent]);

  return {
    SliderComponent,
    containerRef,
    loadSlider
  };
};
