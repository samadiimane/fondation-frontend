import AwardOne from '@/components/AwardOne';
import Banner from '@/components/Banner';
import LatestDocuments from '@/components/LatestDocuments';
import CounterOne from '@/components/CounterOne';
import ServicesHome from '@/components/ServicesHome';
import FoundationIntro from '@/components/foundation/FoundationIntro';
import FooterOne from '@/components/FooterOne';
import HeaderFour from '@/components/HeaderFour';
import Partner from '@/components/Partner';
import Preloader from '@/components/Preloader';
import TopBarTwo from '@/components/TopBarTwo';
import AOSWrap from '@/helper/AOSWrap';
import CustomCursor from '@/helper/CustomCursor';
import {getLocale, getTranslations} from 'next-intl/server';

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({locale, namespace: 'meta.home'});
  return {
    title: t('title'),
    description: t('description')
  };
}

export default function HomePage() {
  return (
    <AOSWrap>
      <section className='page-wrapper'>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />
        <Banner />
        <FoundationIntro />
        <ServicesHome />
        <CounterOne />
        <LatestDocuments />
        <Partner />
        <AwardOne />
        <FooterOne />
      </section>
    </AOSWrap>
  );
}

