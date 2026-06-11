import DifferenceTwo from "@/components/DifferenceTwo";
import Footer from "@/components/Footer";
import TeamInner from "@/components/TeamInner";

export const metadata = {
  title: "AKT research foundation",
  description: "Abdelaziz khallouk temsamani research foundation",
};

const page = () => {
  return (
      <section className='page-wrapper'>

        {/* TeamInner */}
        <TeamInner/>

        {/* Footer */}
        <Footer />
      </section>
  );
};

export default page;
