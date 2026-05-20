"use client";
import Image from "next/image";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
import {useTranslations} from "next-intl";

const COUNTERS = [
  {icon: "icon-support-hand", end: 100, suffix: "+", labelKey: "activeResearchers"},
  {icon: "icon-review", end: 80, suffix: "K+", labelKey: "fundingDistributed"},
  {icon: "icon-documents", end: 100, suffix: "K+", labelKey: "papersPublished"},
  {icon: "icon-award", end: 40, suffix: "K+", labelKey: "awardsWon"}
];

const CounterOne = () => {
  const t = useTranslations("counter");

  return (
    <section className='counter'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='counter__inner'>
              {COUNTERS.map((item, idx) => (
                <div
                  key={item.labelKey}
                  className='counter__single'
                  data-aos='fade-up'
                  data-aos-duration={1000}
                  data-aos-delay={idx * 300}
                >
                  <div className='thumb'>
                    <i className={item.icon} />
                  </div>
                  <div className='counter__content'>
                    <h2>
                      <TrackVisibility once>
                        {({isVisible}) =>
                          isVisible && (
                            <span className='odometer'>
                              <CountUp delay={0} start={0} end={item.end} />
                              {item.suffix}
                            </span>
                          )
                        }
                      </TrackVisibility>
                    </h2>
                    <h5>{t(item.labelKey)}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='poor'>
        <Image
          src='/assets/images/counter/old.png'
          alt='Background pattern'
          fill
          sizes='100vw'
          quality={65}
          className='parallax-image'
          loading='lazy'
          style={{objectFit: "cover"}}
        />
      </div>
    </section>
  );
};

export default CounterOne;
