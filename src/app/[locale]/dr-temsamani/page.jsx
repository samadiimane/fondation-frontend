import AboutDoctor from "@/components/AboutDoctor";
import DifferenceTwo from "@/components/DifferenceTwo";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AKT research foundation",
  description: "Abdelaziz khallouk temsamani research foundation",
};

const page = () => {
  return (
      <section className='page-wrapper'>

        {/* AboutDoctor */}
        <AboutDoctor />

        {/* Footer */}
        <Footer />
      </section>
  );
};

export default page;
