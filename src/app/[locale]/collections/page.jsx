import Footer from '@/components/Footer';
import HeaderFour from '@/components/HeaderFour';
import Preloader from '@/components/Preloader';
import TopBarTwo from '@/components/TopBarTwo';
import AOSWrap from '@/helper/AOSWrap';
import CustomCursor from '@/helper/CustomCursor';
import { getCollections } from '@/lib/api';
import { Link } from '@/i18n/navigation';

export const metadata = {
  title: 'eLibrary Collections',
  description: 'Explore curated research collections from the Abdelaziz Khallouk Temsamani foundation.',
};

export const dynamic = 'force-dynamic';

const CollectionsPage = async () => {
  let collections = [];
  let loadError = null;

  try {
    collections = await getCollections();
  } catch (error) {
    console.error(error);
    loadError = 'Unable to load collections at this time. Please try again later.';
  }

  return (
    <AOSWrap>
      <section className='page-wrapper'>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className='collections-page' style={{ padding: '4rem 0' }}>
          <div className='container' style={{ maxWidth: '960px' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1>Research Collections</h1>
              <p style={{ color: 'rgba(16, 24, 40, 0.72)', maxWidth: '640px', margin: '0.75rem auto 0' }}>
                Browse curated collections featuring manuscripts, publications, and archival materials from the foundation’s
                digital library.
              </p>
            </header>

            {loadError && (
              <div
                role='alert'
                style={{
                  margin: '0 auto',
                  maxWidth: '560px',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(254, 226, 226, 0.6)',
                  color: '#991b1b',
                  textAlign: 'center',
                }}
              >
                {loadError}
              </div>
            )}

            {!loadError && (
              <div
                className='collections-grid'
                style={{
                  display: 'grid',
                  gap: '1.5rem',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                }}
              >
                {collections.map((collection) => (
                  <article
                    key={collection.id}
                    style={{
                      padding: '1.75rem',
                      borderRadius: '18px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: '#fff',
                      boxShadow: '0 18px 35px rgba(15, 76, 129, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{collection.name}</h2>
                      {collection.description && (
                        <p style={{ color: 'rgba(16, 24, 40, 0.7)', lineHeight: 1.6 }}>{collection.description}</p>
                      )}
                    </div>
                    <Link
                      href={`/collections/${collection.id}`}
                      style={{
                        alignSelf: 'flex-start',
                        padding: '0.55rem 1.25rem',
                        borderRadius: '999px',
                        border: '1px solid var(--primary-color, #0f4c81)',
                        color: 'var(--primary-color, #0f4c81)',
                        fontWeight: 600,
                      }}
                    >
                      View documents
                    </Link>
                  </article>
                ))}

                {collections.length === 0 && (
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      textAlign: 'center',
                      padding: '2rem',
                      borderRadius: '16px',
                      border: '1px dashed rgba(226, 232, 240, 0.9)',
                      background: '#fff',
                    }}
                  >
                    No collections available yet. Please check back soon.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </section>
    </AOSWrap>
  );
};

export default CollectionsPage;
