import { redirect } from 'next/navigation';

export const metadata = {
  title: 'eLibrary Documents',
  description: 'Browse and search documents from the Abdelaziz Khallouk Temsamani eLibrary.',
};

const DocumentsPage = ({ params }) => {
  const locale = params?.locale ?? 'en';
  redirect(`/${locale}/library`);
};

export default DocumentsPage;
