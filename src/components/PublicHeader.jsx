"use client";
import Image from "next/image";
import {useEffect, useMemo, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Link, usePathname} from "@/i18n/navigation";
import useAuth from "@/hooks/useAuth";
import {isRtlLocale} from "@/i18n/config";
import {getServiceContent, SERVICE_SLUGS} from "@/content/services";

const toTitleFromSlug = (slug = "") =>
  slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const LIBRARY_LINKS = [
  {
    id: "digital-library",
    href: "/library",
    labelKey: "digitalLibrary",
    activeTargets: ["/library"],
  },
  {
    id: "journals",
    href: "/journals",
    labelKey: "journals",
    activeTargets: ["/journals"],
  },
  {
    id: "publications",
    href: "/categories/publications",
    labelKey: "publications",
    activeTargets: ["/categories/publications"],
  },
  
  {
    id: "research-themes",
    href: "/categories/research-themes",
    labelKey: "issues",
    activeTargets: ["/categories/research-themes"],
  },
  {
    id: "archives",
    href: "/categories/archives",
    labelKey: "archives",
    activeTargets: ["/categories/archives"],
  },
  {
    id: "historical-sites",
    href: "/categories/historical-sites",
    labelKey: "sites",
    activeTargets: ["/categories/historical-sites"],
  },
  
];

const LIBRARY_ACTIVE_TARGETS = LIBRARY_LINKS.flatMap((item) => item.activeTargets);

const EVENT_LINKS = [
  {href: "/events/seminars", labelKey: "seminars"},
  {href: "/events/research-awards", labelKey: "awards"},
  {href: "/events/documentary-media", labelKey: "exhibitions"},
];

const SUPPORT_LINKS = [
  {href: "/support/faq", labelKey: "faq"},
  {href: "/support/terms", labelKey: "policies"},
  {href: "/support/contact", labelKey: "contactUs"},
];

const sanitizeNavId = (value = "") =>
  String(value)
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const extractPath = (href) => (href || "").split("?")[0];
const STICKY_SCROLL_THRESHOLD = 150;

const PublicHeader = () => {
  const t = useTranslations("nav");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openMobileItems, setOpenMobileItems] = useState(() => new Set());
  const [scroll, setScroll] = useState(false);
  const stickyRef = useRef(false);
  const {isAuthenticated, roles, logout, initializing: authLoading} = useAuth();
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
      const nextSticky = window.pageYOffset > STICKY_SCROLL_THRESHOLD;
      if (stickyRef.current !== nextSticky) {
        stickyRef.current = nextSticky;
        setScroll(nextSticky);
      }
    };

    const listenerOptions = { passive: true };
    window.addEventListener("scroll", handleScroll, listenerOptions);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll, listenerOptions);
    };
  }, []);

  const handleMobileMenu = () => {
    setMobileMenu((prev) => !prev);
  };

  useEffect(() => {
    if (!mobileMenu) {
      setOpenMobileItems(new Set());
    }
  }, [mobileMenu]);

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

  const navItems = useMemo(() => {
    return [
      {
        id: "about",
        label: t("aboutUs"),
        activeTargets: ["/foundation", "/dr-temsamani", "/structure"],
        children: [
          {
            id: "foundation",
            href: "/foundation",
            label: t("foundation"),
            activeTargets: ["/foundation"],
          },
          {
            id: "dr-temsamani",
            href: "/dr-temsamani",
            label: t("drTemsamani"),
            activeTargets: ["/dr-temsamani"],
          },
          {
            id: "structure",
            href: "/structure",
            label: t("structure"),
            activeTargets: ["/structure"],
          },
        ],
      },
      {
        id: "library",
        href: "/library",
        label: t("libraryResources"),
        activeTargets: LIBRARY_ACTIVE_TARGETS,
        children: LIBRARY_LINKS.map((item) => ({
          id: item.id,
          href: item.href,
          label: t(item.labelKey),
          activeTargets: item.activeTargets,
        })),
      },
      {
        id: "research-publishing",
        label: t("researchPublishing"),
        activeTargets: ["/advanced-search", "/publishing"],
        children: [
          {
            id: "advanced-search",
            href: "/advanced-search",
            label: t("advancedSearch"),
            activeTargets: ["/advanced-search"],
          },
          {
            id: "publishing",
            href: "/publishing",
            label: t("publishingGuide"),
            activeTargets: ["/publishing"],
          },
        ],
      },
      {
        id: "services",
        href: "/services/academic-consultations",
        label: t("services"),
        activeTargets: serviceLinks.map(({href}) => href),
        children: serviceLinks.map(({href, label}) => ({
          id: `service-${sanitizeNavId(href)}`,
          href,
          label,
          activeTargets: [href],
        })),
      },
      {
        id: "events",
        href: "/events/seminars",
        label: t("events"),
        activeTargets: EVENT_LINKS.map(({href}) => extractPath(href)),
        children: EVENT_LINKS.map(
          ({href, labelKey}) => ({
            id: `event-${sanitizeNavId(labelKey)}`,
            href,
            label: t(labelKey),
            activeTargets: [extractPath(href)],
          }),
        ),
      },
      {
        id: "support",
        href: "/support/faq",
        label: t("supportHelp"),
        activeTargets: SUPPORT_LINKS.map(({href}) => href),
        children: SUPPORT_LINKS.map(({href, labelKey}) => ({
          id: `support-${sanitizeNavId(labelKey)}`,
          href,
          label: t(labelKey),
          activeTargets: [href],
        })),
      },
    ];
  }, [
    serviceLinks,
    t,
  ]);

  const getNavItemActiveTargets = (item) => {
    if (Array.isArray(item.activeTargets) && item.activeTargets.length) {
      return item.activeTargets;
    }
    return item.href ? [extractPath(item.href)] : [];
  };

  const isNavItemActive = (item) => {
    const targets = getNavItemActiveTargets(item);
    return targets.length ? isActive(targets) : false;
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
    setOpenMobileItems(new Set());
  };

  const handleMobileLinkClick = () => {
    closeMobileMenu();
  };

  const toggleMobileItem = (itemId) => {
    setOpenMobileItems((current) => {
      const next = new Set(current);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    closeMobileMenu();
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
      <Link href='/join-us' className='btn--secondary d-none d-md-flex align-items-center gap-2'>
        {t("joinUs")} <i className='fa-solid fa-arrow-right' />
      </Link>
    );
  };

  const renderDesktopNavItem = (item, level = 0) => {
    if (item.type === "text") {
      return (
        <li key={item.id}>
          <span>{item.label}</span>
        </li>
      );
    }

    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const active = isNavItemActive(item);
    const itemClassName = [
      "navbar__item",
      hasChildren ? "navbar__item--has-children" : "",
      level === 0 ? "nav-fade" : "",
      active ? "active" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const linkClassName = hasChildren
      ? level === 0
        ? "navbar__dropdown-label dropdown-label-alter"
        : "navbar__dropdown-label navbar__dropdown-label-sub"
      : undefined;
    const submenuClassName = [
      "navbar__sub-menu",
      level > 0 ? "navbar__sub-menu__nested" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <li key={item.id} className={itemClassName}>
        {item.href ? (
          <Link href={item.href} className={linkClassName}>
            {item.label}
          </Link>
        ) : (
          <button
            type='button'
            className={linkClassName}
            aria-haspopup='true'
          >
            {item.label}
          </button>
        )}
        {hasChildren && (
          <ul className={submenuClassName}>
            {item.children.map((child) => renderDesktopNavItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  const renderMobileNavItem = (item, level = 0) => {
    if (item.type === "text") {
      return (
        <li key={item.id} className='navbar__item'>
          <span className='navbar__text'>{item.label}</span>
        </li>
      );
    }

    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const active = isNavItemActive(item);
    const isOpen = openMobileItems.has(item.id);
    const submenuId = `mobile-nav-${sanitizeNavId(item.id)}`;
    const itemClassName = [
      "navbar__item",
      hasChildren ? "navbar__item--has-children" : "",
      active ? "active" : "",
    ]
      .filter(Boolean)
      .join(" ");

    if (!hasChildren) {
      return (
        <li key={item.id} className={itemClassName}>
          <Link href={item.href} onClick={handleMobileLinkClick}>
            {item.label}
          </Link>
        </li>
      );
    }

    return (
      <li key={item.id} className={itemClassName}>
        <button
          type='button'
          className={`navbar__dropdown-label${isOpen ? " navbar__item-active" : ""}`}
          aria-expanded={isOpen}
          aria-controls={submenuId}
          onClick={() => toggleMobileItem(item.id)}
        >
          {item.label}
        </button>
        <ul
          id={submenuId}
          className={`navbar__sub-menu${isOpen ? " show" : ""}`}
          hidden={!isOpen}
        >
          {item.children.map((child) => renderMobileNavItem(child, level + 1))}
        </ul>
      </li>
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

                  <div className='navbar__menu d-none d-xxl-flex'>
                    <ul
                      className='navbar__list'
                      style={{
                        direction: isRtl ? "rtl" : "ltr"
                      }}
                      lang={locale}
                      dir={isRtl ? "rtl" : "ltr"}
                    >
                      {navItems.map((item) => renderDesktopNavItem(item))}
                    </ul>
                  </div>

                  <div className='navbar__options'>
                    <div className='navbar__mobile-options '>
                      <div className='d-none d-xxl-block'></div>
                      {renderPrimaryCta()}
                    </div>
                    <button
                      onClick={handleMobileMenu}
                      className='open-offcanvas-nav d-flex d-xxl-none'
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
      </header>

      <div
        className={`mobile-menu mobile-menu--primary d-block d-xxl-none ${
          mobileMenu ? "show-menu" : ""
        }`}
      >
        <nav className='mobile-menu__wrapper'>
          <div className='mobile-menu__header nav-fade'>
            <div className='logo'>
              <Link href='/' aria-label='home page' title='logo' onClick={handleMobileLinkClick}>
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
          <div className='mobile-menu__list nav-fade'>
            <ul
              className='navbar__list'
              lang={locale}
              dir={isRtl ? "rtl" : "ltr"}
            >
              {navItems.map((item) => renderMobileNavItem(item))}
            </ul>
          </div>

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
              <Link href='/join-us' className='btn--secondary w-100' onClick={handleMobileMenu}>
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

export default PublicHeader;
