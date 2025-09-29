"use client";
import Link from "next/link";
import React, { useRef } from "react";
import Slider from "react-slick";

const DifferenceOne = () => {
  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <>
      <section className='difference'>
        <div className='container'>
          <div className='row justify-content-center p-2'>
            <div className='col-12 col-lg-10 col-xl-8'>
              <div
                className='section__header text-center'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <h2 className='title-animation_inner'>
                  Our services
                </h2>
                <p>
                  Join our monthly giving program to provide consistent support
                  to our initiatives. Regular contributions, no matter the size,
                  help us plan and sustain long-term projects.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='difference__inner'>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <div className='difference__slider swiper'>
                  <Slider
                    {...settings}
                    ref={sliderRef}
                    className='swiper-wrapper'
                  >
                    <div className='swiper-slide px-2'>
                      <div className='difference__single-wrapper'>
                        <div
                          className='difference__single difference__single-first'
                        >
                          <div className='difference__single-content'>
                            <h5>
                              <Link href='/'>Academic Consultation Services</Link>
                            </h5>
                            <p>
                              Expert guidance for researchers and students with specialized follow-up.
                            </p>
                            <div className='readmore'>
                              <Link
                                href='/'
                                aria-label='blog details'
                                title='blog details'
                              >
                                Read More
                                <i className='fa-solid fa-circle-arrow-right' />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide px-2'>
                      <div className='difference__single-wrapper'>
                        <div
                          className='difference__single difference__single-second'
                        >
                          <div className='difference__single-content'>
                            <h5>
                              <Link href='/'>Research Follow-up & Publishing</Link>
                            </h5>
                            <p>
                              Support for academic research, manuscript review, and publication assistance.
                            </p>
                            <div className='readmore'>
                              <Link
                                href='/'
                                aria-label='blog details'
                                title='blog details'
                              >
                                Read More
                                <i className='fa-solid fa-circle-arrow-right' />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide px-2'>
                      <div className='difference__single-wrapper'>
                        <div
                          className='difference__single difference__single-third '
                        >
                          <div className='difference__single-content'>
                            <h5>
                              <Link href='/'>AI-Powered Semantic Search</Link>
                            </h5>
                            <p>
                              Advanced AI system for intelligent document retrieval and contextual analysis.
                            </p>
                            <div className='readmore'>
                              <Link
                                href='/'
                                aria-label='blog details'
                                title='blog details'
                              >
                                Read More
                                <i className='fa-solid fa-circle-arrow-right' />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide px-2'>
                      <div className='difference__single-wrapper'>
                        <div
                          className='difference__single difference__single-first'
                        >
                          <div className='difference__single-content'>
                            <h5>
                              <Link href='/'>Workshops & Training</Link>
                            </h5>
                            <p>
                              Capacity-building programs for students and researchers in history and science.
                            </p>
                            <div className='readmore'>
                              <Link
                                href='/'
                                aria-label='blog details'
                                title='blog details'
                              >
                                Read More
                                <i className='fa-solid fa-circle-arrow-right' />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide px-2'>
                      <div className='difference__single-wrapper'>
                        <div
                          className='difference__single difference__single-second'
                        >
                          <div className='difference__single-content'>
                            <h5>
                              <Link href='/'>Collaborative Research Networks</Link>
                            </h5>
                            <p>
                              Connecting scholars worldwide to foster academic collaboration.
                            </p>
                            <div className='readmore'>
                              <Link
                                href='/'
                                aria-label='blog details'
                                title='blog details'
                              >
                                Read More
                                <i className='fa-solid fa-circle-arrow-right' />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide px-2'>
                      <div className='difference__single-wrapper'>
                        <div
                          className='difference__single difference__single-third '
                        >
                          <div className='difference__single-content'>
                            <h5>
                              <Link href='/'>Digital Archive Access</Link>
                            </h5>
                            <p>
                              Indexed and searchable academic journals and historical resources.
                            </p>
                            <div className='readmore'>
                              <Link
                                href='/'
                                aria-label='blog details'
                                title='blog details'
                              >
                                Read More
                                <i className='fa-solid fa-circle-arrow-right' />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
            </div>
          </div>
          <div className='slider-navigation'>
            <button
              onClick={() => sliderRef.current.slickPrev()}
              type='button'
              aria-label='prev slide'
              title='prev slide'
              className='prev-difference slider-btn'
            >
              <i className='fa-solid fa-arrow-left' />
            </button>
            <button
              onClick={() => sliderRef.current.slickNext()}
              type='button'
              aria-label='next slide'
              title='next slide'
              className='next-difference slider-btn slider-btn-next'
            >
              <i className='fa-solid fa-arrow-right' />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default DifferenceOne;
