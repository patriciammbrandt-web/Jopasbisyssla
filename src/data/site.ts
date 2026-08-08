/* Centralt innehåll & konfiguration för Jopas Honung.
   Här bor navigering, kontaktuppgifter och listor så att texter kan
   uppdateras på ett ställe. */

export interface NavItem {
  label: string;
  to: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Hem", to: "/" },
  { label: "Om oss", to: "/om-oss" },
  { label: "Honungen", to: "/honungen" },
  { label: "Produkter", to: "/produkter" },
  { label: "Återförsäljare", to: "/aterforsaljare" },
  { label: "Kontakt", to: "/kontakt" },
];

export const CONTACT = {
  company: "Jopas bisyssla",
  orgNr: "556640-5725",
  brand: "Jopas Honung",
  phone: "0709 – 69 45 27",
  phoneHref: "tel:+46709694527",
  email: "info@jopasbisyssla.se",
  emailHref: "mailto:info@jopasbisyssla.se",
  region: "Söderåsen, Skåne",
  instagram: "https://www.instagram.com/jopasbisyssla/",
  facebook: "https://facebook.com/",
};

export interface Product {
  id: string;
  name: string;
  season: string;
  tagline: string;
  description: string;
  notes: string[];
  image?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "forsommar",
    name: "Försommarhonung",
    season: "Maj – Juni",
    tagline: "Ljus, mild och blommig",
    description:
      "Årets första skörd med inslag av raps och tidiga vårblommor. Krämig konsistens och en rund, mild sötma som passar lika bra på mackan som i teet.",
    notes: ["Ljus färg", "Krämig", "Mild raps"],
    image: "/images/photos/forsommarhonung-eq.webp",
  },
  {
    id: "sensommar",
    name: "Sensommarhonung",
    season: "Augusti",
    tagline: "Fyllig och krämig",
    description:
      "Slungad i augusti. Honungen varierar i färg och smak från år till år beroende på vilka blommor bina haft tillgång till. Klöver, lind och vilda örter ger en djupare, gyllene honung med tydlig karaktär, medan honungsfacelia och åkerböna ger en ljusare och mildare honung.",
    notes: ["Fyllig", "Krämig", "Varierar"],
    image: "/images/photos/sensommarhonung-eq.webp",
  },
];

export interface Service {
  id: string;
  title: string;
  description: string;
  status?: "available" | "coming";
}

export const SERVICES: Service[] = [
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
    status: "coming",
  },
];

export interface Retailer {
  id: string;
  name: string;
  type: string;
  location: string;
  note?: string;
  url?: string;
  logo?: string;
  /** Återförsäljare eller samarbete (egna etiketter / bigård). */
  kind: "retailer" | "partner";
}

export const RETAILERS: Retailer[] = [
  {
    id: "skanehill",
    name: "Skånehill gårdsbutik",
    type: "Samarbete",
    location: "Kvidinge",
    url: "https://skanehill.se/",
    logo: "/images/retailers/skanehill.png",
    kind: "partner",
  },
  {
    id: "sannagarden",
    name: "Sånnagården",
    type: "Samarbete",
    location: "Kvidinge",
    url: "https://www.sannagarden.se/",
    logo: "/images/retailers/sannagarden.svg",
    kind: "partner",
  },
  {
    id: "sigvard",
    name: "Sigvard Månsgård",
    type: "Gårdsbutik",
    location: "Åstorp",
    url: "https://sigvardmansgard.se/",
    logo: "/images/retailers/sigvard.png",
    kind: "retailer",
  },
  {
    id: "bruket",
    name: "Bruket bageri & café",
    type: "Bageri & café",
    location: "Helsingborg",
    url: "https://bruketkaffebar.se/",
    logo: "/images/retailers/bruket.png",
    kind: "retailer",
  },
  {
    id: "gyegarden",
    name: "Gyegårdens äppelodling",
    type: "Samarbete",
    location: "Söderåsen",
    url: "https://gyegarden.se/",
    logo: "/images/retailers/gyegarden.png",
    kind: "partner",
  },
  {
    id: "kullabygden",
    name: "Kullabygdens shop",
    type: "Butik",
    location: "Åstorp",
    url: "https://www.kullabygden.se/",
    logo: "/images/retailers/kullabygden.svg",
    kind: "retailer",
  },
  {
    id: "soderports",
    name: "Söderports te och kaffe",
    type: "Specialbutik",
    location: "Helsingborg",
    url: "https://www.soderportskaffeochte.se/",
    logo: "/images/retailers/soderports.svg",
    kind: "retailer",
  },
  {
    id: "blomsterstudion",
    name: "Blomsterstudion Lina Melin",
    type: "Blomsterbutik",
    location: "Åstorp",
    url: "https://www.blomsterstudion.se/",
    logo: "/images/retailers/blomsterstudion.svg",
    kind: "retailer",
  },
];

export const RETAILER_SHOPS = RETAILERS.filter((r) => r.kind === "retailer");
export const RETAILER_PARTNERS = RETAILERS.filter((r) => r.kind === "partner");

export interface HoneyKiosk {
  id: string;
  name: string;
  location: string;
  note?: string;
  mapsUrl?: string;
}

/** Honungskiosker med självbetjäning */
export const HONEY_KIOSKS: HoneyKiosk[] = [
  {
    id: "lindvagen",
    name: "Lindvägen 15",
    location: "Åstorp",
    note: "Självbetjäning",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Lindv%C3%A4gen+15+Åstorp",
  },
  {
    id: "asa",
    name: "Åsa Jutegårdsväg 3",
    location: "Åsa",
    note: "Självbetjäning",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%C3%85sa+Juteg%C3%A5rdsv%C3%A4g+3",
  },
  {
    id: "padel",
    name: "Padel & gym",
    location: "Åstorp",
    note: "Självbetjäning",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Padel+gym+Åstorp",
  },
];



