# Jopas Honung

Webbplats för **Jopas Honung** – en småskalig svensk biodling på Söderåsens
sluttningar och slätten nedanför. Modern, luftig och naturlig design med fokus på
hantverk, förtroende och stora bilder.

## Teknik

- **React 18 + Vite + TypeScript**
- **React Router** för sidnavigering
- **Vanilla CSS per komponent** (inga UI-bibliotek) med centrala design-tokens
- Typsnitt: **Fraunces** (craftad serif för rubriker) + **Inter** (brödtext)

## Kom igång

```bash
npm install
npm run dev      # startar utvecklingsserver på http://localhost:5173
npm run build    # bygger för produktion
npm run preview  # förhandsvisar produktionsbygget
```

## Struktur

```
src/
  components/       En mapp per komponent (.tsx + .css)
    Navbar/ Footer/ Logo/ Button/ Media/ Reveal/
    SectionHeading/ ProductCard/ PageHeader/ ScrollToTop/
  pages/            En mapp per sida (.tsx + .css)
    Home/ About/ Honey/ Products/ Retailers/ Contact/ NotFound/
  hooks/            useScrollReveal, usePageMeta
  data/             site.ts – centralt innehåll (meny, produkter, kontakt)
  styles/           globals.css + theme.css (design-tokens)
public/
  images/           Kundens foton läggs här (se images/README.md)
  favicon.svg
```

## Design-tokens

All färg, typografi, spacing, radie och skuggor definieras i
`src/styles/theme.css` som CSS-variabler. Ändra en gång där – slår igenom
i hela sidan. Inga hårdkodade hex-värden i komponenterna.

Palett (härledd ur etiketten):

- Krämig honungsbeige (bas)
- Honungsguld (primär/accent)
- Djup teal-marin (rubriker/kontrast)
- Kraftbrun + ljus beige (jordfärger)

## Bilder

Sidan är byggd runt stora foton. Innan kundens bilder är på plats visas
craftade platshållare automatiskt. Se `public/images/README.md` för vilka
filnamn som förväntas.

## Att göra innan lansering

- [ ] Lägg in kundens riktiga foton i `public/images/`
- [ ] Byt ut det inbyggda logo-emblemet mot kundens slutgiltiga logotyp
- [ ] Koppla kontaktformuläret till e-post-backend (t.ex. Formspree/EmailJS)
- [ ] Fyll i riktiga kontaktuppgifter och sociala medier i `src/data/site.ts`
- [ ] Lägg in Google Maps-embed på Återförsäljare när gårdsadress finns
- [ ] Uppdatera domän/URL i `index.html` (canonical, Open Graph, schema.org)
```
