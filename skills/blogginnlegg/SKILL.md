---
name: blogginnlegg
description: Skriv, oppdater og kvalitetssikre blogginnlegg for Bravo-prosjektet. Bruk når Codex skal lage nye bloggposter, forbedre eksisterende blogginnhold, justere bloggstruktur, legge inn bilder, tabeller, eksempler, sitater eller innholdsfortegnelse, eller oppdatere felles bloggkomponenter og bloggstiler.
---

# Blogginnlegg

## Oversikt

Bruk denne skillen når arbeidet gjelder blogginnhold eller bloggoppsett i dette prosjektet. Følg eksisterende bloggstruktur, skriv på norsk bokmål, og prioriter gjenbrukbare komponenter og felles stiler fremfor lokale spesialløsninger.

## Arbeidsflyt

1. Les alltid [src/content/blog/README.md](src/content/blog/README.md) før du skriver eller oppdaterer et blogginnlegg.
2. Hvis oppgaven påvirker bloggvisning, bloggkomponenter eller Next.js-oppsett, les relevant dokumentasjon i `node_modules/next/dist/docs/` før du koder.
3. Finn ut om oppgaven gjelder:
   - nytt innlegg i `src/content/blog/`
   - eksisterende innlegg i `src/content/blog/`
   - bilder i `public/blogg/<slug>/`
   - felles bloggkomponenter i `src/components/`
   - felles bloggstil i `src/app/globals.css`
4. Gjør endringer på lavest riktige nivå:
   - innhold i innlegget hvis bare teksten skal endres
   - MDX-komponenter hvis flere innlegg skal bruke samme mønster
   - globale bloggstiler hvis uttrykket skal gjenbrukes på tvers av innlegg

## Filer og ansvar

- `src/content/blog/*.mdx`
  Selve blogginnholdet.

- `public/blogg/<slug>/`
  Bilder per innlegg.

- `src/lib/blog.ts`
  Laster blogginnhold, frontmatter og innholdsfortegnelse.

- `src/components/blog-mdx-components.tsx`
  Gjenbrukbare MDX-komponenter som `Table` og `Example`.

- `src/components/blog-table-of-contents.tsx`
  Innholdsfortegnelse for blogginnlegg.

- `src/components/blog-post-header.tsx`
  Hero-seksjonen for blogginnlegg.

- `src/app/globals.css`
  Felles bloggstil for sitater, eksempler, tabeller og innholdsfortegnelse.

## Regler for blogginnhold

- Skriv på norsk bokmål og bruk `ÆØÅ`.
- Skriv konkret, tydelig og uten fluff.
- Bruk `du` når brukeren ber om direkte rådgivende bloggtekst.
- Bruk `##` og `###` for struktur. Det gir automatisk innholdsfortegnelse.
- Hold frontmatter ryddig og komplett.
- Legg nye innlegg i `src/content/blog/`.
- Legg bilder i `public/blogg/<slug>/`.

## SEO-regler

- Skriv blogginnlegg rundt én tydelig hovedintensjon per side.
- Sørg for at tittel, ingress, mellomtitler og brødtekst svarer på samme spørsmål.
- Bruk `title`, `description`, `seoTitle`, `seoDescription` og `slug` aktivt, ikke som ettertanke.
- Hold `slug` kort, beskrivende og skrevet med små bokstaver og bindestreker.
- Unngå duplisering mellom blogginnlegg med nesten samme søkeintensjon.
- Bruk viktige nøkkelord naturlig, ikke mekanisk.
- Foretrekk tydelige overskrifter som matcher det brukeren faktisk søker etter.
- Bruk beskrivende `alt`-tekst på bilder som tilfører informasjon.
- Bruk interne lenker når de styrker leserreisen eller utdyper temaet.
- Velg beskrivende bildefilnavn uten mellomrom, parenteser eller tilfeldige kopinavn.
- Bruk tom `alt` på dekorative bilder som ikke tilfører informasjon.
- Sørg for at hero-bilder også er relevante for temaet, siden de brukes i metadata og deling.
- Unngå keyword stuffing i `alt`-tekst og filnavn.

## Regler for bloggkomponenter

- Ikke bruk inline-styling i MDX for varige mønstre.
- Hvis flere innlegg trenger samme visuelle løsning, lag eller oppdater en gjenbrukbar komponent i `src/components/blog-mdx-components.tsx`.
- Hvis flere innlegg trenger samme utseende, legg stilen i `src/app/globals.css`.
- Bruk vanlige Markdown-sitater bare for faktiske sitater eller kilder.
- Bruk `Example`-komponenten for formuleringer, manus og forslag leseren kan bruke selv.
- Bruk `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader` og `TableCell` for tabeller i innlegg.
- Bruk `ToolCallout` når innlegget bør peke videre til et relevant verktøy som Lønnsjekk.

## Bilder

Følg reglene i [src/content/blog/README.md](src/content/blog/README.md):

- hero-bilde: `cover.*`
- vanlige bilder: `inline-1.*`, `inline-2.*`
- figurer og grafer: `figure-1.*`, `figure-2.*`

Anbefalt størrelse:

- hero-bilde: `1600 x 1000 px`
- bilder i innlegg: rundt `1200 px` bredde

Bruk beskrivende `alt`-tekst når bildet settes inn i MDX.

## Kvalitetssjekk før du er ferdig

- Stemmer `slug`, `coverImage` og filplassering?
- Har innlegget tydelige `##`-overskrifter?
- Bruker innlegget riktige bloggkomponenter i stedet for lokale hacks?
- Ser sitater, eksempler og tabeller ut som ulike elementtyper?
- Er endringen gjort på riktig nivå: innhold, komponent eller global stil?

## Når du må endre bloggdesignet

Gjør endringen i den felles bloggstakken først:

1. Oppdater komponent i `src/components/` hvis det er et mønster.
2. Oppdater `src/app/globals.css` hvis det er ren presentasjon.
3. Oppdater innleggene til å bruke komponenten i stedet for rå HTML eller lokale spesialløsninger.

Unngå å løse et systemproblem ved å håndstyle ett enkelt innlegg.
