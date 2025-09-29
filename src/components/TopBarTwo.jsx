"use client";
import { useEffect, useRef, useState } from "react";
import NiceSelect from "nice-select2";

const TopBarTwo = () => {
  const countryRef_two = useRef(null);
  const countryWrapperRef = useRef(null);
  const [dark, setDark] = useState(false);

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
    // initialize dark state from body class
    if (typeof window !== "undefined") {
      setDark(document.body.classList.contains("dark-body"));
    }

    if (countryRef_two.current) {
      new NiceSelect(countryRef_two.current, {
        searchable: false,
        placeholder: 'Select Language'
      });
      if (countryWrapperRef.current) {
        countryWrapperRef.current.classList.add('enhanced');
      }

      const selectEl = countryRef_two.current;
      const niceRoot = selectEl.nextElementSibling;

      const renderNiceSelectFlags = () => {
        if (!niceRoot) return;
        const selectedOption = selectEl.options[selectEl.selectedIndex];
        const selectedFlag = selectedOption?.getAttribute('data-flag') || '';
        const selectedLabel = selectedOption?.textContent || '';
        const currentEl = niceRoot.querySelector('.current');
        if (currentEl) {
          currentEl.innerHTML = selectedFlag
            ? `<i class="fi fi-${selectedFlag}"></i> ${selectedLabel}`
            : selectedLabel;
        }

        const listOptions = niceRoot.querySelectorAll('.list .option');
        listOptions.forEach((li) => {
          const value = li.getAttribute('data-value');
          const opt = Array.from(selectEl.options).find((o) => o.value === value);
          if (opt) {
            const flag = opt.getAttribute('data-flag') || '';
            const label = opt.textContent || '';
            li.innerHTML = flag ? `<i class=\"fi fi-${flag}\"></i> ${label}` : label;
          }
        });
      };

      renderNiceSelectFlags();
      selectEl.addEventListener('change', renderNiceSelectFlags);
    }
  }, []);

  return (
    <div className="topbar two d-none d-lg-block px-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-lg-6">
            <div className="topbar__list-wrapper">
              <ul className="topbar__list">
                <li>
                  <a href="mailto:AKT_Research_Foundation@gmail.com">
                    <i className="fa-regular fa-envelope" />
                    AKT_Research_Foundation@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:2305-587-3407">
                    <i className="fa-solid fa-phone" />
                    +212 654-396-789
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
                 aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                 title={dark ? "Light mode" : "Dark mode"}
                 onClick={() => handleDarkVersion(dark ? "light" : "dark")}
               >
                 <i className={`fa-solid ${dark ? "fa-moon" : "fa-sun"}`} />
               </button>

              <div className="country-select two" ref={countryWrapperRef}>
                <select
                  ref={countryRef_two}
                  name="country"
                  defaultValue={"English"}
                  className="select two"
                >
                  <option value="English" data-flag="gb">
                    English
                  </option>
                  <option value="Arabic" data-flag="ma">
                    Arabic
                  </option>
                  <option value="French" data-flag="fr">
                    French
                  </option>
                  <option value="Spanish" data-flag="es">
                    Spanish
                  </option>
                </select>
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