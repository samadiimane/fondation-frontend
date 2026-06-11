"use client";

import {usePathname} from "next/navigation";

import PublicHeader from "@/components/PublicHeader";
import PublicTopBar from "@/components/PublicTopBar";
import {locales} from "@/i18n/config";

const PUBLIC_CHROME_EXCLUDED_SECTIONS = new Set(["admin", "auth"]);

const getSectionFromPathname = (pathname = "") => {
  const [firstSegment, secondSegment] = pathname.split("/").filter(Boolean);
  return locales.includes(firstSegment) ? secondSegment : firstSegment;
};

const PublicShell = ({children}) => {
  const pathname = usePathname();
  const section = getSectionFromPathname(pathname);
  const showPublicChrome = !PUBLIC_CHROME_EXCLUDED_SECTIONS.has(section);

  return (
    <>
      {showPublicChrome && (
        <>
          <PublicTopBar />
          <PublicHeader />
        </>
      )}
      {children}
    </>
  );
};

export default PublicShell;
