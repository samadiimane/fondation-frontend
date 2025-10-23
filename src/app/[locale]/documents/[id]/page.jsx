import { notFound } from 'next/navigation';
import FooterOne from '@/components/FooterOne';
import HeaderFour from '@/components/HeaderFour';
import Preloader from '@/components/Preloader';
import TopBarTwo from '@/components/TopBarTwo';
import AOSWrap from '@/helper/AOSWrap';
import CustomCursor from '@/helper/CustomCursor';
import { getDocument, getDocumentFileLink } from '@/lib/api';
import { Link } from '@/i18n/navigation';

const detailLabelStyle = {
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'rgba(16, 24, 40, 0.6)',
};

const detailValueStyle = {
  fontWeight: 600,
  fontSize: '1rem',
  color: 'rgba(16, 24, 40, 0.92)',
};

const buttonStyle = {
  padding: '0.9rem 1.5rem',
  borderRadius: '999px',
  border: 'none',
  backgroundColor: 'var(--primary-color, #0f4c81)',
  color: '#fff',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
};

const disabledButtonStyle = {
  ...buttonStyle,
  cursor: 'not-allowed',
  opacity: 0.6,
};

const DocumentDetailPage = async ({ params }) => {
  const { id } = params;

  let document;
  let fileLink = null;

  try {
    document = await getDocument(id);
  } catch (error) {
    if (error?.message?.includes('API error 404')) {
      notFound();
    }
    console.error(error);
    throw error;
  }

  try {
    fileLink = await getDocumentFileLink(id);
  } catch (error) {
    if (!error?.message?.includes('404')) {
      console.error('Failed to load document file link', error);
    }
    fileLink = null;
  }

  const identifierItems = [
    { label: 'DOI', value: document.doi },
    { label: 'ISBN', value: document.isbn },
    { label: 'ISSN', value: document.issn },
  ].filter((item) => item.value);

  const metadataItems = [
    { label: 'Type', value: document.type || 'Unknown' },
    { label: 'Year', value: document.year || 'Unavailable' },
    { label: 'Language', value: document.language?.toUpperCase?.() },
    {
      label: 'Pages',
      value:
        typeof document.pages === 'number'
          ? `${document.pages} pages`
          : document.pages || 'Not specified',
    },
  ];

  if (document.collectionId) {
    metadataItems.push({ label: 'Collection ID', value: `#${document.collectionId}` });
  }

  const fileUrl = fileLink?.url ?? null;

  return (
    <AOSWrap>
      <section className='page-wrapper'>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className='document-detail' style={{ padding: '4rem 0' }}>
          <div className='container' style={{ maxWidth: '960px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <Link href='/library' className='back-link'>
                  <span aria-hidden='true'>{'\u2190'}</span> Back to library
                </Link>
                <h1 style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>{document.title}</h1>
                <p style={{ color: 'rgba(16, 24, 40, 0.72)', marginBottom: 0 }}>
                  {document.author || 'Unknown author'}
                  {document.authors && document.authors !== document.author && (
                    <> {' \u2022 '} {document.authors}</>
                  )}
                </p>
              </div>
              {fileUrl ? (
                <a
                  href={fileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={buttonStyle}
                >
                  <i className='fa-solid fa-file-pdf' aria-hidden='true'></i>
                  Open PDF
                </a>
              ) : (
                <button type='button' disabled style={disabledButtonStyle} aria-disabled='true'>
                  PDF not available yet
                </button>
              )}
            </div>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem',
              }}
            >
              {metadataItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    background: '#fff',
                  }}
                >
                  <span style={detailLabelStyle}>{item.label}</span>
                  <div style={{ ...detailValueStyle, marginTop: '0.35rem' }}>{item.value}</div>
                </div>
              ))}
            </section>

            {document.abstract && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Abstract</h2>
                <p style={{ lineHeight: 1.8, color: 'rgba(16, 24, 40, 0.82)' }}>{document.abstract}</p>
              </section>
            )}

            {identifierItems.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Identifiers</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
                  {identifierItems.map((item) => (
                    <li
                      key={item.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.85rem 1.25rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.7)',
                        background: '#fff',
                      }}
                    >
                      <span style={detailLabelStyle}>{item.label}</span>
                      {item.label === 'DOI' ? (
                        <a
                          href={`https://doi.org/${item.value}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          style={{ color: 'var(--primary-color, #0f4c81)', fontWeight: 600 }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span style={detailValueStyle}>{item.value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                background: 'rgba(236, 254, 255, 0.5)',
                color: 'rgba(15, 76, 129, 0.9)',
              }}
            >
              <strong>Need full text access?</strong>{' '}
              We are preparing direct PDF access for this collection. In the meantime, please contact the foundation team
              for assistance.
            </section>
          </div>
        </main>

        <FooterOne />
      </section>
    </AOSWrap>
  );
};

export default DocumentDetailPage;
