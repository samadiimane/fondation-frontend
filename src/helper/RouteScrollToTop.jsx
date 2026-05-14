"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const RouteScrollToTop = () => {
  const location = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    let setupFrameId;
    let scrollFrameId;
    let cleanup = () => {};

    setupFrameId = window.requestAnimationFrame(() => {
      const progressWrap = document.querySelector(".progress-wrap");
      const progressPath = progressWrap?.querySelector("path");
      if (!progressWrap || !progressPath) {
        return;
      }

      const pathLength = progressPath.getTotalLength();
      progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
      progressPath.style.strokeDashoffset = `${pathLength}`;
      progressPath.style.transition = progressPath.style.WebkitTransition =
        "stroke-dashoffset 10ms linear";

      const updateProgress = () => {
        scrollFrameId = undefined;
        const scroll = window.scrollY;
        const height = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        const progress = pathLength - (scroll * pathLength) / height;
        progressPath.style.strokeDashoffset = `${Math.max(progress, 0)}`;
        progressWrap.classList.toggle("active-progress", scroll > 50);
      };

      const requestProgressUpdate = () => {
        if (scrollFrameId) {
          return;
        }
        scrollFrameId = window.requestAnimationFrame(updateProgress);
      };

      const handleClick = (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      updateProgress();
      window.addEventListener("scroll", requestProgressUpdate, { passive: true });
      progressWrap.addEventListener("click", handleClick);

      cleanup = () => {
        if (scrollFrameId) {
          window.cancelAnimationFrame(scrollFrameId);
        }
        window.removeEventListener("scroll", requestProgressUpdate);
        progressWrap.removeEventListener("click", handleClick);
      };
    });

    return () => {
      window.cancelAnimationFrame(setupFrameId);
      cleanup();
    };
  }, []);

  return (
    <>
      <button
        className='progress-wrap'
        aria-label='scroll indicator'
        title='back to top'
      >
        <span />
        <svg
          className='progress-circle svg-content'
          width='100%'
          height='100%'
          viewBox='-1 -1 102 102'
        >
          <path d='M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98' />
        </svg>
      </button>
    </>
  );
};

export default RouteScrollToTop;
