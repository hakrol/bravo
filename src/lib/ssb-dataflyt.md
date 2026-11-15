# SSB-dataflyt og oppdatering av tall

Denne filen forklarer hvordan SSB-data håndteres i prosjektet, hvilke filer som blir oppdatert når du kjører `npm run ssb:sync`, og hva du må gjøre for at nye tall skal vises på nettsiden.

## Kortversjonen

Prosjektet leser normalt ikke data direkte fra SSB ved hver sidevisning. I stedet brukes ferdiggenererte JSON-filer i `src/lib/generated`.

Når du kjører `npm run ssb:sync`:

- hentes nye data fra SSB
- JSON-filene i `src/lib/generated` oppdateres
- manifestet oppdateres
- genererte visningsmodeller for yrkessider oppdateres

Hvis SSB har publisert nye tall i tabellene vi bruker, vil filene bli oppdatert med nyeste tilgjengelige data.

## Hvordan systemet fungerer

### 1. Vanlig drift

Applikasjonen bruker normalt lokalt genererte filer, ikke live-kall mot SSB.

Dette styres i praksis av:

- `src/lib/queries.ts`
- `src/lib/ssb-store.ts`

Når `SSB_DATA_SOURCE` ikke er satt til `"remote"`, brukes lokale JSON-filer fra `src/lib/generated`.

### 2. Synk mot SSB

Scriptet `npm run ssb:sync` kjører:

- `src/lib/ssb-sync.ts`

Under denne kjøringen settes `SSB_DATA_SOURCE = "remote"`, slik at scriptet henter data direkte fra SSB og skriver nye filer lokalt.

### 3. Ferdige sider

Flere sider, spesielt yrkessidene, bygger på ferdiggenererte filer. Det betyr at nye tall ikke blir synlige bare fordi SSB har publisert dem. Først må de hentes inn og skrives til de lokale JSON-filene.

## Hvilke filer blir oppdatert av `npm run ssb:sync`

Scriptet oppdaterer datasett i:

- `src/lib/generated/occupation-latest-average.json`
- `src/lib/generated/occupation-latest-median.json`
- `src/lib/generated/occupation-previous-median.json`
- `src/lib/generated/occupation-average-timeseries.json`
- `src/lib/generated/occupation-median-timeseries.json`
- `src/lib/generated/occupation-distribution-latest.json`
- `src/lib/generated/occupation-sector-salary-latest.json`
- `src/lib/generated/occupation-sector-work-relations-latest.json`
- `src/lib/generated/occupation-contracted-distribution-latest.json`
- `src/lib/generated/occupation-supplement-timeseries.json`
- `src/lib/generated/occupation-supplement-median-latest.json`
- `src/lib/generated/occupation-workforce-timeseries.json`
- `src/lib/generated/occupation-age-timeseries.json`
- `src/lib/generated/occupation-working-hours-timeseries.json`
- `src/lib/generated/apprenticeship-latest-median.json`
- `src/lib/generated/apprenticeship-previous-median.json`
- `src/lib/generated/apprenticeship-median-timeseries.json`
- `src/lib/generated/apprenticeship-distribution-latest.json`
- `src/lib/generated/inflation-quarter-series.json`
- `src/lib/generated/occupation-quarterly-salary-timeseries.json`
- `src/lib/generated/norway-quarterly-salary-timeseries.json`

I tillegg oppdateres:

- `src/lib/generated/manifest.json`
- `src/lib/generated/occupation-detail-view-models/index.json`
- alle JSON-filer i `src/lib/generated/occupation-detail-view-models/`
- `src/lib/generated/apprenticeship-detail-view-models/index.json`
- alle JSON-filer i `src/lib/generated/apprenticeship-detail-view-models/`

## Kvartalsgrunnlag for reallønn og alder

Synken henter hele den tilgjengelige historikken for følgende nye uttrekk:

| Fil | Tabell | Utvalg |
| --- | --- | --- |
| `occupation-quarterly-salary-timeseries.json` | 11658 | Alle yrkeskoder, inkludert «Alle yrker». Alle aldre, under 40 år, 40–54 år og 55 år eller eldre. |
| `norway-quarterly-salary-timeseries.json` | 11652 | Hele landet (`Region=Ialt`). Alle aldre, under 25 år, 25–39 år, 40–54 år, 55–66 år og 67 år eller eldre. |

Begge uttrekk inneholder begge kjønn samlet, menn og kvinner, og fire lønnsmål:

- `GjAvtaltMdlonn`: gjennomsnittlig avtalt månedslønn
- `GjMdTotal`: gjennomsnittlig månedslønn
- `MedianAvtMndLonn`: median avtalt månedslønn
- `MedianMndLonn`: median månedslønn

Disse filene bruker kompakt JSON-stat2 (`format: "json-stat2"`) med en `chunks`-liste.
Store uttrekk deles etter SSBs cellegrense. Koder, dimensjonsrekkefølge, nullverdier,
statusmarkeringer og kildeinformasjon beholdes i hver del. `rowCount` i manifestet
er samlet antall observasjoner, inkludert nullverdier. Bruk
`getStoredQuarterlySalaryDataset` i `src/lib/ssb-store.ts` for å lese disse filene.
De øvrige datasettene beholder formatet med `rows` og leses med `getStoredDataset`.

De nye datasettene inneholder nominell lønn. Reallønn må beregnes med KPI.
`inflation-quarter-series.json` inneholder månedlig KPI, selv om filnavnet sier
«quarter». Lønnstallene gjelder midtmåneden i kvartalet; valg av KPI-periode må
derfor være tydelig når en ny reallønnsvisning lages. Eksisterende sider bruker
kvartalsgjennomsnitt av KPI. Denne synken endrer ikke beregningsmetoden deres.

Ikke bland disse kvartalstallene med den årlige medianserien fra tabell 11418.
`occupation-age-timeseries.json` inneholder gjennomsnittsalder, ikke lønn etter alder.
Bruk SSBs samlede observasjon for landstall; ikke beregn landets median fra yrkesmedianer.

### Kontroll etter kvartalssynk

1. Kontroller siste periode i selve observasjonene, ikke bare tabelltittel eller oppdateringsdato.
2. Kontroller alle fire lønnsmål, alle aldersgrupper og alle tre kjønnsvalg i begge nye filer.
3. Kontroller at delene samlet dekker alle valgte yrker og perioder uten overlapp eller hull.
4. Behold manglende og skjermede tall som `null` med tilhørende status. Ikke erstatt dem med null kroner.
5. Kontroller faktisk tidsdekning per lønnsmål og aldersgruppe; tabellens startår garanterer ikke tall i alle kombinasjoner.
6. Sammenlign et utvalg verdier med SSB, samt «alle aldre»/avtalt gjennomsnittslønn mot den eksisterende kvartalsfilen.
7. Kontroller at KPI dekker kvartalets referansemåned og alle tre måneder dersom kvartalsgjennomsnitt brukes.
8. Kjør TypeScript- og lintkontroll, og kontroller genererte yrkes- og lærlingvisninger før eventuell publisering.

## Yrkeskort på `/yrker`

Yrkeskortene på `/yrker` bruker også de genererte snapshot-filene. Medianlønn,
lønnsvekst, arbeidstakervekst, snittalder og lønnsforskjell mellom kvinner og
menn beregnes fra lokale filer i `src/lib/generated`.

Dette betyr at kortene ikke oppdateres direkte når SSB publiserer nye tall. Nye
tall blir først synlige etter at `npm run ssb:sync` er kjørt, de oppdaterte
JSON-filene er committet, og en ny versjon er deployet.

## Hva du må gjøre når SSB publiserer nye tall

### Hvis du jobber lokalt

1. Kjør `npm run ssb:sync`
2. Kontroller at filene i `src/lib/generated` er oppdatert
3. Test at sidene viser forventede tall
4. Commit endringene
5. Deploy den nye versjonen

### Hvis du vil ha nye tall ut i produksjon

Du må gjøre mer enn bare å kjøre scriptet lokalt.

For at brukerne skal se nye tall i produksjon må:

1. `npm run ssb:sync` kjøres
2. de oppdaterte JSON-filene bli med i en deploy

Hvis synken bare kjøres på din maskin uten commit og deploy, ser ikke brukerne de nye tallene.

## Viktig å vite

### `npm run ssb:sync` henter ikke "alt" fra SSB

Scriptet henter bare de tabellene og uttrekkene som er definert i `src/lib/ssb-sync.ts`.

Det betyr:

- ja, det henter alt prosjektet vårt er satt opp til å bruke
- nei, det henter ikke alle mulige tabeller fra SSB

### Hvis SSB ikke har publisert nye tall ennå

Da vil scriptet fortsatt kjøre, men filene blir bare regenerert med samme eller tilsvarende innhold som før.

### Cache og revalidate

Noen deler av koden bruker cache-mekanismer i Next.js, men hovedflyten for SSB-data i dette prosjektet er fortsatt de genererte JSON-filene.

Det viktigste er derfor:

- synk data
- deploy oppdaterte filer

## Anbefalt rutine

Ved nye kvartalstall:

1. Kjør `npm run ssb:sync`
2. Se over endringene i `src/lib/generated`
3. Test et utvalg sider
4. Commit og deploy

## Anbefalt videre forbedring

For å sikre at tallene alltid er oppdatert bør vi automatisere dette med en planlagt jobb, for eksempel:

- GitHub Actions på schedule
- Vercel Cron
- annen CI-jobb som kjører `npm run ssb:sync` og deployer ved endringer

Da slipper manuell oppfølging hver gang SSB publiserer nye tall.
