import Button from "../../components/Button/Button";
import Media from "../../components/Media/Media";
import Reveal from "../../components/Reveal/Reveal";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import { usePageMeta } from "../../hooks/usePageMeta";
import { PRODUCTS } from "../../data/site";
import "./Honey.css";

interface Step {
  n: string;
  title: string;
  text: string;
  label: string;
  img?: string;
}

const STEPS: Step[] = [
  {
    n: "01",
    title: "Binas arbete",
    text: "Allt börjar i blomman. Ett enda bi besöker tusentals blommor per dag och samlar nektar som förvandlas till honung i kupan. Våra bin besöker bland annat rapsfält, fruktodlingar och lindalléer, utifrån vad som finns vid just den bigården.",
    label: "Bina på vaxkakan",
    img: "/images/photos/photo-32.webp",
  },
  {
    n: "02",
    title: "Slungning",
    text: "När ramarna är fyllda och honungen lagom mogen lyfter vi dem ur kupan och river bort vaxlocken. Ramarna placeras i slungan, där honungen försiktigt centrifugeras ut – utan värme som förstör smaken.",
    label: "Slungning",
    img: "/images/photos/slungning.webp",
  },
  {
    n: "03",
    title: "Silning",
    text: "Den nyslungade honungen silas långsamt genom fina silar för att skilja bort vaxrester och andra partiklar. Vi silar milt och tar oss tid – aldrig genom finfilter som tar bort pollen och karaktär.",
    label: "Silning",
    img: "/images/photos/photo-23.webp",
  },
  {
    n: "04",
    title: "Tappning",
    text: "Efter en tids vila tappas honungen på burk för hand. Varje burk fylls, torkas av och förses med etikett i vårt eget lilla tapperi. Inget tillsätts och inget tas bort – det är ren honung, precis som bina gjorde den.",
    label: "Tappning på burk",
    img: "/images/photos/photo-20.webp",
  },
  {
    n: "05",
    title: "Kvalitetskontroll",
    text: "Innan honungen får lämna oss kontrollerar vi vattenhalt, konsistens och smak. Bara honung vi själva skulle ställa på frukostbordet får bära vår etikett.",
    label: "Kvalitetskontroll",
    img: "/images/photos/photo-06.webp",
  },
];

export default function Honey() {
  usePageMeta({
    title: "Honungen",
    description:
      "Från blomma till burk – följ hela processen bakom Jopas Honung: binas arbete, slungning, silning, tappning och kvalitetskontroll.",
    path: "/honungen",
  });

  return (
    <div className="honey">
      <PageHeader
        eyebrow="Honungen"
        title="Från blomma till burk"
        intro="God honung går inte att skynda fram. Här följer du hela vägen – från binas tålmodiga arbete i blomman till den färdiga burken, hanterad för hand i varje steg."
      />

      {/* Intro-band */}
      <section className="section honey__intro">
        <div className="container honey__intro-grid">
          <Reveal variant="left">
            <p className="honey__intro-lead">
              Honung är naturens eget skafferi. Vår uppgift är enkel men
              viktig: att ta vara på det bina skapat utan att förädla bort
              själen ur det.
            </p>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <p className="honey__intro-text">
              Vi arbetar oförädlat och kallhanterat. Ingen pastörisering, ingen
              onödig filtrering – bara varsam hantering som bevarar smak, arom
              och de nyttiga ämnen som gör honung till något helt annat än
              vanligt socker. Resultatet blir en honung som smakar av just den
              plats och den säsong den kommer ifrån.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Process-steg */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Processen"
            title="Fem steg, hanterade för hand"
          />
          <div className="honey__steps">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className={`honey-step ${i % 2 === 1 ? "honey-step--rev" : ""}`}
              >
                <Reveal
                  variant={i % 2 === 1 ? "right" : "left"}
                  className="honey-step__media"
                >
                  <Media
                    src={step.img}
                    alt={step.title}
                    label={step.label}
                    ratio="4/3"
                    rounded="lg"
                  />
                </Reveal>
                <Reveal variant="up" delay={100} className="honey-step__copy">
                  <span className="honey-step__n">{step.n}</span>
                  <h3 className="honey-step__title">{step.title}</h3>
                  <p className="honey-step__text">{step.text}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honungssorter */}
      <section className="section honey__sorts-section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Sorter & säsong"
            title="En honung, många ansikten"
            description="Smaken skiftar med blomningen. Samma bin, samma marker – men två helt olika honungar beroende på när på året de skördas."
          />
          <div className="honey__sorts">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.id} variant="up" delay={i * 90}>
                <article className="sort-card">
                  <div className="sort-card__top">
                    <span className="sort-card__season">{p.season}</span>
                    <h3 className="sort-card__name">{p.name}</h3>
                    <p className="sort-card__tag">{p.tagline}</p>
                  </div>
                  <p className="sort-card__desc">{p.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Säsongsvariation-band */}
      <section className="section">
        <div className="container">
          <Reveal variant="scale">
            <div className="honey__season">
              <div className="honey__season-glow" aria-hidden="true" />
              <div className="honey__season-content">
                <span className="eyebrow">Säsongsvariation</span>
                <h2>Därför smakar två burkar aldrig exakt likadant</h2>
                <p>
                  Honung är ett levande naturprodukt. En regnig försommar,
                  en varm juli eller ett fält med åkerböna alldeles vid
                  kuporna – allt sätter sin prägel på färg, arom och
                  konsistens. Vi ser det inte som en brist utan som hela
                  poängen. Varje skörd är en ögonblicksbild av året som var.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <Reveal variant="fade">
            <div className="honey__cta">
              <h2>Smaka skillnaden själv</h2>
              <p className="lead">
                Se hela sortimentet eller hör av dig om du vill köpa direkt
                från oss.
              </p>
              <div className="honey__cta-actions">
                <Button to="/produkter" size="lg">
                  Till produkterna
                </Button>
                <Button to="/kontakt" variant="secondary" size="lg">
                  Kontakta oss
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
