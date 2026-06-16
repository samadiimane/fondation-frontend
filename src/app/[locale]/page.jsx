import AwardOne from '@/components/AwardOne';
import Banner from '@/components/Banner';
import LatestDocuments from '@/components/LatestDocuments';
import Counter from '@/components/Counter';
import ServicesHome from '@/components/ServicesHome';
import FoundationIntro from '@/components/foundation/FoundationIntro';
import Footer from '@/components/Footer';
import Partner from '@/components/Partner';
import {defaultLocale, normalizeLocale} from '@/i18n/config';
import {getLocale, getTranslations, setRequestLocale} from 'next-intl/server';

export async function generateMetadata({params}) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams?.locale ?? await getLocale());
  const t = await getTranslations({locale, namespace: 'meta.home'});
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function HomePage({params}) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams?.locale ?? defaultLocale);
  setRequestLocale(locale);

  return (
      <section className='page-wrapper'>
        <main id='main-content'>
          <Banner locale={locale} />
          <FoundationIntro />
          <ServicesHome />
          <Counter />
          <LatestDocuments />
          <Partner />
          <AwardOne locale={locale} />
        </main>
        <Footer locale={locale} />
      </section>
  );
}
