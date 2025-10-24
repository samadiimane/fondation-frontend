import {redirect} from "next/navigation";

const LibraryJournalsRedirect = async ({params}) => {
  const locale = params?.locale;
  const prefix = locale ? `/${locale}` : "";
  redirect(`${prefix}/journals`);
};

export default LibraryJournalsRedirect;
