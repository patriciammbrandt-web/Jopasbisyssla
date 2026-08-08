import { useState } from "react";
import "./Media.css";

interface MediaProps {
  /** Bildens sökväg, t.ex. "/images/hero.jpg". Läggs av kunden i /public/images. */
  src?: string;
  /** Beskrivande alt-text (obligatorisk för tillgänglighet). */
  alt: string;
  /** Text som visas i platshållaren tills riktig bild finns. */
  label?: string;
  /** Bildförhållande, t.ex. "4/3", "16/9", "1/1", "3/4". */
  ratio?: string;
  /** cover beskär, contain visar hela bilden i ramen. Default: cover. */
  fit?: "cover" | "contain";
  /** Ladda ivrigt (used for LCP hero image). Default: lazy. */
  priority?: boolean;
  className?: string;
  rounded?: "md" | "lg" | "xl";
}

/**
 * Bildkomponent med craftad platshållare. Innan kunden lagt in sina
 * foton visas en honungston-panel med bikake-mönster + etikett, så att
 * layouten ser genomtänkt ut. När <img> laddas tonas den in ovanpå.
 */
export default function Media({
  src,
  alt,
  label,
  ratio = "4/3",
  fit = "cover",
  priority = false,
  className = "",
  rounded = "lg",
}: MediaProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;

  return (
    <figure
      className={`media media--r-${rounded} media--fit-${fit} ${className}`.trim()}
      style={{ aspectRatio: ratio }}
    >
      <div className="media__placeholder" aria-hidden={showImg && loaded}>
        <span className="media__bee">
          <svg viewBox="0 0 48 48">
            <ellipse cx="18" cy="16" rx="7" ry="4.5" transform="rotate(-28 18 16)" />
            <ellipse cx="30" cy="16" rx="7" ry="4.5" transform="rotate(28 30 16)" />
            <ellipse className="media__bee-body" cx="24" cy="27" rx="8" ry="10.5" />
            <path d="M17 24 h14 M17.5 30 h13 M20 36 h8" />
          </svg>
        </span>
        {label && <figcaption className="media__label">{label}</figcaption>}
      </div>

      {showImg && (
        <img
          className={`media__img ${loaded ? "is-loaded" : ""}`.trim()}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </figure>
  );
}
