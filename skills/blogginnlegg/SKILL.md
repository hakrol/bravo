---
name: blogginnlegg
description: Skriv, oppdater og kvalitetssikre blogginnlegg for Bravo-prosjektet. Bruk når Codex skal lage nye bloggposter, forbedre eksisterende blogginnhold, justere bloggstruktur, legge inn bilder, tabeller, eksempler, sitater eller innholdsfortegnelse, eller oppdatere felles bloggkomponenter og bloggstiler.
---

# Innholdsregler

## Oversikt

Bruk denne skillen når arbeidet gjelder blogginnhold eller bloggoppsett i dette prosjektet. Følg eksisterende bloggstruktur, skriv på norsk bokmål, og prioriter gjenbrukbare komponenter og felles stiler fremfor lokale spesialløsninger.

Blogginnleggene skal hjelpe norske lesere med å forstå lønn, lønnsstatistikk, yrker, utdanning og karrierevalg. Innholdet skal gjøre det lettere å ta gode valg, stille bedre spørsmål og bruke lønnsdata på en praktisk måte.

Skriv for en smart leser som ikke nødvendigvis kan statistikk, SSB-tabeller eller fagterminologi. Tonen skal være konkret, hjelpsom og rolig, uten salgspreg, overdrevne løfter eller generiske SEO-avsnitt.

## Prioritering ved konflikt

Hvis regler overlapper eller virker motstridende:

1. Oppgavespesifikk brief i `daily-brief.md`
2. Denne skillen
3. `PROJECT.MD`
4. `AGENTS.MD`

Bruk den mest spesifikke regelen som passer oppgaven.

## Arbeidsflyt

1. Les alltid [src/content/blog/README.md](src/content/blog/README.md) før du skriver eller oppdaterer et blogginnlegg.
2. Hvis oppgaven påvirker bloggvisning, bloggkomponenter eller Next.js-oppsett, les relevant dokumentasjon i `node_modules/next/dist/docs/` før du koder.
3. Identifiser lavest riktige nivå for endringen:
   - nytt innlegg i `src/content/blog/`
   - eksisterende innlegg i `src/content/blog/`
   - bilder i `public/blogg/<slug>/`
   - felles bloggkomponenter i `src/components/`
   - felles bloggstil i `src/app/globals.css`
4. Gjør endringer på lavest riktige nivå:
   - innhold i innlegget hvis bare teksten skal endres
   - MDX-komponenter hvis flere innlegg skal bruke samme mønster
   - globale bloggstiler hvis uttrykket skal gjenbrukes på tvers av innlegg
5. For automatiserte blogginnlegg: bruk `skills/blogginnlegg/daily-brief.md` som tema-kø og kjøringsbrief, men ikke dupliser generelle bloggstandarder der.

## Arbeidskopi og synk

- Desktop/Bravo-prosjektet er den stabile innholdskilden for blogginnlegg.
- Når en midlertidig Codex-worktree brukes til utkast eller forhåndsvisning, må hele bloggpakken synkes samlet til Desktop/Bravo før temaet regnes som ferdig.
- Ikke kryss av temaer i `daily-brief.md` hvis MDX-fil, snapshot, public-assets og relevante komponentendringer bare finnes i en annen worktree.
- Når et innlegg er godkjent for publisering, skal status i Desktop/Bravo vise hele endringen samlet.

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



## Bloggbrief

Når et blogginnlegg lages fra tema-køen, skal briefen under temaet følges.

Briefen kan inneholde:
- Tittel
- Beskrivelse av hva innlegget skal svare på, hensikt og mål
- Overskrifter og mellomoverskrifter som skal brukes eller vurderes
- Interne lenker som skal inn i teksten
- Eksterne lenker som skal brukes som kilder eller videre lesing
- Diagramtyper som skal inkluderes

Hvis briefen mangler noen av feltene, skal Codex bruke beste skjønn basert på prosjektreglene og eksisterende blogginnlegg.

Hvis briefen oppgir `Diagrammer`, er hvert punkt en påkrevd diagramtype. Brukeren skal bare trenge å skrive typen, for eksempel `Boblediagram` eller `Lønnsutviklingsdiagram`. Codex skal velge riktig eksisterende komponent, wrapper-komponent, plassering og datagrunnlag ut fra diagramreglene under.

Codex skal ikke be brukeren fylle inn komponentnavn, formål, plassering eller datafil i tema-køen. Hvis et oppgitt diagram ikke kan lages med tilgjengelig datagrunnlag, skal Codex forklare hvorfor før temaet regnes som ferdig.

## Regler for blogginnhold

- Blogginnlegg skal skrives på naturlig Norsk Bokmål med direkte og konkret språk.
- Skriv konkret, tydelig og uten fluff.
- Unngå fet tekst for å fremheve poeng.
- Ikke start med “X omtales ofte som…”
- Ikke skriv “det er viktig å merke seg at…” med mindre det faktisk trengs.
- Bruk konkret subjekt: “En brannmann…”, “Lønnen…”, “SSB-tallene…”
- Gå rett på hva leseren prøver å forstå.
- Første setning i innlegget skal være en engasjerende hook, men ikke bruk den samme hook-strukturen i hvert innlegg. Hook skal være relevant for temaet, ikke en generisk klisjé. Maks 2-3 setninger.
- Bruk `du` når brukeren ber om direkte rådgivende bloggtekst.
- Forklar vanskelige begreper enkelt, uten å bli barnslig.
- Skill mellom fakta, tolkning og råd.
- Unngå amerikanske karriereråd som ikke passer norske forhold.
- Bruk `##` og `###` for struktur. Det gir automatisk innholdsfortegnelse.
- Hold frontmatter ryddig og komplett.
- Legg nye innlegg i `src/content/blog/`.
- Legg bilder i `public/blogg/<slug>/`.

### Innledning

Innledningen skal raskt etablere relevans og leseretning.

Vanlige innganger:
- Statistikk
- Spørsmål
- Problem/pain point
- Kontrast eller overraskelse

Hooken skal være relevant for temaet og basert på faktisk innhold i innlegget.

Avslutt innledningen med et frampek.

## Diagramkrav for datadrevne blogginnlegg

Produksjonsklare visuelle dataelementer:
- Boblediagram: `<BlogChart type="bubble" />`
- Redaksjonelt stolpediagram: egen bloggkomponent bygget på `EditorialDivergingBarChart`
- Søkbar yrkesliste: `<BlogOccupationSalaryTable snapshotId="..." />`
- Kjønnsdelt lønnskort: `<BlogGenderSalaryCards />`
- Lønnsutviklingsdiagram: `<BlogSalaryDevelopmentChart />`, slik advokatinnlegget bruker via `<LegalSalaryDevelopmentChart />`

Gyldige diagramtyper i `daily-brief.md`:
- `Kjønnsdelt lønnskort`
- `Boblediagram`
- `Redaksjonelt stolpediagram`
- `Søkbar yrkesliste`
- `Lønnsutviklingsdiagram`
- `Femårs lønnsutvikling`

Alle blogginnlegg som handler om lønn for ett konkret yrke skal ha `BlogGenderSalaryCards` der det passer naturlig tidlig i innlegget, vanligvis etter første hovedtabell eller etter avsnittet som forklarer hovedtallet. Komponenten skal vise medianlønn for kvinner og menn, med veksling mellom årslønn, månedslønn og timelønn. Bruk samme periode og kilde som innleggets hovedtall. Kjønnsdelte lønnstall skal ligge i et frosset snapshot under src/content/blog/data/ før innlegget regnes som ferdig. Hvis SSB ikke publiserer kjønnsdelte tall for yrket, skal innlegget forklare hvorfor komponenten ikke brukes.

Datadrevne blogginnlegg skal som hovedregel inneholde minst 2 visuelle dataelementer. Velg blant disse produksjonsklare typene:

- `BlogChart` med `type="bubble"`
  Brukes når innlegget skal vise sammenheng mellom lønnsnivå og størrelse på yrkesgruppe. Lag en egen wrapper-komponent i `src/components/` og la `value` komme fra et frosset snapshot når innlegget handler om en bestemt periode. `size` er antall lønnstakere og kan komme fra samme snapshot hvis det finnes der, eller fra en tydelig navngitt tilleggsmap når tallet kommer fra en annen SSB-tabell. Bruk datafeltene `lane`, `labelOffset`, `showLabel`, `color` og `opacity` hvis bobleplasseringen må finjusteres. Ikke legg nye yrkesnavn-spesialtilfeller inn i selve `BlogChart`.

- Redaksjonelt stolpediagram
  Brukes når innlegget skal rangere yrker, grupper eller sammenligningspunkter etter lønn. Lag en egen bloggkomponent i `src/components/` som bruker `EditorialDivergingBarChart`, slik eksisterende lege-, kirurg- og lærerdiagrammer gjør. La rader og kilde komme fra frosset snapshot når perioden er historisk; wrapper-komponenten kan velge hvilke rader som skal vises og hvilket punkt som skal markeres med `highlight`. Ikke bruk den gamle horisontale `BlogChart`-varianten i nye blogginnlegg.

- `BlogSalaryDevelopmentChart`
  Brukes når innlegget skal vise faktisk femårsutvikling i median samlet månedslønn for ett yrke eller en liten gruppe sammenlignbare yrker. Diagrammet skal vise kroner på y-aksen, år på x-aksen og samlet vekst fra start til slutt både i kroner og prosent. Ikke indeksér verdiene. Bruk en wrapper-komponent når dataene kommer fra et artikkelspesifikt snapshot, slik at MDX-en kan bruke en kort komponent som `<LegalSalaryDevelopmentChart />`.

- `BlogOccupationSalaryTable`
  Brukes som søkbar liste/tabell over yrker fra et frosset snapshot under `src/content/blog/data/`. Tabellen passer når innlegget har flere relevante yrker enn det som bør vises i et diagram.

Arbeidsmønster:
- Bruk wrapper-komponent for boblediagram, redaksjonelt stolpediagram og artikkelspesifikk lønnsutvikling, slik at MDX-en bare inneholder en kort komponent som `<DoctorSalaryBubbleChart />`.
- Bruk `BlogOccupationSalaryTable` direkte i MDX med `snapshotId`.
- For historiske datainnlegg skal tallgrunnlaget ligge i `src/content/blog/data/`; ikke hardkod historiske lønnstall direkte i MDX eller i diagramkomponenten hvis snapshot finnes.
- Hold selve diagramkomponentene generiske. Tema-, yrkes- og artikkelspesifikke valg skal ligge i wrapper-komponenten eller snapshot-data.

Minstekrav:
- Bruk minst 2 av disse i datadrevne blogginnlegg.
- Hvis `daily-brief.md` oppgir konkrete diagrammer, skal disse telle som påkrevde elementer og prioriteres over generelle forslag i denne skillen.
- Bruk aldri to diagrammer rett etter hverandre uten forklarende tekst mellom.
- Velg `BlogOccupationSalaryTable` når leseren bør kunne søke eller bla i flere yrker.
- Velg boblediagram når antall lønnstakere er en viktig del av poenget.
- Velg redaksjonelt stolpediagram når sortering/rangering er hovedpoenget.

## Interne lenker
- Interne lenker skal legges inn naturlig i teksten. For eksempel "Se også vår yrkesside for elektrikere", hvor lenken er på "elektrikere".

## SEO-regler

- Skriv blogginnlegg rundt én tydelig hovedintensjon per side.
- Sørg for at tittel, ingress, mellomtitler og brødtekst svarer på samme spørsmål.
- Bruk `title`, `description`, `seoTitle`, `seoDescription` og `slug` aktivt, ikke som ettertanke.
- `description` skal fungere som en engasjerende hook på bloggforsiden, ikke bare som en nøktern oppsummering.
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

Unngå:
- “komplett guide”-språk
- kunstig lange introduksjoner
- overskrifter som bare gjentar søkeord
- SEO-fyll mellom faktiske poenger
- seksjoner som ikke tilfører ny informasjon

## Data og SSB

- Hvis innlegget bruker SSB-data, følg reglene i `/lib/ssb/docs.md` når filen finnes i prosjektet.
- Bruk eksisterende funksjoner i `/lib/ssb/queries.ts` når innlegget krever nye SSB-uttrekk.
- Ikke konstruer rå SSB-kall inne i komponenter eller blogginnlegg.
- Datadrevne innlegg som handler om en bestemt periode, for eksempel 2025, skal bruke et frosset snapshot under `src/content/blog/data/`.
- Ikke la historiske blogginnlegg lese direkte fra `latest`-JSON eller andre datakilder som endrer seg når SSB-data oppdateres.
- Forklar kilde, periode, målemetode og viktige avgrensninger når tall brukes.

## Datadisiplin

- Ikke presenter estimater som fakta.
- Ikke trekk årsakssammenhenger direkte fra lønnsstatistikk uten grunnlag.
- Skill tydelig mellom observerte tall og egne forklaringer.
- Ikke overdriv konklusjoner fra små forskjeller i datasettet.
- Forklar usikkerhet eller begrensninger når tallgrunnlaget er svakt.

## Regler for bloggkomponenter

- Ikke bruk inline-styling i MDX for varige mønstre.
- Hvis flere innlegg trenger samme visuelle løsning, lag eller oppdater en gjenbrukbar komponent i `src/components/blog-mdx-components.tsx`.
- Hvis flere innlegg trenger samme utseende, legg stilen i `src/app/globals.css`.
- Bruk vanlige Markdown-sitater bare for faktiske sitater eller kilder.
- Bruk `Example`-komponenten for formuleringer, manus og forslag leseren kan bruke selv.
- Bruk `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader` og `TableCell` for tabeller i innlegg.
- Bruk `ToolCallout` når innlegget bør peke videre til et relevant verktøy som Lønnsjekk.
- Ikke lag nye komponenter hvis eksisterende komponenter dekker behovet godt nok.
- Foretrekk små lokale forbedringer fremfor nye abstraksjoner.

## Bilder

Følg reglene i [src/content/blog/README.md](src/content/blog/README.md):

- hero-bilde: `yrke-lonn.*` - yrke er det sentrale temaet i innlegget, og lønn er det sentrale temaet i innlegget. Eksempel: `psykolog-lonn.*`
- vanlige bilder: `inline-1.*`, `inline-2.*`
- figurer og grafer: `figure-1.*`, `figure-2.*`

Anbefalt størrelse:

- hero-bilde: `1600 x 1000 px`
- bilder i innlegg: rundt `1200 px` bredde

Bruk beskrivende `alt`-tekst når bildet settes inn i MDX.

## Ferdigdefinisjon

Et blogginnlegg regnes bare som ferdig når:

- MDX-filen finnes i `src/content/blog/`
- frontmatter følger eksisterende format
- `title`, `description`, `seoTitle`, `seoDescription`, `slug` og `coverImage` er satt
- `description` fungerer som en presis og engasjerende hook
- innlegget har tydelige `##`-overskrifter
- innlegget svarer tydelig og tidlig på hovedspørsmålet i tittelen
- minst én relevant intern lenke er brukt hvis briefen oppgir interne lenker
- alle diagramkrav fra `daily-brief.md` er fulgt, eller avvik er forklart tydelig
- riktige bloggkomponenter brukes i stedet for lokale hacks
- sitater, eksempler og tabeller bruker riktige komponenter eller stiler
- endringen er gjort på riktig nivå: innhold, komponent eller global stil
- kilder er brukt og forklart når tall eller eksterne fakta brukes
- historiske SSB-tall kommer fra frosset snapshot
- `daily-brief.md` er oppdatert med filsti og dato når automasjonen brukes

## Når du må endre bloggdesignet

Gjør endringen i den felles bloggstakken først:

1. Oppdater komponent i `src/components/` hvis det er et mønster.
2. Oppdater `src/app/globals.css` hvis det er ren presentasjon.
3. Oppdater innleggene til å bruke komponenten i stedet for rå HTML eller lokale spesialløsninger.

Unngå å løse et systemproblem ved å håndstyle ett enkelt innlegg.



## Unngå typiske AI-feil

- Ikke start med brede selvfølgeligheter som “I dagens arbeidsmarked...”
- Ikke bruk generiske fraser som “det finnes mange faktorer som spiller inn” uten å konkretisere dem.
- Ikke avslutt hvert avsnitt med en oppsummerende læresetning.
- Ikke bruk overdrevne formuleringer som “alt du trenger å vite”.
- Ikke skriv lange balanserende avsnitt der ingen ting egentlig sies.
- Ikke gjenta søkeord mekanisk.
- Ikke bruk like setningsrytmer i mange avsnitt på rad.
- Ikke lag konklusjoner som er sterkere enn datagrunnlaget.
- Skriv heller kort, konkret og litt ujevnt enn glatt og generisk.
- Varier lengden på avsnitt og setninger naturlig.
- Ikke skriv alle seksjoner med identisk struktur.
- Prioriter konkrete observasjoner før generelle forklaringer.
- Ikke gjør alle avsnitt “perfekt balanserte”.
- Skriv som en erfaren fagperson, ikke som en SEO-tekstgenerator.

