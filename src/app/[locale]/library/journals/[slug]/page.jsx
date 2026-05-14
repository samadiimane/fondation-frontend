import {redirect} from "next/navigation";

const LibraryJournalRedirect = async ({params}) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  const slug = resolvedParams?.slug ?? "";
  const prefix = locale ? `/${locale}` : "";
  redirect(`${prefix}/journals/${slug}`);
};

export default LibraryJournalRedirect;
