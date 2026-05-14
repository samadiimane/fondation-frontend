import {redirect} from "next/navigation";

const LibraryJournalsRedirect = async ({params}) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  const prefix = locale ? `/${locale}` : "";
  redirect(`${prefix}/journals`);
};

export default LibraryJournalsRedirect;
