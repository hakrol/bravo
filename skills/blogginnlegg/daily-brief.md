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
- Hvis `Ikke startet` er tom, skal ingen nye innlegg lages.
- Når et tema har `Diagrammer`, skal hvert punkt være en enkel diagramtype som skal inkluderes i innlegget hvis datagrunnlaget finnes eller kan hentes etter bloggskillens regler.
- Hvis et oppgitt diagram ikke kan lages, skal Codex forklare hvorfor før temaet regnes som ferdig.

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
- Flytt temaet til "Ferdig".
- Ikke slett ferdige temaer.

Eksempel:

```md
- [x] Hvordan forberede seg til lønnssamtale - `src/content/blog/lonnssamtale-forberedelse.mdx` - 2026-04-29
```

## Mal for nye temaer

Legg nye bloggtemaer inn under `Ikke startet` med denne strukturen når du vil styre innholdet mer presist:

```md
- [ ] Hva tjener en eksempelrolle?
  Tittel:
  Hva tjener en eksempelrolle?

  Beskrivelse:
  Innlegget skal svare tydelig på hovedspørsmålet og forklare hvilke faktorer som påvirker lønnen.

  Overskrifter:
  - Hva tjener en eksempelrolle?
  - Hva er timelønnen til en eksempelrolle?
  - Hva påvirker lønnen?

  Diagrammer:
  - Kjønnsdelt lønnskort
  - Boblediagram
  - Søkbar yrkesliste

  Interne lenker:
  - /yrke/eksempelrolle-lonn

  Eksterne lenker:
  - https://www.ssb.no/
```

Bruk `Diagrammer` på samme måte som `Overskrifter`, `Interne lenker` og `Eksterne lenker`: det er en konkret bestilling, ikke bare et forslag. Fyll bare inn diagramtypen. Skill-reglene bestemmer komponent, plassering og datagrunnlag.

## Tema-kø

Bruk første ukryssede tema i listen under.

### Ikke startet

### Ferdig

- [x] Hvor mye tjener piloter? - `src/content/blog/hvor-mye-tjener-piloter.mdx` - 2026-05-21
- [x] Hva tjener en snekker? - `src/content/blog/hva-tjener-en-snekker.mdx` - 2026-05-14
- [x] Hva tjener en brannmann? - `src/content/blog/hva-tjener-en-brannmann.mdx` - 2026-05-14
- [x] Hva tjener en politi? - `src/content/blog/hva-tjener-en-politi.mdx` - 2026-05-12
- [x] Hva tjener en elektriker? - `src/content/blog/hva-tjener-en-elektriker.mdx` - 2026-05-10
- [x] Hva tjener advokater og jurister? - `src/content/blog/hva-tjener-advokater-og-jurister.mdx` - 2026-05-19
- [x] Hva tjener sykepleiere og andre helsearbeidere? - `src/content/blog/hva-tjener-sykepleiere-og-andre-helsearbeidere.mdx` - 2026-05-02
- [x] Hva er lønnen til en lege? - `src/content/blog/hva-er-lonnen-til-en-lege.mdx` - 2026-05-03
- [x] Hva tjener en kirurg? - `src/content/blog/hva-tjener-en-kirurg.mdx` - 2026-05-03
- [x] Hvilket yrke tjener mest? - `src/content/blog/best-betalte-yrker-i-2025.mdx` - 2026-05-06
- [x] Hvor mye tjener en psykolog? - `src/content/blog/hvor-mye-tjener-en-psykolog.mdx` - 2026-05-06
