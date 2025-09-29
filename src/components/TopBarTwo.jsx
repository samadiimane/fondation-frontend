"use client";
import {useEffect, useRef, useState} from "react";
import NiceSelect from "nice-select2";
import {useLocale, useTranslations} from "next-intl";
import {usePathname, useRouter} from "@/i18n/navigation";
import {localeFlagMap, localeLabels, locales} from "@/i18n/config";

const TopBarTwo = () => {
  const selectRef = useRef(null);
  const wrapperRef = useRef(null);
  const niceInstanceRef = useRef(null);
  const [dark, setDark] = useState(false);
  const t = useTranslations("topbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleDarkVersion = (type) => {
    const body = document.body;
    if (type === "dark") {
      body.classList.add("dark-body");
      setDark(true);
    } else {
      body.classList.remove("dark-body");
      setDark(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDark(document.body.classList.contains("dark-body"));
    }
  }, []);

  useEffect(() => {
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
        router.replace(pathname, {locale: nextLocale});
      }
    };

    selectEl.addEventListener("change", handleChange);
    selectEl.addEventListener("change", renderFlags);

    return () => {
      selectEl.removeEventListener("change", handleChange);
      selectEl.removeEventListener("change", renderFlags);
      niceInstanceRef.current?.destroy?.();
      niceInstanceRef.current = null;
    };
  }, [locale, pathname, router, t]);

  return (
    <div className="topbar two d-none d-lg-block px-4">
      <div className="container">
        <div className="row align-items-center">
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
                  <a href={`tel:${t("phone")}`}>
                    <i className="fa-solid fa-phone" />
                    {t("phone")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="topbar__items justify-content-end">
              <button
                type="button"
                className="topbar__theme-btn"
                aria-label={t(dark ? "lightMode" : "darkMode")}
                title={t(dark ? "lightMode" : "darkMode")}
                onClick={() => handleDarkVersion(dark ? "light" : "dark")}
              >
                <i className={`fa-solid ${dark ? "fa-moon" : "fa-sun"}`} />
              </button>

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

export default TopBarTwo;
