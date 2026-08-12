export type ServiceStatus = "available" | "unavailable" | "sold_out";

export interface ServiceOffer {
  id: string;
  title: string;
  description: string;
  status: ServiceStatus;
}

export interface ServicesFile {
  services: ServiceOffer[];
}

export const SERVICE_STATUS_OPTIONS: {
  value: ServiceStatus;
  label: string;
}[] = [
  { value: "available", label: "Tillgänglig" },
  { value: "unavailable", label: "Ej tillgänglig" },
  { value: "sold_out", label: "Slut" },
];

export function serviceStatusLabel(status: ServiceStatus): string {
  return (
    SERVICE_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status
  );
}

/** Fallback om /data/services.json saknas. */
export const FALLBACK_SERVICES: ServiceOffer[] = [
  {
    id: "honung",
    title: "Honung",
    description:
      "Lokalproducerad, oförädlad honung från våra egna kupor. Säljs i burk direkt från gården, på marknader och hos utvalda återförsäljare.",
    status: "available",
  },
  {
    id: "pollinering",
    title: "Pollinering",
    description:
      "Vi placerar ut bisamhällen hos odlare och lantbrukare under blomningen. Fler bin ger bättre skörd – och friskare landskap.",
    status: "available",
  },
  {
    id: "bisamhallen",
    title: "Försäljning av bisamhällen",
    description:
      "Vi säljer starka, friska bisamhällen till både nya och erfarna biodlare, med rådgivning på vägen för den som är ny i yrket.",
    status: "available",
  },
  {
    id: "vax",
    title: "Bivax",
    description:
      "Rent bivax från vår egen produktion – till ljus, salvor och vaxdukar. Lanseras inom kort i mindre partier.",
    status: "unavailable",
  },
];
