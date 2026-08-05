import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import Socials from "../Socials/Socials";
import { NAV_ITEMS, CONTACT, RETAILER_PARTNERS } from "../../data/site";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo size="lg" tone="light" />
          <p className="footer__tagline">
            Småskalig biodling på Söderåsens sluttningar och slätten nedanför.
            Honung hanterad på ett hantverksmässigt sätt – från blomma till burk.
          </p>
          <Socials className="footer__socials" />
        </div>

        <nav className="footer__col" aria-label="Sidfotsmeny">
          <h3 className="footer__heading">Utforska</h3>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="footer__link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h3 className="footer__heading">Kontakt</h3>
          <ul>
            <li>
              <a href={CONTACT.phoneHref} className="footer__link">
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={CONTACT.emailHref} className="footer__link">
                {CONTACT.email}
              </a>
            </li>
            <li className="footer__muted">{CONTACT.region}</li>
            <li className="footer__muted">{CONTACT.company}</li>
            <li className="footer__muted">Org.nr {CONTACT.orgNr}</li>
          </ul>
        </div>
      </div>

      <div className="container footer__partners">
        <h3 className="footer__heading">Samarbeten</h3>
        <ul className="footer__partner-logos">
          {RETAILER_PARTNERS.filter((p) => p.logo && p.url).map((p) => (
            <li key={p.id}>
              <a
                href={p.url}
                className={`footer__partner-link footer__partner-link--${p.id}`}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${p.name} (öppnas i ny flik)`}
              >
                <img src={p.logo} alt="" loading="lazy" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} {CONTACT.brand}. Producerad av{" "}
          <a
            href="https://isakweb.se"
            target="_blank"
            rel="noreferrer noopener"
            className="footer__credit"
          >
            IsakWeb
          </a>
        </p>
        <p className="footer__made">
          100% svensk honung · Skördad med omsorg
        </p>
      </div>
    </footer>
  );
}
