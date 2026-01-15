'use client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import styles from './DocumentCard.module.scss';
import { getDocumentTypeLabel } from '@/lib/documentTypes';

// Compact representation of a single document used across listings.
const DocumentCard = ({ document }) => {
  if (!document) {
    return null;
  }

  const tTypes = useTranslations('shared.documentTypes');
  const {
    id,
    title,
    author,
    year,
    type,
    abstract,
    language,
    fullTextAvailable,
  } = document;
  const typeLabel = type ? getDocumentTypeLabel(type, tTypes) : '';

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>
            <Link href={`/documents/${id}`} className={styles.titleLink}>
              {title}
            </Link>
          </h3>
          <p className={styles.meta}>
            {author && <span className={styles.author}>{author}</span>}
            {year && (
              <span className={styles.metaSeparator}>
                <span aria-hidden='true'>{'\u2022'}</span> {year}
              </span>
            )}
            {type && (
              <span className={styles.metaSeparator}>
                <span aria-hidden='true'>{'\u2022'}</span> {typeLabel || type}
              </span>
            )}
            {language && (
              <span className={styles.metaSeparator}>
                <span aria-hidden='true'>{'\u2022'}</span> {language.toUpperCase()}
              </span>
            )}
          </p>
        </div>
        <div className={styles.actions}>
          <span
            className={fullTextAvailable ? styles.badgePositive : styles.badge}
            aria-label={fullTextAvailable ? 'Full text available' : 'Full text not available'}
          >
            {fullTextAvailable ? 'Full Text' : 'Reference Only'}
          </span>
          <Link href={`/documents/${id}`} className={styles.detailsButton} aria-label={`View details for ${title}`}>
            View
          </Link>
        </div>
      </header>
      {abstract && <p className={styles.abstract}>{abstract}</p>}
    </article>
  );
};

export default DocumentCard;



