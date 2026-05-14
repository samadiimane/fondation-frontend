import { redirect } from 'next/navigation';

export const metadata = {
  title: 'eLibrary Documents',
  description: 'Browse and search documents from the Abdelaziz Khallouk Temsamani eLibrary.',
};

const DocumentsPage = async ({ params }) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? 'en';
  redirect(`/${locale}/library`);
};

export default DocumentsPage;
