import { useState } from "react";
import "./Logo.css";

interface LogoProps {
  /** Storlek på emblemet. */
  size?: "sm" | "md" | "lg";
  /** Ton för fallback-ordmärket – "light" på mörk bakgrund. */
  tone?: "dark" | "light";
  className?: string;
}

/**
 * Varumärkes-logga för Jopas Honung.
 * Använder kundens runda emblem (/public/images/logo.webp). Saknas filen
 * (t.ex. innan den lagts in) visas ett craftat emblem + ordmärke i stället,
 * så att loggan aldrig blir en trasig bild. Byts automatiskt till fotot
 * så fort logo.webp finns på plats.
 */
export default function Logo({
  size = "md",
  tone = "dark",
  className = "",
}: LogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`logo logo--${size} logo--${tone} ${className}`.trim()}>
        <span className="logo__emblem" aria-hidden="true">
          <svg viewBox="0 0 80 80" role="presentation">
            <circle className="logo__ring" cx="40" cy="40" r="37" />
            <circle className="logo__dot" cx="16" cy="40" r="2.4" />
            <circle className="logo__dot" cx="64" cy="40" r="2.4" />
            <g className="logo__wings">
              <ellipse cx="31" cy="30" rx="10.5" ry="6.6" transform="rotate(-30 31 30)" />
              <ellipse cx="49" cy="30" rx="10.5" ry="6.6" transform="rotate(30 49 30)" />
            </g>
            <ellipse className="logo__body" cx="40" cy="46" rx="13" ry="16.5" />
            <path className="logo__stripes" d="M27.5 41 h25 M28 50 h24 M31 58 h18" />
            <path className="logo__antenna" d="M35 30 q-3 -8 -8 -9 M45 30 q3 -8 8 -9" />
            <circle className="logo__eye" cx="35.5" cy="41.5" r="1.7" />
            <circle className="logo__eye" cx="44.5" cy="41.5" r="1.7" />
            <path className="logo__smile" d="M35 46 q5 4 10 0" />
          </svg>
        </span>
        <span className="logo__wordmark">
          <span className="logo__name">Jopas</span>
          <span className="logo__sub">Honung</span>
        </span>
      </span>
    );
  }

  return (
    <span className={`logo logo--${size} ${className}`.trim()}>
      <img
        className="logo__img"
        src="/images/logo.webp"
        alt="Jopas Honung"
        width={528}
        height={528}
        decoding="async"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
