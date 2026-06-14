# NAV grunnbelop

Denne mappen beskriver hvordan Lønnsinnsikt henter og lagrer grunnbeløp fra NAV.
Dataene brukes som støttekilde ved innhold og beregninger der folketrygdens
grunnbeløp er relevant.

SSB er fortsatt hovedkilden for lønnsstatistikk. NAV-grunnbeløp skal brukes til
forklaringer, terskler og sammenligninger der G er riktig begrep.

## Kilde

Swagger:

```text
https://g.nav.no/api/v1/swagger_doc
```

Dokumenterte endepunkter:

```text
GET /api/v1/grunnbeloep
GET /api/v1/grunnbeloep?dato=YYYY-MM-DD
GET /api/v1/historikk/grunnbeløp
GET /api/v1/historikk/grunnbeløp?fra=YYYY-MM-DD
```

Historikk-endepunktet har norsk bokstav i URL-en. I kode brukes derfor
percent-encodet sti:

```text
/api/v1/historikk/grunnbel%C3%B8p
```

## Filer

- `src/lib/nav.ts`
  Klient, typer, normalisering og hjelpefunksjoner for NAV-grunnbeløp.

- `src/lib/nav-store.ts`
  Server-side lesing av frosset snapshot fra `src/lib/generated/`.

- `src/lib/nav-sync.ts`
  Synkroniseringsscript som henter historikk fra NAV og skriver snapshot.

- `src/lib/generated/nav-grunnbeloep-history.json`
  Frosset historikk som kan brukes av blogginnlegg og andre server-side
  funksjoner uten å gjøre direkte NAV-kall ved render.

## Snapshot-struktur

Snapshotet er lagret slik:

```ts
{
  version: 1;
  source: {
    name: "NAV";
    apiBaseUrl: string;
    swaggerUrl: string;
    endpoint: string;
    documentedEndpoint: string;
    downloadedAt: string;
  };
  notes: string[];
  count: number;
  latest: NavGrunnbeloep;
  entries: NavGrunnbeloep[];
}
```

Hver rad er normalisert til interne ASCII-felter:

```ts
{
  dato: string;
  grunnbeloep: number;
  grunnbeloepPerMaaned: number;
  gjennomsnittPerAar?: number;
  omregningsfaktor?: number;
  virkningstidspunktForMinsteinntekt?: string;
}
```

## Bruk

For frosset data i server-side kode:

```ts
import {
  getLatestStoredGrunnbeloep,
  getStoredGrunnbeloepForDate,
  getStoredGrunnbeloepHistory,
} from "@/lib/nav-store";
```

For live-kall til NAV:

```ts
import { getRemoteGrunnbeloep, getRemoteGrunnbeloepHistory } from "@/lib/nav";
```

Historiske blogginnlegg og andre publiserte artikler bør bruke frosset snapshot,
ikke live-kall, slik at tallene ikke endrer seg uten at innholdet oppdateres.

## Synkronisering

Kjør:

```text
npm run nav:sync
```

Scriptet henter hele historikken fra NAV og skriver
`src/lib/generated/nav-grunnbeloep-history.json`.

## Kjente begrensninger

- Swagger-modellen beskriver noen felter med snake_case, mens API-responsen kan
  bruke camelCase. Klienten normaliserer begge varianter.
- Eldre historiske rader kan mangle gjennomsnitt per år og virkningstidspunkt for
  minsteinntekt.
- NAV-grunnbeløp er ikke SSB-lønnsstatistikk og skal ikke presenteres som
  lønnsdata.
