import Button from "../../components/Button/Button";
import Media from "../../components/Media/Media";
import Reveal from "../../components/Reveal/Reveal";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./About.css";

const VALUES = [
  {
    title: "Småskaligt med flit",
    text: "Vi växer i binas takt, inte marknadens. Få kupor betyder att vi hinner se varje samhälle och sköta det med omsorg.",
  },
  {
    title: "Lokalt förankrat",
    text: "All honung kommer från våra egna kupor på Söderåsen. Ingen inblandning, ingen import – bara det landskapet ger.",
  },
  {
    title: "Hantverk före hastighet",
    text: "Vi slungar, silar och tappar för hand. Långsamt och varsamt, så att honungens smak och nyttiga ämnen bevaras.",
  },
  {
    title: "Respekt för bina",
    text: "Friska bin ger god honung. Vi tar bara det de kan avvara och låter samhällena gå starka in i vintern.",
  },
];

export default function About() {
  usePageMeta({
    title: "Om oss",
    description:
      "Historien bakom Jopas Honung – en småskalig familjebiodling på Söderåsen med hantverket och binas välmående i centrum.",
    path: "/om-oss",
  });

  return (
    <div className="about">
      <PageHeader
        eyebrow="Om oss"
        title="Från en nyfikenhet till en bisyssla vi lever för"
        intro="Jopas Honung föddes ur nyfikenhet på binas värld och en vilja att göra något genuint med händerna. I dag är det en liten biodling på Söderåsen där varje burk bär spår av landskapet den kommer ifrån."
      />

      {/* Story */}
      <section className="section">
        <div className="container about__story">
          <Reveal variant="left">
            <Media
              src="/images/photos/photo-24.webp"
              alt="Biodlaren inspekterar en ram med bin vid kuporna i trädgården"
              label="Vid kuporna"
              ratio="4/5"
              rounded="lg"
            />
          </Reveal>
          <div className="about__story-copy">
            <SectionHeading
              eyebrow="Så började det"
              title="Det började med ett surr på tomten"
            />
            <Reveal variant="up" delay={120}>
              <p>
                En sommar flyttade det in ett bisamhälle i en gammal
                fruktlåda. I stället för att flytta på dem blev det en kupa,
                och sedan två. Ju mer vi lärde oss om binas märkvärdiga liv,
                desto svårare blev det att sluta.
              </p>
            </Reveal>
            <Reveal variant="up" delay={180}>
              <p>
                Det som var tänkt som en liten bisyssla vid sidan av vardagen
                blev en passion. I dag flyger våra bin på Söderåsens
                sluttningar bort mot Hallandsåsen – ett landskap av ängar,
                fruktträd och ljunghedar som ger honungen sin karaktär.
              </p>
            </Reveal>
            <Reveal variant="up" delay={240}>
              <p>
                Vi är fortfarande små, och det är ett medvetet val. Genom att
                hålla ett hanterbart antal kupor kan vi vara nära varje
                samhälle och sköta honungen på ett hantverksmässigt sätt,
                hela vägen från blomma till burk.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Filosofi / värden */}
      <section className="section about__values-section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Vår filosofi"
            title="Det vi håller fast vid"
            description="Fyra enkla principer som styr allt vi gör – från hur vi sköter bina till hur honungen hamnar i burken."
          />
          <div className="about__values">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} variant="up" delay={i * 80}>
                <article className="value-card">
                  <span className="value-card__mark" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <h3 className="value-card__title">{v.title}</h3>
                  <p className="value-card__text">{v.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Citat */}
      <section className="section">
        <div className="container container--narrow">
          <Reveal variant="scale">
            <blockquote className="about__quote">
              <span className="about__quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              <p>
                Vi säljer inte bara honung. Vi delar med oss av en sommar på
                Söderåsen – fångad i en burk, precis så som bina gjorde den.
              </p>
              <cite>— Jopas bisyssla</cite>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Bildpar */}
      <section className="section">
        <div className="container about__gallery">
          <Reveal variant="up">
            <Media
              src="/images/photos/photo-30.webp"
              alt="Ett bisamhälle klänger tätt samlat vid kupan"
              label="Ett samhälle samlas"
              ratio="1/1"
              rounded="lg"
            />
          </Reveal>
          <Reveal variant="up" delay={120}>
            <Media
              src="/images/photos/photo-31.webp"
              alt="Bigårdens kupor står uppradade på Söderåsens sluttningar"
              label="Bigården på åsen"
              ratio="1/1"
              rounded="lg"
            />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <Reveal variant="fade">
            <div className="about__cta">
              <div>
                <h2>Nyfiken på hur honungen blir till?</h2>
                <p className="lead">
                  Följ med hela vägen – från binas arbete i blomman till den
                  färdiga burken.
                </p>
              </div>
              <Button to="/honungen" size="lg">
                Upptäck processen
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
