---
name: blogg-lonnsraad
description: Skriv eller oppdater praktiske blogginnlegg om lønnssamtale, lønnskrav, lønnsforhandling og vurdering av jobbtilbud i Norge. Bruk dataskillene når hovedspørsmålet er lønnsnivå eller statistiske forskjeller.
---

# Praktiske lønnsråd

Les `AGENTS.MD`, `PROJECT.MD` og `src/content/blog/README.md` fra prosjektroten før arbeidet. Følg fellesreglene der.

- Gjør rådene konkrete for situasjonen: årlig lønnssamtale, endret ansvar, jobbskifte eller jobbtilbud. Forklar hva leseren kan forberede, si og følge opp.
- Gi et kort, konkret hovedsvar tidlig. Ved spørsmål om hva leseren bør si, vis en brukbar formulering før lange forklaringer. La eksempler og råd tilføre noe nytt fremfor å gjenta hovedsvaret.
- Bruk direkte du-språk og norske arbeidslivsforhold. Skill rettigheter, tariffbestemmelser, arbeidsgiverpraksis og råd fra hverandre. Verifiser rettslige og tidsaktuelle påstander mot relevante primærkilder.
- Ikke lov bestemte lønnshopp eller bruk generelle prosentintervaller som dokumenterte normer uten kilde og avgrensning.
- Koble rådene til ansvar, resultater og sammenlignbare markedsdata. Forklar hvorfor statistikk er et vurderingsgrunnlag, ikke et løfte om hva den enkelte vil få.
- Når lønnstall brukes, oppgi kilde, lønnsbegrep, enhet og statistikkperiode. Skill median fra gjennomsnitt og fast avtalt lønn fra samlet månedslønn, tillegg og overtid når forskjellen er relevant for rådet. Ikke utled startlønn eller erfaringslønn fra generelle yrkestall. Merk års- og timebeløp som omregninger med eksplisitte forutsetninger.
- Bruk `Example` til formuleringer og samtalemanus. Merk regneeksempler og forutsetninger slik at de ikke fremstår som observerte lønnstall.
- Bruk `ToolCallout` uten egne props når Lønnsjekk er et naturlig neste steg. Lenker og eksempler skal hjelpe leseren med en konkret beslutning.
- Ikke legg inn tabeller med mindre brukeren eksplisitt ber om det. Dette gjelder også nøkkeltallstabeller og tabeller som bare gjentar eksempler eller brødtekst.
- Ikke legg inn en oppsummering eller et eget kildeavsnitt. Kilder skal lenkes naturlig der de aktuelle opplysningene brukes. Behold relevante kildehenvisninger i eventuelle diagrammer.

## Variasjon i hovedoverskriften

Når et nytt innlegg ikke har en bestilt hovedoverskrift, velg tilfeldig mellom de fem malene nedenfor til innleggets synlige `title`. Se på tittelen i det sist opprettede lønnsrådsinnlegget i repoet, og utelat malen som ble brukt der hvis den kan gjenkjennes. Trekk med lik sannsynlighet blant de gjenværende malene. Hvis forrige mal er ukjent, trekk blant alle fem.

1. Hvordan [konkret handling]?
2. [Tema]: Dette bør du avklare før [situasjon]
3. Slik [konkret handling] i [situasjon]
4. Hva sier du når [konkret situasjon]?
5. [Konkret spørsmål]? Dette kan du si og gjøre

Tilpass malen til naturlig bokmål og innleggets faktiske spørsmål. Ikke lov konkrete formuleringer eller handlinger som innlegget ikke leverer. Bruk bare årstall når temaet er tidsavhengig; eventuelle statistikkår skal vise dataåret, ikke publiseringsåret. En konkret overskrift fra brukeren har forrang. Ved oppdatering beholdes eksisterende tittel med mindre bestillingen omfatter en ny overskrift.

## Metode og statistikkutvalg holdes internt

Ikke legg inn standardavsnitt om hvem statistikken omfatter, hvordan den er avgrenset, eller hvordan data hentes og bearbeides. Utelat rutinemessige opplysninger om «alle aldre og sektorer», «heltids- og deltidsansatte samlet», omregning av deltidslønn til full stilling og oppramsing av andre stillingstitler i statistikkgruppen. Ikke skriv om yrkeskoder, snapshots, komponenter eller implementasjon i innlegget. Regelen gjelder ingress, brødtekst, diagramforklaringer og FAQ.

Kontroller fortsatt disse forholdene internt og bevar dem i datagrunnlaget når relevant. Ta bare med en kort, konkret presisering når utelatelsen ville gjort rådet eller sammenligningen vesentlig misvisende. Forklar begrensningen i én enkel setning knyttet til den aktuelle påstanden, uten et generelt metodeavsnitt.

Dette skal ikke fjerne forutsetninger som leseren trenger for å bruke et regneeksempel eller vurdere et jobbtilbud. Oppgi for eksempel om et beløp er fastlønn, om bonus er garantert, og hvilket timetall en omregning bygger på når det er relevant for beslutningen.

## Valgfrie diagrammer og konkrete observasjoner

- Diagrammer er valgfrie. Ta dem med når de forklarer et relevant poeng eller er bestilt. Lønnsråd har ikke yrkesartiklenes krav om seks diagrammer eller et lønnsutviklingsdiagram før første mellomoverskrift.
- Bruk relevante delte diagramkomponenter fra `/utvikling-diagram` og frosne, kildebelagte data etter README-reglene. Gjenbruk gjeldende utseende og oppførsel; ikke kopier designet eller bruk utviklingssidens testdata som statistikkgrunnlag.
- Plasser diagrammet ved rådet det underbygger, med forklarende tekst mellom diagrammer. Trekk fram et konkret funn med relevante beløp, årstall eller endringer når tallene gir grunnlag for det. Unngå standardtekst som bare sier hva diagrammet viser, tekniske bruksanvisninger og årsaksforklaringer som ikke er dokumentert.

## FAQ basert på SEO-data

- Avslutt innlegget med nøyaktig fem relevante spørsmål og korte, konkrete svar i `FAQ` og `FAQItem`. FAQ skal stå helt nederst etter siste fagseksjon, uten egen Markdown-overskrift over komponenten.
- Undersøk tilgjengelig SEO-grunnlag for temaet før spørsmålene velges, for eksempel Search Console, søkeordanalyse eller relevante spørsmål i søkeresultater. Hvis egne søkedata eller søkevolumer ikke er tilgjengelige, bruk spørsmål fra undersøkte søkeresultater og oppgi begrensningen ved levering. Ikke finn på søkevolum eller presenter antatte søk som målte data.
- Hvert spørsmål skal dekke et annet informasjonsbehov enn det som allerede er besvart i brødtekst, eksempler, diagramforklaringer eller andre FAQ-svar. Kontroller mot det ferdige innlegget og bytt ut overlappende spørsmål; ikke lag omskrivinger av hovedoverskriftene for å fylle fem plasser.
- Svarene skal bygge på etterprøvbare kilder og tilføre ny informasjon. Lenke kilder naturlig der det er relevant, og skill råd fra dokumenterte rettigheter. Hvis fem relevante tilleggsspørsmål ikke kan kildebelegges, oppgi hva som mangler ved levering fremfor å finne på svar.
