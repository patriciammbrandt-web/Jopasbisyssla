export interface MarketEvent {
  id: string;
  /** Kort datumetikett, t.ex. "14 SEP" */
  date: string;
  /** Veckodag, t.ex. "Lördag" */
  day: string;
  title: string;
  /** Plats och tid, t.ex. "Torget, 10–15" */
  place: string;
}

export interface MarketsFile {
  markets: MarketEvent[];
}

/** Fallback om JSON inte går att ladda. */
export const FALLBACK_MARKETS: MarketEvent[] = [
  {
    id: "m1",
    date: "14 SEP",
    day: "Lördag",
    title: "Skördemarknad på Söderåsen",
    place: "Torget, 10–15",
  },
  {
    id: "m2",
    date: "28 SEP",
    day: "Lördag",
    title: "Höstmarknad i Klippan",
    place: "Centrum, 11–16",
  },
  {
    id: "m3",
    date: "12 OKT",
    day: "Söndag",
    title: "Bondens marknad",
    place: "Helsingborg, 10–14",
  },
];
