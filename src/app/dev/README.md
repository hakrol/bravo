# Utviklingsområde

Dette området brukes til interne prototyper, grafskisser og eksperimenter som ikke skal være en del av produksjonsopplevelsen ennå.

## Hvor ligger det?

- `/dev` er startsiden for utviklingsområdet.
- `/dev/grafer` er grafverkstedet.
- Nye dev-sider kan legges under `src/app/dev/`, for eksempel `src/app/dev/ssb/page.tsx`.

## Produksjonssperre

Hele området er sperret i `src/app/dev/layout.tsx`.

`isDevAreaAvailable()` i `src/lib/dev-area.ts` gjør området tilgjengelig når:

- `NODE_ENV` ikke er `production`
- `ENABLE_DEV_AREA` ikke er satt til `false`

I produksjon svarer området med 404 via `notFound()`.

## Når skal dette brukes?

Bruk `/dev` når du vil:

- teste en graf før den blir en gjenbrukbar komponent
- sammenligne ulike måter å vise SSB-data på
- lage en rask UI-prototype
- undersøke layout, tabeller, filtre eller interaksjoner før de flyttes til en ordentlig side

Ikke bruk `/dev` til:

- innhold som skal indekseres av søkemotorer
- admin-funksjoner, publisering eller innlogging
- API-logikk som bør ligge i `/lib`
- komponenter som allerede er klare for produksjon

## Hvordan prompte Codex

Når du vil at noe skal bygges som en intern prototype, skriv tydelig at det skal ligge i dev-området.

Eksempler:

```text
Lag dette som en dev-prototype under /dev/grafer. Det skal ikke lenkes fra vanlig navigasjon eller være tilgjengelig i produksjon.
```

```text
Bygg en intern testside i /dev for å sammenligne tre ulike grafdesign basert på samme lønnsdata.
```

```text
Dette er kun for utviklingsområdet. Ikke flytt det til vanlige komponenter ennå, og ikke gjør det synlig på forsiden.
```

```text
Lag en rask prototype i /dev som bruker eksisterende SSB-funksjoner fra /lib. Ikke lag rå API-kall i komponenten.
```

Når en prototype er klar for produksjon, bruk en egen prompt som sier at den skal flyttes ut av dev-området:

```text
Denne prototypen i /dev/grafer er klar. Flytt den til en gjenbrukbar komponent i /components og bruk den på riktig produksjonsside.
```

## Regler for kode i dev-området

- Følg fortsatt prosjektreglene i `AGENTS.md`.
- Bruk eksisterende datalogikk i `/lib`.
- Ikke installer nye pakker uten at det er nødvendig.
- Hold prototyper små og tydelig avgrenset.
- Ikke legg lenker til `/dev` i vanlig navigasjon.
- Flytt produksjonsklar kode ut av `/dev` før den brukes på offentlige sider.
