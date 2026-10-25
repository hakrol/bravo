# Utviklingsområde

Dette området brukes til interne prototyper, grafskisser og eksperimenter som ikke skal være en del av produksjonsopplevelsen ennå.

## Hvor ligger det?

- `/dev` er startsiden for utviklingsområdet.
- `/dev/grafer` er grafverkstedet.
- Øverst på `/dev/grafer` ligger «Interaktiv lønnsforskjell» med valg mellom 10, 5 og 1 år med testdata. Den eksisterende fordelingsgrafen ligger under.
- `/utvikling-diagram` samler nye diagrammer med én fane per diagram og er lenket fra `/dev`.
- Fanene «Interaktiv lønnsutvikling», «Interaktiv lønnsforskjell» og «Interaktiv reallønn» lar deg bytte mellom diagrammene på samme side.
- Den samme fanekomponenten finnes også på `/dev/grafer`, inkludert «Interaktiv yrkessammenligning». De tidligere frittstående diagrammene på siden er beholdt.
- «Interaktivt lønnsspenn» finnes som egen fane på begge sider, med lønnsbånd og valgfri sammenligning med egen lønn.
- Nye dev-sider kan legges under `src/app/dev/`, for eksempel `src/app/dev/ssb/page.tsx`.

## Produksjonssperre

Hele området er sperret i `src/app/dev/layout.tsx`.

`isDevAreaAvailable()` i `src/lib/dev-area.ts` gjør området tilgjengelig når:

- `NODE_ENV` ikke er `production`
- `ENABLE_DEV_AREA` ikke er satt til `false`

I produksjon svarer området med 404 via `notFound()`.

`/utvikling-diagram` har en egen serversperre i `src/app/utvikling-diagram/page.tsx`.
Siden krever `NODE_ENV=development` og at `isDevAreaAvailable()` er sann.
Den er ikke med i sitemap eller vanlig navigasjon, og metadata hindrer indeksering.
Legg til nye faner i `diagrams` i `src/components/development-diagram-tabs.tsx`.
Hver fane bruker den eksisterende diagramkomponenten med testdata i utviklingsvisningen.
Lønnsutviklingsdiagrammet bruker fiktive lønnstall og prisindekser for 2016–2025 fra
`src/lib/development-diagram-data.ts`. Blogginnlegget bruker fortsatt sitt opprinnelige datagrunnlag.
Diagrammets faste navn er «Interaktiv lønnsutvikling». Både utviklingsvisningen og
bloggkomponenten `BlogSalaryGrowthExplorer` bruker `src/components/salary-growth-explorer.tsx`.
Bloggkomponenten velger faktiske data med `snapshotId`; se standarden i `src/content/blog/README.md`.

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

## Interaktiv lønnsforskjell

`src/components/salary-gender-gap-explorer.tsx` tar imot et `SalaryGenderGapDataset` fra `src/lib/salary-gender-gap.ts`. Hvert punkt har `year`, `men` og `women`, som er nominell median månedslønn i kroner for hvert kjønn, med samme populasjonsdefinisjon. Både stolpene, lønnsverdiene og prosentforskjellen bruker disse medianene; de beregnes ikke fra gjennomsnittslønninger. Utviklingssiden bruker fiktive medianlønninger. Diagrammet har ingen undertittel. Årene sorteres, og de siste ti vises. Tomme datasett viser en tomtilstand; ugyldige verdier og duplikate år avvises.

Testdata ligger i `src/lib/development-salary-gender-gap-data.ts` og omfatter begge retninger, små forskjeller og lik lønn. Testperiodevalget ligger i `src/components/development-salary-gender-gap.tsx`. Komponenten gjør ingen API-kall.

Stolpens topp er høyeste lønn. Det lyse feltet viser laveste lønn fra aksens nedre grense; toppfeltet viser differansen. Blått toppfelt betyr at menn tjener mest, rosa at kvinner tjener mest. Ved lik lønn brukes grått, 0 % og ingen målelinje. Prosenten beregnes som `(menn - kvinner) / menn * 100`, men vises som absoluttverdi uten fortegn. Fargen og teksten forklarer hvem som tjener mest. Geometrien avrundes ikke.

Y-aksen skaleres dynamisk og merkes når den er avkortet. Stolpebredde og mellomrom tilpasses tilgjengelig bredde, slik at ti år med testdata får plass innenfor standardbredden på 768 px på utviklingssiden og i blogginnlegg. Minimumsplassen per år beregnes fra prosentetikettene. På små skjermer beholdes horisontal scrolling når etikettene ellers ville blitt for tette. Hover, trykk og tastatur viser detaljer på en fast plass under plottet. Piltaster, Home og End bytter år, Enter/mellomrom velger, og Escape går tilbake til siste år.
Ved hover, trykk eller tastaturfokus vises også ♂ og ♀ med lønnen over valgt stolpe. Høyeste lønn står øverst; ved lik lønn beholdes menn øverst. Etikettene tilpasses synlig bredde og nabostolpene, slik at tall og prosentetiketter ikke overlapper. Skalaen reserverer plass til verdiene før interaksjon.

## Interaktiv reallønn

Diagrammet vises på `/dev/grafer` og som egen fane på `/utvikling-diagram`. `src/components/real-wage-growth-explorer.tsx` tar et `RealWageDataset` fra `src/lib/real-wage-growth.ts`. Komponentens input er årlige gjennomsnittlige nominelle månedslønninger for `women` og `men`, samt årlig KPI-indeks i `cpi`, i `points`. Det valgfrie feltet `median` er samlet nominell median månedslønn for begge kjønn. Denne må oppgis separat og beregnes ikke fra gjennomsnittslønningene. Tooltipen viser reallønnsendring, nominell lønnsvekst, årlig prisvekst (KPI) og «Median månedslønn», i denne rekkefølgen. Gjennomsnittlig nominell månedslønn vises ikke i tooltipen. Manglende median vises som «Mangler data» og påvirker ingen vekstberegninger. Bruk samme KPI-definisjon og indeksbasis gjennom hele datasettet.

`baseline` kan gi året før første visningsår. Ti årlige endringer trenger elleve år med sammenlignbare lønns- og KPI-tall. Testdata i `src/lib/development-real-wage-data.ts` bruker 2015 som grunnlag og viser 2016–2025. `src/components/development-real-wage.tsx` tilbyr 10, 5 og 1 år samt manglende data.

Nominell vekst beregnes separat per kjønn mot nøyaktig foregående kalenderår. Reallønnsveksten er `((1 + nominell vekst / 100) / (1 + KPI-vekst / 100) - 1) * 100`. Samme prisvekst brukes for begge kjønn. Tallene avrundes først ved visning. Årene sorteres, og maksimalt ti vises; eldre innsendte år kan fortsatt brukes som sammenligningsgrunnlag.

`null`, utelatte felt, nullverdier, negative lønns-/indeksverdier og ikke-endelige tall regnes som manglende data. De vises som —, aldri som 0 % eller anslag. Et manglende lønnstall påvirker bare aktuelt kjønn; et manglende KPI-tall påvirker begge kjønn. Ingen beregning hopper over et manglende kalenderår. Ved nullvekst vises en strek på nullinjen, uten kunstig stolpehøyde.

Stolpene er grønne ved positiv og røde ved negativ reallønnsvekst, med synlige ♀/♂ under hver stolpe. Hvert år har en svak, vekslende hvit/lyseblå sone med en diskré skillelinje mot naboåret. Sonene går fra øverste gridlinje til og med årstallet. De to stolpene er sentrert innenfor sonen, med mindre avstand mellom kjønnene enn mellom årgruppene. Stolpebredde, avstand og kompakte prosentetiketter tilpasses slik at hver etikett ligger sentrert rett over eller under sin egen stolpe. Etikettene flyttes ikke vertikalt for å gå klar av naboene. Ti vanlige testår passer i standard blogg-/utviklingsbredde; på mobil brukes horisontal scrolling for lesbare etiketter og større trykkflater.

Mus viser detaljer kun ved hover; klikk låser aldri tooltipen. Touch og penn kan velge en stolpe ved trykk. Trykk utenfor detaljboksen lukker den, mens trykk inne i boksen beholder den åpen. Et avbrutt trykk under scrolling åpner ingen boks. På mobil vises detaljene under plottet. Tastaturfokus viser detaljer så lenge stolpen har fokus. Piltaster, Home og End navigerer; Escape lukker tooltipen.

Komponenten gjør ingen API-kall. Kildeteksten er ren tekst. Begge dev-rutene beholder eksisterende produksjonssperrer.

Kjønnsvelgeren «Begge | Menn | Kvinner» fremhever uten å filtrere. Begge kjønn beholder samme plassering og skala; stolper, prosentetiketter og symboler for øvrig kjønn tones ned, men kan fortsatt vise tooltip.

Nøkkeltallene er kompakte oppsummeringer til høyre for velgeren, med «Siste 5 år» over «Siste 10 år» og kjønnssymbol ved hvert tall. Årsspenn vises ikke. Ett valgt kjønn får en enklere linje. På smale skjermer kan oppsummeringene bryte til neste linje og beholder høyrejusteringen.

Samlet reallønnsvekst siste 5 og 10 år sammenligner lønnsnivået i første og siste av henholdsvis 5 og 10 årganger, slik som i «Interaktiv lønnsutvikling». Med sluttår 2025 betyr dette 2021–2025 og 2016–2025. Første årgang er startnivået: årsveksten inn i dette året tas ikke med i oppsummeringen. De resterende 4 eller 9 vekstratene kjedes geometrisk som `((1 + r1/100) × … × (1 + rn/100) − 1) × 100`. Baseline brukes fortsatt for den første års­stolpen, men inngår ikke som startnivå i oppsummeringen. Periodene slutter i siste kalenderår der minst ett kjønn har en gyldig reallønnsrate, med felles sluttår for begge kjønn. Manglende år eller nødvendige vekstrater gir ikke et nøkkeltall for det aktuelle kjønnet; det brukes ikke en eldre fullstendig periode ved hull. Hele innsendte historikken kan brukes, selv om stolpediagrammet viser maksimalt ti år. Begge dev-visningene og blogginnleggene bruker den samme beregningsfunksjonen.

## Interaktiv yrkessammenligning

`src/components/occupation-salary-comparison-explorer.tsx` tar `dataset`, `selectedOccupationCode` og valgfri `comparisonOccupationCodes`. Referanseyrket inkluderes alltid i det valgte utvalget. Datamodell og rene beregninger ligger i `src/lib/occupation-salary-comparison.ts`. Komponenten gjør ingen API-kall. En senere SSB-integrasjon skal levere samme modell via eksisterende `/lib/ssb.ts` og spørringene i `/lib/ssb/queries.ts`.

Testdata i `src/lib/development-occupation-comparison-data.ts` bruker de sju medianlønningene og yrkeslenkene fra referansebildets automatiker-snapshot. Lønnsvekst, KPI-vekst og antall sysselsatte er fortsatt fiktive testdata, dokumentert i datasettet. Testvelgeren tilbyr manglende tall og bytte av referanseyrke. Lønn gjelder heltidsekvivalenter, mens sysselsatte gjelder personer med heltid og deltid samlet. Disse er ikke samme måleenhet.

Reallønnsvekst beregnes med eksisterende `calculateRealWageGrowth`: `((1 + nominell vekst / 100) / (1 + prisvekst / 100) - 1) * 100`. KPI-perioden må samsvare med lønnsvekståret. Inputvekst gjelder årlig endring i medianlønn for samme populasjon. Alle yrker i ett datasett må ha samme populasjonsdefinisjon; avvikende år vises ikke. Null/ugyldig medianlønn behandles som manglende, mens null vekst og null personer er gyldig.

Lønnsforskjellen i prosent bruker referanseyrkets lønn som nevner. Diagrammet har fast sortering fra høyest til lavest lønn, med manglende verdier sist. Nøkkeltallsseksjonen, sorteringskontrollen, forklaringstekstene og merket «Valgt yrke» er fjernet. Yrkesnavnene lenker til yrkessidene; stolpene er egne knapper for detaljvisning, uten lenker inni knappene.

Månedslønn har nullbasert skala. Differansevisningen har symmetrisk skala og nullinje, også når samtlige avvik er negative. Referanseyrket beholder mørkeblå farge. Hover viser detaljer; mus låser ikke boksen. Touch/penn velger en stolpe ved trykk og lukker ved nytt trykk eller trykk utenfor. Tastaturfokus, Enter/mellomrom, piltaster, Home/End og Escape støttes. Mobil viser boksen i dokumentflyten rett under valgt rad, uten å dekke grafen. Redusert bevegelse deaktiverer stolpeanimasjonene. Kildedetaljene er fjernet fra tooltipen; kildeseksjonen under diagrammet er beholdt. Eksisterende diagramkomponenter er ikke endret.

`src/lib/occupation-salary-comparison.test.ts` dekker differanser, median, rangering, alle sorteringer, KPI, null/manglende data, skalaer og dynamiske innsikter.

## Interaktivt lønnsspenn

`SalaryRangeExplorer` i `src/components/salary-range-explorer.tsx` tar ett `SalaryRangeDataset` fra `src/lib/salary-range.ts`. Hvert år har separate `all`-, `women`- og `men`-verdier med `p25`, `median` og `p75`. `all` er fordelingen for begge kjønn samlet og må oppgis separat; den beregnes aldri fra kjønnskvartilene. Alle verdier skal være fast avtalt brutto månedslønn i heltidsekvivalenter, uten bonus, uregelmessige tillegg og overtid. Fiktive data for 2016–2025 ligger i `src/lib/development-salary-range-data.ts`; de skal ikke brukes som statistikk for personalsjefer eller i blogginnlegg.

Ett transparent bånd viser de midterste 50 %, ikke minste og høyeste lønn. «Begge kjønn | Menn | Kvinner» viser bare valgt fordeling, med «Begge kjønn» som standard. Samlet fordeling er mørkeblå; menn og kvinner bruker eksisterende blå og rosa kjønnsfarger. Skalaen beregnes fra alle tre serier og endres ikke ved kjønnsbytte. Årene sorteres og de siste ti vises, med kalenderavstand på x-aksen. Manglende, ikke-positive, ikke-endelige eller feilordnede kvartiler gir hull for aktuelt kjønn og år. Bånd og medianlinje trekkes heller ikke over manglende kalenderår. Duplikate og ikke-hele årstall avvises.

Infoboksen følger utseende og pointermønster fra «Interaktiv reallønn»: hover uten låsing på PC, trykk på touch/penn, lukking utenfor boksen og med Escape. Scrolling åpner ingen boks. På mobil ligger den under plottet. Tastaturbrukere kan nå hvert år i valgt serie; høyre/venstre bytter år og Home/End går til første/siste år. Infoboksen viser kvartiler, median, spenn i kroner og eventuell sammenligning med egen lønn.

Kontrollfeltet er uten omsluttende boks, bakgrunn, ramme, avrunding og skygge. Det har to seksjoner med en lys skillelinje. Til venstre står «Velg kjønn» med egne ikoner og avrundede knapper; aktivt valg er mørkeblått. Til høyre står «Din lønn», et stort turkist beløp og en turkis slider med verdiboble over markøren. År/måned-valget er fjernet; slider, diagram, infobokser og sammenligning viser bare årslønn. Årsbeløp er månedslønn ganget med tolv. Alle beregninger og datasett bruker fortsatt uavrundet månedslønn internt. Årsaksen merkes i millioner kroner for lesbare aksetall.

Forklaringstekstene om kvartilbåndet og bruk av slideren er fjernet fra hovedvisningen. Info-ikonet øverst til høyre åpner `SalaryRangeInfoDialog` fra `src/components/salary-range-info-dialog.tsx`. Hele diagraminnholdet sløres og settes til `inert` mens en lokal forklaringsboks vises over det. Boksen forklarer nedre kvartil, median, øvre kvartil, de midterste 50 %, egen lønn, kjønnsvalg og lønnsgrunnlag. Testdata merkes også her. Kryss, «Tilbake til diagrammet», Escape eller trykk på bakgrunnen lukker boksen. Tastaturfokus går til dialogen ved åpning, holdes inne med Tab/Shift+Tab og returneres til info-ikonet ved lukking. Innholdet kan scrolles på små skjermer.

Stilene ligger i `src/components/salary-range-explorer.module.css`, med egne sliderstiler for Chromium/Safari og Firefox. På brede flater ligger kontrollene på én rad; container queries tilpasser oppsettet til mindre tilgjengelig bredde. På smale flater får sliderboblen ekstra plass slik at den ikke dekker lønnsbeløpet. Slideren har en 8 px tykk bane og en 24 px markør. Startposisjonen følger siste median i valgt serie, og sammenligningen aktiveres først når brukeren bruker slideren. Lønn velges bare med slideren, fra 1 000 kr per måned til minst 150 000 kr per måned, med høyere øvre grense hvis diagramskalaen krever det. Egen lønn vises som en turkis, stiplet linje og sammenlignes med siste år eller aktivt år. Oppsummeringen under diagrammet viser alltid separate sammenligninger med menn og kvinner, med avvik i prosent og kroner, kjønnets median og kvartilplassering. Beløpet holdes fast i løpende kroner og representerer ikke brukerens historiske lønnsutvikling. Det anslås ingen nøyaktig persentil. Ved lønn utenfor diagramskalaen beholdes den stiplede linjen på øvre eller nedre kant. Både beløpet ved linjen og verdiene over slideren følger fortsatt faktisk valgt årslønn, også mens beløpet endres utenfor skalaen. Linjens etikett holdes innenfor plottet. Skalaen og sammenligningsberegningene endres ikke av at linjen begrenses til kanten. Beløpet finnes bare i komponentens tilstand og sendes ikke til en API.

Utviklingswrapperen tilbyr 10, 5 og 1 år samt manglende data. Testdata inneholder både overlappende og kryssende kjønnsserier. `src/lib/salary-range.test.ts` dekker inntasting, enheter, kvartilgrenser, sammenligning, datavalidering, hull og diagramgeometri. Faktiske historiske kvartiler og artikkelspesifikke snapshots legges til når diagrammet skal brukes i blogg.

## Regler for kode i dev-området

- Følg fortsatt prosjektreglene i `AGENTS.md`.
- Bruk eksisterende datalogikk i `/lib`.
- Ikke installer nye pakker uten at det er nødvendig.
- Hold prototyper små og tydelig avgrenset.
- Ikke legg lenker til `/dev` i vanlig navigasjon.
- Flytt produksjonsklar kode ut av `/dev` før den brukes på offentlige sider.
