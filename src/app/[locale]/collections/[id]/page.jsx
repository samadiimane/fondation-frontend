import Footer from '@/components/Footer';
import CollectionDocumentsSection from '@/components/CollectionDocumentsSection';
import { getCollectionDocuments, getCollections } from '@/lib/api';
import { defaultLocale, normalizeLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';

const getFriendlyError = (message) => {
  if (!message) return null;
  return message.includes('Missing NEXT_PUBLIC_API_BASE')
    ? 'NEXT_PUBLIC_API_BASE is not configured. Add it to .env.local to enable document browsing.'
    : message;
};

const CollectionDetailPage = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const locale = normalizeLocale(resolvedParams?.locale ?? defaultLocale);

  let collectionName = `Collection #${id}`;

  try {
    const collections = await getCollections();
    const match = collections.find((item) => String(item.id) === String(id));
    if (match?.name) {
      collectionName = match.name;
    }
  } catch (error) {
    console.error('Failed to load collection metadata', error);
  }

  let initialDocuments = [];
  let initialPage = 1;
  let initialHasNext = false;
  let initialError = null;

  try {
    const initialData = await getCollectionDocuments(id, { page: 1, pageSize: 20 });
    initialDocuments = initialData.documents;
    initialPage = initialData.page || 1;
    initialHasNext = initialData.hasNext;
  } catch (error) {
    console.error('Failed to load collection documents', error);
    if (error?.message?.includes('API error 404')) {
      notFound();
    }
    initialError = getFriendlyError(error?.message || 'Unable to load documents for this collection.');
  }

  return (
      <section className='page-wrapper'>

        <CollectionDocumentsSection
          collectionId={id}
          collectionName={collectionName}
          initialDocuments={initialDocuments}
          initialPage={initialPage}
          initialHasNext={initialHasNext}
          initialError={initialError}
        />

        <Footer locale={locale} />
      </section>
  );
};

export default CollectionDetailPage;
