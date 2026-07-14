# Blogginnhold

Legg nye innlegg som `.mdx`-filer i denne mappen.

Hvert innlegg skal ha frontmatter øverst:

```md
---
title: "Tittel"
description: "Kort beskrivelse"
slug: "min-slug"
publishedAt: "2026-04-03"
coverImage: "/blogg/min-slug/yrke-lonn.png"
coverImageAlt: "Kort beskrivelse av hva hero-bildet viser"
coverImageAiGenerated: false
author: "Kristian"
category: "lonn"
tags:
  - "Snekker"
seoTitle: "Valgfri SEO-tittel"
seoDescription: "Valgfri SEO-beskrivelse"
---
```

Deretter skriver du selve innholdet i MDX.

## SEO-retningslinjer

Bruk disse feltene bevisst i frontmatter:

- `title`
  Brukes som synlig tittel i innlegget. Hold den tydelig, konkret og skrevet for mennesker.

- `description`
  Brukes som kort oppsummering og bør forklare hva leseren faktisk får ut av innlegget.
  På bloggforsiden fungerer dette som salgsteksten for innlegget. Skriv den som en engasjerende hook som gjør leseren nysgjerrig på svaret, ikke bare som en nøktern oppsummering.

- `seoTitle`
  Brukes når du vil ha en litt mer søkevennlig variant enn den synlige tittelen. Hold den kort og tydelig.

- `seoDescription`
  Brukes når du vil ha en mer presis metabeskrivelse enn den vanlige `description`.

- `slug`
  Skal være kort, beskrivende og skrevet med små bokstaver og bindestreker.

- `coverImageAlt`
  Skal beskrive selve hero-bildet kort og konkret, for eksempel `To piloter som sitter i cockpit`. Brukes både som alt-tekst og som første setning i den lille grå bildeteksten under hero-bildet.

- `coverImageAiGenerated`
  Valgfritt boolsk felt som settes til `true` når hero-bildet er KI-generert. Da vises teksten `Illustrasjonen er AI-generert og brukes for visualisering av temaet.` etter bildebeskrivelsen. Hvis feltet mangler eller er `false`, vises ikke denne teksten.

- `category`
  Skal være én av de godkjente bloggkategoriene. Bruk `lonn` for lønns-, yrkes- og lønnsutviklingsartikler. Bruk `lonnsforhandling` for guider om lønnssamtale, lønnskrav og forhandling.

- `tags`
  Valgfritt felt for spesifikke hovedtemaer i innlegget. Bruk bare tags når temaet er sentralt i artikkelen, ikke fordi ordet nevnes i en sammenligning.

Anbefalt praksis:

- La `title` være tydelig og lesbar, ikke pakket med søkeord.
- La `seoTitle` være mer søkespisset hvis det gir mening, men ikke kunstig.
- Hold `description` og `seoDescription` konkrete. Forklar hva innlegget handler om og hvorfor det er nyttig.
- Gi `description` en tydelig hook for bloggforsiden: still gjerne opp en kontrast, et spørsmål eller et konkret funn som gjør at leseren får lyst til å åpne innlegget.
- Unngå at `title` og `seoTitle` er identiske hvis du kan lage en bedre SEO-variant.
- Unngå at flere innlegg dekker nøyaktig samme søkeintensjon med nesten like titler.
- Bruk én tydelig hovedintensjon per innlegg.
- Sørg for at viktige nøkkelord finnes naturlig i tittel, ingress, mellomtitler og brødtekst.
- Bruk tydelige `##`-overskrifter som matcher det brukeren faktisk vil vite.
- Bruk beskrivende `alt`-tekst på bilder når bildene har informasjonsverdi.
- Lenke gjerne til relevante interne sider og blogginnlegg når det faktisk hjelper leseren.

Praktiske tommelfingerregler:

- `title`: vanligvis rundt 40 til 70 tegn
- `seoTitle`: vanligvis rundt 50 til 60 tegn når mulig
- `description`: vanligvis rundt 120 til 160 tegn
- `seoDescription`: vanligvis rundt 120 til 160 tegn

Eksempel:

```md
title: "Hvor mye mer kan man be om i lønn?"
description: "En konkret guide til hvor mye du realistisk kan be om i lønn, og hvordan du regner deg frem til et smart krav."
slug: "hvor-mye-mer-kan-man-be-om-i-lonn"
category: "lonnsforhandling"
seoTitle: "Hvor mye mer kan man be om i lønn? Konkrete tall og realistiske nivåer"
seoDescription: "Se hva som er normalt lønnshopp ved årlig justering, økt ansvar og jobbskifte, og lær hvordan du beregner et realistisk lønnskrav."
```

## Fast bilderegel for automatiserte innlegg

Automatiserte yrke/lønn-innlegg skal ikke lage eller generere egne hero-bilder. Sett likevel `coverImage` til en full artikkelspesifikk sti under `/blogg/<slug>/`, slik at bildet kan legges inn manuelt senere.

```md
coverImage: "/blogg/hva-er-lonnen-til-en-lege/lege-lonn.png"
coverImageAlt: "To leger i hvite frakker med stetoskop og skrivebrett"
coverImageAiGenerated: false
```

Når `coverImage` settes til en sti under `/blogg/<slug>/`, skal den tilsvarende mappen `public/blogg/<slug>/` opprettes samtidig. Selve bildefilen skal fortsatt ikke opprettes eller genereres hvis brukeren skal legge inn bildet selv.

Bruk et beskrivende filnavn basert på yrket, for eksempel `lege-lonn.png`, `psykolog-lonn.png` eller `vernepleier-lonn.png`. Ikke opprett bildefilen eller generer bilde hvis brukeren skal legge inn bildet selv.

## Fast navngivningsregel for egne bilder

Legg alle blogg-bilder i:

`public/blogg/<slug>/`

Bruk denne faste navngivningen:

- `cover.jpg`, `cover.png` eller `cover.svg`
  Brukes som hero-bilde i toppen av innlegget og i bloggkort.

- `inline-1.jpg`, `inline-2.jpg`, `inline-3.jpg`
  Brukes til vanlige bilder inne i innlegget, i den rekkefølgen de kommer.

- `figure-1.png`, `figure-2.png`
  Brukes til grafer, skjermbilder eller illustrasjoner der `inline-*` blir for uklart.

- `quote-1.jpg`
  Brukes bare hvis et innlegg har et eget illustrasjonsbilde knyttet til et sitat eller eksempel.

Anbefalt praksis:

- Hold deg til små bokstaver.
- Bruk bindestrek, ikke mellomrom eller underscore.
- Ha én mappe per innlegg, basert på `slug`.
- Oppdater `coverImage` i frontmatter til å peke på `cover.*`.
- Hvis SEO er viktig for et hero-bilde, kan du bruke et beskrivende filnavn som fortsatt følger slug-format, for eksempel `cover-hvor-mye-mer-kan-man-be-om-i-lonn.jpg`.
- Unngå filnavn med mellomrom, parenteser eller kopisuffiks som `(1)`.

## SEO på bilder

Beste praksis for bilder i blogginnlegg:

- Bruk filnavn som beskriver motivet eller temaet, ikke bare et internt navn.
- Bruk små bokstaver og bindestreker i filnavn.
- Unngå mellomrom, parenteser, `IMG_1234`, `final-final` og kopinavn som `(1)`.
- Bruk relevant `alt`-tekst på bilder som tilfører informasjon.
- La `alt`-teksten beskrive hva bildet viser i konteksten av innlegget.
- Bloggbilder får automatisk en liten grå bildetekst under bildet. For MDX-bilder bygger første setning på `alt`-teksten, og for hero-bilder bygger den på `coverImageAlt`. For hero-bilder vises setningen `Illustrasjonen er AI-generert og brukes for visualisering av temaet.` bare når `coverImageAiGenerated` er satt til `true`.
- Ikke fyll `alt`-teksten med søkeord.
- Hvis bildet er dekorativt og ikke tilfører informasjon, bruk tom `alt`.
- Bruk hero-bilder som faktisk passer til temaet i innlegget, siden de også brukes i deling og metadata.
- Bruk gode filstørrelser og komprimerte bilder, slik at siden ikke blir treg.

Eksempler på gode filnavn:

- `cover-hvor-mye-mer-kan-man-be-om-i-lonn.jpg`
- `figure-lonnsutvikling-radgivere-2021-2025.png`
- `inline-lonnssamtale-med-leder.jpg`

Eksempler på gode `alt`-tekster:

- `alt="Eksempel på lønnsutvikling for rådgivere fra 2021 til 2025"`
- `alt="Illustrasjon av en lønnssamtale mellom ansatt og leder"`

Eksempler på svake `alt`-tekster:

- `alt="bilde"`
- `alt="hero image"`
- `alt="lønn lønnssamtale høyere lønn jobb marked"`

Eksempel:

- `public/blogg/hvor-mye-mer-kan-man-be-om-i-lonn/cover.jpg`
- `public/blogg/hvor-mye-mer-kan-man-be-om-i-lonn/inline-1.jpg`
- `public/blogg/hvor-mye-mer-kan-man-be-om-i-lonn/figure-1.png`

Eksempel i MDX:

```mdx
![Lønnsutvikling for lignende roller](/blogg/hvor-mye-mer-kan-man-be-om-i-lonn/figure-1.png)
```

## Gjenbrukbare bloggkomponenter

Bruk felles bloggkomponenter i MDX når mønsteret skal kunne gjenbrukes i flere innlegg.

- `Example`
  Brukes til formuleringer, manus, eksempler og konkrete setninger leseren kan bruke selv.

- `Table`
  Brukes til tabeller i innlegg i stedet for rå HTML eller inline-styling.

- `ToolCallout`
  Brukes når et innlegg naturlig bør peke videre til Lønnsjekk. Tekst og CTA er standardisert i komponenten, så bruk den uten egne `title`-, `description`-, `href`- eller `cta`-props.

- `FAQ` og `FAQItem`
  Brukes når briefen ber om en FAQ-seksjon eller når innlegget bør svare kort på konkrete tilleggsspørsmål. Bruk spørsmålene fra `daily-brief.md` når de er oppgitt. FAQ skal alltid stå helt nederst i innlegget, uten egen Markdown-overskrift over komponenten. Komponenten viser selv overskriften `Ofte stilte spørsmål`.

- `BlogChart`
  Brukes til redaksjonelle diagrammer i blogginnlegg. Komponenten støtter horisontale og vertikale stolpediagrammer, linje og area. Bruk den når tallene skal leses som en del av artikkelen, ikke som et dashboard.

- `SalaryJumpBarChart` og `SsbSalaryExampleChart`
  Ferdige eksempler som viser anbefalt uttrykk og datastruktur. Bruk dem som mal når nye figurer lages.

Eksempel:

```mdx
<ToolCallout />
```

Eksempel på FAQ:

```mdx
<FAQ>
  <FAQItem question="Hva er forskjellen på medianlønn og gjennomsnittslønn?">
    Medianlønn viser midtpunktet i lønnsfordelingen, mens gjennomsnittet kan trekkes opp eller ned av svært høye eller lave lønninger.
  </FAQItem>
  <FAQItem question="Bør jeg bruke månedslønn eller årslønn når jeg sammenligner?">
    Bruk samme måleenhet gjennom hele sammenligningen. SSB-tallene presenteres ofte som månedslønn, mens årslønn er en enkel omregning.
  </FAQItem>
</FAQ>
```

## Diagrammer i blogginnlegg

Diagrammer skal være enkle, redaksjonelle og kildebelagte. Start alltid med spørsmålet figuren skal svare på, og hold datamengden liten nok til at leseren kan skanne figuren på mobil.

Datadrevne innlegg som handler om en bestemt periode skal bruke snapshots. Hvis et innlegg for eksempel handler om 2025-tall, skal tallgrunnlaget lagres som en egen fil under `src/content/blog/data/` og hentes via en eksplisitt kortkode eller `snapshotId`. Ikke bruk `latest`-datasett direkte i historiske blogginnlegg, fordi de vil endre seg når nye SSB-data synkes.

Anbefalt standardformat i MDX:

```mdx
<BlogChart
  title="Median månedslønn varierer mye mellom yrkesgrupper"
  subtitle="Median månedslønn etter yrkesgruppe. Stolpene er sortert fra høyest til lavest."
  type="bar-horizontal"
  format="currency"
  source="SSB tabell 11418"
  note="Tallene gjelder månedslønn for heltids- og deltidsansatte samlet."
  sort="descending"
  xAxisLabel="Kroner per måned"
  data={[
    {
      label: "Ledere",
      value: 78020,
      note: "Median månedslønn for yrkesgruppen.",
    },
    {
      label: "Alle yrker",
      value: 55800,
      category: "highlight",
      note: "Totalnivået gjør sammenligningen enklere.",
    },
    {
      label: "Kontoryrker",
      value: 52110,
    },
  ]}
/>
```

Bruk disse feltene:

- `title`: tydelig figurpoeng, ikke bare datanavn.
- `subtitle`: forklar hva som sammenlignes og hvordan figuren skal leses.
- `type`: `bar-horizontal`, `bar-vertical`, `line` eller `area`.
- `format`: `currency`, `number` eller `percent`.
- `source`: alltid oppgi kilde, for eksempel `SSB tabell 11418`.
- `note`: metode, avgrensning eller usikkerhet.
- `data`: én serie med `{ label, value, note?, category? }`.
- `series`: flere serier for linje/area, med `{ label, color?, points }`.
- `sort`: `descending`, `ascending` eller `none`. Stolpediagrammer sorteres høy til lav som standard.
- `highlightLabel`: markerer én kategori med tydeligere farge.
- `primaryColor` og `highlightColor`: kan overstyres ved behov, men standardfargene bør brukes i vanlige blogginnlegg.

### Stacked bar charts

Bruk `type="stacked-bar"` når figuren skal vise prosentvis fordeling per kategori. Dette passer når ett lønnstall ikke er nok, for eksempel hvis du vil vise andel under, rundt og over et nivå.

```mdx
<BlogChart
  title="Fordelingen sier mer enn ett enkelt lønnstall"
  subtitle="Hver rad viser hvordan lønnsnivået fordeler seg innenfor en yrkesgruppe."
  type="stacked-bar"
  format="percent"
  source="SSB tabell 11418, strukturert eksempel"
  note="Segmentene normaliseres til 100 prosent per rad."
  showLegend
  normalizeStacked
  categories={[
    {
      label: "Ledere",
      segments: [
        { label: "Under 50k", value: 12 },
        { label: "50-70k", value: 38 },
        { label: "Over 70k", value: 46 },
        { label: "Uoppgitt", value: 4 },
      ],
    },
    {
      label: "Alle yrker",
      note: "referanse",
      segments: [
        { label: "Under 50k", value: 36 },
        { label: "50-70k", value: 43 },
        { label: "Over 70k", value: 15 },
        { label: "Uoppgitt", value: 6 },
      ],
    },
  ]}
/>
```

Retningslinjer for stacked bars:

- Bruk samme segmentrekkefølge i alle rader.
- La høyere/verdimessig bedre kategori ha mørkere grønn.
- Bruk varme, lysere farger for lavere nivåer og grått for `Uoppgitt` eller `Vet ikke`.
- La `normalizeStacked` være på når verdiene skal leses som prosentfordeling.
- Segmentlabels vises bare inne i stolpen når det er nok plass. Små segmenter forklares via tooltip.

For SSB-data bør `note` beskrive tabell, målemetode, periode og viktige dimensjoner. Eksempel:

```md
Kilde: SSB tabell 11418. Målemetode: median. Sektor: alle sektorer. Kjønn: begge kjønn. Tid: 2025.
```

Designregler:

- Foretrekk horisontale stolper når etikettene er lange eller figuren står midt i en artikkel.
- Marker kun ett sammenligningspunkt med `category: "highlight"` når det hjelper leseren.
- Bruk `note` per datapunkt for tooltip-tekst når tallet trenger forklaring.
- Ikke bruk flere farger enn nødvendig. Standardpaletten er laget for Lønnsinnsikt og bør normalt være nok.
