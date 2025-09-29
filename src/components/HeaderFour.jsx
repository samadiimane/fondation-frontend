"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NiceSelect from "nice-select2";
import AddToCart from "../helper/AddToCart";
const HeaderFour = () => {
  const countryRef = useRef(null);
  let pathname = usePathname();
  let [search, setSearch] = useState(false);
  let [backdrop, setBackdrop] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const [scroll, setScroll] = useState(false);
  const handleSearch = () => {
    setSearch(!search);
  };
  const handleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleBackdrop = () => {
    setBackdrop(!backdrop);
  };

  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset < 150) {
        setScroll(false);
      } else if (window.pageYOffset > 150) {
        setScroll(true);
      }
      return () => (window.onscroll = null);
    };
  }, []);

  const mobileMenuListRef = useRef(null);

  useEffect(() => {
    const desktopMenu = document.querySelector(".navbar__menu");

    if (desktopMenu && mobileMenuListRef.current) {
      mobileMenuListRef.current.innerHTML = desktopMenu.innerHTML;

      const setupDropdownToggles = (container) => {
        const dropdownLabels = container.querySelectorAll(
          ".navbar__dropdown-label"
        );

        dropdownLabels.forEach((label) => {
          label.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const subMenu = this.nextElementSibling;

            const siblingLabels = Array.from(
              this.closest("ul")?.querySelectorAll(
                ":scope > li > .navbar__dropdown-label"
              ) || []
            );

            siblingLabels.forEach((sibling) => {
              const siblingSubMenu = sibling.nextElementSibling;

              if (
                sibling !== this &&
                siblingSubMenu &&
                siblingSubMenu.classList.contains("navbar__sub-menu")
              ) {
                siblingSubMenu.style.maxHeight = "0px";
                siblingSubMenu.classList.remove("show");
                sibling.classList.remove("navbar__item-active");
              }
            });

            if (subMenu && subMenu.classList.contains("navbar__sub-menu")) {
              const isOpen = subMenu.classList.contains("show");

              if (isOpen) {
                subMenu.style.maxHeight = "0px";
                subMenu.classList.remove("show");
                this.classList.remove("navbar__item-active");
              } else {
                subMenu.classList.add("show");
                subMenu.style.maxHeight = subMenu.scrollHeight + "px";
                this.classList.add("navbar__item-active");
              }
            }
          });
        });
      };

      setupDropdownToggles(mobileMenuListRef.current);
    }
  }, []);

  useEffect(() => {
    if (countryRef.current) {
      new NiceSelect(countryRef.current);
    }
  }, []);

  return (
    <>
      <header
        className={`header header-tertiary ${scroll && "sticky-header"
          }`}
      >
        <div className='container-fluid mt-2 mb-1'>
          <div className='row'>
            <div className='col-12'>
              <div className='main-header__menu-box'>
                <nav className='navbar p-0'>
                  <div className='navbar-logo'>
                    <Link href='/'>
                      <img
                        src='/assets/images/logo.png'
                        alt='Image_inner'
                        style={{ height: "80px", objectFit: "cover" }}
                      />
                    </Link>
                  </div>

                  <div className='navbar__menu d-none d-xl-block'>
                    <ul className='navbar__list'>

                      {/* About Us */}
                      <li className={`navbar__item navbar__item--has-children nav-fade ${["/about-us", "/foundation", "/dr-temsamani", "/structure"].includes(pathname) ? "active" : ""}`}>
                        <Link href='#' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          About Us
                        </Link>
                        <ul className='navbar__sub-menu'>
                          <li className={["/foundation"].includes(pathname) ? "active" : ""}>
                            <Link href='/foundation'>The Foundation</Link>
                          </li>
                          <li className={["/dr-temsamani"].includes(pathname) ? "active" : ""}>
                            <Link href='/dr-temsamani'>About Dr. Temsamani</Link>
                          </li>
                          <li className={["/structure"].includes(pathname) ? "active" : ""}>
                            <Link href='/structure'>Administrative Structure & Scientific Committee</Link>
                          </li>
                        </ul>
                      </li>

                      {/* Library & Resources */}
                      <li className={`navbar__item navbar__item--has-children nav-fade ${["/library", "/journals", "/publications", "/archives", "/sites", "/issues"].includes(pathname) ? "active" : ""}`}>
                        <Link href='#' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          Library & Resources
                        </Link>
                        <ul className='navbar__sub-menu'>
                          <li><Link href='/library'>Digital Library</Link></li>
                          <li className='navbar__item navbar__item--has-children'>
                            <Link href='/journals' className='navbar__dropdown-label navbar__dropdown-label-sub'>Journals</Link>
                            <ul className='navbar__sub-menu navbar__sub-menu__nested'>
                              <li><Link href='/dar-al-niaba'>Dar Al-Niaba</Link></li>
                              <li><Link href='/les-tangérois'>Les Tangérois</Link></li>
                            </ul>
                          </li>
                          <li><Link href='#'>Publications</Link></li>
                          <li><Link href='#'>Archives & Documentary Heritage</Link></li>
                          <li><Link href='#'>Manuscrits</Link></li>
                          <li><Link href='#'>Historical Sites & Landmarks</Link></li>
                          <li><Link href='#'>Research Issues & Problematics</Link></li>
                        </ul>
                      </li>

                      {/* Research & Publishing */}
                      <li className={`navbar__item navbar__item--has-children nav-fade ${["/advanced-search", "/submit", "/guide"].includes(pathname) ? "active" : ""}`}>
                        <Link href='#' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          Research & Publishing
                        </Link>
                        <ul className='navbar__sub-menu'>
                          <li><Link href='#'>Advanced Content Search</Link></li>
                          <li><Link href='#'>Submit Your Research</Link></li>
                          <li><Link href='#'>Publishing Guide & Submission Criteria</Link></li>
                        </ul>
                      </li>

                      {/* Services */}
                      <li className={`navbar__item navbar__item--has-children nav-fade ${["/consultations", "/support", "/platform"].includes(pathname) ? "active" : ""}`}>
                        <Link href='#' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          Services
                        </Link>
                        <ul className='navbar__sub-menu'>
                          <li><Link href='#'>Academic Consultations & Guidance</Link></li>
                          <li><Link href='#'>Researcher Support & Empowerment</Link></li>
                          <li><Link href='#'>Personal Research Workspace</Link></li>
                        </ul>
                      </li>

                      {/* Events & Activities */}
                      <li className={`navbar__item navbar__item--has-children nav-fade ${["/seminars", "/awards", "/exhibitions"].includes(pathname) ? "active" : ""}`}>
                        <Link href='#' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          Events
                        </Link>
                        <ul className='navbar__sub-menu'>
                          <li><Link href='#'>Academic Seminars & Lectures</Link></li>
                          <li><Link href='#'>Research Awards & Recognition</Link></li>
                          <li><Link href='#'>Exhibitions & Documentary Media</Link></li>
                        </ul>
                      </li>

                      {/* Support & Help */}
                      <li className={`navbar__item navbar__item--has-children nav-fade ${["/faq", "/contact-us", "/policies"].includes(pathname) ? "active" : ""}`}>
                        <Link href='#' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          Support & Help
                        </Link>
                        <ul className='navbar__sub-menu'>
                          <li><Link href='/'>Frequently Asked Questions (FAQ)</Link></li>
                          <li><Link href='/'>Contact Us</Link></li>
                          <li><Link href='/'>Terms & Policies</Link></li>
                        </ul>
                      </li>

                    </ul>
                  </div>


                  <div className='navbar__options'>
                    <div className='navbar__mobile-options '>
                      <div className=' d-none d-xxl-block'>
                      </div>
                      <Link
                        href='/'
                        className='btn--secondary d-none d-md-flex'
                      >
                        Join Us <i className='fa-solid fa-arrow-right' />
                      </Link>
                    </div>
                    <button
                      onClick={handleMobileMenu}
                      className='open-offcanvas-nav d-flex d-xl-none'
                      aria-label='toggle mobile menu'
                      title='open offcanvas menu'
                    >
                      <span className='icon-bar top-bar' />
                      <span className='icon-bar middle-bar' />
                      <span className='icon-bar bottom-bar' />
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${search ? "search-active search-popup" : "search-popup"
            }`}
        >
          <button
            onClick={handleSearch}
            className='close-search'
            aria-label='close search box'
            title='close search box'
          >
            <i className='fa-solid fa-xmark' />
          </button>
          <form action='#' method='post'>
            <div className='search-popup__group'>
              <input
                type='text'
                name='search-field'
                id='searchField'
                placeholder='Search....'
                required=''
              />
              <button
                type='submit'
                aria-label='search products'
                title='search products'
              >
                <i className='fa-solid fa-magnifying-glass' />
              </button>
            </div>
          </form>
        </div>
      </header>

      <div
        className={`mobile-menu mobile-menu--primary d-block d-xxl-none ${mobileMenu ? "show-menu" : ""
          }`}
      >
        <nav className='mobile-menu__wrapper'>
          <div className='mobile-menu__header nav-fade'>
            <div className='logo'>
              <Link href='/' aria-label='home page' title='logo'>
                <img src='/assets/images/logo.png' alt='Image_inner' />
              </Link>
            </div>
            <button
              onClick={handleMobileMenu}
              aria-label='close mobile menu'
              className='close-mobile-menu'
            >
              <i className='fa-solid fa-xmark' />
            </button>
          </div>
          <div className='mobile-menu__list' ref={mobileMenuListRef}></div>

          <div className='mobile-menu__cta nav-fade d-block d-md-none'>
            <Link href='/' className='btn--primary '>
              Join Us <i className='fa-solid fa-arrow-right' />
            </Link>
          </div>
          <div className='mobile-menu__social social nav-fade'>
            <Link
              href='https://www.facebook.com/'
              target='_blank'
              aria-label='share us on facebook'
              title='facebook'
            >
              <i className='fa-brands fa-facebook-f' />
            </Link>
            <Link
              href='https://vimeo.com/'
              target='_blank'
              aria-label='share us on vimeo'
              title='vimeo'
            >
              <i className='fa-brands fa-vimeo-v' />
            </Link>
            <Link
              href='https://x.com/'
              target='_blank'
              aria-label='share us on twitter'
              title='twitter'
            >
              <i className='fa-brands fa-twitter' />
            </Link>
            <Link
              href='https://www.linkedin.com/'
              target='_blank'
              aria-label='share us on linkedin'
              title='linkedin'
            >
              <i className='fa-brands fa-linkedin-in' />
            </Link>
          </div>
        </nav>
      </div>

      <div
        className={`mobile-menu__backdrop ${mobileMenu ? "mobile-menu__backdrop-active" : ""
          }`}
      ></div>
    </>
  );
};

export default HeaderFour;