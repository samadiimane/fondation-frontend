"use client";
import Image from "next/image";
import {useEffect, useMemo, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Link, usePathname} from "@/i18n/navigation";
import useNavigationTaxonomy from "@/hooks/useNavigationTaxonomy";
import useNavigationJournals from "@/hooks/useNavigationJournals";
import useAuth from "@/hooks/useAuth";
import {isRtlLocale} from "@/i18n/config";
import {getServiceContent, SERVICE_SLUGS} from "@/content/services";

const KNOWN_SECTION_CONFIG = {
  archives: {
    href: "/categories/archives",
    priority: 1,
  },
  "research-themes": {
    href: "/categories/research-themes",
    priority: 2,
  },
  "historical-sites": {
    href: "/categories/historical-sites",
    priority: 3,
    labelKey: "sites",
  },
  publications: {
    href: "/categories/publications",
    priority: 4,
    labelKey: "publications",
  },
};

const toTitleFromSlug = (slug = "") =>
  slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const EVENT_LINKS = [
  {href: "/events", labelKey: "events"},
  {href: "/events?type=seminar", labelKey: "seminars"},
  {href: "/events?type=award", labelKey: "awards"},
  {href: "/events?type=exhibitions", labelKey: "exhibitions"},
];

const SUPPORT_LINKS = [
  {href: "/support/faq", labelKey: "faq"},
  {href: "/support/contact", labelKey: "contactUs"},
  {href: "/support/terms", labelKey: "policies"},
];

const HeaderFour = () => {
  const t = useTranslations("nav");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const pathname = usePathname();
  const [search, setSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scroll, setScroll] = useState(false);
  const {categories, loading: categoriesLoading} = useNavigationTaxonomy({ locale });
  const {journals: navJournals, loading: navJournalsLoading} = useNavigationJournals({ locale });
  const {isAuthenticated, roles, logout, initializing: authLoading} = useAuth();
  const mobileMenuListRef = useRef(null);
  const safeRoles = Array.isArray(roles) ? roles : [];
  const hasAdminRole = safeRoles.includes("admin");

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

  const collator = useMemo(() => {
    try {
      return new Intl.Collator(locale || undefined, {sensitivity: "base"});
    } catch {
      return new Intl.Collator("en", {sensitivity: "base"});
    }
  }, [locale]);

  const journalLinks = useMemo(() => {
    if (navJournals.length) {
      const mapped = navJournals.map((journal) => ({
        slug: journal.slug,
        label: (journal.name ?? "").trim(),
        href: `/journals/${journal.slug}`,
      }));
      mapped.sort((a, b) => collator.compare(a.label, b.label));
      return mapped;
    }
    const journals = (categories || []).filter((category) => category.kind === "journal");
    const mapped = journals.map((category) => {
      const linked = category.linkedJournal;
      const label = (linked?.name ?? category.name ?? "").trim();
      return {
        slug: category.slug,
        label,
        href: linked
          ? `/journals/${linked.slug}`
          : `/journals/${category.slug}`,
      };
    });
    mapped.sort((a, b) => collator.compare(a.label, b.label));
    return mapped;
  }, [categories, collator, navJournals]);

  const librarySectionLinks = useMemo(() => {
    const sections = (categories || []).filter(
      (category) =>
        category.kind === "section" &&
        category.slug !== "library" &&
        category.slug !== "journals"
    );
    const unique = new Map();
    sections.forEach((section) => {
      if (!section?.slug || unique.has(section.slug)) return;
      const config = KNOWN_SECTION_CONFIG[section.slug];
      const fallbackLabel = toTitleFromSlug(section.slug);
      const labelKey = config?.labelKey;
      const translatedLabel = labelKey ? t(labelKey) : "";
      unique.set(section.slug, {
        slug: section.slug,
        label: translatedLabel || section.name?.trim() || fallbackLabel,
        href: config?.href ?? `/library?category=${section.slug}`,
        priority: config?.priority ?? Number.MAX_SAFE_INTEGER,
      });
    });
    const values = Array.from(unique.values());
    values.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return collator.compare(a.label, b.label);
    });
    return values;
  }, [categories, collator, t]);

  const journalActiveTargets = useMemo(
    () => ["/journals", ...journalLinks.map((item) => item.href.split("?")[0])],
    [journalLinks]
  );

  const libraryActiveTargets = useMemo(
    () => ["/library", ...journalActiveTargets, ...librarySectionLinks.map((item) => item.href.split("?")[0])],
    [journalActiveTargets, librarySectionLinks]
  );

  const isJournalsLoading = navJournalsLoading || categoriesLoading;

  const serviceLinks = useMemo(() => {
    return SERVICE_SLUGS.map((slug) => {
      const content = getServiceContent(locale, slug);
      const fallbackLabel = toTitleFromSlug(slug);
      return {
        href: `/services/${slug}`,
        label: content?.title?.trim() || fallbackLabel
      };
    });
  }, [locale]);

  const extractPath = (href) => (href || "").split("?")[0];

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    setMobileMenu(false);
  };

  const renderPrimaryCta = () => {
    if (authLoading) {
      return null;
    }
    if (isAuthenticated) {
      return (
        <button
          type='button'
          onClick={handleLogout}
          className='btn--secondary d-none d-md-flex ms-0 ms-md-3 align-items-center gap-2'
          aria-label={t("logout")}
        >
          {t("logout")}
          <i className='fa-solid fa-arrow-right' />
        </button>
      );
    }
    return (
      <Link href='/auth/login' className='btn--secondary d-none d-md-flex align-items-center gap-2'>
        {t("joinUs")} <i className='fa-solid fa-arrow-right' />
      </Link>
    );
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
                      <Image
                        src='/assets/images/logo.png'
                        alt='Foundation logo'
                        width={476}
                        height={197}
                        sizes='180px'
                        quality={75}
                        priority
                        style={{height: "80px", width: "auto", objectFit: "cover"}}
                      />
                    </Link>
                  </div>

                  <div className='navbar__menu d-none d-xl-block'>
                    <ul
                      className='navbar__list'
                      style={{
                        direction: isRtl ? "rtl" : "ltr"
                      }}
                      lang={locale}
                      dir={isRtl ? "rtl" : "ltr"}
                    >
                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive(["/foundation", "/dr-temsamani", "/structure"]) ? "active" : ""
                        }`}
                      >
                         <Link href='/' className='navbar__dropdown-label dropdown-label-alter'>
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
                          isActive(libraryActiveTargets) ? "active" : ""
                        }`}
                      >
                        <Link
                          href='/library'
                          className='navbar__dropdown-label dropdown-label-alter'
                        >
                          {t("libraryResources")}
                        </Link>
                        <ul className='navbar__sub-menu'>
                          <li className={isActive("/library") ? "active" : ""}>
                            <Link href='/library'>{t("digitalLibrary")}</Link>
                          </li>
                          <li
                            className={`navbar__item navbar__item--has-children ${
                              isActive(journalActiveTargets) ? "active" : ""
                            }`}
                          >
                            <Link
                              href='/journals'
                              className='navbar__dropdown-label navbar__dropdown-label-sub'
                            >
                              {t("journals")}
                            </Link>
                            <ul className='navbar__sub-menu navbar__sub-menu__nested'>
                              {isJournalsLoading ? (
                                <li>
                                  <span>{t("journalsLoading")}</span>
                                </li>
                              ) : journalLinks.length ? (
                                <>
                                  <li className={isActive("/journals") ? "active" : ""}>
                                    <Link href='/journals'>{t("journalsAll")}</Link>
                                  </li>
                                  {journalLinks.map((journal) => (
                                    <li
                                      key={journal.slug}
                                      className={isActive(extractPath(journal.href)) ? "active" : ""}
                                    >
                                      <Link href={journal.href}>{journal.label}</Link>
                                    </li>
                                  ))}
                                </>
                              ) : (
                                <li>
                                  <span>{t("journalsEmpty")}</span>
                                </li>
                              )}
                            </ul>
                          </li>
                          {categoriesLoading ? (
                            <li>
                              <span>{t("libraryLoading")}</span>
                            </li>
                          ) : librarySectionLinks.length ? (
                            librarySectionLinks.map((section) => (
                              <li
                                key={section.slug}
                                className={isActive(extractPath(section.href)) ? "active" : ""}
                              >
                                <Link href={section.href}>{section.label}</Link>
                              </li>
                            ))
                          ) : (
                            <li>
                              <span>{t("libraryEmpty")}</span>
                            </li>
                          )}
                        </ul>
                      </li>

                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive(["/advanced-search", "/publishing"]) ? "active" : ""
                        }`}
                      >
                        <Link href='/' className='navbar__dropdown-label dropdown-label-alter'>
                          {t("researchPublishing")}
                         </Link>
                        <ul className='navbar__sub-menu'>
                          <li className={isActive("/advanced-search") ? "active" : ""}>
                            <Link href='/advanced-search'>{t("advancedSearch")}</Link>
                          </li>
                          <li className={isActive("/publishing") ? "active" : ""}>
                            <Link href='/publishing'>{t("publishingGuide")}</Link>
                          </li>
                        </ul>
                      </li>

                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive(serviceLinks.map(({href}) => href)) ? "active" : ""
                        }`}
                      >
                        <Link
                          href='/services/academic-consultations'
                          className='navbar__dropdown-label dropdown-label-alter'
                        >
                          {t("services")}
                        </Link>
                        <ul className='navbar__sub-menu'>
                          {serviceLinks.map(({href, label}) => (
                            <li key={href}>
                              <Link href={href}>{label}</Link>
                            </li>
                          ))}
                        </ul>
                      </li>

                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive(["/events"]) ? "active" : ""
                        }`}
                      >
                        <Link
                          href='/events'
                          className='navbar__dropdown-label dropdown-label-alter'
                        >
                          {t("events")}
                        </Link>
                        <ul className='navbar__sub-menu'>
                          {EVENT_LINKS.filter(({ labelKey }) => labelKey !== "events").map(
                            ({ href, labelKey }) => (
                              <li key={href}>
                                <Link href={href}>{t(labelKey)}</Link>
                              </li>
                            ),
                          )}
                        </ul>
                      </li>

                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          isActive(SUPPORT_LINKS.map(({href}) => href)) ? "active" : ""
                        }`}
                      >
                        <Link
                          href='/support/faq'
                          className='navbar__dropdown-label dropdown-label-alter'
                        >
                          {t("supportHelp")}
                        </Link>
                        <ul className='navbar__sub-menu'>
                          {SUPPORT_LINKS.map(({href, labelKey}) => (
                            <li key={href}>
                              <Link href={href}>{t(labelKey)}</Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div className='navbar__options'>
                    <div className='navbar__mobile-options '>
                      <div className='d-none d-xxl-block'></div>
                      {renderPrimaryCta()}
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
                <Image
                  src='/assets/images/logo.png'
                  alt='Foundation logo'
                  width={476}
                  height={197}
                  sizes='160px'
                  quality={75}
                  loading='lazy'
                />
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
            {authLoading ? null : isAuthenticated ? (
              <button
                type='button'
                onClick={handleLogout}
                className='btn--secondary w-100'
                aria-label={t("logout")}
              >
                {t("logout")} <i className='fa-solid fa-arrow-right' />
              </button>
            ) : (
              <Link href='/auth/login' className='btn--secondary w-100' onClick={handleMobileMenu}>
                {t("joinUs")} <i className='fa-solid fa-arrow-right' />
              </Link>
            )}
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
