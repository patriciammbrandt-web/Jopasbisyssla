import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrollar till toppen vid sidbyte, eller till hash-ankare när det finns. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = hash.slice(1);
    let tries = 0;
    let timer = 0;

    const jump = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
      tries += 1;
      if (tries < 40) {
        timer = window.setTimeout(jump, 50);
      }
    };

    jump();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
