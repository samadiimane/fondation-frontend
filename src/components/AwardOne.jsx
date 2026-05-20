import Link from "next/link";
import Image from "next/image";

const AwardOne = () => {
  return (
    <section className='award'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-8'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <h2 className='title-animation_inner'>
                Highlights of the events <span>Photo Gallery</span>
              </h2>
            </div>
          </div>
        </div>
        <div className='row gutter-24'>
          <div className='col-12 col-lg-8'>
            <div
              className='award__single'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='thumb'>
                <Link href='/'>
                  <Image
                    src='/assets/images/award/fondation.jpg'
                    alt='Image_inner'
                    width={888}
                    height={393}
                    sizes='(min-width: 992px) 66vw, 100vw'
                    quality={72}
                    loading='lazy'
                  />
                </Link>
              </div>
              <div className='content'>
                <div className='award__content'>
                  <h5>
                    <Link href='/'>"الذكرى الأربعين لصدور مجلة "دار النيابة</Link>
                  </h5>
                  <p>Demostic &amp; Transportation</p>
                </div>
                <div className='award__thumb'>
                  <Link href='/'>
                    <i className='fa-solid fa-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-4'>
            <div
              className='award__single'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={200}
            >
              <div className='thumb'>
                <Link href='/'>
                  <Image
                    src='/assets/images/award/ctr.jpg'
                    alt='Image_inner'
                    width={1600}
                    height={1200}
                    sizes='(min-width: 992px) 33vw, 100vw'
                    quality={68}
                    loading='lazy'
                  />
                </Link>
              </div>
              <div className='content'>
                <div className='award__content'>
                  <h5>
                    <Link href='/'>Child trouble &amp; care</Link>
                  </h5>
                  <p>Demostic &amp; Transportation</p>
                </div>
                <div className='award__thumb'>
                  <Link href='/'>
                    <i className='fa-solid fa-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-5'>
            <div
              className='award__single'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <div className='thumb'>
                <Link href='/'>
                  <Image
                    src='/assets/images/award/ctr.jpg'
                    alt='Image_inner'
                    width={1600}
                    height={1200}
                    sizes='(min-width: 992px) 42vw, 100vw'
                    quality={68}
                    loading='lazy'
                  />
                </Link>
              </div>
              <div className='content'>
                <div className='award__content'>
                  <h5>
                    <Link href='/'>Child trouble &amp; care</Link>
                  </h5>
                  <p>Demostic &amp; Transportation</p>
                </div>
                <div className='award__thumb'>
                  <Link href='/'>
                    <i className='fa-solid fa-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-7'>
            <div
              className='award__single'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={300}
            >
              <div className='thumb'>
                <Link href='/'>
                  <Image
                    src='/assets/images/award/fondation.jpg'
                    alt='Image_inner'
                    width={888}
                    height={393}
                    sizes='(min-width: 992px) 58vw, 100vw'
                    quality={72}
                    loading='lazy'
                  />
                </Link>
              </div>
              <div className='content'>
                <div className='award__content'>
                  <h5>
                    <Link href='/'>Child trouble &amp; care</Link>
                  </h5>
                  <p>Demostic &amp; Transportation</p>
                </div>
                <div className='award__thumb'>
                  <Link href='/'>
                    <i className='fa-solid fa-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='section__cta cta text-center'>
              <Link
                href='/'
                aria-label='our events'
                title='our events'
                className='btn--primary'
              >
                View All <i className='fa-solid fa-arrow-right' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardOne;
