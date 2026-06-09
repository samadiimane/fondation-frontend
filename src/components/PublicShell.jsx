"use client";

import {usePathname} from "next/navigation";

import PublicTopBar from "@/components/PublicTopBar";
import {locales} from "@/i18n/config";

const TOPBAR_EXCLUDED_SECTIONS = new Set(["admin", "auth"]);

const getSectionFromPathname = (pathname = "") => {
  const [firstSegment, secondSegment] = pathname.split("/").filter(Boolean);
  return locales.includes(firstSegment) ? secondSegment : firstSegment;
};

const PublicShell = ({children}) => {
  const pathname = usePathname();
  const section = getSectionFromPathname(pathname);
  const showPublicTopBar = !TOPBAR_EXCLUDED_SECTIONS.has(section);

  return (
    <>
      {showPublicTopBar && <PublicTopBar />}
      {children}
    </>
  );
};

export default PublicShell;
