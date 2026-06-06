# Utdanning.no yrkesbeskrivelser

Denne mappen inneholder yrkesbeskrivelser fra Utdanning.no. Dataene brukes som
en redaksjonell og faglig støttekilde når Lønnsinnsikt forklarer hva et yrke
innebærer, hvilke arbeidsoppgaver som er vanlige, hvor yrket finnes, og hvilken
utdanning som normalt leder inn i yrket.

SSB-data er fortsatt hovedkilden for lønn, antall lønnstakere, arbeidsforhold,
perioder og yrkeskoder. Utdanning.no skal brukes til yrkesforklaring, ikke som
fasit for lønnsstatistikk.

## Filer

- `yrkesbeskrivelser.json`
  Frosset nedlasting av Utdanning.no sitt API for yrkesbeskrivelser.

- `docs.md`
  Denne dokumentasjonen.

## Kilde

Indeks:

```text
https://utdanning.no/api/v1/data_norge--yrkesbeskrivelse
```

Indeksen returnerer bare en liste med detalj-URL-er. Selve yrkesbeskrivelsene
ligger på hver enkelt URL, for eksempel:

```text
https://utdanning.no/api/v1/data_norge--yrkesbeskrivelse/y_kreftsykepleier
```

Utdanning.no oppgir yrkesbeskrivelsene som offentlige data. Datasettet bruker
blant annet `sammenligning_id`, `styrk98`, `styrk08`, `body`, `yrke_hvor_jobber`
og `yrke_utdanning`.

## Struktur i `yrkesbeskrivelser.json`

Filen er lagret som et wrapper-objekt:

```ts
{
  source: {
    name: string;
    indexUri: string;
    license: string;
    downloadedAt: string;
  };
  notes: string[];
  count: number;
  successfulCount: number;
  failedCount: number;
  descriptions: UtdanningOccupationDescription[];
}
```

Hver rad i `descriptions` er én detaljert yrkesbeskrivelse fra Utdanning.no,
med `sourceUri` lagt til lokalt slik at vi kan spore hvilket endepunkt raden kom
fra.

Viktige felter:

- `title`
  Redaksjonell yrkestittel hos Utdanning.no.

- `sammenligning_id`
  Stabil ID som vanligvis starter med `y_`, for eksempel
  `y_kreftsykepleier`.

- `body.summary`
  Kort oppsummering av yrket.

- `body.value`
  Hovedbeskrivelsen som HTML. Denne kan inneholde avsnitt, lenker, overskrifter
  og punktlister med arbeidsoppgaver.

- `arbeidsoppgave`
  Kan være tom selv om arbeidsoppgavene finnes i `body.value`. Ikke bruk dette
  feltet alene som fasit.

- `yrke_hvor_jobber`
  HTML med typiske arbeidssteder.

- `yrke_utdanning`
  HTML med utdanningsvei.

- `yrke_personegenskaper`
  HTML med personlige egenskaper.

- `yrke_sist_kvalitetssikret`
  Dato for siste kvalitetssikring hos Utdanning.no når feltet finnes.

- `styrk98`
  Kobling til 7-sifrede yrkeskoder fra yrkeskatalogen der Utdanning.no har
  gjort en kobling.

- `styrk08`
  Kobling til 4-sifret STYRK-08-gruppe der den finnes.

## Forholdet til `src/lib/ssb/426.csv`

`src/lib/ssb/426.csv` er yrkeskatalogen med 7-sifrede STYRK98-baserte
yrkeskoder/stillingstitler. Utdanning.no har færre, redaksjonelle
yrkesbeskrivelser enn det finnes detaljerte yrkeskoder i yrkeskatalogen.

Modellen er derfor ikke:

```text
én 7-sifret yrkeskode -> én Utdanning.no-beskrivelse
```

Den er oftere:

```text
flere 7-sifrede yrkeskoder -> én Utdanning.no-beskrivelse
```

Eksempel:

```text
2230114 KREFTSYKEPLEIER    -> y_kreftsykepleier
2230103 ONKOLOGISYKEPLEIER -> y_kreftsykepleier
2230101 INTENSIVSYKEPLEIER -> y_intensivsykepleier
2230123 ANESTESISYKEPLEIER -> y_anestesisykepleier
```

For lønnsstatistikk vil disse ofte inngå i samme STYRK-08-gruppe, for eksempel:

```text
2221 Spesialsykepleiere
```

Et blogginnlegg om `KREFTSYKEPLEIER` kan derfor bruke Utdanning.no til å forklare
arbeidsoppgaver, men må være tydelig på at SSB-lønnstall ofte gjelder
yrkesgruppen `2221 Spesialsykepleiere`, ikke nødvendigvis kreftsykepleiere
alene.

## Anbefalt bruk

Når prosjektet trenger en yrkesbeskrivelse:

1. Finn aktuell 7-sifret yrkeskode i `src/lib/ssb/426.csv`.
2. Søk etter samme kode i `descriptions[].styrk98`.
3. Bruk Utdanning.no-beskrivelsen hvis det finnes et klart treff.
4. Hvis flere beskrivelser matcher, velg den som passer best til faktisk
   stillingstittel og arbeidsoppgaver.
5. Hvis ingen Utdanning.no-beskrivelse finnes, fall tilbake til 4-sifret
   STYRK-08-gruppe fra `426.csv`.
6. Hvis også dette blir for grovt, bruk intern kortbeskrivelse fra
   `src/lib/occupation-descriptions.ts`.

For blogginnlegg bør Utdanning.no brukes som støttekilde for:

- hva yrket innebærer
- vanlige arbeidsoppgaver
- typiske arbeidssteder
- utdanningsvei
- autorisasjon/lisens når det er relevant
- kvalitetssikringsdato og faglig kvalitetssikrer når dette finnes

Ikke presenter Utdanning.no-beskrivelser som SSB-data.

## Kjente begrensninger

- Utdanning.no dekker ikke alle 7-sifrede yrkeskoder i `426.csv`.
- Noen beskrivelser dekker flere stillingstitler.
- Noen stillingstitler kan være relevante for mer enn én beskrivelse.
- `body.value` er HTML og må parses eller renses før tekst brukes direkte i UI,
  blogginnlegg eller generert innhold.
- `arbeidsoppgave` kan være tomt selv når `body.value` inneholder en tydelig
  arbeidsoppgaveliste.
- Første nedlasting ga 604 URL-er, men 5 detalj-URL-er returnerte 403 og ligger
  derfor i JSON-filen med `fetchError`.

## Lisens og kildehenvisning

Når innhold fra Utdanning.no brukes i publisert tekst, bør kilden nevnes i
kildeavsnitt eller naturlig i teksten.

Eksempel:

```text
Yrkesbeskrivelsen bygger på Utdanning.no, siden for kreftsykepleier.
```

Ikke kopier store tekstblokker ukritisk inn i blogginnlegg. Bruk beskrivelsene
som kildegrunnlag, og skriv om til Lønnsinnsikt sin konkrete, nøkterne stil.
