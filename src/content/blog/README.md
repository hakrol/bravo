# Blogginnhold

Legg nye innlegg som `.mdx`-filer i denne mappen.

## Arbeidsflyt og fellesregler

Dette er felleskilden for alle bloggtypene. De aktive skillene ligger i `.agents/skills/`. Start med `blogginnlegg` hvis typen ikke er valgt; les ellers den valgte type-skillen direkte. Skillene er `blogg-yrkeslonn`, `blogg-sammenligning`, `blogg-rangering`, `blogg-lonnsoversikt` og `blogg-lonnsraad`.

Bestill innlegg direkte i samtalen, eventuelt med en brief fra `bloggbrief`. Det finnes ingen temakø eller automatisk skriveflyt. En brief er en artikkelbestilling, ikke dokumentasjon for fakta.

- Følg `AGENTS.MD` og bruk `PROJECT.MD` som produkt- og redaksjonsgrunnlag. Bestillingen bestemmer konkret vinkel, overskrifter og ønskede elementer innenfor prosjektets regler. Skillene kan ikke overstyre disse eller gi tillatelse til publisering.
- Behold bestilte overskrifter og deres rekkefølge. Legg bare til seksjoner når de gir nødvendig forklaring. Avklar vesentlig motstrid fremfor å finne på et datagrunnlag.
- Skriv på naturlig norsk bokmål med konkrete subjekter, aktiv form og lite fagterminologi. Bruk du-språk når det hjelper leseren. Varier rytmen naturlig og unngå generiske SEO-avsnitt, overdrevne løfter og fet tekst som poengmarkering.
- Gi et relevant, konkret hovedsvar tidlig. En hook skal bygge på artikkelens spørsmål eller et dokumentert funn. Les [introeksemplene](../../../.agents/skills/blogginnlegg/references/introeksempler.md) som stilreferanse, ikke som faktakilde.
- Skill fakta, tolkning, råd og regneeksempler. Ikke utled årsaker fra lønnsforskjeller alene. Ikke presenter estimater som observerte tall.
- Bruk interne lenker naturlig i teksten og verifiser at målsidene finnes. Lenke til konkrete eksterne kilder der opplysningene brukes. Tidsaktuelle fakta, satser og rettslige påstander må kontrolleres mot relevante primærkilder.
- Endre innhold i MDX, datagrunnlag i snapshots og gjenbrukbare mønstre i eksisterende komponenter. Ikke endre bloggdesign som en automatisk del av en skriveoppgave. Les relevant lokal Next.js-dokumentasjon før tekniske endringer som omfattes av `AGENTS.MD`.

### Data og kilder

- Følg `src/lib/ssb/docs.md`, bruk eksisterende spørringer i `src/lib/ssb/queries.ts`, og la alle SSB-kall gå gjennom `src/lib/ssb.ts`. Ikke konstruer API-kall i MDX eller UI-komponenter.
- Skill mellom 7-sifret STYRK98-kode i Yrkeskatalogen og 4-sifret STYRK-08-gruppe i statistikken. Yrke bestemmes av arbeidsoppgaver, ikke utdanning eller stillingstittel alene. Følg prosjektets omkodingsregler.
- Bruk `src/lib/utdanning/yrkesbeskrivelser.json` og `src/lib/utdanning/docs.md` for yrkesoppgaver, arbeidssted og utdanningsvei. Koble helst via `styrk98[].yrkeskode_styrk98` mot `src/lib/ssb/426.csv`. Ikke presenter Utdanning.no-beskrivelser som SSB-data.
- Oppgi kilde, statistikkperiode, lønnsbegrep, enhet og vesentlige populasjonsavgrensninger. Skriv «1. kvartal 2025», ikke `2025K1`, i publisert tekst.
- Frys periodebundne data under `src/content/blog/data/`. Tekst, tabeller og diagrammer skal stemme med samme snapshot; historiske innlegg skal ikke lese direkte fra skiftende `latest`-data.
- Manglende eller undertrykte tall er ikke null. Forklar vesentlige datamangler. Ikke beregn startlønn eller årsaksforklaringer fra tall som ikke dokumenterer dem.

### Ferdigkontroll

Et innlegg er klart for gjennomgang når MDX-filen og nødvendige snapshots finnes i samme arbeidskopi, frontmatter er komplett, bestillingen er fulgt, kilder og lenker er kontrollert og tallene stemmer mellom alle visninger. Bruk `title`, `description`, `seoTitle`, `seoDescription`, `slug`, `coverImage` og `coverImageAlt` bevisst. Kontroller eksisterende format og komponentstøtte i `src/lib/blog.ts` og `src/components/blog-mdx-components-fixed.tsx`.

Forklar bestilte elementer som ikke kan leveres og hvorfor. Kontroller MDX/frontmatter og eventuelle berørte typer og komponenter med relevante eksisterende valideringer. Rapporter hva som er kontrollert og hva som gjenstår. Ikke publiser automatisk. Bruk `draft: true` når brukeren ber om et upublisert utkast; eksisterende innlasting skjuler slike innlegg utenfor utviklingsmodus.

## Frontmatter

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
author: "Redaksjonen"
category: "lonn"
tags:
  - "Snekker"
seoTitle: "Valgfri SEO-tittel"
seoDescription: "Valgfri SEO-beskrivelse"
---
```

Deretter skriver du selve innholdet i MDX.

Når et publisert innlegg senere får en reell innholdsoppdatering, kan frontmatter også ha:

```md
updatedAt: "2026-05-15"
```

Oppdateringsdatoen vises bare når den er senere enn `publishedAt`. Behold den opprinnelige publiseringsdatoen.

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

## Bilder som brukeren legger inn selv

Opprett eller generer hero-bilder bare når dette inngår i bestillingen. Når brukeren legger inn bildet selv, sett `coverImage` til en full artikkelspesifikk sti under `/blogg/<slug>/`. For yrkesinnlegg brukes `<yrke>-lonn.png`; for andre innlegg brukes `cover.png`. Ikke opprett selve bildefilen.

```md
coverImage: "/blogg/hva-er-lonnen-til-en-lege/lege-lonn.png"
coverImageAlt: "To leger i hvite frakker med stetoskop og skrivebrett"
coverImageAiGenerated: false
```

Når `coverImage` settes til en sti under `/blogg/<slug>/`, skal den tilsvarende mappen `public/blogg/<slug>/` opprettes samtidig. Selve bildefilen skal fortsatt ikke opprettes eller genereres hvis brukeren skal legge inn bildet selv.

Bruk for eksempel `lege-lonn.png`, `psykolog-lonn.png` eller `vernepleier-lonn.png` for yrkesinnlegg. Opprett mappen også når bildet skal legges inn senere. En tom mappe følger ikke med Git; bruk en `.gitkeep` når den skal følge endringen. Oppgi manglende bilde ved levering, og merk bare faktisk genererte bilder med `coverImageAiGenerated: true`.

## Fast navngivningsregel for egne bilder

Legg alle blogg-bilder i:

`public/blogg/<slug>/`

Bruk denne faste navngivningen:

- `cover.jpg`, `cover.png` eller `cover.svg`
  Brukes som hero-bilde i toppen av innlegget og i bloggkort for andre innlegg enn yrkesinnlegg. Yrkesinnlegg bruker `<yrke>-lonn.*`.

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
- Oppdater `coverImage` til det faktiske filnavnet etter regelen for innleggstypen. Ikke gi eksisterende bilder nye navn uten behov.
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
  Brukes når bestillingen ber om en FAQ-seksjon eller når innlegget bør svare kort på konkrete tilleggsspørsmål. Bruk bestilte spørsmål når de er oppgitt. FAQ skal alltid stå helt nederst i innlegget, etter eventuell oppsummering og kildeavsnitt, uten egen Markdown-overskrift over komponenten. Komponenten viser selv overskriften `Ofte stilte spørsmål`.

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

Diagrammer skal være enkle, redaksjonelle og kildebelagte.

Bestilte diagrammer og tabeller er konkrete leveranser. Brukeren kan bestille en diagramtype uten å angi komponent, plassering eller snapshot-ID. Velg relevant eksisterende komponent og forklar eventuelle databegrensninger. Datadrevne innlegg skal som hovedregel ha minst ett relevant visuelt dataelement; et lønnskort eller en søkbar datatabell teller også. Lønnsråd har ikke et slikt minstekrav. Ikke legg diagrammer rett etter hverandre uten forklarende tekst mellom, og ikke legg inn generiske nøkkeltallstabeller som bare gjentar brødteksten.

| Bestilt type | Implementasjon og bruk |
| --- | --- |
| Interaktiv lønnsutvikling | `BlogSalaryGrowthExplorer` med registrert `snapshotId`, som beskrevet nedenfor. Også standardvalget ved eldre betegnelser som «Lønnsutviklingsdiagram» eller «Femårs lønnsutvikling»; respekter bestilt periode. |
| Interaktiv lønn etter kjønn | `BlogGenderSalaryExplorer` rundt `SalaryGenderExplorer`, med sammenlignbare medianverdier fra et frosset snapshot. Vises i egen fane på `/utvikling-diagram`. Erstatter kjønnsdelte lønnskort i nye yrkesinnlegg; se type-skillen for krav og unntak. |
| Redaksjonelt stolpediagram | Artikkelwrapper rundt `EditorialDivergingBarChart`, med rader og kilde fra snapshot. Bruk til rangering og sammenligning; ikke den gamle horisontale `BlogChart`-varianten. |
| Boblediagram | Artikkelwrapper rundt `BlogChart` med `type="bubble"`. Lønn bestemmer `value`, antall lønnstakere bestemmer `size`. Oppgi kilde for begge; ikke legg yrkesspesifikke unntak i den generiske komponenten. |
| Søkbar yrkesliste | `BlogOccupationSalaryTable` med registrert `snapshotId`. Bruk når leseren bør kunne søke i et større utvalg. |
| Lønnsfordeling utvikling | Artikkelwrapper rundt `BlogSalaryDistributionDevelopmentChart` med P25, median og P75 fra snapshot. Bruk maksimalt ti nyeste komplette år; manglende kvartiler skal ikke erstattes med null. Oppgi perioden som faktisk vises. |

Hold generiske diagrammer gjenbrukbare. Legg artikkelspesifikke valg i snapshots og små wrappers når komponenten trenger det. Ikke lag nye varianter når eksisterende løsning dekker behovet. Eldre diagramkomponenter kan fortsatt brukes av eksisterende innlegg; nye lønnsutviklingsvisninger følger standarden under.

«Interaktiv lønn etter kjønn» sammenligner kvinner og menn i én periode. Lag en liten artikkelwrapper som importerer yrkets snapshot og sender `occupationLabel`, `period`, `source`, `womenMonthlyMedian`, `menMonthlyMedian` og eventuelt `monthlyHours` til `BlogGenderSalaryExplorer`. Registrer artikkelwrapperen i `src/components/blog-mdx-components-fixed.tsx`. Bruk samme lønnsbegrep og populasjonsavgrensning for begge kjønn. Komponenten tar median månedslønn som grunnlag, omregner årslønn med faktor 12 og estimerer timelønn med standard 162,5 timer per måned eller et eksplisitt positivt timetall fra snapshotet. Manglende eller undertrykte tall angis som `null`, aldri null kroner eller anslag. Testdata i `src/lib/development-gender-salary-data.ts` brukes bare i diagramverkstedet. «Interaktiv lønnsforskjell» er et eget diagram for utviklingen over tid.

Datadrevne innlegg som handler om en bestemt periode skal bruke snapshots. Hvis et innlegg for eksempel handler om 2025-tall, skal tallgrunnlaget lagres som en egen fil under `src/content/blog/data/` og hentes via en eksplisitt kortkode eller `snapshotId`. Ikke bruk `latest`-datasett direkte i historiske blogginnlegg, fordi de vil endre seg når nye SSB-data synkes.

### Standarddiagram: Interaktiv lønnsutvikling

«Interaktiv lønnsutvikling» er det faste navnet på det felles lønnsutviklingsdiagrammet. Når en brief ber om dette diagrammet, eller et nytt yrkesinnlegg skal vise lønnsutvikling, bruk `BlogSalaryGrowthExplorer`:

```mdx
<BlogSalaryGrowthExplorer snapshotId="arealplanlegger-lonnsutvikling-2025" />
```

`snapshotId` er obligatorisk og velger et registrert datasett. En ukjent ID gir en feil, slik at innlegget ikke viser tall for et annet yrke ved en skrivefeil. Bruk en ID med formatet `<yrke>-lonnsutvikling-<siste-år>`, med små bokstaver og bindestreker.

Når et innlegg sammenligner flere fagretninger, kan `snapshotIds` oppgis som en kommaseparert streng med registrerte ID-er i tillegg til `snapshotId`, for eksempel `snapshotIds="yrke-a-lonnsutvikling-2025,yrke-b-lonnsutvikling-2025"`. Bruk en streng i MDX, siden JavaScript-uttrykk som array-props filtreres bort. Da vises en fagvelger over det samme standarddiagrammet. `snapshotId` angir hvilken fagretning som vises først. Hver fagretning skal fortsatt ha sitt eget kildebelagte snapshot; flere snapshots kan samles i én JSON-fil og registreres hver for seg.

For et nytt innlegg:

1. Lag et kildebelagt JSON-snapshot under `src/content/blog/data/` og bruk strukturen i `arealplanlegger-interaktiv-lonnsutvikling-2025.json` som utgangspunkt. Typen er `SalaryGrowthSnapshot` i `src/lib/salary-growth-snapshot.ts`.
2. Importer og registrer filen med sin ID i `src/lib/blog-salary-growth-snapshots.ts`.
3. Sett inn `BlogSalaryGrowthExplorer` i innlegget med denne ID-en. MDX-komponenten er allerede registrert i `src/components/blog-mdx-components-fixed.tsx`.

Datasettet skal følge disse reglene:

- `title`: «Slik har lønnen til [yrke] utviklet seg».
- `subtitle`: «Median månedslønn fra [startår] til [sluttår]». Oppgi lønnsbegrepet som faktisk brukes i datagrunnlaget; bruk «Gjennomsnittlig månedslønn» når tallene er gjennomsnitt.
- `source`: oppgi bare SSB-tabellen, for eksempel «SSB tabell 11418». Kildefeltet under diagrammet viser bare tabellhenvisninger, med KPI-tabellen i tillegg når inflasjonsjusteringen er på. Forklar nødvendige avgrensninger og forskjellen mellom nominell og inflasjonsjustert lønn i brødteksten. `note` kan bevare slike opplysninger i datasettet, men vises ikke under diagrammet.
- `points`: lønn for begge kjønn i kroner per måned, med minst to år i stigende rekkefølge, unike årstall og positive, endelige verdier. Bruk de siste ti tilgjengelige årene når sammenlignbare tall finnes. En kortere, tydelig oppgitt periode er tillatt.
- `womenPoints` og `menPoints`: valgfrie serier med samme årstall, lønnsbegrep og avgrensninger som `points`. Ta bare med serier som har kildebelagte tall for hele perioden. Manglende eller undertrykte tall skal ikke erstattes med null eller anslag.
- `inflation`: oppgi KPI-kilde, eventuell `sourceUrl`, `referenceMonth`, oppdateringsdato i `updated` og årsverdier i `points`. Bruk samme referansemåned hvert år. Justeringen bruker siste lønnsårs prisnivå. Manglende KPI-år gjør inflasjonsjusteringen utilgjengelig; ikke finn opp verdier for å fylle hull.

Utseende, farger, plassering av tall, vekstpil, inflasjonsknapp og fokus ved hover styres samlet i `src/components/salary-growth-explorer.tsx`. Bruk denne komponenten fremfor å kopiere designet eller lage artikkelspesifikke stilvarianter. Testdata fra `src/lib/development-diagram-data.ts` brukes bare på `/utvikling-diagram`.

Fast formulering i en brief:

> Bruk standarddiagrammet «Interaktiv lønnsutvikling» med lønnsdata for [yrke].
