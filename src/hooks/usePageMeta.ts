import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
  /** Sökväg för canonical/OG, t.ex. "/om-oss". Default "/". */
  path?: string;
  /** Sätt noindex (t.ex. 404). */
  noIndex?: boolean;
}

const BASE_TITLE = "Jopas Honung";
const SITE_URL = "https://www.jopashonung.se";

function upsertMeta(
  selector: string,
  attrs: Record<string, string>,
  content: string
) {
  let tag = document.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => tag!.setAttribute(k, v));
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function upsertLink(rel: string, href: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Sätter title, description, canonical och OG-tags per sida. */
export function usePageMeta({
  title,
  description,
  path = "/",
  noIndex = false,
}: PageMeta) {
  useEffect(() => {
    const fullTitle =
      path === "/"
        ? `${BASE_TITLE} – ${title}`
        : `${title} · ${BASE_TITLE}`;
    document.title = fullTitle;

    const url = `${SITE_URL}${path === "/" ? "/" : path}`;

    if (description) {
      upsertMeta('meta[name="description"]', { name: "description" }, description);
      upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
      upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    }

    upsertMeta('meta[property="og:title"]', { property: "og:title" }, fullTitle);
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, fullTitle);

    if (!noIndex) {
      upsertMeta('meta[property="og:url"]', { property: "og:url" }, url);
      upsertLink("canonical", url);
      upsertMeta('meta[name="robots"]', { name: "robots" }, "index, follow");
    } else {
      upsertMeta('meta[name="robots"]', { name: "robots" }, "noindex, follow");
    }
  }, [title, description, path, noIndex]);
}
