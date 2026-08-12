import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { MarketEvent } from "../../data/markets";
import { FALLBACK_MARKETS } from "../../data/markets";
import "./MarketsAdmin.css";

const SESSION_KEY = "jopas-markets-admin";

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
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Admin · Kommande marknader · Jopas Honung";
    let cancelled = false;
    async function restoreSession() {
      const saved = sessionStorage.getItem(SESSION_KEY);
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
        } else {
          sessionStorage.removeItem(SESSION_KEY);
        }
      } catch {
        if (!cancelled) sessionStorage.removeItem(SESSION_KEY);
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
        const res = await fetch(`/data/markets.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Kunde inte ladda marknader");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.markets;
        if (!cancelled) {
          setMarkets(
            Array.isArray(list) && list.length > 0
              ? list
              : FALLBACK_MARKETS.map((m) => ({ ...m })),
          );
        }
      } catch {
        if (!cancelled) {
          setMarkets(FALLBACK_MARKETS.map((m) => ({ ...m })));
          setMessage("Kunde inte hämta sparade marknader – visar standardlista.");
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [authed]);

  const canSave = useMemo(
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
      setMessage("Skriv in lösenordet.");
      setStatus("error");
      return;
    }
    setLoggingIn(true);
    setMessage(null);
    setStatus("idle");
    try {
      const ok = await verifyPassword(password);
      if (!ok) {
        setStatus("error");
        setMessage("Fel lösenord.");
        return;
      }
      sessionStorage.setItem(SESSION_KEY, password);
      setAuthed(true);
      setStatus("idle");
      setMessage(null);
    } catch {
      setStatus("error");
      setMessage("Kunde inte verifiera lösenordet. Försök igen.");
    } finally {
      setLoggingIn(false);
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPassword("");
    setStatus("idle");
    setMessage(null);
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

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!canSave) {
      setStatus("error");
      setMessage("Fyll i alla fält innan du sparar.");
      return;
    }
    setStatus("saving");
    setMessage(null);
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
      setStatus("ok");
      setMessage(
        data.message ||
          "Sparat. Hemsidan uppdateras automatiskt inom någon minut.",
      );
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Kunde inte spara.");
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
          <h1 className="madmin__title">Uppdatera marknader</h1>
          <p className="madmin__lead">
            Logga in med lösenordet ni fått av webbutvecklaren.
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
          {message && (
            <p className="madmin__msg madmin__msg--error" role="alert">
              {message}
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
            <h1 className="madmin__title">Kommande marknader</h1>
            <p className="madmin__lead">
              Ändra datum, dag, titel och plats/tid. Det som sparas syns på
              startsidan och sidan Återförsäljare efter att Vercel byggt om
              sajten (oftast 1–2 minuter).
            </p>
          </div>
          <button type="button" className="madmin__btn" onClick={logout}>
            Logga ut
          </button>
        </header>

        <form onSubmit={handleSave} className="madmin__form">
          <ul className="madmin__list">
            {markets.map((m, index) => (
              <li key={m.id} className="madmin__row">
                <div className="madmin__row-top">
                  <span className="madmin__row-label">Marknad {index + 1}</span>
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
              disabled={status === "saving" || !canSave}
            >
              {status === "saving" ? "Sparar…" : "Spara ändringar"}
            </button>
          </div>

          {message && (
            <p
              className={`madmin__msg ${
                status === "error" ? "madmin__msg--error" : "madmin__msg--ok"
              }`}
              role="status"
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
