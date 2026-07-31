import Button from "../../components/Button/Button";
import Media from "../../components/Media/Media";
import Reveal from "../../components/Reveal/Reveal";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import { usePageMeta } from "../../hooks/usePageMeta";
import { RETAILERS, HONEY_KIOSKS, CONTACT } from "../../data/site";
import { useMarkets } from "../../hooks/useMarkets";
import "./Retailers.css";

export default function Retailers() {
  usePageMeta({
    title: "Återförsäljare",
    description:
      "Här hittar du Jopas Honung – gårdsbutiker, caféer, specialbutiker och självbetjäningskiosker i Skåne.",
  });
  const { markets } = useMarkets();

  return (
    <div className="retailers">
      <PageHeader
        eyebrow="Återförsäljare"
        title="Var du hittar vår honung"
        intro="Honungen säljs hos utvalda handlare runt om i Skåne – och i våra självbetjäningskiosker. Här är platserna där du kan få tag på den."
      />

      {/* Butiker */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Butiker & samarbeten"
            title="Där honungen står på hyllan"
          />
          <div className="retailers__grid">
            {RETAILERS.map((r, i) => (
              <Reveal key={r.id} variant="up" delay={i * 70}>
                <article className="retailer-card">
                  {r.logo && (
                    <div className="retailer-card__logo">
                      <img
                        src={r.logo}
                        alt={`${r.name} logotyp`}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <span className="retailer-card__type">{r.type}</span>
                  <h3 className="retailer-card__name">{r.name}</h3>
                  <p className="retailer-card__loc">
                    <span className="retailer-card__pin" aria-hidden="true">
                      ◈
                    </span>
                    {r.location}
                  </p>
                  {r.note && <p className="retailer-card__note">{r.note}</p>}
                  {r.url && (
                    <a
                      href={r.url}
                      className="retailer-card__link"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Besök webbplats
                      <span aria-hidden="true"> →</span>
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Honungskiosker */}
      <section className="section retailers__kiosks-section">
        <div className="container">
          <SectionHeading
            eyebrow="Självbetjäning"
            title="Våra honungskiosker"
            description="Fyll på när det passar dig – öppet dygnet runt vid våra honungskiosker med självbetjäning."
          />
          <div className="retailers__kiosks-layout">
            <Reveal variant="left" className="retailers__kiosks-media">
              <Media
                src="/images/photos/photo-27.png"
                alt="Röd honungskiosk med skylten Honung säljes och Swish-betalning"
                label="Honungskiosk"
                ratio="4/5"
                rounded="lg"
              />
            </Reveal>
            <div className="retailers__kiosks">
              {HONEY_KIOSKS.map((k, i) => (
                <Reveal key={k.id} variant="up" delay={i * 70}>
                  <article className="kiosk-card">
                    <span className="kiosk-card__badge">
                      {k.note ?? "Självbetjäning"}
                    </span>
                    <h3 className="kiosk-card__name">{k.name}</h3>
                    <p className="kiosk-card__loc">
                      <span className="kiosk-card__pin" aria-hidden="true">
                        ◈
                      </span>
                      {k.location}
                    </p>
                    {k.mapsUrl && (
                      <a
                        href={k.mapsUrl}
                        className="kiosk-card__link"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Visa på karta
                        <span aria-hidden="true"> →</span>
                      </a>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marknader */}
      <section className="section retailers__markets-section">
        <div className="container">
          <SectionHeading
            eyebrow="Möt oss"
            title="Kommande marknader"
            description="Kom förbi, provsmaka och fyll på skafferiet. Vi har alltid några burkar med oss."
          />
          <div className="retailers__markets">
            {markets.map((m, i) => (
              <Reveal key={m.id} variant="up" delay={i * 70}>
                <div className="rmarket">
                  <div className="rmarket__date">
                    <span className="rmarket__d">{m.date}</span>
                    <span className="rmarket__day">{m.day}</span>
                  </div>
                  <div>
                    <h3 className="rmarket__title">{m.title}</h3>
                    <p className="rmarket__place">{m.place}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Karta */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Hitta hit"
            title="Vårt hörn av Skåne"
            description="Vi håller till på Söderåsens sluttningar mot Hallandsåsen. Hör av dig för exakt adress vid gårdsbesök."
          />
          <Reveal variant="scale">
            <div className="retailers__map" role="img" aria-label="Karta över Söderåsen i Skåne">
              <div className="retailers__map-grid" aria-hidden="true" />
              <div className="retailers__map-pin">
                <span className="retailers__map-dot" />
                <span className="retailers__map-label">Söderåsen</span>
              </div>
              <p className="retailers__map-hint">
                Karta läggs in här (Google Maps) när gårdsadressen är klar.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bli återförsäljare */}
      <section className="section">
        <div className="container">
          <Reveal variant="fade">
            <div className="retailers__cta">
              <div>
                <h2>Vill du sälja vår honung?</h2>
                <p className="lead">
                  Vi samarbetar gärna med butiker, caféer och restauranger som
                  delar vår kärlek till lokalt och genuint. Hör av dig så
                  hittar vi ett upplägg som passar.
                </p>
              </div>
              <div className="retailers__cta-actions">
                <Button to="/kontakt" size="lg">
                  Bli återförsäljare
                </Button>
                <a href={CONTACT.emailHref} className="retailers__cta-mail">
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
