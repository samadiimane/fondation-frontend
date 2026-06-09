import AboutDoctor from "@/components/AboutDoctor";
import DifferenceTwo from "@/components/DifferenceTwo";
import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
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

        {/* AboutDoctor */}
        <AboutDoctor />

        {/* Footer */}
        <Footer />
      </section>
  );
};

export default page;
