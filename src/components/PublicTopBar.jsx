"use client";
import {useEffect, useRef} from "react";
import {useLocale, useTranslations} from "next-intl";
import {usePathname, useRouter} from "@/i18n/navigation";
import {localeFlagMap, localeLabels, locales} from "@/i18n/config";

const PublicTopBar = () => {
  const selectRef = useRef(null);
  const wrapperRef = useRef(null);
  const niceInstanceRef = useRef(null);
  const t = useTranslations("topbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const phone = t("phone");
  const phoneHref = phone.replace(/[^\d+]/g, "");

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    let isCurrent = true;
    let removeSelectListeners = () => {};
    const selectEl = selectRef.current;
    if (!selectEl) {
      return;
    }

    if (niceInstanceRef.current) {
      niceInstanceRef.current.destroy();
      niceInstanceRef.current = null;
    }

    selectEl.innerHTML = "";
    locales.forEach((code) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = localeLabels[code] || code;
      const flag = localeFlagMap[code];
      if (flag) {
        option.setAttribute("data-flag", flag);
      }
      selectEl.appendChild(option);
    });

    selectEl.value = locale;

    if (wrapperRef.current) {
      wrapperRef.current.classList.add("enhanced");
    }

    const enhanceSelect = async () => {
      try {
        const module = await import("nice-select2");
        if (!isCurrent) return;
        const NiceSelect = module.default ?? module;
        const instance = new NiceSelect(selectEl, {
          searchable: false,
          placeholder: t("languagePlaceholder")
        });
        niceInstanceRef.current = instance;

        const niceRoot = selectEl.nextElementSibling;

        const renderFlags = () => {
          if (!niceRoot) return;
          const selectedOption = selectEl.options[selectEl.selectedIndex];
          const selectedLocale = selectedOption?.value;
          const selectedFlag = selectedOption?.getAttribute("data-flag") || "";
          const selectedLabel = localeLabels[selectedLocale] || selectedOption?.textContent || "";
          const currentEl = niceRoot.querySelector(".current");
          if (currentEl) {
            currentEl.innerHTML = selectedFlag
              ? `<i class="fi fi-${selectedFlag}"></i> ${selectedLabel}`
              : selectedLabel;
          }

          const listOptions = niceRoot.querySelectorAll(".list .option");
          listOptions.forEach((li) => {
            const value = li.getAttribute("data-value");
            const flag = localeFlagMap[value];
            const label = localeLabels[value] || value;
            li.innerHTML = flag ? `<i class="fi fi-${flag}"></i> ${label}` : label;
          });
        };

        renderFlags();

        const handleChange = (event) => {
          const nextLocale = event.target.value;
          if (nextLocale && nextLocale !== locale) {
            router.replace(pathnameRef.current, {locale: nextLocale});
          }
        };

        selectEl.addEventListener("change", handleChange);
        selectEl.addEventListener("change", renderFlags);
        removeSelectListeners = () => {
          selectEl.removeEventListener("change", handleChange);
          selectEl.removeEventListener("change", renderFlags);
        };
      } catch (error) {
        console.error(error);
      }
    };

    enhanceSelect();

    return () => {
      isCurrent = false;
      removeSelectListeners();
      if (wrapperRef.current) {
        wrapperRef.current.classList.remove("enhanced");
      }
      niceInstanceRef.current?.destroy?.();
      niceInstanceRef.current = null;
    };
  }, [locale, router, t]);

  return (
    <div className="topbar two d-none d-xl-block">
      <div className="container">
        <div className="px-3 row align-items-center">
          <div className="col-12 col-lg-6">
            <div className="topbar__list-wrapper">
              <ul className="topbar__list">
                <li>
                  <a href={`mailto:${t("email")}`}>
                    <i className="fa-regular fa-envelope" />
                    {t("email")}
                  </a>
                </li>
                <li>
                  <a href={`tel:${phoneHref}`}>
                    <i className="fa-solid fa-phone" />
                    {phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="topbar__items justify-content-end">
              <div className="country-select two" ref={wrapperRef}>
                <select
                  ref={selectRef}
                  name="language"
                  defaultValue={locale}
                  className="select two"
                  aria-label={t("languageLabel")}
                ></select>
              </div>

              <div className="social">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  aria-label="share us on facebook"
                  title="facebook"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-facebook-f" />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  aria-label="share us on twitter"
                  title="twitter"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-twitter" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  aria-label="share us on linkedin"
                  title="linkedin"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-linkedin-in" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTopBar;
