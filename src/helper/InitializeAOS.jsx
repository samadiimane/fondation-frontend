"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function InitializeAOS() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return null;
}
