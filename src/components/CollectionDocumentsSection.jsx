'use client';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import DocumentCard from './DocumentCard';
import Pagination from './Pagination';
import Skeleton from './Skeleton';
import { getCollectionDocuments } from '@/lib/api';

const PAGE_SIZE = 20;

const CollectionDocumentsSection = ({
  collectionId,
  collectionName,
  initialDocuments = [],
  initialPage = 1,
  initialHasNext = false,
  initialError = null,
}) => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [page, setPage] = useState(initialPage);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError);

  const loadPage = async (targetPage) => {
    if (!collectionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { documents: nextDocuments, hasNext: nextHasNext, page: resolvedPage } = await getCollectionDocuments(
        collectionId,
        { page: targetPage, pageSize: PAGE_SIZE }
      );

      setDocuments(nextDocuments);
      setHasNext(nextHasNext);
      setPage(resolvedPage || targetPage);

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: targetPage > page ? 'smooth' : 'auto' });
      }
    } catch (err) {
      console.error(err);
      const message = err?.message || 'Unable to load collection documents right now.';
      setError(
        message.includes('Missing NEXT_PUBLIC_API_BASE')
          ? 'NEXT_PUBLIC_API_BASE is not configured. Add it to .env.local to enable document browsing.'
          : message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (nextPage) => {
    if (isLoading || nextPage === page) {
      return;
    }
    loadPage(nextPage);
  };

  const showSkeleton = isLoading && documents.length === 0;
  const showEmpty = !isLoading && documents.length === 0 && !error;

  return (
    <section style={{ padding: '3rem 0' }}>
      <div className='container' style={{ maxWidth: '960px' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <Link
            href='/collections'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--primary-color, #0f4c81)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span aria-hidden='true'>{'\u2190'}</span> Back to collections
          </Link>
          <h1 style={{ marginBottom: '0.75rem' }}>{collectionName || 'Collection'}</h1>
          <p style={{ color: 'rgba(16, 24, 40, 0.7)', margin: 0 }}>
            Browse documents preserved within this collection. Use the pagination controls to explore additional pages.
          </p>
        </header>

        {error && (
          <div
            role='alert'
            style={{
              marginBottom: '2rem',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(254, 226, 226, 0.6)',
              color: '#991b1b',
            }}
          >
            {error}
          </div>
        )}

        <div
          className='collection-documents-grid'
          style={{
            display: 'grid',
            gap: '1.5rem',
          }}
        >
          {showSkeleton &&
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`collection-skeleton-${idx}`}
                className='result-card skeleton-card'
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.75rem' }}
              >
                <Skeleton style={{ width: '62%', height: '1.1rem' }} />
                <Skeleton style={{ width: '45%', height: '0.9rem' }} />
                <Skeleton style={{ width: '100%', height: '0.9rem' }} />
                <Skeleton style={{ width: '70%', height: '0.9rem' }} />
              </div>
            ))}

          {!showSkeleton &&
            documents.map((document) => <DocumentCard key={document.id} document={document} />)}

          {showEmpty && (
            <div
              className='result-card empty-result'
              style={{
                textAlign: 'center',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px dashed rgba(226, 232, 240, 0.9)',
                background: '#fff',
              }}
            >
              No documents were found in this collection yet.
            </div>
          )}
        </div>

        {(hasNext || page > 1) && (
          <Pagination page={page} hasNext={hasNext} onPageChange={handlePageChange} isLoading={isLoading} />
        )}
      </div>
    </section>
  );
};

export default CollectionDocumentsSection;
