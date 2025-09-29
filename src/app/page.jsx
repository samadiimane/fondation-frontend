import AwardOne from "@/components/AwardOne";
import BannerThree from "@/components/BannerThree";
import BlogOne from "@/components/BlogOne";
import CounterOne from "@/components/CounterOne";
import DifferenceOne from "@/components/DifferenceOne";
import DifferenceTwo from "@/components/DifferenceTwo";
import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import PartnerFive from "@/components/PartnerFive";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";

export const metadata = {
  title: "AKT research foundation",
  description: "Abdelaziz khallouk temsamani research foundation",
};

const page = () => {
  return (
    <AOSWrap>
      <section className='page-wrapper'>
        {/* Preloader */}
        <Preloader />

        {/* CustomCursor  */}
        <CustomCursor />

        {/* TopBarTwo */}
        <TopBarTwo />

        {/* HeaderFour */}
        <HeaderFour />

        {/* BannerThree */}
        <BannerThree />

        {/* DifferenceTwo*/}
        <DifferenceTwo />

        {/* DifferenceOne*/}
        <DifferenceOne />

        {/* CounterOne */}
        <CounterOne />

        {/* BlogOne */}
        <BlogOne />

        {/* PartnerFive */}
        <PartnerFive />

        {/* AwardOne */}
        <AwardOne />

        {/* FooterOne */}
        <FooterOne />
      </section>
    </AOSWrap>
  );
};

export default page;