import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (hash) {
      const target = document.getElementById(
        decodeURIComponent(hash.slice(1))
      );

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        return;
      }
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    document
      .querySelectorAll<HTMLElement>("[data-scroll-container]")
      .forEach((element) => {
        element.scrollTop = 0;
      });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
