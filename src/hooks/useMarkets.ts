import { useEffect, useState } from "react";
import {
  FALLBACK_MARKETS,
  type MarketEvent,
  type MarketsFile,
} from "../data/markets";

/**
 * Hämtar kommande marknader från /data/markets.json
 * (uppdateras via /admin/marknader utan kodändring).
 */
export function useMarkets() {
  const [markets, setMarkets] = useState<MarketEvent[]>(FALLBACK_MARKETS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/data/markets.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as MarketsFile | MarketEvent[];
        const list = Array.isArray(data) ? data : data.markets;
        if (!cancelled && Array.isArray(list) && list.length > 0) {
          setMarkets(list);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Kunde inte ladda marknader",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { markets, loading, error };
}
