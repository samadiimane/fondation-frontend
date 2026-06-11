import Footer from "@/components/Footer";
import LibrarySearch from "@/components/LibrarySearch";

export const metadata = {
  title: "AKT research foundation",
  description: "Abdelaziz khallouk temsamani research foundation",
};

const page = () => {
  return (
      <section className='page-wrapper'>

        {/* LibrarySearch */}
        <LibrarySearch />

        {/* Footer */}
        <Footer />
      </section>
  );
};

export default page;
