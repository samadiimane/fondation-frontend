import DifferenceTwo from "@/components/DifferenceTwo";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AKT research foundation",
  description: "Abdelaziz khallouk temsamani research foundation",
};

const page = () => {
  return (
      <section className='page-wrapper'>

        {/* DifferenceTwo*/}
        <DifferenceTwo />

        {/* Footer */}
        <Footer />
      </section>
  );
};

export default page;
