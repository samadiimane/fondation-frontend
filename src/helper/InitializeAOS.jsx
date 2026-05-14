"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

let isAosInitialized = false;

export default function InitializeAOS() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let timeoutId;
    let idleCallbackId;

    const initialize = async () => {
      const module = await import("aos");
      if (cancelled) return;

      const AOS = module.default ?? module;

      if (isAosInitialized) {
        AOS.refreshHard();
        return;
      }

      AOS.init({
        duration: 1000,
        once: true,
        disableMutationObserver: true,
        debounceDelay: 150,
        throttleDelay: 150,
      });
      isAosInitialized = true;
    };

    timeoutId = window.setTimeout(() => {
      if (cancelled) return;

      if ("requestIdleCallback" in window) {
        idleCallbackId = window.requestIdleCallback(initialize);
      } else {
        initialize();
      }
    }, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      if (idleCallbackId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
    };
  }, [pathname]);

  return null;
}
