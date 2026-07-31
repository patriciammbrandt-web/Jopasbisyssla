import Button from "../../components/Button/Button";
import Logo from "../../components/Logo/Logo";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./NotFound.css";

export default function NotFound() {
  usePageMeta({ title: "Sidan hittades inte", noIndex: true });

  return (
    <section className="notfound">
      <div className="container notfound__inner">
        <Logo size="lg" className="notfound__logo" />
        <span className="eyebrow">Fel 404</span>
        <h1 className="notfound__title">Bina kunde inte hitta hit</h1>
        <p className="lead">
          Sidan du letar efter finns inte längre – eller så flög den sin väg.
          Låt oss guida dig tillbaka till kupan.
        </p>
        <div className="notfound__actions">
          <Button to="/" size="lg">
            Till startsidan
          </Button>
          <Button to="/produkter" variant="secondary" size="lg">
            Se honungen
          </Button>
        </div>
      </div>
    </section>
  );
}
