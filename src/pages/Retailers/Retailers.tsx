import Button from "../../components/Button/Button";
import Media from "../../components/Media/Media";
import Reveal from "../../components/Reveal/Reveal";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import { usePageMeta } from "../../hooks/usePageMeta";
import { RETAILER_SHOPS, RETAILER_PARTNERS, HONEY_KIOSKS, CONTACT } from "../../data/site";
import { useMarkets } from "../../hooks/useMarkets";
import "./Retailers.css";

export default function Retailers() {
  usePageMeta({
    title: "Återförsäljare",
    description:
      "Här hittar du Jopas Honung – återförsäljare, samarbeten och självbetjäningskiosker i Skåne.",
    path: "/aterforsaljare",
  });
  const { markets } = useMarkets();

  return (
    <div className="retailers">
      <PageHeader
        eyebrow="Återförsäljare"
        title="Var du hittar vår honung"
        intro="Honungen säljs hos utvalda återförsäljare runt om i Skåne, hos gårdar vi samarbetar med – och i våra självbetjäningskiosker."
      />

      {/* Återförsäljare */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Återförsäljare"
            title="Där honungen står på hyllan"
          />
          <div className="retailers__grid">
            {RETAILER_SHOPS.map((r, i) => (
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

      {/* Samarbeten */}
      <section className="section retailers__partners-section">
        <div className="container">
          <SectionHeading
            eyebrow="Samarbeten"
            title="Gårdar vi samarbetar med"
          />
          <div className="retailers__grid">
            {RETAILER_PARTNERS.map((r, i) => (
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
                src="/images/photos/photo-27.webp"
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
