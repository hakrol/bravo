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
- Når et tema har `FAQ`, skal hvert punkt være et konkret spørsmål som skal inkluderes i innleggets FAQ-seksjon. Codex skal skrive korte, presise svar basert på innleggets datagrunnlag og plassere FAQ-en naturlig mot slutten av innlegget, vanligvis før oppsummeringen.
- Ikke legg inn generiske nøkkeltallstabeller som bare gjentar tall fra brødteksten. Bruk tabeller kun når det er en del av instruksen. 

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


Bruk `Diagrammer` og `FAQ` på samme måte som `Overskrifter`, `Interne lenker` og `Eksterne lenker`: det er en konkret bestilling, ikke bare et forslag. For `Diagrammer` fyller du bare inn diagramtypen. For `FAQ` fyller du inn spørsmålene som skal besvares. Skill-reglene bestemmer komponent, plassering og datagrunnlag.

## Tema-kø

Bruk første ukryssede tema i listen under.

### Ikke startet

[ ] Butikksjef eller salgsleder: hvilket yrke lønner seg mest?

Tittel:
Butikksjef eller salgsleder: hvilket yrke lønner seg mest?

Beskrivelse:
Innlegget skal sammenligne butikksjefer med salgsledere og andre nærliggende lederyrker. Vinklingen er karriereorientert: leseren skal forstå hvordan butikksjefrollen plasserer seg lønnsmessig blant andre leder- og salgsyrker. Artikkelen bør ikke bare handle om høyest lønn, men også om rolleforskjeller, ansvar og mulige karriereveier.

Overskrifter:

* Hva gjør en butikksjef?
* Hva gjør en salgsleder?
* Lønn: butikksjef sammenlignet med salgsleder
* Andre relaterte yrker å sammenligne med
* Kjønnsforskjeller i lønn
* Hvilket yrke passer best som neste steg?

Diagrammer:

* Kjønnsdelt lønnskort
* Boblediagram
* Søkbar yrkesliste
* Redaksjonelt stolpediagram

FAQ:

* Tjener butikksjefer eller salgsledere mest?
* Hva er forskjellen på butikksjef og salgsleder?
* Hvilke yrker ligner på butikksjef?
* Hvilke lederyrker innen salg har høyest lønn?
* Hvor mye tjener en butikksjef i året?
* Er butikksjef en god vei videre innen salg og varehandel?

Interne lenker:

* /yrke/butikkavdelingssjefer-lonn

Eksterne lenker:

* https://utdanning.no/yrker/beskrivelse/butikksjef
* https://utdanning.no/yrker/beskrivelse/salgssjef


- [ ] Automatikere: lønn, arbeidsmarked og relaterte yrker

Tittel:
Automatikere: lønn, arbeidsmarked og relaterte yrker

Beskrivelse:
Innlegget skal forklare hvorfor automatikere skiller seg ut blant tekniske fag: relativt høy lønn, tydelig kjønnsforskjell i lønnstallene og et arbeidsmarked som kan sammenlignes med flere elektro- og industrifag. Ta med yrkesbeskrivelsen tidlig, og bruk deretter lønn, lønnsfordeling, antall lønnstakere, alder og relaterte yrker til å bygge en helhetlig artikkel. Siden automatikere allerede er et høyere lønnet håndverksyrke, bør artikkelen vise både nivå, spredning og sammenligning.

Overskrifter:

* Hva tjener automatikere?
* Hva gjør en automatiker?
* Lønn for kvinner og menn
* Hvor høy er lønnen sammenlignet med andre tekniske fag?
* Lønnsfordeling: hvor stort er spennet?
* Arbeidsmarked, alder og antall ansatte

Diagrammer:

* Kjønnsdelt lønnskort
* Redaksjonelt stolpediagram
* Boblediagram
* Femårs lønnsutvikling

FAQ:

* Hva er timelønnen til en automatiker?
* Hva er årslønnen til en automatiker?
* Tjener automatikere mer enn elektrikere?
* Hvor stor er lønnsforskjellen mellom kvinner og menn blant automatikere?
* Hvor mange jobber som automatikere?
* Hvilke yrker er mest relevante å sammenligne med automatikere?

Interne lenker:

* /yrke/automatikere-lonn
* /yrke/energimontorer-lonn
* /yrke/elektrikere-lonn
* /yrke/serviceelektronikere-lonn
* /yrke/anleggsmaskin-og-industrimekanikere-lonn

Eksterne lenker:

* https://utdanning.no/yrker/beskrivelse/automatiker

- [ ] Hvor mye tjener glassarbeidere sammenlignet med lignende yrker?

Tittel:
Hvor mye tjener glassarbeidere sammenlignet med lignende yrker?

Beskrivelse:
Innlegget skal bruke sammenligning som hovedgrep. Start med yrkesbeskrivelsen og lønnen for glassarbeidere, men la artikkelen forklare hvordan lønnen ser ut ved siden av gulv- og flisleggere, isolatører, taktekkere, rørleggere og andre nærliggende byggfag. Kjønnsdelt lønnskort skal være med, men teksten må være presis på at egne kvinnetall kan mangle eller være skjermet dersom datagrunnlaget er for lite. Bruk lønnsfordeling og antall lønnstakere for å gjøre sammenligningen mer konkret.

Overskrifter:

* Hva tjener glassarbeidere?
* Hva gjør en glassarbeider?
* Slik er lønnsnivået sammenlignet med lignende byggyrker
* Lønnsfordeling blant glassarbeidere
* Hvor mange jobber som glassarbeidere?

Diagrammer:

* Kjønnsdelt lønnskort
* Boblediagram
* Redaksjonelt stolpediagram
* Søkbar yrkesliste

FAQ:

* Hva er månedslønnen til glassarbeidere?
* Hva er årslønnen til en glassarbeider?
* Hva er timelønnen til en glassarbeider?
* Finnes det egne lønnstall for kvinnelige glassarbeidere?
* Tjener glassarbeidere mer enn gulv- og flisleggere?
* Hvilke yrker bør glassarbeidere sammenlignes med?

Interne lenker:

* /yrke/glassarbeidere-lonn
* /yrke/gulv-og-flisleggere-lonn
* /yrke/isolatorer-mv-lonn
* /yrke/taktekkere-lonn
* /yrke/rorleggere-og-vvs-montorer-lonn

Eksterne lenker:

* https://utdanning.no/yrker/beskrivelse/glassfagarbeider

- [ ] Førtrykkere: lønn og lønnsutvikling

Tittel:
Lønn og lønnsutvikling blant førtrykkere

Beskrivelse:
Innlegget skal handle om et mindre og mer spesialisert grafisk yrke. Vinklingen bør være at førtrykkere ikke bare skal vurderes på lønnsnivå, men også på utviklingen i antall lønnstakere, alder og relaterte grafiske yrker. Ta med yrkesbeskrivelsen, lønn for kvinner og menn, lønnsfordeling og femårs utvikling. Artikkelen bør forklare tallene nøkternt og unngå å gjøre brede bransjepåstander hvis datagrunnlaget ikke støtter det.

Overskrifter:

* Hva tjener førtrykkere?
* Hva gjør en førtrykker?
* Lønn for kvinner og menn
* Lønnsutvikling og reallønn
* Antall lønnstakere og gjennomsnittsalder
* Førtrykkere sammenlignet med andre grafiske yrker

Diagrammer:

* Kjønnsdelt lønnskort
* Femårs lønnsutvikling
* Redaksjonelt stolpediagram
* Søkbar yrkesliste

FAQ:

* Hva er månedslønnen til førtrykkere?
* Hva blir årslønnen til en førtrykker?
* Hva er timelønnen til en førtrykker?
* Er det lønnsforskjell mellom kvinner og menn blant førtrykkere?
* Hvor mange jobber som førtrykkere?
* Hvilke yrker ligner på førtrykkere?

Interne lenker:

* /yrke/fortrykkere-lonn
* /yrke/trykkere-lonn
* /yrke/innbindere-mv-lonn
* /yrke/andre-kunsthandverkere-lonn
* /yrke/presisjonsinstrumentmakere-og-reparatorer-lonn

Eksterne lenker:

* https://utdanning.no/yrker/beskrivelse/mediegrafiker

- [ ] Gulv- og flisleggere: lønnstallene du bør kjenne til

Tittel:
Gulv- og flisleggere: lønnstallene du bør kjenne til

Beskrivelse:
Innlegget skal være en praktisk oversikt over de viktigste lønnstallene for gulv- og flisleggere: månedslønn, årslønn, timelønn, lønnsfordeling, antall lønnstakere og alder. Yrkesbeskrivelsen skal forklare arbeidet med gulv, fliser, underlag og finish. Siden egne kvinnetall i lønnsfordelingen kan mangle, skal artikkelen ikke overtolke kjønnsforskjeller i lønn, men heller bruke arbeidsmarkedstallene til å vise at yrket er svært mannsdominert. Sammenligningen bør gå mot glassarbeidere, isolatører, taktekkere, rørleggere og kuldemontører.

Overskrifter:

* Hva tjener gulv- og flisleggere?
* Hva gjør en gulv- og flislegger?
* Månedslønn, årslønn og timelønn
* Lønnsfordeling: hva viser spennet?
* Antall ansatte, alder og kvinneandel
* Lønn sammenlignet med nærliggende byggfag

Diagrammer:

* Kjønnsdelt lønnskort
* Redaksjonelt stolpediagram
* Boblediagram
* Søkbar yrkesliste

FAQ:

* Hva er månedslønnen til gulv- og flisleggere?
* Hva er årslønnen til en gulv- og flislegger?
* Hva er timelønnen til en gulv- og flislegger?
* Finnes det egne lønnstall for kvinnelige gulv- og flisleggere?
* Hvor mange jobber som gulv- og flisleggere?
* Tjener gulv- og flisleggere mer enn glassarbeidere?

Interne lenker:

* /yrke/gulv-og-flisleggere-lonn
* /yrke/glassarbeidere-lonn
* /yrke/isolatorer-mv-lonn
* /yrke/taktekkere-lonn
* /yrke/kuldemontorer-mv-lonn

Eksterne lenker:

* https://utdanning.no/yrker/beskrivelse/mur-og_flislegger

### Ferdig

- [x] Hvor gamle er butikksjefer – og hva sier det om yrket? - `src/content/blog/hvor-gamle-er-butikksjefer.mdx` - 2026-07-12

- [x] Hvor mye tjener en butikksjef sammenlignet med butikkmedarbeidere? - `src/content/blog/hvor-mye-tjener-en-butikksjef-sammenlignet-med-butikkmedarbeidere.mdx` - 2026-07-12

- [x] Lønnsforskjeller mellom kvinnelige og mannlige butikksjefer - `src/content/blog/lonnsforskjeller-mellom-kvinnelige-og-mannlige-butikksjefer.mdx` - 2026-07-12

- [x] Slik har lønnen utviklet seg for butikksjefer - `src/content/blog/slik-har-lonnen-utviklet-seg-for-butikksjefer.mdx` - 2026-07-05

- [x] Slik har lønnen utviklet seg for energimontører - `src/content/blog/slik-har-lonnen-utviklet-seg-for-energimontorer.mdx` - 2026-07-05

- [x] Lønn, alder og kjønnsforskjeller blant bilmekanikere - `src/content/blog/lonn-alder-og-kjonnsforskjeller-blant-bilmekanikere.mdx` - 2026-07-05

- [x] Hva tjener en betongarbeider? - `src/content/blog/hva-tjener-en-betongarbeider.mdx` - 2026-07-05

- [x] De 10 yrkene med størst lønnsforskjell mellom kvinner og menn - `src/content/blog/de-10-yrkene-med-storst-lonnsforskjell-mellom-kvinner-og-menn.mdx` - 2026-07-04

- [x] Dette er årslønnen til bygningsarbeidere - `src/content/blog/dette-er-arslonnen-til-bygningsarbeidere.mdx` - 2026-06-21

- [x] Disse 10 yrkene tjener minst i Norge - `src/content/blog/disse-10-yrkene-tjener-minst-i-norge.mdx` - 2026-06-21

- [x] Dette er Norges vanligste yrker - `src/content/blog/dette-er-norges-vanligste-yrker.mdx` - 2026-06-18

- [x] Hvor mye tjener en konduktør? - `src/content/blog/hvor-mye-tjener-en-konduktor.mdx` - 2026-06-17

- [x] Hvilken måned betaler vi ikke skatt? - `src/content/blog/hvilken-maned-betaler-vi-ikke-skatt.mdx` - 2026-06-17

- [x] Er feriepenger alltid 12%? - `src/content/blog/er-feriepenger-alltid-12-prosent.mdx` - 2026-06-16

- [x] Skal man deles årslønn på 11 eller 12? - `src/content/blog/skal-man-dele-arslonn-pa-11-eller-12.mdx` - 2026-06-15

- [x] Hvilke yrker tjener over 1 million? - `src/content/blog/hvilke-yrker-tjener-over-1-million.mdx` - 2026-06-14

- [x] Hva er gjennomsnittlig lønnsvekst i Norge? - `src/content/blog/hva-er-gjennomsnittlig-lonnsvekst-i-norge.mdx` - 2026-06-14
- [x] Hva slags lærer tjener mest? - `src/content/blog/hva-slags-laerer-tjener-mest.mdx` - 2026-06-10
- [x] Hva er lønnen til en servitør? - `src/content/blog/hva-er-lonnen-til-en-servitor.mdx` - 2026-06-06
- [x] Hvor mye tjener en intensivsykepleier? - `src/content/blog/hvor-mye-tjener-en-intensivsykepleier.mdx` - 2026-05-31
- [x] Hva tjener bussjåfører og trikkeførere? - `src/content/blog/hva-tjener-bussjaforer-og-trikkeforere.mdx` - 2026-05-30
- [x] Hva er årslønnen til en maler? - `src/content/blog/hva-er-arslonnen-til-en-maler.mdx` - 2026-05-30
- [x] Hvor mye tjener en rørlegger i året? - `src/content/blog/hvor-mye-tjener-en-rorlegger-i-aret.mdx` - 2026-05-26
- [x] Hva er årslønnen til en vernepleier? - `src/content/blog/hva-er-arslonnen-til-en-vernepleier.mdx` - 2026-05-25
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
