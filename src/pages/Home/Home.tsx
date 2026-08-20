import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import Media from "../../components/Media/Media";
import Reveal from "../../components/Reveal/Reveal";
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import ProductCard from "../../components/ProductCard/ProductCard";
import { usePageMeta } from "../../hooks/usePageMeta";
import { PRODUCTS, CONTACT } from "../../data/site";
import { useMarkets } from "../../hooks/useMarkets";
import "./Home.css";

const MARQUEE_BASE = [
  "Försommarhonung",
  "Sensommarhonung",
  "Pollinering",
  "Bisamhällen",
  "Bivax",
  "Från blomma till burk",
];
// Upprepas rikligt så en grupp alltid är bredare än skärmen → aldrig tomt.
const MARQUEE_ITEMS = [...MARQUEE_BASE, ...MARQUEE_BASE, ...MARQUEE_BASE];

const PILLARS = [
  {
    to: "/honungen",
    title: "Honungen",
    text: "Oförädlad och långsamt hanterad – slungad, silad och tappad i vårt slungrum, utan upphettning, så att smak och nyttiga ämnen bevaras.",
  },
  {
    to: "/honungen",
    title: "Pollinering",
    text: "Bina gör mer än honung. De pollinerar åsens ängar, odlingar och fruktträd – grunden för hela landskapets skörd.",
  },
  {
    to: "/om-oss",
    title: "Bisamhällen",
    text: "Vi håller starka, friska samhällen och läser av dem med varsam hand, säsong för säsong, år efter år.",
  },
];

export default function Home() {
  usePageMeta({
    title: "Småskalig svensk honung från Söderåsen",
    description:
      "Jopas Honung – handverksmässigt hanterad, lokalproducerad honung från Söderåsen. Från blomma till burk, med omsorg i varje steg.",
    path: "/",
  });
  const { markets } = useMarkets();

  return (
    <div className="home">
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <img
            className="hero__bg-img"
            src="/images/photos/photo-24-hero.webp"
            alt=""
            width={1000}
            height={750}
            decoding="sync"
            fetchPriority="high"
            loading="eager"
          />
          <div className="hero__bg-wash" />
        </div>
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">Söderåsen · Skåne</span>
            <h1 className="hero__title">
              Honung med <em>sinne</em> för det småskaliga
            </h1>
            <p className="hero__lead lead">
              Våra flitiga bin flyger på Söderåsens sluttningar och slätten
              nedanför. Vi är småskaliga producenter som hanterar vår
              honung på ett hantverksmässigt sätt – från blomma till burk.
            </p>
            <div className="hero__actions">
              <Button to="/produkter" size="lg">
                Se honungen
              </Button>
              <Button to="/om-oss" variant="secondary" size="lg">
                Vår historia
              </Button>
            </div>
            <ul className="hero__trust">
              <li>
                <strong>100%</strong> svensk honung
              </li>
              <li>
                <strong>Lokalt</strong> på åsen
              </li>
            </ul>
          </div>

          <div className="hero__media">
            <div className="hero__markets">
              <div className="hero__markets-head">
                <span className="eyebrow">Kommande marknader</span>
                <Link to="/aterforsaljare#marknader" className="hero__markets-all">
                  Alla datum <span aria-hidden="true">→</span>
                </Link>
              </div>
              <ul className="hero__markets-list">
                {markets.slice(0, 3).map((m) => (
                  <li key={m.id} className="hero__market">
                    <span className="hero__market-date">
                      <span className="hero__market-d">{m.date}</span>
                    </span>
                    <span className="hero__market-info">
                      <span className="hero__market-title">{m.title}</span>
                      <span className="hero__market-place">
                        {m.day} · {m.place}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="hero__marquee" aria-hidden="true">
          <div className="hero__marquee-track">
            {[0, 1].map((group) => (
              <div className="hero__marquee-group" key={group}>
                {MARQUEE_ITEMS.map((item, i) => (
                  <span className="hero__marquee-item" key={`${group}-${i}`}>
                    {item}
                    <span className="hero__marquee-sep" aria-hidden="true" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- KORT OM FÖRETAGET ---------- */}
      <section className="section about-strip">
        <div className="container about-strip__grid">
          <Reveal variant="left">
            <Media
              src="/images/photos/photo-29.webp"
              alt="Jonatan och Patricia vid marknadsståndet framför gården"
              label="Jonatan & Patricia"
              ratio="4/3"
              rounded="lg"
            />
          </Reveal>
          <div className="about-strip__copy">
            <SectionHeading
              eyebrow="Om oss"
              title="En bisyssla som blev en passion"
              description="En sommar fick vi ett bisamhälle av en granne som snart blev både två och tre kupor i trädgården. Idag sköter vi sju bigårdar och våra bin flyger på Söderåsens sluttningar och slätten nedanför."
            />
            <Reveal variant="up" delay={160}>
              <div className="stats">
                <div className="stats__item">
                  <span className="stats__num">Söderåsen</span>
                  <span className="stats__label">Där bina flyger</span>
                </div>
                <div className="stats__item">
                  <span className="stats__num">2 skördar</span>
                  <span className="stats__label">Följer säsongen</span>
                </div>
                <div className="stats__item">
                  <span className="stats__num">Hantverk</span>
                  <span className="stats__label">I varje steg</span>
                </div>
              </div>
            </Reveal>
            <Reveal variant="up" delay={220}>
              <Button to="/om-oss" variant="ghost">
                Läs hela historien
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- PELARE / INTRO ---------- */}
      <section className="section pillars">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Vad vi gör"
            title="Bina, honungen och landskapet"
            description="Tre delar av samma kretslopp. Klicka dig vidare för att förstå hur allt hänger ihop."
          />
          <div className="pillars__grid">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} variant="up" delay={i * 90}>
                <Link to={p.to} className="pillar">
                  <span className="pillar__index">0{i + 1}</span>
                  <h3 className="pillar__title">{p.title}</h3>
                  <p className="pillar__text">{p.text}</p>
                  <span className="pillar__link">
                    Läs mer <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRODUKTER ---------- */}
      <section className="section products-preview">
        <div className="container">
          <div className="products-preview__head">
            <SectionHeading
              align="center"
              eyebrow="Sortimentet"
              title="Honung för varje säsong"
              description="Smaken förändras med blomningen. Här är honungen vi slungar under året."
            />
            <Reveal variant="fade">
              <Button to="/produkter" variant="ghost" className="products-preview__all">
                Alla produkter
              </Button>
            </Reveal>
          </div>
          <div className="products-preview__grid">
            {PRODUCTS.map((product, i) => (
              <Reveal key={product.id} variant="up" delay={i * 90}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- KONTAKT-CTA ---------- */}
      <section className="section">
        <div className="container">
          <Reveal variant="scale">
            <div className="cta-band">
              <div className="cta-band__glow" aria-hidden="true" />
              <div className="cta-band__content">
                <span className="eyebrow">Hör av dig</span>
                <h2 className="cta-band__title">
                  Vill du köpa honung, boka pollinering eller bara prata bin?
                </h2>
                <p className="cta-band__text">
                  Vi svarar gärna på frågor om honung, bisamhällen och
                  pollinering. Ring, mejla eller kom förbi på en marknad.
                </p>
                <div className="cta-band__actions">
                  <Button to="/kontakt" size="lg">
                    Kontakta oss
                  </Button>
                  <a href={CONTACT.phoneHref} className="cta-band__phone">
                    {CONTACT.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
