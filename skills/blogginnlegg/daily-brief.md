# Daglig bloggbrief

Denne filen styrer den daglige bloggautomatiseringen. Den skal være kort og redaksjonell.

For generelle bloggstandarder, følg:

- `AGENTS.md`
- `PROJECT.MD`
- `skills/blogginnlegg/SKILL.md`
- `src/content/blog/README.md`

## Fast instruks

- Lag ett nytt blogginnlegg per kjøring.
- Bruk første ukryssede tema under `Tema-kø`.
- Ikke skriv flere innlegg samtidig.
- Ikke publiser direkte.
- Ikke installer nye biblioteker.
- Ikke refaktorer kode som ikke er relevant for blogginnlegget.

## Arbeidsflyt

- Skriv blogginnlegg direkte i Desktop/Bravo-prosjektet når automasjonen har tilgang til det.
- Hvis en midlertidig Codex-worktree brukes til utkast, skal alle tilhørende filer synkes samlet til Desktop/Bravo før temaet regnes som ferdig:
  - MDX-innlegg
  - frosne data-snapshots
  - filer under `public/blogg/<slug>/`
  - relevante komponentendringer
  - denne briefen
- Kryss bare av temaet når hele bloggpakken finnes i samme arbeidskopi.
- Legg til filsti og dato på samme linje når temaet krysses av.
- Ikke slett ferdige temaer.

Eksempel:

```md
- [x] Hvordan forberede seg til lønnssamtale - `src/content/blog/lonnssamtale-forberedelse.mdx` - 2026-04-29
```

## Redaksjonelle føringer

- Skriv på Norsk Bokmål.
- Skriv konkret, hjelpsomt og uten fluff.
- Bruk direkte `du`-språk når innlegget gir råd.
- Koble praktiske råd til lønnsdata når det er relevant.
- Bruk interne lenker bare når de hjelper leseren videre.
- La `description` fungere som en presis og engasjerende hook på bloggforsiden.

## Data

- Hvis innlegget bruker SSB-data, følg SSB-reglene i prosjektet.
- Hvis innlegget handler om en bestemt periode, bruk eller opprett et frosset snapshot.
- Ikke la historiske blogginnlegg lese direkte fra `latest`-data.
- Hvis tallgrunnlaget ikke er klart, lag et ikke-datadrevet innlegg eller noter tydelig hva som mangler.

## Tema-kø

Bruk første ukryssede tema i listen under.

### Ikke startet

- [x] Hva tjener sykepleiere og andre helsearbeidere? - `src/content/blog/hva-tjener-sykepleiere-og-andre-helsearbeidere.mdx` - 2026-05-02
- [ ] Hva er lønnen til en lege?
- [ ] Hva tjener en kirurg?
- [ ] Hvilket yrke tjener mest?
- [ ] Hvor mye tjener en psykolog?

### Ferdig

- [x] Hva tjener advokater og jurister? - `src/content/blog/hva-tjener-advokater-og-jurister.mdx` - 2026-05-01
