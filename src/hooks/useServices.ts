import { useEffect, useState } from "react";
import {
  FALLBACK_SERVICES,
  type ServiceOffer,
  type ServicesFile,
} from "../data/services";

/** Hämtar produkter/tjänster från /data/services.json (CMS via /admin). */
export function useServices() {
  const [services, setServices] = useState<ServiceOffer[]>(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/data/services.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as ServicesFile | ServiceOffer[];
        const list = Array.isArray(data) ? data : data.services;
        if (!cancelled && Array.isArray(list) && list.length > 0) {
          setServices(list);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Kunde inte ladda produkter",
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

  return { services, loading, error };
}
