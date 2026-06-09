import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import LibrarySearch from "@/components/LibrarySearch";
import TopBarTwo from "@/components/TopBarTwo";

export const metadata = {
  title: "AKT research foundation",
  description: "Abdelaziz khallouk temsamani research foundation",
};

const page = () => {
  return (
      <section className='page-wrapper'>
        {/* TopBarTwo */}
        <TopBarTwo />

        {/* HeaderFour */}
        <HeaderFour />

        {/* LibrarySearch */}
        <LibrarySearch />

        {/* Footer */}
        <Footer />
      </section>
  );
};

export default page;
