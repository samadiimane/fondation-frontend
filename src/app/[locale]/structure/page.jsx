import DifferenceTwo from "@/components/DifferenceTwo";
import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import TeamInner from "@/components/TeamInner";
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

        {/* TeamInner */}
        <TeamInner/>

        {/* Footer */}
        <Footer />
      </section>
  );
};

export default page;
