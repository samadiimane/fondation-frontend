import Link from "next/link";

const FooterOne = () => {
  return (
    <>
      <footer className='footer-two'>
        <div className='container'>
          <div className='row gutter-60'>
            <div className='col-12 col-md-6 col-xl-3'>
              <div
                className='footer-two__widget'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <div className='footer-two__widget-logo'>
                  <Link href='/'>
                    <img src='assets/images/logo2.png' alt='Image_inner' style={{ height: '100px', width: '200px', objectFit: 'contain' }} />
                  </Link>
                </div>
                <div className='footer-two__widget-content'>
                  <p>
                  AKT research foundation is internationally recognized globally operating multidisciplinary professional
                   research and development association.
                  </p>
                  <div className='social'>
                    <Link
                      href='https://www.facebook.com'
                      target='_blank'
                      aria-label='share us on facebook'
                      title='facebook'
                    >
                      <i className='fa-brands fa-facebook-f' />
                    </Link>
                    <Link
                      href='https://x.com'
                      target='_blank'
                      aria-label='share us on twitter'
                      title='twitter'
                    >
                      <i className='fa-brands fa-twitter' />
                    </Link>
                    <Link
                      href='https://www.linkedin.com'
                      target='_blank'
                      aria-label='share us on linkedin'
                      title='linkedin'
                    >
                      <i className='fa-brands fa-linkedin-in' />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-md-6 col-xl-2 offset-xl-1'>
              <div
                className='footer-two__widget'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={200}
              >
                <div className='footer-two__widget-intro'>
                  <h5>Quick Links</h5>
                  <div className='line'>
                    <span className='large-line' />
                    <span className='small-line' />
                    <span className='small-line' />
                  </div>
                </div>
                <div className='footer-two__widget-content'>
                  <ul>
                    <li>
                      <Link href='/about-us'>
                        <i className='fa-solid fa-arrow-right' />
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href='/library'>
                        <i className='fa-solid fa-arrow-right' />
                        Library
                      </Link>
                    </li>
                    <li>
                      <Link href='/'>
                        <i className='fa-solid fa-arrow-right' />
                        Advanced
                      </Link>
                    </li>
                    <li>
                      <Link href='/'>
                        <i className='fa-solid fa-arrow-right' />
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link href='/'>
                        <i className='fa-solid fa-arrow-right' />
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='col-12 col-md-6 col-xl-3'>
              <div
                className='footer-two__widget footer-two__widget--alternate'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={400}
              >
                <div className='footer-two__widget-intro'>
                  <h5>Our Services</h5>
                  <div className='line'>
                    <span className='large-line' />
                    <span className='small-line' />
                    <span className='small-line' />
                  </div>
                </div>
                <div className='footer-two__widget-content'>
                  <ul>
                    <li>
                      <Link href='/'>
                        <i className='fa-solid fa-arrow-right' />
                        Our Causes
                      </Link>
                    </li>
                    <li>
                      <Link href='/'>
                        <i className='fa-solid fa-arrow-right' />
                        Education Support
                      </Link>
                    </li>
                    <li>
                      <Link href='/'>
                        <i className='fa-solid fa-arrow-right' />
                        Our Campaign
                      </Link>
                    </li>
                    <li>
                      <Link href='/'>
                        <i className='fa-solid fa-arrow-right' />
                        Food Support
                      </Link>
                    </li>
                    <li>
                      <Link href='/'>
                        <i className='fa-solid fa-arrow-right' />
                        Health Support
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='col-12 col-md-6 col-xl-3'>
              <div
                className='footer-two__widget footer-two__widget--alternate'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={600}
              >
                <div className='footer-two__widget-intro'>
                  <h5>Get In Touch</h5>
                  <div className='line'>
                    <span className='large-line' />
                    <span className='small-line' />
                    <span className='small-line' />
                  </div>
                </div>
                <div className='footer-two__widget-content footer-two__widget-content--contact'>
                  <ul>
                    <li>
                      <Link
                        href='/https://maps.app.goo.gl/Gr9pTNqz5FRNrjQw8'
                        target='_blank'
                      >
                        <i className='fa-solid fa-location-dot' />
                        Tangier, morocco
                      </Link>
                    </li>
                    <li>
                      <Link href='/tel:2305-587-3407'>
                        <i className='fa-solid fa-phone' />
                        +212 (246) 642-27-10
                      </Link>
                    </li>
                    <li>
                      <Link href='/mailto:AKT_Research_Foundation@gmail.com'>
                        <i className='fa-regular fa-envelope' />
                        AKT_Research_Foundation@gmail.com
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='footer-two__copyright'>
          <div className='container'>
            <div className='row align-items-center gutter-12'>
              <div className='col-12 col-lg-7'>
                <div className='footer-two__copyright-inner text-center text-lg-start'>
                  <p>
                    Copyright © <span id='copyrightYear' />{" "}
                    <Link href='/'>Abdelaziz khallouk temsamani research foundation</Link>. All rights reserved.
                  </p>
                </div>
              </div>
              <div className='col-12 col-lg-4'>
                <div className='footer__bottom-left'>
                  <ul className='footer__bottom-list justify-content-center justify-content-lg-end'>
                    <li>
                      <Link href='/terms-conditions'>
                        Terms &amp; Conditions
                      </Link>
                    </li>
                    <li>
                      <Link href='/privacy-policy'>Privacy Policy</Link>
                    </li>
                    <li>
                      <Link href='/privacy-policy'>Cookie Settings</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterOne;
