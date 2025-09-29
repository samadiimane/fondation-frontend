"use client";
import Link from "next/link";
import { useRef } from "react";
import Slider from "react-slick";

const BannerThree = () => {
  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    arrows: false,
  };
  return (
    <section className='banner-three'>
      <div className='container-fluid'>
        <div className='row align-items-center'>
          <div className='col-12 col-lg-6'>
            <div className='banner-three__slider swiper'>
              <Slider {...settings} ref={sliderRef} className='swiper-wrapper'>
                <div className='swiper-slide'>
                  <div className='banner-three__content'>
                    <h1 className='title-animation_inner'>
                    Advancing Scientific Knowledge for a Better Tomorrow 
                    </h1>
                    <p>
                     We connect researchers, preserve knowledge, and support innovation,
                     ensuring that discoveries continue to benefit future generations.
                    </p>
                    <div className='banner__content-cta cta'>
                      <Link
                        href='/library'
                        aria-label='about us'
                        title='about us'
                        className='btn--tertiary'
                      >
                        Explore the Library <i className='fa-solid fa-arrow-right' />
                      </Link>
                      <Link
                        href='/'
                        aria-label='contact us'
                        title='contact us'
                        className='btn--primary'
                      >
                        Publish Your Work <i className='fa-solid fa-arrow-right' />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='banner-three__content'>
                  <h1 className='title-animation_inner'>
                    Advancing Scientific Knowledge for a Better Tomorrow
                    </h1>
                    <p>
                    We connect researchers, preserve knowledge, and support innovation,
                     ensuring that discoveries continue to benefit future generations.
                    </p>
                    <div className='banner__content-cta cta'>
                      <Link
                        href='/library'
                        aria-label='about us'
                        title='about us'
                        className='btn--tertiary'
                      >
                        Explore the Library <i className='fa-solid fa-arrow-right' />
                      </Link>
                      <Link
                        href='/'
                        aria-label='contact us'
                        title='contact us'
                        className='btn--primary'
                      >
                        Publish Your Work <i className='fa-solid fa-arrow-right' />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='banner-three__content'>
                  <h1 className='title-animation_inner'>
                    Advancing Scientific Knowledge for a Better Tomorrow
                    </h1>
                    <p>
                    We connect researchers, preserve knowledge, and support innovation,
                     ensuring that discoveries continue to benefit future generations.
                    </p>
                    <div className='banner__content-cta cta'>
                      <Link
                        href='/library'
                        aria-label='about us'
                        title='about us'
                        className='btn--tertiary'
                      >
                        Explore the Library <i className='fa-solid fa-arrow-right' />
                      </Link>
                      <Link
                        href='/'
                        aria-label='contact us'
                        title='contact us'
                        className='btn--primary'
                      >
                        Publish Your Work <i className='fa-solid fa-arrow-right' />
                      </Link>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
          <div className='col-12 col-lg-6 d-none d-lg-block'>
            <div className='banner-three__thumb'>
              <div className='banner-three__thumb-inner'>
              <div className='group'>
                  <div className='m-one move-image'>
                    <img
                      src='/assets/images/banner/kasbah.png'
                      alt='Image_inner'
                      data-aos='fade-right'
                      data-aos-duration={1000}
                    />
                  </div>
                  <div className='m-three move-image'>
                    <img
                      src='/assets/images/banner/lagrotte.png'
                      alt='Image_inner'
                      data-aos='fade-right'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    />
                  </div>
                </div>
                <div className='group'>
                  <div className='m-two move-image'>
                    <img
                      src='/assets/images/banner/babhar.png'
                      alt='Image_inner'
                      data-aos='zoom-in'
                      data-aos-duration={1000}
                    />
                  </div>
                  <div className='m-four move-image'>
                    <img
                      src='/assets/images/banner/port.png'
                      alt='Image_inner'
                      data-aos='zoom-in'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    />
                  </div>
                </div>
                <div className='group'>
                  <div className='m-one move-image'>
                    <img
                      src='/assets/images/banner/phare.png'
                      alt='Image_inner'
                      data-aos='fade-right'
                      data-aos-duration={1000}
                    />
                  </div>
                  <div className='m-three move-image'>
                    <img
                      src='/assets/images/banner/atlas.png'
                      alt='Image_inner'
                      data-aos='fade-right'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerThree;
