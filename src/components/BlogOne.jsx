"use client";
import Link from "next/link";
import { useRef } from "react";
import Slider from "react-slick";

const BlogOne = () => {
  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToScroll: 1,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0%",
    arrows: false,
    dots: true,
    appendDots: (dots) => <div className='ff-pagination'>{dots}</div>,
    customPaging: () => <button className='dot' />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          centerPadding: "5%",
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          centerPadding: "5%",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "5%",
        },
      },
    ],
  };

  const blogData = [
    {
      image: "assets/images/blog/one.png",
      tag: "Health",
      author: "Dr. Sarah Chen",
      date: "Sep 20, 2025",
      title: "IT Service Case Studies Accelerate Business Fly Success Tech",
      excerpt: "Discover how our comprehensive IT service case studies demonstrate proven strategies for accelerating business growth and achieving remarkable success in the tech industry."
    },
    {
      image: "assets/images/blog/two.png",
      tag: "Education",
      author: "Dr. Fatima Bennani",
      date: "Sep 18, 2025",
      title: "Complete Guide to Business Insurance Solutions",
      excerpt: "Learn everything you need to know about business insurance options, coverage types, and how to choose the perfect policy for your company's specific needs."
    },
    {
      image: "assets/images/blog/three.png",
      tag: "Food",
      author: "Prof. Aicha Moroccan",
      date: "Sep 15, 2025",
      title: "Digital Marketing Strategies for Modern Business Growth",
      excerpt: "Explore cutting-edge digital marketing techniques and strategies that drive real results for modern businesses in today's competitive marketplace."
    },
    {
      image: "assets/images/blog/one.png",
      tag: "Technology",
      author: "Dr. Ahmed Tazi",
      date: "Sep 12, 2025",
      title: "Understanding Cloud Computing for Small Businesses",
      excerpt: "A comprehensive guide to cloud computing solutions that help small businesses reduce costs, improve efficiency, and scale their operations effectively."
    },
    {
      image: "assets/images/blog/two.png",
      tag: "Finance",
      author: "Dr. Mohammed Berrada",
      date: "Sep 9, 2025",
      title: "Investment Strategies for Long-term Wealth Building",
      excerpt: "Master proven investment strategies and financial planning techniques that create sustainable wealth and secure your financial future for years to come."
    }
  ];

  return (
    <section className='blog'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-xl-8'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <h2 className='title-animation_inner'>
                Our Latest <span>Articles</span> &amp; Researches you need
              </h2>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <Slider {...settings} ref={sliderRef}>
              {blogData.map((blog, index) => (
                <div key={index} className='px-3'>
                  <div
                    className='blog__single-wrapper'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={index * 300}
                  >
                    <div className='blog__single van-tilt'>
                      <div className='blog__single-thumb'>
                        <Link href='/'>
                          <img src={blog.image} alt='Image_inner' />
                        </Link>
                        <div className='tag'>
                          <Link href='/'>
                            <i className='fa-solid fa-tags' />
                            {blog.tag}
                          </Link>
                        </div>
                      </div>
                      <div className='blog__single-inner'>
                        <div className='blog__single-meta'>
                          <p>
                            <i className='icon-user' />
                            {blog.author}
                          </p>
                          <p>
                              <i className='fa-regular fa-calendar' />
                              {blog.date}
                          </p>
                        </div>
                        <div className='blog__single-content'>
                          <h5>
                            <Link href='/'>
                              {blog.title}
                            </Link>
                          </h5>
                          <p>
                            {blog.excerpt}
                          </p>
                        </div>
                        <div className='blog__single-cta'>
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
              ))}
            </Slider>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='ff-pagination pagination-one mt-40' />
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='section__cta cta text-center mt-5'>
              <Link
                href='/'
                aria-label='our blog'
                title='our blog'
                className='btn--primary'
              >
                Explore the Library <i className='fa-solid fa-arrow-right' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogOne;