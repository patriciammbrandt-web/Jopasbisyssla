import Button from "../../components/Button/Button";
import Media from "../../components/Media/Media";
import Reveal from "../../components/Reveal/Reveal";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import { usePageMeta } from "../../hooks/usePageMeta";
import { PRODUCTS, SERVICES } from "../../data/site";
import "./Products.css";

export default function Products() {
  usePageMeta({
    title: "Produkter & Tjänster",
    description:
      "Honung, pollinering och bisamhällen från Jopas Honung. Utforska sortimentet och våra tjänster – lokalproducerat på Söderåsen.",
    path: "/produkter",
  });

  return (
    <div className="products">
      <PageHeader
        eyebrow="Produkter & Tjänster"
        title="Honung, bin och allt däremellan"
        intro="Vår honung säljs i burk direkt från gården, på marknader och hos utvalda återförsäljare. Utöver honungen erbjuder vi pollinering och friska bisamhällen – och snart även eget bivax."
      />

      {/* Honung */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Honung" title="Årets skördar" />
          <div className="products__list">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.id} variant="up" delay={i * 80}>
                <article
                  className={`prod-row ${i % 2 === 1 ? "prod-row--rev" : ""}`}
                >
                  <div className="prod-row__media">
                    <Media
                      src={p.image}
                      alt={`Burk med ${p.name}`}
                      label={p.name}
                      ratio="4/3"
                      rounded="lg"
                    />
                  </div>
                  <div className="prod-row__body">
                    <span className="prod-row__season">{p.season}</span>
                    <h3 className="prod-row__name">{p.name}</h3>
                    <p className="prod-row__tag">{p.tagline}</p>
                    <p className="prod-row__desc">{p.description}</p>
                    <ul className="prod-row__notes">
                      {p.notes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tjänster */}
      <section className="section products__services-section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Tjänster"
            title="Mer än honung"
            description="Bina gör nytta långt utanför burken. Här är tjänsterna vi erbjuder utöver honungsförsäljningen."
          />
          <div className="products__services">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} variant="up" delay={i * 80}>
                <article className="service-card">
                  <div className="service-card__head">
                    <h3 className="service-card__title">{s.title}</h3>
                    {s.status === "coming" ? (
                      <span className="service-card__badge service-card__badge--coming">
                        Kommande
                      </span>
                    ) : (
                      <span className="service-card__badge">Tillgänglig</span>
                    )}
                  </div>
                  <p className="service-card__text">{s.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Köp-CTA */}
      <section className="section">
        <div className="container">
          <Reveal variant="scale">
            <div className="products__buy">
              <div className="products__buy-content">
                <span className="eyebrow">Var du hittar oss</span>
                <h2>Så köper du vår honung</h2>
                <p>
                  Handla direkt från gården, möt oss på en marknad eller besök
                  någon av våra återförsäljare. Vill du beställa en större mängd
                  eller boka pollinering? Hör bara av dig.
                </p>
                <div className="products__buy-actions">
                  <Button to="/aterforsaljare" size="lg">
                    Hitta återförsäljare
                  </Button>
                  <Button to="/kontakt" variant="secondary" size="lg">
                    Beställ direkt
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
