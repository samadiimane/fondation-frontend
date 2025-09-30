"use client";
import {useEffect, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Link, usePathname} from "@/i18n/navigation";

const HeaderFour = () => {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [search, setSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scroll, setScroll] = useState(false);
  const mobileMenuListRef = useRef(null);

  const normalizedPath = (() => {
    if (!pathname) return "/";
    const localePrefix = new RegExp(`^/${locale}(?=/|$)`);
    const withoutLocale = pathname.replace(localePrefix, "");
    return withoutLocale === "" ? "/" : withoutLocale;
  })();

  const isActive = (paths) => {
    const targets = Array.isArray(paths) ? paths : [paths];
    return targets.some((target) => {
      if (target === "/") {
        return normalizedPath === "/";
      }
      return normalizedPath.startsWith(target);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.pageYOffset > 150);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const desktopMenu = document.querySelector(".navbar__menu");
    const mobileMenuContainer = mobileMenuListRef.current;

    if (!desktopMenu || !mobileMenuContainer) {
      return;
    }

    mobileMenuContainer.innerHTML = desktopMenu.innerHTML;

    const setupDropdownToggles = (container) => {
      const dropdownLabels = container.querySelectorAll(
        ".navbar__dropdown-label"
      );

      dropdownLabels.forEach((label) => {
        label.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();

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
              subMenu.style.maxHeight = `${subMenu.scrollHeight}px`;
              this.classList.add("navbar__item-active");
            }
          }
        });
      });
    };

    setupDropdownToggles(mobileMenuContainer);

    return () => {
      mobileMenuContainer.innerHTML = "";
    };
  }, []);

  const handleSearch = () => {
    setSearch((prev) => !prev);
  };

  const handleMobileMenu = () => {
    setMobileMenu((prev) => !prev);
  };

  return (
    <>
      <header
        className={`header header-tertiary ${scroll ? "sticky-header" : ""}`}
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
                        alt='Foundation logo'
                        style={{height: "80px", objectFit: "cover"}}
                      />
                    </Link>
                  </div>

                  <div className='navbar__menu d-none d-xl-block'>
                    <ul className='navbar__list'>
                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive(["/foundation", "/dr-temsamani", "/structure"]) ? "active" : ""
                        }`}
                      >
                         <Link href='/' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          {t("aboutUs")}
                         </Link>
                        <ul className='navbar__sub-menu'>
                          <li className={isActive("/foundation") ? "active" : ""}>
                            <Link href='/foundation'>{t("foundation")}</Link>
                          </li>
                          <li className={isActive("/dr-temsamani") ? "active" : ""}>
                            <Link href='/dr-temsamani'>{t("drTemsamani")}</Link>
                          </li>
                          <li className={isActive("/structure") ? "active" : ""}>
                            <Link href='/structure'>{t("structure")}</Link>
                          </li>
                        </ul>
                      </li>

                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive([
                            "/library",
                            "/journals",
                            "/publications",
                            "/archives",
                            "/manuscripts",
                            "/sites",
                            "/issues",
                            "/dar-al-niaba",
                            "/les-tangerois"
                          ])
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link href='/' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          {t("libraryResources")}
                         </Link>
                        <ul className='navbar__sub-menu'>
                          <li className={isActive("/library") ? "active" : ""}>
                            <Link href='/library'>{t("digitalLibrary")}</Link>
                          </li>
                          <li
                            className={`navbar__item navbar__item--has-children ${
                              isActive(["/journals", "/dar-al-niaba", "/les-tangerois"]) ? "active" : ""
                            }`}
                          >
                            <Link
                              href='/journals'
                              className='navbar__dropdown-label navbar__dropdown-label-sub'
                            >
                              {t("journals")}
                            </Link>
                            <ul className='navbar__sub-menu navbar__sub-menu__nested'>
                              <li className={isActive("/dar-al-niaba") ? "active" : ""}>
                                <Link href='/dar-al-niaba'>{t("darAlNiaba")}</Link>
                              </li>
                              <li className={isActive("/les-tangerois") ? "active" : ""}>
                                <Link href='/les-tangerois'>{t("lesTangerois")}</Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <span>{t("publications")}</span>
                          </li>
                          <li>
                            <span>{t("archives")}</span>
                          </li>
                          <li>
                            <span>{t("manuscripts")}</span>
                          </li>
                          <li>
                            <span>{t("sites")}</span>
                          </li>
                          <li>
                            <span>{t("issues")}</span>
                          </li>
                        </ul>
                      </li>

                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive(["/advanced-search", "/submit", "/guide"]) ? "active" : ""
                        }`}
                      >
                        <Link href='/' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          {t("researchPublishing")}
                         </Link>
                        <ul className='navbar__sub-menu'>
                          <li>
                            <span>{t("advancedSearch")}</span>
                          </li>
                          <li>
                            <span>{t("submitResearch")}</span>
                          </li>
                          <li>
                            <span>{t("publishingGuide")}</span>
                          </li>
                        </ul>
                      </li>

                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive(["/consultations", "/support", "/platform"]) ? "active" : ""
                        }`}
                      >
                        <Link href='/' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          {t("services")}
                         </Link>
                        <ul className='navbar__sub-menu'>
                          <li>
                            <span>{t("consultations")}</span>
                          </li>
                          <li>
                            <span>{t("support")}</span>
                          </li>
                          <li>
                            <span>{t("platform")}</span>
                          </li>
                        </ul>
                      </li>

                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive(["/seminars", "/awards", "/exhibitions"]) ? "active" : ""
                        }`}
                      >
                        <Link href='/' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          {t("events")}
                         </Link>
                        <ul className='navbar__sub-menu'>
                          <li>
                            <span>{t("seminars")}</span>
                          </li>
                          <li>
                            <span>{t("awards")}</span>
                          </li>
                          <li>
                            <span>{t("exhibitions")}</span>
                          </li>
                        </ul>
                      </li>

                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive(["/faq", "/contact-us", "/policies"]) ? "active" : ""
                        }`}
                      >
                        <Link href='/' aria-label='dropdown menu' className='navbar__dropdown-label dropdown-label-alter'>
                          {t("supportHelp")}
                         </Link>
                        <ul className='navbar__sub-menu'>
                          <li>
                            <span>{t("faq")}</span>
                          </li>
                          <li>
                            <span>{t("contactUs")}</span>
                          </li>
                          <li>
                            <span>{t("policies")}</span>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div className='navbar__options'>
                    <div className='navbar__mobile-options '>
                      <div className='d-none d-xxl-block'></div>
                      <Link href='/' className='btn--secondary d-none d-md-flex'>
                        {t("joinUs")} <i className='fa-solid fa-arrow-right' />
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

        <div className={`${search ? "search-active search-popup" : "search-popup"}`}>
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
                placeholder={t("searchPlaceholder")}
                required
              />
              <button
                type='submit'
                aria-label='search content'
                title='search content'
              >
                <i className='fa-solid fa-magnifying-glass' />
              </button>
            </div>
          </form>
        </div>
      </header>

      <div
        className={`mobile-menu mobile-menu--primary d-block d-xxl-none ${
          mobileMenu ? "show-menu" : ""
        }`}
      >
        <nav className='mobile-menu__wrapper'>
          <div className='mobile-menu__header nav-fade'>
            <div className='logo'>
              <Link href='/' aria-label='home page' title='logo'>
                <img src='/assets/images/logo.png' alt='Foundation logo' />
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
              {t("joinUs")} <i className='fa-solid fa-arrow-right' />
            </Link>
          </div>
          <div className='mobile-menu__social social nav-fade'>
            <a
              href='https://www.facebook.com/'
              target='_blank'
              aria-label='share us on facebook'
              title='facebook'
              rel='noreferrer'
            >
              <i className='fa-brands fa-facebook-f' />
            </a>
            <a
              href='https://vimeo.com/'
              target='_blank'
              aria-label='share us on vimeo'
              title='vimeo'
              rel='noreferrer'
            >
              <i className='fa-brands fa-vimeo-v' />
            </a>
            <a
              href='https://x.com/'
              target='_blank'
              aria-label='share us on twitter'
              title='twitter'
              rel='noreferrer'
            >
              <i className='fa-brands fa-twitter' />
            </a>
            <a
              href='https://www.linkedin.com/'
              target='_blank'
              aria-label='share us on linkedin'
              title='linkedin'
              rel='noreferrer'
            >
              <i className='fa-brands fa-linkedin-in' />
            </a>
          </div>
        </nav>
      </div>

      <div
        className={`mobile-menu__backdrop ${
          mobileMenu ? "mobile-menu__backdrop-active" : ""
        }`}
        onClick={handleMobileMenu}
      ></div>
    </>
  );
};

export default HeaderFour;
