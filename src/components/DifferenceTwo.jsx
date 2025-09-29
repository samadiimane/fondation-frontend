"use client";
import { useState } from "react";
import ModalVideo from "react-modal-video";
const DifferenceTwo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("mission");
  return (
    <>
      <section className='difference-two'>
        <div className='container'>
          <div className='row gutter-40 align-items-center'>
            <div className='col-12 col-lg-3 col-xxl-5 d-none d-lg-block'>
              <div className='difference-two__thumb-wrapper'>
                <div className='difference-two__thumb'>
                  <div
                    className='thumb-lg'
                    data-aos='fade-right'
                    data-aos-duration={1000}
                  >
                    <img
                      src='assets/images/difference/fondation.jpg'
                      alt='Image_inner'
                    />
                    <div className='video-btn-wrapper'>
                      <button
                        onClick={() => setIsOpen(true)}
                        className='open-video-popup'
                      >
                        <i className='icon-play' />
                      </button>
                    </div>
                  </div>
                  <div
                    className='thumb-sm'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={300}
                  >
                    <img
                      src='assets/images/difference/temsamani.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-lg-8 col-xxl-7'>
              <div className='difference-two__tab'>
                <div className='difference-two__content'>
                  <h2 className='title-animation_inner'>
                    <span> Welcome </span> to The Abdelaziz Khallouk Temsamani Reasearch Foundation
                  </h2>
                  <p>
                    Charity is the voluntary act of giving help, typically in
                    the form of money, time, or resources, to those in need.
                    Charitable organizations aim to solve social, environmental,
                    and economic challenges by addressing issues like poverty,
                    Charity is the voluntary act of giving help, typically in
                    the form of money, time, or resources, to those in need.
                    Charitable organizations aim to solve social, environmental,
                    and economic challenges by addressing issues like poverty,
                    Charity is the voluntary act of giving help, typically in
                    the form of money, time, or resources, to those in need.
                  </p>

                  <div className='difference-two__inner cta'>
                    <div className='difference-two__inner-content'>
                      {/* TABS */}
                      <div className='difference-two__tab'>
                        <div className='difference-two__tab-btns'>
                          <button
                            className={`difference-two__tab-btn ${
                              activeTab === "mission" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("mission")}
                            aria-label='mission'
                            title='mission'
                          >
                            Our Mission
                          </button>
                          <button
                            className={`difference-two__tab-btn ${
                              activeTab === "vision" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("vision")}
                            aria-label='vision'
                            title='vision'
                          >
                            Our Vision
                          </button>
                          <button
                            className={`difference-two__tab-btn ${
                              activeTab === "excellence" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("excellence")}
                            aria-label='excellence'
                            title='excellence'
                          >
                            Excellence
                          </button>
                        </div>

                        <div className='difference-two__tab-content'>
                          {activeTab === "mission" && (
                            <div
                              className='difference-two__content-single'
                              id='mission'
                            >
                              <ul>
                                <li>
                                  <i className='fa-solid fa-check' /> To support and promote scientific and historical research.
                                </li>
                                <li>
                                  <i className='fa-solid fa-check' /> To make knowledge accessible and impactful for society.
                                </li>
                              </ul>
                            </div>
                          )}
                          {activeTab === "vision" && (
                            <div
                              className='difference-two__content-single'
                              id='vision'
                            >
                              <ul>
                                <li>
                                  <i className='fa-solid fa-check' /> A world where knowledge is preserved, shared, and used to 
                                  build bridges between past, present, and future.
                                </li>
                                <li>
                                  <i className='fa-solid fa-check' /> Integrity, collaboration, innovation, and respect for 
                                  cultural and scientific heritage.
                                </li>
                              </ul>
                            </div>
                          )}
                          {activeTab === "excellence" && (
                            <div
                              className='difference-two__content-single'
                              id='excellence'
                            >
                              <ul>
                                <li>
                                  <i className='fa-solid fa-check' /> We help
                                  companies develop powerful corporate social
                                </li>
                                <li>
                                  <i className='fa-solid fa-check' /> Helped
                                  fund 3,265 Project powerful corporate poor
                                </li>
                                <li>
                                  <i className='fa-solid fa-check' /> Dedicated
                                  Tech Services
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ModalVideo
        channel='youtube'
        autoplay
        isOpen={isOpen}
        videoId='XxVg_s8xAms'
        onClose={() => setIsOpen(false)}
        allowFullScreen
      />
    </>
  );
};

export default DifferenceTwo;
