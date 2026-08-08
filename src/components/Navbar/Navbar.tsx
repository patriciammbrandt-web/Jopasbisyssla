import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../Logo/Logo";
import { NAV_ITEMS, CONTACT } from "../../data/site";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stäng mobilmenyn vid sidbyte
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lås scroll när mobilmenyn är öppen
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`}
    >
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" aria-label="Jopas Honung – startsida">
          <Logo />
        </Link>

        <nav className="nav__links" aria-label="Huvudmeny">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav__link ${isActive ? "is-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className={`nav__burger ${open ? "is-open" : ""}`}
          aria-label={open ? "Stäng meny" : "Öppna meny"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobilmeny */}
      <div className={`nav__mobile ${open ? "is-open" : ""}`}>
        <nav className="nav__mobile-links" aria-label="Mobilmeny">
          {NAV_ITEMS.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              className={({ isActive }) =>
                `nav__mobile-link ${isActive ? "is-active" : ""}`
              }
            >
              <span className="nav__mobile-index">0{i + 1}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav__mobile-foot">
          <a href={CONTACT.emailHref}>{CONTACT.email}</a>
        </div>
      </div>
    </header>
  );
}
