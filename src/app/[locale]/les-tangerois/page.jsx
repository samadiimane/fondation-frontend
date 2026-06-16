import DifferenceTwo from "@/components/DifferenceTwo";
import Footer from "@/components/Footer";
import {defaultLocale, normalizeLocale} from "@/i18n/config";

export const metadata = {
  title: "AKT research foundation",
  description: "Abdelaziz khallouk temsamani research foundation",
};

const page = async ({params}) => {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams?.locale ?? defaultLocale);

  return (
      <section className='page-wrapper'>

        {/* DifferenceTwo*/}
        <DifferenceTwo />

        {/* Footer */}
        <Footer locale={locale} />
      </section>
  );
};

export default page;
