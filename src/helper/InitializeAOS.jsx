"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

let isAosInitialized = false;

export default function InitializeAOS() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let timeoutId;
    let animationFrameId;
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
      });
      isAosInitialized = true;
    };

    const scheduleIdleInit = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;

        if ("requestIdleCallback" in window) {
          idleCallbackId = window.requestIdleCallback(initialize, { timeout: 1500 });
        } else {
          initialize();
        }
      }, 300);
    };

    const scheduleInit = () => {
      animationFrameId = window.requestAnimationFrame(scheduleIdleInit);
    };

    if (document.readyState === "complete") {
      scheduleInit();
    } else {
      window.addEventListener("load", scheduleInit, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", scheduleInit);
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(animationFrameId);
      if (idleCallbackId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
    };
  }, [pathname]);

  return null;
}
