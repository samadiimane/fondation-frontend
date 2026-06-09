import DifferenceTwo from "@/components/DifferenceTwo";
import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";

export const metadata = {
  title: "AKT research foundation",
  description: "Abdelaziz khallouk temsamani research foundation",
};

const page = () => {
  return (
      <section className='page-wrapper'>

        {/* HeaderFour */}
        <HeaderFour />

        {/* DifferenceTwo*/}
        <DifferenceTwo />

        {/* Footer */}
        <Footer />
      </section>
  );
};

export default page;
