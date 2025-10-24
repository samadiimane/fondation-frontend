import {redirect} from "next/navigation";

const LibraryJournalRedirect = async ({params}) => {
  const locale = params?.locale;
  const slug = params?.slug ?? "";
  const prefix = locale ? `/${locale}` : "";
  redirect(`${prefix}/journals/${slug}`);
};

export default LibraryJournalRedirect;
