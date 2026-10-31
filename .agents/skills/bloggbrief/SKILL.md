---
name: bloggbrief
description: Lag en kort redaksjonell bestilling til et blogginnlegg for Lønnsinnsikt, uten å skrive artikkelen eller legge den i en temakø. Bruk når brukeren ber om en brief eller instruks til senere bloggproduksjon.
---

# Bloggbrief

Les `AGENTS.MD`, `PROJECT.MD` og `src/content/blog/README.md` fra prosjektroten. Velg hovedtype etter [blogginnlegg](../blogginnlegg/SKILL.md) og les den valgte type-skillen for faglige avgrensninger.

Returner én kort bestilling direkte i samtalen. Ikke opprett artikkelfiler eller en temakø med mindre brukeren uttrykkelig ber om det. Denne repo-skillen erstatter behovet for Daily Briefs-pluginen i prosjektets arbeidsflyt; installert plugin-konfigurasjon endres ikke her.

Bruk følgende felt, og utelat valgfrie felt som ikke trengs:

```text
Innleggstype: yrkeslønn | sammenligning | rangering | lønnsoversikt | lønnsråd
Tittel:
Beskrivelse:
Periode og avgrensning:
Overskrifter:
Diagrammer:
Tabeller:
FAQ:
Interne lenker:
Eksterne lenker:
```

- Velg én faktisk verdi for innleggstype. Beskriv hovedspørsmål, vinkel, nødvendige data og hva som ikke bør overtolkes i ett konsist avsnitt under Beskrivelse.
- Angi periode når kjent; ellers bestill siste tilgjengelige sammenlignbare periode uten å finne på år eller beløp. For rangeringer: angi utvalg og rangeringsmål. For sammenligninger: angi hvilke yrker og hvilket lønnsbegrep som skal sammenlignes.
- Overskrifter skal kunne brukes direkte som H2 og tilføre ulike svar. Ikke pålegg alle innlegg samme struktur.
- Diagrammer og tabeller er konkrete bestillinger. Velg bare elementer med et tydelig formål og eksisterende støtte i README. Bruk «Interaktiv lønnsutvikling» for standarddiagrammet. Brukeren trenger ikke fylle inn komponentnavn eller snapshot-ID.
- FAQ inneholder spørsmål, ikke svar. Velg bare relevante tilleggsspørsmål. Produksjonen plasserer FAQ helt nederst etter README-regelen.
- Verifiser at interne lenker finnes. Prioriter norske primærkilder for eksterne lenker. Ikke oppgi ukontrollerte URL-er eller statistikk som sikre fakta.
- Ikke legg til avkrysningsstatus, kjøringsdato eller instruks om automatisk skriving eller publisering.
