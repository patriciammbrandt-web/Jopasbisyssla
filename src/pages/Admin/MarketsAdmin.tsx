import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { MarketEvent } from "../../data/markets";
import { FALLBACK_MARKETS } from "../../data/markets";
import {
  FALLBACK_SERVICES,
  SERVICE_STATUS_OPTIONS,
  type ServiceOffer,
  type ServiceStatus,
} from "../../data/services";
import "./MarketsAdmin.css";

const SESSION_KEY = "jopas-admin";
const LEGACY_SESSION_KEY = "jopas-markets-admin";

function newId() {
  return `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function emptyMarket(): MarketEvent {
  return { id: newId(), date: "", day: "", title: "", place: "" };
}

async function verifyPassword(pwd: string): Promise<boolean> {
  const res = await fetch("/api/markets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: pwd, action: "verify" }),
  });
  return res.ok;
}

export default function MarketsAdmin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [markets, setMarkets] = useState<MarketEvent[]>([]);
  const [services, setServices] = useState<ServiceOffer[]>([]);
  const [marketsStatus, setMarketsStatus] = useState<
    "idle" | "saving" | "ok" | "error"
  >("idle");
  const [servicesStatus, setServicesStatus] = useState<
    "idle" | "saving" | "ok" | "error"
  >("idle");
  const [marketsMessage, setMarketsMessage] = useState<string | null>(null);
  const [servicesMessage, setServicesMessage] = useState<string | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Admin · Jopas Honung";
    let cancelled = false;
    async function restoreSession() {
      const saved =
        sessionStorage.getItem(SESSION_KEY) ||
        sessionStorage.getItem(LEGACY_SESSION_KEY);
      if (!saved) {
        if (!cancelled) setCheckingSession(false);
        return;
      }
      try {
        const ok = await verifyPassword(saved);
        if (cancelled) return;
        if (ok) {
          setPassword(saved);
          setAuthed(true);
          sessionStorage.setItem(SESSION_KEY, saved);
          sessionStorage.removeItem(LEGACY_SESSION_KEY);
        } else {
          sessionStorage.removeItem(SESSION_KEY);
          sessionStorage.removeItem(LEGACY_SESSION_KEY);
        }
      } catch {
        if (!cancelled) {
          sessionStorage.removeItem(SESSION_KEY);
          sessionStorage.removeItem(LEGACY_SESSION_KEY);
        }
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }
    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    async function load() {
      try {
        const [marketsRes, servicesRes] = await Promise.all([
          fetch(`/data/markets.json?t=${Date.now()}`, { cache: "no-store" }),
          fetch(`/data/services.json?t=${Date.now()}`, { cache: "no-store" }),
        ]);

        if (marketsRes.ok) {
          const data = await marketsRes.json();
          const list = Array.isArray(data) ? data : data.markets;
          if (!cancelled) {
            setMarkets(
              Array.isArray(list) && list.length > 0
                ? list
                : FALLBACK_MARKETS.map((m) => ({ ...m })),
            );
          }
        } else if (!cancelled) {
          setMarkets(FALLBACK_MARKETS.map((m) => ({ ...m })));
          setMarketsMessage(
            "Kunde inte hämta sparade marknader – visar standardlista.",
          );
        }

        if (servicesRes.ok) {
          const data = await servicesRes.json();
          const list = Array.isArray(data) ? data : data.services;
          if (!cancelled) {
            setServices(
              Array.isArray(list) && list.length > 0
                ? list
                : FALLBACK_SERVICES.map((s) => ({ ...s })),
            );
          }
        } else if (!cancelled) {
          setServices(FALLBACK_SERVICES.map((s) => ({ ...s })));
          setServicesMessage(
            "Kunde inte hämta produkter – visar standardlista.",
          );
        }
      } catch {
        if (!cancelled) {
          setMarkets(FALLBACK_MARKETS.map((m) => ({ ...m })));
          setServices(FALLBACK_SERVICES.map((s) => ({ ...s })));
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [authed]);

  const canSaveMarkets = useMemo(
    () =>
      markets.length > 0 &&
      markets.every(
        (m) =>
          m.date.trim() && m.day.trim() && m.title.trim() && m.place.trim(),
      ),
    [markets],
  );

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setLoginMessage("Skriv in lösenordet.");
      return;
    }
    setLoggingIn(true);
    setLoginMessage(null);
    try {
      const ok = await verifyPassword(password);
      if (!ok) {
        setLoginMessage("Fel lösenord.");
        return;
      }
      sessionStorage.setItem(SESSION_KEY, password);
      sessionStorage.removeItem(LEGACY_SESSION_KEY);
      setAuthed(true);
      setLoginMessage(null);
    } catch {
      setLoginMessage("Kunde inte verifiera lösenordet. Försök igen.");
    } finally {
      setLoggingIn(false);
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
    setAuthed(false);
    setPassword("");
    setMarketsStatus("idle");
    setServicesStatus("idle");
    setMarketsMessage(null);
    setServicesMessage(null);
    setLoginMessage(null);
  }

  function updateMarket(
    id: string,
    field: keyof MarketEvent,
    value: string,
  ) {
    setMarkets((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  }

  function addMarket() {
    setMarkets((prev) => [...prev, emptyMarket()]);
  }

  function removeMarket(id: string) {
    setMarkets((prev) => prev.filter((m) => m.id !== id));
  }

  function moveMarket(id: string, dir: -1 | 1) {
    setMarkets((prev) => {
      const i = prev.findIndex((m) => m.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function updateServiceStatus(id: string, status: ServiceStatus) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  }

  async function handleSaveMarkets(e: FormEvent) {
    e.preventDefault();
    if (!canSaveMarkets) {
      setMarketsStatus("error");
      setMarketsMessage("Fyll i alla fält innan du sparar.");
      return;
    }
    setMarketsStatus("saving");
    setMarketsMessage(null);
    try {
      const res = await fetch("/api/markets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, markets }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Fel (${res.status})`);
      }
      if (Array.isArray(data.markets)) setMarkets(data.markets);
      setMarketsStatus("ok");
      setMarketsMessage(
        data.message ||
          "Sparat. Hemsidan uppdateras automatiskt inom någon minut.",
      );
    } catch (err) {
      setMarketsStatus("error");
      setMarketsMessage(
        err instanceof Error ? err.message : "Kunde inte spara.",
      );
    }
  }

  async function handleSaveServices(e: FormEvent) {
    e.preventDefault();
    setServicesStatus("saving");
    setServicesMessage(null);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, services }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Fel (${res.status})`);
      }
      if (Array.isArray(data.services)) setServices(data.services);
      setServicesStatus("ok");
      setServicesMessage(
        data.message ||
          "Sparat. Hemsidan uppdateras automatiskt inom någon minut.",
      );
    } catch (err) {
      setServicesStatus("error");
      setServicesMessage(
        err instanceof Error ? err.message : "Kunde inte spara.",
      );
    }
  }

  if (checkingSession) {
    return (
      <div className="madmin">
        <div className="madmin__card madmin__card--narrow">
          <p className="madmin__lead">Kontrollerar inloggning…</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="madmin">
        <div className="madmin__card madmin__card--narrow">
          <p className="madmin__eyebrow">Jopas Honung</p>
          <h1 className="madmin__title">Admin</h1>
          <p className="madmin__lead">
            Uppdatera produkter och kommande marknader. Logga in med lösenordet
            ni fått av webbutvecklaren.
          </p>
          <form onSubmit={handleLogin} className="madmin__login">
            <label className="madmin__label">
              Lösenord
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="madmin__input"
                disabled={loggingIn}
              />
            </label>
            <button
              type="submit"
              className="madmin__btn madmin__btn--primary"
              disabled={loggingIn}
            >
              {loggingIn ? "Loggar in…" : "Logga in"}
            </button>
          </form>
          {loginMessage && (
            <p className="madmin__msg madmin__msg--error" role="alert">
              {loginMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="madmin">
      <div className="madmin__card">
        <header className="madmin__head">
          <div>
            <p className="madmin__eyebrow">Admin</p>
            <h1 className="madmin__title">Jopas Honung</h1>
            <p className="madmin__lead">
              Ändra produktstatus och kommande marknader. Det som sparas syns på
              sajten efter att Vercel byggt om (oftast 1–2 minuter).
            </p>
          </div>
          <button type="button" className="madmin__btn" onClick={logout}>
            Logga ut
          </button>
        </header>

        <section className="madmin__section" aria-labelledby="admin-products">
          <h2 id="admin-products" className="madmin__section-title">
            Produkter &amp; tjänster
          </h2>
          <p className="madmin__section-lead">
            Ställ in om varje erbjudande är tillgängligt, ej tillgängligt eller
            slut. Syns på sidan Produkter.
          </p>
          <form onSubmit={handleSaveServices} className="madmin__form">
            <ul className="madmin__list">
              {services.map((s) => (
                <li key={s.id} className="madmin__row madmin__row--service">
                  <div className="madmin__service-main">
                    <h3 className="madmin__service-title">{s.title}</h3>
                    <p className="madmin__service-text">{s.description}</p>
                  </div>
                  <label className="madmin__label madmin__label--status">
                    Status
                    <select
                      className="madmin__input madmin__select"
                      value={s.status}
                      onChange={(e) =>
                        updateServiceStatus(
                          s.id,
                          e.target.value as ServiceStatus,
                        )
                      }
                    >
                      {SERVICE_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </li>
              ))}
            </ul>
            <div className="madmin__footer">
              <span />
              <button
                type="submit"
                className="madmin__btn madmin__btn--primary"
                disabled={servicesStatus === "saving" || services.length === 0}
              >
                {servicesStatus === "saving"
                  ? "Sparar…"
                  : "Spara produkter"}
              </button>
            </div>
            {servicesMessage && (
              <p
                className={`madmin__msg ${
                  servicesStatus === "error"
                    ? "madmin__msg--error"
                    : "madmin__msg--ok"
                }`}
                role="status"
              >
                {servicesMessage}
              </p>
            )}
          </form>
        </section>

        <section className="madmin__section" aria-labelledby="admin-markets">
          <h2 id="admin-markets" className="madmin__section-title">
            Kommande marknader
          </h2>
          <p className="madmin__section-lead">
            Ändra datum, dag, titel och plats/tid. Syns på startsidan och
            Återförsäljare.
          </p>
          <form onSubmit={handleSaveMarkets} className="madmin__form">
            <ul className="madmin__list">
              {markets.map((m, index) => (
                <li key={m.id} className="madmin__row">
                  <div className="madmin__row-top">
                    <span className="madmin__row-label">
                      Marknad {index + 1}
                    </span>
                    <div className="madmin__row-actions">
                      <button
                        type="button"
                        className="madmin__icon-btn"
                        onClick={() => moveMarket(m.id, -1)}
                        disabled={index === 0}
                        aria-label="Flytta upp"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="madmin__icon-btn"
                        onClick={() => moveMarket(m.id, 1)}
                        disabled={index === markets.length - 1}
                        aria-label="Flytta ner"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="madmin__icon-btn madmin__icon-btn--danger"
                        onClick={() => removeMarket(m.id)}
                        aria-label="Ta bort"
                      >
                        Ta bort
                      </button>
                    </div>
                  </div>
                  <div className="madmin__grid">
                    <label className="madmin__label">
                      Datum
                      <input
                        className="madmin__input"
                        value={m.date}
                        placeholder="14 SEP"
                        onChange={(e) =>
                          updateMarket(m.id, "date", e.target.value)
                        }
                      />
                    </label>
                    <label className="madmin__label">
                      Dag
                      <input
                        className="madmin__input"
                        value={m.day}
                        placeholder="Lördag"
                        onChange={(e) =>
                          updateMarket(m.id, "day", e.target.value)
                        }
                      />
                    </label>
                    <label className="madmin__label madmin__label--wide">
                      Titel
                      <input
                        className="madmin__input"
                        value={m.title}
                        placeholder="Skördemarknad på Söderåsen"
                        onChange={(e) =>
                          updateMarket(m.id, "title", e.target.value)
                        }
                      />
                    </label>
                    <label className="madmin__label madmin__label--wide">
                      Plats &amp; tid
                      <input
                        className="madmin__input"
                        value={m.place}
                        placeholder="Torget, 10–15"
                        onChange={(e) =>
                          updateMarket(m.id, "place", e.target.value)
                        }
                      />
                    </label>
                  </div>
                </li>
              ))}
            </ul>

            <div className="madmin__footer">
              <button
                type="button"
                className="madmin__btn"
                onClick={addMarket}
              >
                + Lägg till marknad
              </button>
              <button
                type="submit"
                className="madmin__btn madmin__btn--primary"
                disabled={marketsStatus === "saving" || !canSaveMarkets}
              >
                {marketsStatus === "saving"
                  ? "Sparar…"
                  : "Spara marknader"}
              </button>
            </div>

            {marketsMessage && (
              <p
                className={`madmin__msg ${
                  marketsStatus === "error"
                    ? "madmin__msg--error"
                    : "madmin__msg--ok"
                }`}
                role="status"
              >
                {marketsMessage}
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
