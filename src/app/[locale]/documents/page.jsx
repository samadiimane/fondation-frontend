import FooterOne from '@/components/FooterOne';
import HeaderFour from '@/components/HeaderFour';
import LibrarySearch from '@/components/LibrarySearch';
import Preloader from '@/components/Preloader';
import TopBarTwo from '@/components/TopBarTwo';
import AOSWrap from '@/helper/AOSWrap';
import CustomCursor from '@/helper/CustomCursor';

export const metadata = {
  title: 'eLibrary Documents',
  description: 'Browse and search documents from the Abdelaziz Khallouk Temsamani eLibrary.',
};

const DocumentsPage = () => {
  return (
    <AOSWrap>
      <section className='page-wrapper'>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />
        <LibrarySearch />
        <FooterOne />
      </section>
    </AOSWrap>
  );
};

export default DocumentsPage;
