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
   - standard coverbilde i frontmatter
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

- `public/blogg/<slug>/<yrke-lonn>.png`
  Artikkelspesifikk coversti for automatiserte yrke/lønn-innlegg. Mappen `public/blogg/<slug>/` skal opprettes når `coverImage` peker dit, men selve bildefilen skal ikke opprettes eller genereres av automasjonen.

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

Hvis briefen oppgir `Diagrammer`, er hvert punkt en påkrevd diagramtype. Brukeren skal bare trenge å skrive typen, for eksempel `Boblediagram` eller `Lønnsutviklingsdiagram`. Codex skal velge riktig eksisterende komponent, wrapper-komponent, plassering og datagrunnlag ut fra diagramreglene under.

Hvis briefen oppgir `FAQ`, er hvert punkt et påkrevd spørsmål. Codex skal inkludere en FAQ-seksjon med `<FAQ>` og `<FAQItem question="...">`, skrive korte svar som bygger på innleggets innhold og datagrunnlag, og plassere FAQ-en helt nederst i innlegget, etter oppsummering og kildeavsnitt når de finnes. Ikke legg inn en egen Markdown-overskrift som `## FAQ`; komponenten skal selv vise den eneste overskriften: `Ofte stilte spørsmål`.

Codex skal ikke be brukeren fylle inn komponentnavn, formål, plassering eller datafil i tema-køen. Hvis et oppgitt diagram ikke kan lages med tilgjengelig datagrunnlag, skal Codex forklare hvorfor før temaet regnes som ferdig.

## Rangeringsinnlegg

Når det neste ukryssede temaet i `daily-brief.md` er merket som et `Rangeringsinnlegg`, skal disse instruksjonene brukes i tillegg til de generelle instruksjonene for blogginnlegg.

Et rangeringsinnlegg er fortsatt et vanlig blogginnlegg. Det skal følge bloggens vanlige filstruktur, frontmatter, URL-struktur, komponentbruk og publiseringsflyt.

- Les hele briefen for det aktuelle innlegget før arbeidet starter.
- `daily-brief.md` er styrende for det konkrete rangeringsinnlegget. Bruk tittelen, søkeintensjonen, overskriftene, avgrensningene, datagrunnlaget, tabellene, diagrammene og komponentene som er angitt i briefen.
- Behold overskriftene fra briefen som hovedstruktur og i samme rekkefølge. Ikke erstatt dem med en generell standardstruktur for rangeringsinnlegg.
- Bruk diagramtypen og diagramkomponenten som er angitt i briefen. Ikke velg en annen diagramtype bare fordi den vanligvis brukes i rangeringsinnlegg.
- Dersom briefen angir hvilke verdier, yrker, kategorier eller år som skal vises i diagrammet, skal denne avgrensningen følges.
- Dersom briefen krever både tabell og diagram, skal begge brukes. De skal bygge på det samme datagrunnlaget og vise konsistente verdier og plasseringer.
- Ikke legg til ekstra diagrammer, tabeller eller hovedseksjoner med mindre det er nødvendig for å oppfylle briefen eller forklare vesentlige forbehold.
- Hvis briefen ikke angir en bestemt overskrift, diagramtype eller presentasjonsform, brukes de generelle instruksjonene for rangeringsinnlegg og bloggens eksisterende mønstre.
- Ved motstrid gjelder de artikkelspesifikke instruksjonene i `daily-brief.md` foran de generelle instruksjonene for rangeringsinnlegg. Repoets sikkerhetsregler og tekniske krav gjelder alltid.
- Legg innlegget i `src/content/blog/` som `.mdx`.
- Bruk den vanlige frontmatter-strukturen for blogginnlegg.
- Lag blogg-coverbilde og bruk `coverImage` og `coverImageAlt` når dette kreves av den vanlige bloggstrukturen.
- Ikke publiser eksternt eller automatisk.
- Rangeringen skal bygge på et tydelig definert og dokumenterbart datagrunnlag. Oppgi hvilket år, hvilken måleenhet, hvilken populasjon og hvilke avgrensninger rangeringen gjelder.
- Bruk den samme måleenheten for alle plasseringene. Ikke bland for eksempel gjennomsnittslønn og medianlønn i én rangering.
- Forklar kort hvordan rangeringen er beregnet før eller rett etter at resultatene presenteres.
- Presenter hovedresultatet tidlig. Leseren skal raskt forstå hvem eller hva som ligger øverst, og hva som skiller toppen fra resten.
- Vis plasseringene i tydelig nummerert rekkefølge. Antallet plasseringer i innlegget skal samsvare med antallet som oppgis i tittelen.
- Ikke fyll rangeringen med irrelevante yrker eller kategorier bare for å nå et bestemt antall. Avgrens sammenligningsgrunnlaget til det innlegget faktisk handler om.
- Kontroller at navn, verdier og rekkefølge er konsistente mellom tekst, tabeller, diagrammer og eventuelle lokale datasnapshots.
- Forklar hvorfor de øverste plasseringene skiller seg ut, men ikke presenter antakelser som dokumenterte årsaker.
- Omtal vesentlige forbehold, datamangler, like plasseringer og usikre sammenligninger der de påvirker resultatet.
- Bruk konkrete mellomtitler som beskriver funnene. Unngå generiske overskrifter som «Oppsummering av rangeringen» eller «Dette må du vite».
- Bruk interne lenker til relevante yrkessider, sammenligningsverktøy, kalkulatorer, forklaringsinnlegg og andre blogginnlegg når det hjelper leseren videre.
- Eksterne kilder skal inkorporeres naturlig i teksten der opplysningen brukes. Ikke avslutt rangeringsinnlegg med et eget `Kilder:`-avsnitt.
- Skriv på Norsk Bokmål med konkret, nøkternt og forklarende språk.
- Unngå generiske SEO-avsnitt. Hvert rangeringsinnlegg skal ha én tydelig søkeintensjon.

## Forklareringsinnlegg

Når brukeren ber om et `forklareringsinnlegg`, skal det behandles som en egen innholdstype, ikke som et vanlig blogginnlegg.

- Legg innlegget i `src/content/forklarer/` som `.mdx`.
- Bruk frontmatter med `title`, `description`, `slug`, `publishedAt`, `author`, `term`, `seoTitle` og `seoDescription`. Bruk `relatedTerms` når det finnes naturlige relaterte forklaringer.
- Bruk URL-strukturen `/forklarer/<slug>`.
- Ikke lag blogg-coverbilde, og ikke bruk `coverImage` eller `coverImageAlt`.
- Ikke publiser eksternt eller automatisk.
- Bruk brukerens oppgitte overskrifter som hovedstruktur, og legg bare til ekstra seksjoner når de er nødvendige for å forklare begrepet godt.
- Svar direkte i starten: forklar hva begrepet betyr før du går inn i nyanser, eksempler og misforståelser.
- Skriv på Norsk Bokmål med rolig, konkret og forklarende språk.
- Prioriter praktisk bruk i lønnssammenheng, forskjeller mot nærliggende begreper, eksempler og vanlige misforståelser.
- Bruk interne lenker til relevante verktøy, yrkessider, blogginnlegg, ordbok eller andre forklareringsinnlegg når det hjelper leseren.
- Eksterne kilder skal inkorporeres naturlig i teksten der opplysningen brukes. Ikke avslutt forklareringsinnlegg med et eget `Kilder:`-avsnitt.
- Forklareringsinnlegg viser en minimalistisk høyresidebar med andre ord og begreper. Listen skal bare inneholde begreper som faktisk har egen forklarerside, og maksimalt 25 lenker.
- Ikke bruk `FAQ` og `FAQItem` i forklareringsinnlegg med mindre brukeren eksplisitt ber om FAQ.
- Unngå generiske SEO-avsnitt. Hvert forklareringsinnlegg skal ha én tydelig søkeintensjon.

## Regler for blogginnhold

- Blogginnlegg skal skrives på naturlig Norsk Bokmål med direkte og konkret språk.
- Skriv konkret, tydelig og uten fluff.
- Unngå fet tekst for å fremheve poeng.
- Ikke start med “X omtales ofte som…”
- Ikke skriv “det er viktig å merke seg at…” med mindre det faktisk trengs.
- Bruk konkret subjekt: “En brannmann…”, “Lønnen…”, “SSB-tallene…”
- Gå rett på hva leseren prøver å forstå.
- Første setning i innlegget skal være en engasjerende hook. Hook skal være relevant for temaet, ikke en generisk klisjé.
- Bruk `du` når brukeren ber om direkte rådgivende bloggtekst.
- Forklar vanskelige begreper enkelt, uten å bli barnslig.
- Skill mellom fakta, tolkning og råd.
- Unngå amerikanske karriereråd som ikke passer norske forhold.
- Bruk `##` og `###` for struktur. Det gir automatisk innholdsfortegnelse.
- Hold frontmatter ryddig og komplett.
- Legg nye innlegg i `src/content/blog/`.
- For automatiserte yrke/lønn-innlegg skal det ikke lages eller genereres et nytt hero-bilde. Sett likevel `coverImage` til en full artikkelspesifikk sti, for eksempel `"/blogg/hva-er-lonnen-til-en-lege/lege-lonn.png"`, slik at brukeren kan legge inn bildet selv.
- Opprett alltid tilhørende mappe under `public/blogg/<slug>/` når `coverImage` settes til en sti under `/blogg/<slug>/`, også når bildefilen skal legges inn manuelt senere.

### Innledning

Før du skriver innledningen til et blogginnlegg, les `skills/blogginnlegg/Eksempler-tekst.txt`.

Bruk eksemplene som stilreferanse:
- Følg mønstrene under `Bra intro` for rytme, konkretisering og åpning.
- Unngå mønstrene under `Dårlig intro`, spesielt generiske åpninger, SEO-fyll og formuleringer som bare sier at temaet er viktig.
- Ikke kopier eksemplene ordrett. Bruk dem til å vurdere om introen er konkret, nyttig og relevant for akkurat dette innlegget.

Innledningen skal raskt etablere relevans og leseretning.

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
- Skriv `alt`-tekst slik at den også fungerer som første, korte setning i bildeteksten.
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
- Ved blogginnlegg om konkrete yrker eller lønn: bruk yrkeskoder bevisst. Den sjusifrede yrkeskoden kommer fra Yrkeskatalogen/STYRK98 og brukes ved rapportering, mens SSB-statistikk ofte grupperer yrker etter fire sifre i STYRK-08.
- Husk at yrkeskode bestemmes av faktiske arbeidsoppgaver, ikke utdanning, bransje, lønn eller stillingstittel alene. Se `src/lib/ssb/docs.md` for detaljer om Yrkeskatalogen, Klass API og omkoding mellom STYRK98 og STYRK-08.
- Når et blogginnlegg skal forklare arbeidsoppgaver, arbeidssted, utdanningsvei eller hva et konkret yrke innebærer, bruk Utdanning.no-dataene i `src/lib/utdanning/yrkesbeskrivelser.json` og reglene i `src/lib/utdanning/docs.md` som støttekilde. Koble helst via `styrk98[].yrkeskode_styrk98` mot 7-sifret kode i `src/lib/ssb/426.csv`.
- Ikke presenter Utdanning.no-beskrivelser som SSB-data. Bruk SSB til lønn og yrkeskoder, og Utdanning.no til yrkesforklaring.
- Bruk eksisterende funksjoner i `/lib/ssb/queries.ts` når innlegget krever nye SSB-uttrekk.
- Ikke konstruer rå SSB-kall inne i komponenter eller blogginnlegg.
- Datadrevne innlegg som handler om en bestemt periode, for eksempel 2025, skal bruke et frosset snapshot under `src/content/blog/data/`.
- Ikke la historiske blogginnlegg lese direkte fra `latest`-JSON eller andre datakilder som endrer seg når SSB-data oppdateres.
- Forklar kilde, periode, målemetode og viktige avgrensninger når tall brukes.
- Skriv kvartaler med lesbar tekst, for eksempel `1. kvartal 2025` eller `4. kvartal 2025`. Ikke bruk kompakte periodekoder som `2025K1` eller `2025K4` i publisert bloggtekst, FAQ eller kildeavsnitt.

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
- Bruk `FAQ` og `FAQItem` når `daily-brief.md` oppgir FAQ-spørsmål. FAQ skal alltid stå helt nederst, uten egen Markdown-overskrift over komponenten. Svarene skal være korte, konkrete og ikke gjenta hele avsnitt fra innlegget.
- Ikke lag nye komponenter hvis eksisterende komponenter dekker behovet godt nok.
- Foretrekk små lokale forbedringer fremfor nye abstraksjoner.

## Bilder

Følg reglene i [src/content/blog/README.md](src/content/blog/README.md):

- Automatiserte yrke/lønn-innlegg skal ikke lage eller generere egne bilder.
- Sett likevel `coverImage` til en full artikkelspesifikk sti under `/blogg/<slug>/`, for eksempel `coverImage: "/blogg/hva-er-lonnen-til-en-lege/lege-lonn.png"`.
- Bruk et beskrivende filnavn basert på yrket, for eksempel `lege-lonn.png`, `psykolog-lonn.png` eller `vernepleier-lonn.png`.
- Bruk en konkret `coverImageAlt` som beskriver det planlagte hero-bildet.
- Opprett mappen `public/blogg/<slug>/` som tilsvarer `coverImage`-stien.
- Ikke opprett bildefilen eller generer bilde. Brukeren legger inn bildet selv.
- Hvis brukeren eksplisitt ber om egne bilder, gjelder navngivningen under:
- hero-bilde: `yrke-lonn.*` - yrke er det sentrale temaet i innlegget, og lønn er det sentrale temaet i innlegget. Eksempel: `psykolog-lonn.*`
- vanlige bilder: `inline-1.*`, `inline-2.*`
- figurer og grafer: `figure-1.*`, `figure-2.*`

Anbefalt størrelse:

- hero-bilde: `1600 x 1000 px`
- bilder i innlegg: rundt `1200 px` bredde

Bruk beskrivende `alt`-tekst når bildet settes inn i MDX. Sett også `coverImageAlt` i frontmatter med en kort, konkret beskrivelse av selve hero-bildet. Bloggbilder får automatisk en liten grå bildetekst under bildet. For MDX-bilder bygger første setning på `alt`-teksten, og for hero-bilder bygger den på `coverImageAlt`.

## Ferdigdefinisjon

Et blogginnlegg regnes bare som ferdig når:

- MDX-filen finnes i `src/content/blog/`
- frontmatter følger eksisterende format
- `title`, `description`, `seoTitle`, `seoDescription`, `slug` og `coverImage` er satt
- mappen under `public/blogg/<slug>/` finnes for `coverImage`-stien
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

