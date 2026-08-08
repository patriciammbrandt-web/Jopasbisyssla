# Admin – kommande marknader

Kunder uppdaterar kommande marknader själva via `/admin/marknader`.
Ändringar sparas till `public/data/markets.json` i GitHub och Vercel
bygger om sajten automatiskt.

## Snabbstart för kund

1. Gå till `https://www.ER-DOMÄN.se/admin/marknader`
2. Logga in med adminlösenordet
3. Lägg till, redigera eller ta bort marknader
4. Klicka **Spara**
5. Vänta någon minut – startsidan uppdateras efter nästa deploy

## Miljövariabler (Vercel)

Sätts under **Project → Settings → Environment Variables**.
Gäller för Production (och Preview om ni vill testa admin där).

| Variabel | Beskrivning | Exempel |
|---|---|---|
| `ADMIN_PASSWORD` | Lösenord till `/admin/marknader` | *(hemligt – dela inte i chat/repo)* |
| `GITHUB_TOKEN` | GitHub-token med skrivrätt till repot | `github_pat_…` |
| `GITHUB_OWNER` | GitHub-användare eller organisation | `jopas-honung` |
| `GITHUB_REPO` | Repots namn | `JopasBisyssla` |
| `GITHUB_BRANCH` | Branch som Vercel deployar från | `main` |

Efter att variabler lagts till eller ändrats: gör en **Redeploy** i Vercel.

### Skapa GitHub-token

1. GitHub → **Settings → Developer settings → Personal access tokens**
2. Skapa en **fine-grained** token (rekommenderas) med:
   - Repository access: **bara detta repo**
   - Permissions → Repository permissions → **Contents: Read and write**
3. Klistra in tokenen som `GITHUB_TOKEN` i Vercel
4. Spara tokenen säkert – den visas bara en gång

Classic token fungerar också om den har scope `repo` (för privata repo) eller
rätt att pusha till publika repo.

## Överlämning (från byrå → kundens GitHub + Vercel)

När sajten ska ligga hos kunden i stället för byråns konto:

1. **Flytta koden** till kundens GitHub-konto/organisation (transfer eller ny remote).
2. **Skapa Vercel-projekt** under kundens Vercel-team och koppla till det nya repot.
3. **Sätt miljövariablerna** i kundens Vercel (tabellen ovan):
   - `ADMIN_PASSWORD` – samma som tidigare, eller byt till ett nytt
   - `GITHUB_OWNER` / `GITHUB_REPO` – kundens repo
   - `GITHUB_TOKEN` – **ny** token skapad i kundens GitHub
   - `GITHUB_BRANCH` – `main`
4. **Koppla domänen** till kundens Vercel-projekt.
5. **Stäng av** byråns gamla Vercel-projekt (ta bort eller pausa) så det inte
   deployar längre.
6. **Testa** `/admin/marknader`: logga in, spara en marknad, kontrollera att
   commit syns i GitHub och att startsidan uppdateras efter deploy.
7. Vid överlämning: byt gärna `ADMIN_PASSWORD` om lösenordet delats under bygget.

### Checklista

- [ ] Repo ligger under kundens GitHub
- [ ] Vercel-projekt under kundens konto, kopplat till rätt repo
- [ ] Alla fem miljövariabler satta
- [ ] Domän pekar på kundens Vercel
- [ ] Byråns gamla projekt avstängt
- [ ] Admin-login och sparning testad live
- [ ] Lösenord förvaras säkert hos kunden (inte i mejltrådar i klartext)

## Lokalt under utveckling

Under `npm run dev` sparas marknader direkt till `public/data/markets.json`.
Lösenord lokalt: miljövariabeln `ADMIN_PASSWORD`, annars standardvärdet `dev`.

```bash
# PowerShell-exempel
$env:ADMIN_PASSWORD="dev"
npm run dev
```

Öppna sedan `http://localhost:5173/admin/marknader`.

## Felsökning

| Problem | Trolig orsak |
|---|---|
| ”Fel lösenord” | `ADMIN_PASSWORD` saknas eller skiljer sig från det som anges i admin |
| ”Saknar miljövariabel” | Någon av `GITHUB_*` / `ADMIN_PASSWORD` saknas i Vercel |
| ”Kunde inte spara till GitHub” | Token saknar skrivrätt, fel `OWNER`/`REPO`, eller fel branch |
| Marknad sparas men syns inte på sajten | Vänta på Vercel-deploy, eller hårduppdatera (cache) |

## Säkerhet

- Lägg **aldrig** `ADMIN_PASSWORD` eller `GITHUB_TOKEN` i git, README eller chattloggar.
- Admin-sidan är medvetet enkel (lösenord i session). Den är avsedd för
  få betrodda personer – inte publikt kontosystem.
- Rotera token och lösenord om någon med access slutar eller om uppgifterna läckt.
