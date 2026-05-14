"use client";

import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
import {useTranslations} from "next-intl";

import {useDeferredSlider} from "@/hooks/useDeferredSlider";

const logos = [
  "/assets/images/sponsor/one.png",
  "/assets/images/sponsor/two.png",
  "/assets/images/sponsor/three.png",
  "/assets/images/sponsor/four.png",
  "/assets/images/sponsor/five.png",
  "/assets/images/sponsor/one.png",
  "/assets/images/sponsor/two.png",
  "/assets/images/sponsor/three.png",
  "/assets/images/sponsor/four.png",
  "/assets/images/sponsor/five.png"
];

const Partner = () => {
  const t = useTranslations("partners");
  const {SliderComponent, containerRef} = useDeferredSlider({
    enabled: logos.length > 1,
    rootMargin: "800px"
  });
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToScroll: 1,
    slidesToShow: 5,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    dots: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  };
  return (
    <div className='partner fc-partner cf-p pt-120 pb-120'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='text-center'>
              <h5 className='fw-5'>
                <TrackVisibility once>
                  {({isVisible}) =>
                    isVisible && (
                      <>
                        {t("headingPrefix")}{" "}
                        <span className='odometer'>
                          <CountUp delay={0} start={0} end={62} />
                        </span>{" "}
                        {t("headingSuffix")}
                      </>
                    )
                  }
                </TrackVisibility>
              </h5>
            </div>
          </div>
          <div className='col-12'>
            <div className='partner__slider swiper' ref={containerRef}>
              {SliderComponent ? (
                <SliderComponent {...settings} className='swiper-wrapper'>
                  {logos.map((src, idx) => (
                    <div className='swiper-slide' key={`${src}-${idx}`}>
                      <div className='partner__slider-single'>
                        <img src={src} alt={t("logoAlt")} />
                      </div>
                    </div>
                  ))}
                </SliderComponent>
              ) : (
                <div className='row row-cols-2 row-cols-sm-3 row-cols-lg-5 g-3 justify-content-center'>
                  {logos.slice(0, 5).map((src, idx) => (
                    <div className='col' key={`${src}-${idx}`}>
                      <div className='partner__slider-single'>
                        <img src={src} alt={t("logoAlt")} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
