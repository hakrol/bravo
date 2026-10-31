---
name: blogg-yrkeslonn
description: Skriv eller oppdater blogginnlegg om hva ett yrke tjener, som elektrikerlønn eller lønnen til rørleggere. Omfatter lønnsspenn, historikk og arbeidsmarked for yrket; bruk sammenligningsskillen når to yrker er likestilte hovedtemaer.
---

# Yrkeslønn

Les `AGENTS.MD`, `PROJECT.MD` og `src/content/blog/README.md` fra prosjektroten før arbeidet. Følg fellesreglene der uten å gå via inngangsskillen.

- Svar tidlig med kildebelagt hovedtall, lønnsbegrep, enhet og statistikkår. Ikke bruk publiseringsåret som om det var dataåret.
- Kontroller internt om yrkestittelen har egne SSB-tall eller inngår i en bredere gruppe. Bruk kontrollen til å velge riktige data; ikke legg inn en standardforklaring av statistikkgruppen i innlegget.
- Bruk yrkeskoder og Utdanning.no internt etter datakildereglene i README. Innlegget skal ikke inneholde yrkeskoder, forklaringer om kodeverk eller tekniske forklaringer om datahenting, snapshots, komponenter eller implementasjon. Forklar arbeidsoppgaver og utdanningsvei bare når de hjelper leseren. Oppgi fortsatt kilder, statistikkår og lønnsbegrep, men følg regelen under om metode og statistikkutvalg.
- Skill median fra gjennomsnitt og fast avtalt lønn fra samlet månedslønn, tillegg og overtid. Merk års- og timebeløp som omregninger med eksplisitte forutsetninger.
- Ikke utled startlønn, erfaringslønn eller lønn for selvstendig næringsdrivende fra generelle ansattall. Ta bare med slike svar når kilden faktisk dekker dem.
- Bruk `BlogGenderSalaryExplorer` («Interaktiv lønn etter kjønn») tidlig når sammenlignbare medianverdier for kvinner og menn finnes. Gjenbruk det interaktive diagrammet `SalaryGenderExplorer` fra `/utvikling-diagram` med samme utseende og oppførsel. Lagre tallene i et eget frosset snapshot og send dem inn via en artikkelwrapper. Bruk samme periode og avgrensning som hovedtallet. Komponenten viser median; ikke send inn gjennomsnitt. Månedslønn er grunnlaget, årslønn omregnes med faktor 12 og timelønn estimeres med eksplisitt timetall (standard 162,5 timer per måned). Hvis hovedtallet er gjennomsnitt, merk forskjellen tydelig eller velg median som hovedmål. Forklar utelatelsen kort hvis kjønnsdata mangler. Dette diagrammet kommer i tillegg til de fem faste diagrammene nedenfor; «Interaktiv lønnsforskjell» viser utviklingen over tid.
- Bruk de fem faste interaktive diagrammene nedenfor. Andre diagrammer er valgfrie og skal bare tas med når de tilfører noe eller er bestilt.
- Lenke naturlig til eksisterende yrkesside. Hold sammenligninger som støtter svaret underordnet hovedyrket.
- Ikke legg inn tabeller med mindre brukeren eksplisitt ber om det. Dette gjelder også nøkkeltallstabeller, sammenligningstabeller og søkbare yrkestabeller. De fem faste diagrammene skal fortsatt brukes.
- Ikke legg inn en oppsummering eller et eget kildeavsnitt. Kilder skal lenkes naturlig i teksten der de aktuelle opplysningene brukes. Behold relevante kildehenvisninger i diagrammene.

## Variasjon i hovedoverskriften

Når et nytt innlegg ikke har en bestilt hovedoverskrift, velg tilfeldig mellom de fem malene nedenfor til innleggets synlige `title`. Ikke velg automatisk den første malen. Se på tittelen i det sist opprettede yrkeslønnsinnlegget i repoet, og utelat malen som ble brukt der hvis den kan gjenkjennes. Trekk med lik sannsynlighet blant de gjenværende malene. Hvis forrige mal er ukjent, trekk blant alle fem.

1. Hva tjener en [yrke] i [statistikkår]?
2. Lønn som [yrke]: Dette viser tallene
3. [Yrke] i Norge: Lønn og lønnsutvikling
4. Hvor mye får en [yrke] i lønn?
5. Lønnen til en [yrke]: Nivå, forskjeller og utvikling

Erstatt plassholderne med det aktuelle yrket og statistikkåret for hovedtallet, ikke publiseringsåret. Tilpass artikkel, bøyning og stor forbokstav til naturlig bokmål. Tittelen skal samsvare med innholdet. En konkret overskrift fra brukeren har forrang. Ved oppdatering beholdes eksisterende tittel med mindre bestillingen omfatter en ny overskrift.

## Metode og statistikkutvalg holdes internt

Ikke legg inn standardavsnitt om hvem statistikken omfatter eller hvordan datagrunnlaget er avgrenset og bearbeidet. Dette regnes også som tekniske forklaringer, selv om teksten ikke inneholder yrkeskoder eller faguttrykk. Regelen gjelder brødtekst, ingress, diagramforklaringer og FAQ.

Utelat rutinemessige opplysninger om «alle aldre og sektorer», «heltids- og deltidsansatte samlet», omregning av deltidslønn til full stilling og oppramsing av andre stillingstitler i statistikkgruppen. Et avsnitt som «Tallene gjelder ansatte kjemikere i alle aldre og sektorer … Gruppen omfatter også blant annet biokjemikere og forskere innen kjemi» skal ikke være med.

Kontroller fortsatt disse forholdene internt og bevar dem i datagrunnlaget når relevant. Ta bare med en kort, konkret presisering dersom utelatelsen ville gjort selve lønnssvaret eller en sammenligning vesentlig misvisende, for eksempel hvis det ikke finnes egne tall for yrket. Forklar da begrensningen i én enkel setning knyttet til den aktuelle påstanden, uten et generelt metodeavsnitt. Ikke bruk en slik presisering som anledning til å ramse opp standardavgrensninger.

## Faste diagrammer

Hvert yrkeslønnsinnlegg skal inneholde alle disse fem diagrammene med kildebelagte data for det aktuelle yrket:

«Interaktiv lønnsutvikling» skal plasseres tidlig i innlegget, etter en kort innledning med hovedsvaret og før den første mellomoverskriften i artikkelteksten (`##` eller `###`). Ikke legg andre diagrammer, lønnskort eller lange forklaringer foran dette diagrammet. Artikkelens synlige tittel fra frontmatter står fortsatt øverst.

| Diagram | Eksisterende løsning |
| --- | --- |
| Interaktiv lønnsutvikling | `BlogSalaryGrowthExplorer` med eget registrert `snapshotId`, etter README-reglene. |
| Interaktiv yrkessammenligning | `OccupationSalaryComparisonExplorer` med hovedyrket som referanse og et relevant utvalg sammenlignbare yrker. |
| Interaktiv lønnsforskjell | `SalaryGenderGapExplorer` med sammenlignbare medianlønninger for kvinner og menn over tid. |
| Interaktiv reallønn | `RealWageGrowthExplorer` med lønnsutvikling og KPI for samsvarende perioder. |
| Interaktiv lønnstakerutvikling | `WorkforceGrowthExplorer` med antall lønnstakere over tid og samme kvartal gjennom serien. |

`/utvikling-diagram` er kilden til diagrammenes utseende og interaksjon. Ta utgangspunkt i `src/app/utvikling-diagram/page.tsx` og følg `DevelopmentDiagramTabs` i `src/components/development-diagram-tabs.tsx` til de delte diagramkomponentene. Gjenbruk disse komponentene og deres gjeldende utseende og oppførsel; ikke bruk eksisterende blogginnleggs artikkelwrappers som fasit. Kontroller datakrav i de aktuelle komponentene og tilhørende typer i `src/lib/`.

Bruk egne frosne snapshots for yrket etter bloggens fellesregler, og registrer nødvendige artikkelwrappers i `src/components/blog-mdx-components-fixed.tsx`. `/utvikling-diagram` er design- og komponentreferanse, ikke statistikkgrunnlag for innlegget. Ikke kopier testdata eller andre yrkers tall fra utviklingssiden.

Hvis nødvendige data mangler eller er undertrykt, skal de ikke erstattes med null eller anslag. Forklar begrensningen kort for leseren og oppgi ved levering hvilket påkrevd diagram som ikke kunne ferdigstilles og hvorfor. Ikke regn alle diagramkrav som oppfylt dersom et diagram mangler.

## Naturlig forklaring av diagrammene

Knytt hvert diagram til brødteksten der det passer i artikkelen. Forklar kort hva leseren ser, og trekk frem en konkret, interessant observasjon når datagrunnlaget viser en: for eksempel et tydelig vekstskifte, endret kjøpekraft, en utvikling i lønnsforskjellen eller et nærliggende yrke som skiller seg ut.

Bruk relevante beløp, årstall eller endringer for å underbygge observasjonen. Hvis diagrammet ikke viser noe spesielt, gi en nøktern forklaring uten å konstruere et funn. Unngå standardtekster som bare sier «diagrammet viser utviklingen», oppramsing av alle punkter og tekniske bruksanvisninger. Ikke påstå årsaker som tallene alene ikke dokumenterer.

Start med en kort innledning med hovedsvaret, deretter «Interaktiv lønnsutvikling» før første mellomoverskrift. Fordel de øvrige diagrammene mellom relevante seksjoner med forklarende tekst mellom. Mulig videre struktur er yrkesforklaring, sammenligning, lønnsforskjell, kjøpekraft, lønnstakerutvikling og FAQ. Tilpass overskrifter og rekkefølge til bestillingen uten å utelate de faste diagrammene eller flytte lønnsutviklingsdiagrammet ned i en senere seksjon.

## FAQ basert på SEO-data

- Avslutt innlegget med nøyaktig fem relevante spørsmål og korte, konkrete svar i `FAQ` og `FAQItem`. FAQ skal stå helt nederst etter siste fagseksjon, uten oppsummering, eget kildeavsnitt eller egen Markdown-overskrift over komponenten. Lenke også kilder naturlig i FAQ-svarene der det er relevant.
- Velg spørsmål ut fra tilgjengelige SEO-data for yrket, for eksempel søkefraser fra Search Console, søkeordanalyse eller relevante spørsmål i søkeresultater. Prioriter dokumenterte søkeintensjoner som hovedartikkelen ikke allerede besvarer.
- Undersøk tilgjengelig SEO-grunnlag før spørsmålene velges. Hvis søkevolum eller egne søkedata ikke er tilgjengelige, bruk relevante spørsmål fra undersøkte søkeresultater og oppgi begrensningen ved levering. Ikke finn på søkevolum eller presenter antatte søk som målte data.
- Hvert spørsmål skal dekke et annet informasjonsbehov enn det som allerede er besvart i brødtekst, diagramforklaringer eller andre FAQ-svar. Ikke lag omskrivinger av hovedoverskriftene for å fylle fem plasser. Kontroller spørsmålene mot det ferdige innlegget og bytt ut overlappende spørsmål.
- Svarene skal bygge på etterprøvbare kilder og tilføre ny informasjon. Ikke utled for eksempel startlønn eller erfaringslønn fra generelle lønnstall for å fylle FAQ-en. Hvis fem relevante tilleggsspørsmål ikke kan kildebelegges, oppgi hva som mangler ved levering fremfor å finne på svar.
