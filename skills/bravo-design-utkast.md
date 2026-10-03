---
name: bravo-design
description: Vurder, planlegg og forbedre brukergrensesnittet i Lønnsinnsikt. Bruk ved designkritikk, UI- og UX-endringer, visuell polering, responsiv tilpasning, tilgjengelighetskontroll og utvikling av nye sider eller komponenter. Ikke bruk for rene data-, API-, innholds- eller backendoppgaver uten en visuell flate.
---

# Utkast – ikke aktiv skill

Denne filen er et utkast til gjennomgang. Den er med vilje ikke lagret som
`SKILL.md` i en skill-mappe og skal derfor ikke behandles som en aktiv skill.

# Bravo design

## Formål

Hjelp Lønnsinnsikt med å lage et rolig, presist og tillitsbyggende grensesnitt
som gjør norske lønnsdata lettere å forstå og bruke. Designet skal hjelpe
brukeren med å finne svar, tolke tall og ta bedre lønnsvalg. Det skal ikke være
dekorasjon for dekorasjonens skyld.

Skillen skal gi retning og kvalitetskontroll, ikke erstatte brukerens brief,
prosjektets etablerte design eller faglige krav.

## Autoritative kilder

Før designarbeid:

1. Les `PROJECT.MD` for målgruppe, produktløfte, innholdsprinsipper og
   posisjonering.
2. Les `AGENTS.md` for tekniske regler, arbeidsmåte og avgrensninger.
3. Les eventuell lokal stilguide for flaten, for eksempel
   `src/app/lonnskalkulator/STIL.md`.
4. Undersøk eksisterende komponenter, tokens og mønstre før nye varianter
   foreslås.
5. Ved endringer i Next.js App Router, metadata, routing, server actions,
   caching eller datahenting: les relevant dokumentasjon i
   `node_modules/next/dist/docs/` før implementasjon.

Ved konflikt gjelder oppgavespesifikke krav og prosjektets styrende filer foran
denne skillen. Ikke opprett `PRODUCT.md` eller en parallell produktbeskrivelse;
`PROJECT.MD` er prosjektets produktkilde.

## Forstå flaten før du designer

Bestem hva brukeren primært skal gjøre på den aktuelle flaten:

- **Velge og handle:** Forside, landingssider og andre flater som skal hjelpe
  brukeren videre til søk, yrke eller lønnssjekk.
- **Utføre en oppgave:** Lønnssjekk, kalkulatorer, søk, filtre og andre
  verktøyflater.
- **Forstå:** Yrkesdetaljer, datavisninger, forklaringssider og blogginnhold.
- **Utforske:** Oversikter, yrkesgrupper og sammenligninger der brukeren leter
  etter mønstre eller alternativer.

En side kan støtte flere behov, men ett behov skal styre hierarkiet. Hvis dette
ikke kan utledes fra oppgaven og eksisterende produktkontekst, avklar det før en
større redesign.

## Arbeidsmåte

### Ved kritikk eller gjennomgang

- Ikke endre filer med mindre brukeren også ber om implementasjon.
- Beskriv først hva som fungerer og bør bevares.
- Skill mellom dokumenterte problemer, sannsynlige problemer og subjektive
  preferanser.
- Prioriter funn etter konsekvens for forståelse, gjennomføring, tillit og
  tilgjengelighet.
- Knytt hvert viktig funn til et konkret element eller en konkret brukerreise.
- Foreslå den minste endringen som løser problemet.

### Ved forbedring av en eksisterende flate

- Bevar fungerende informasjonsarkitektur, produktnavn, datalogikk og
  etablerte interaksjoner.
- Finn rotårsaken før du justerer stil. Et uklart hierarki løses ikke alltid med
  mer farge, større kort eller flere forklaringer.
- Gjør små, sammenhengende og reversible endringer.
- Gjenbruk eksisterende komponenter og designverdier når de dekker behovet.
- Ikke refaktorer tilstøtende kode uten at det er nødvendig for oppgaven.
- Hvis endringen krever en ny visuell retning, presenter retningen og
  konsekvensene før den bygges.

### Ved en ny flate

- Definer målgruppe, hovedoppgave, viktigste informasjon og ønsket neste steg.
- Velg en tydelig visuell retning som passer Lønnsinnsikts nøkterne og
  datadrevne posisjonering.
- Start med innholdshierarki og brukerflyt før dekorative detaljer.
- Bruk realistisk norsk innhold og realistiske tallformater i utformingen.
- Bygg med eksisterende layout-, typografi- og komponentmønstre der de finnes.

## Designprinsipper for Lønnsinnsikt

### Klarhet før effekt

- La siden raskt svare på hva brukeren kan finne ut eller gjøre.
- Prioriter ett tydelig første steg: søk, velg yrke, legg inn lønn eller les
  hovedtallet.
- Vis hovedsvaret tidlig og tilby detaljer gradvis.
- Bruk forklaringer der de endrer forståelsen, ikke for å fylle flaten.
- Unngå uklare løfter, markedsføringsspråk og kunstig hastverk.

### Tall skal være lette å tolke

- Gjør måleenhet, periode, populasjon og kilde synlig der de påvirker
  tolkningen.
- Skill tydelig mellom median, gjennomsnitt, estimat og brukerens egne tall.
- Bruk norsk tall- og valutaformat konsekvent.
- Bruk tabulære sifre når justering mellom tall forbedrer lesbarheten.
- Bruk farge som støtte, aldri som eneste bærer av betydning.
- Ikke gi mer visuell presisjon enn datagrunnlaget forsvarer.
- Skill visuelt mellom fakta, beregning, tolkning og råd.

### Hierarki og layout

- Hver flate skal ha ett tydelig fokus og en lesbar rekkefølge.
- Grupper elementer etter oppgave og betydning, ikke bare etter datatype.
- Bruk luft og justering før rammer, bakgrunner og skygger.
- Unngå bokser inni bokser og lange rekker av likeverdige kort.
- Ikke legg ikoner, badges eller etiketter til uten informasjonsverdi.
- Hold viktige handlinger synlige uten å gjenta samme CTA unødvendig.

### Typografi

- Bruk et tydelig typografisk hierarki med få nivåer.
- Prioriter lesbarhet og skanning fremfor store dekorative overskrifter.
- Hold avsnitt og linjelengder moderate.
- Ikke bruk små eller svake tekster til viktig kilde-, periode- eller
  forklaringsinformasjon.
- Bevar prosjektets etablerte skrifter med mindre brukeren ber om ny retning.

### Farge og visuell karakter

- Uttrykket skal være rolig, saklig, moderne og tillitsbyggende.
- Bruk farge til hierarki, tilstand, sammenligning og handling.
- Kontroller kontrast i faktisk kombinasjon av tekst og bakgrunn.
- Ikke bruk gradienter, glød, sterke skygger eller dekorative fargeflater som
  reduserer troverdigheten eller konkurrerer med dataene.
- Ikke avvis et etablert merkevarevalg bare fordi det ligner en generell
  design-antipattern.

### Interaksjon og tilbakemelding

- Gjør klikkbare og redigerbare elementer tydelige uten instruksjonstekst.
- Vis fokus, hover, valgt tilstand, lasting, feil, tomt resultat og fullført
  handling der det er relevant.
- Bevar tastaturrekkefølge og synlig fokusmarkering.
- Unngå bevegelse uten funksjon. Animasjon skal forklare overgang, årsak eller
  sammenheng.
- Respekter `prefers-reduced-motion` når bevegelse brukes.
- Ikke skjul nødvendig funksjonalitet bak hover alene.

## Responsivitet

- Design fra innholdets prioritet, ikke ved å krympe desktop-layouten.
- Kontroller smale mobilbredder, vanlige laptopbredder og store skjermer.
- Unngå horisontal scrolling for vanlig innhold.
- Sørg for tilstrekkelige trykkflater og avstand mellom handlinger.
- Tabeller og diagrammer skal fortsatt kunne forstås på mobil; bruk omforming,
  prioritering eller kontrollert scrolling når det er bedre enn å skjule data.
- Unngå at lange yrkesnavn, store kronebeløp eller prosentverdier bryter
  layouten.

## Tilgjengelighet

- Bruk semantisk HTML og korrekt overskriftshierarki.
- Alle kontroller skal ha tilgjengelig navn og tydelig tilstand.
- Skjemafeil skal forklare både problemet og hvordan det kan rettes.
- Diagrammer skal ha en tilgjengelig tekstlig eller tabellarisk representasjon
  av de viktigste opplysningene.
- Kontroller tekstkontrast, fokuskontrast og lesbarhet ved zoom.
- Ikke formidle forskjeller bare med farge, plassering eller bevegelse.
- Bruk klart norsk bokmål i etiketter, hjelpetekst og feilmeldinger.

## Robusthet og grensetilfeller

Vurder relevante tilstander før en flate regnes som ferdig:

- manglende eller forsinkede data
- null treff og tomme datasett
- delvis tilgjengelige SSB-tall
- svært lange navn og store tall
- like verdier eller verdier som ikke kan sammenlignes direkte
- lasting, nettverksfeil og ny innlasting
- ugyldig brukerinput
- tastaturbruk, zoom og redusert bevegelse

Ikke konstruer tilstander som produktet ikke kan få. Prioriter de som faktisk
følger av datakildene og brukerflyten.

## Antimønstre som skal vurderes – ikke håndheves blindt

Se spesielt etter:

- generisk «AI-SaaS»-utseende uten kobling til produktets formål
- kort for hvert eneste datapunkt
- kort inni kort
- for mange avrundede beholdere, piller og badges
- gradienttekst eller glød rundt viktig informasjon
- lavkontrasttekst på fargede flater
- ikoner som pynt foran alle overskrifter
- store hero-områder som skyver hovedoppgaven ned
- gjentatte CTA-er med samme funksjon
- overdreven bruk av animasjon
- forklaringstekst som kompenserer for uklare kontroller
- datavisninger uten periode, enhet eller kilde

Dette er signaler for vurdering, ikke absolutte forbud. Behold et mønster når det
har en tydelig funksjon, følger prosjektets etablerte stil eller er eksplisitt
ønsket av brukeren.

## Komponenter og implementasjon

- Foretrekk serverkomponenter når interaktivitet ikke krever klientkode.
- Hold UI, datahenting og API-logikk adskilt.
- Legg gjenbrukbare UI-komponenter i `/components`.
- Bruk eksisterende Tailwind-mønstre og tokens før lokale spesialverdier.
- Ikke legg SSB-kall eller rå API-adresser i komponenter.
- Ikke installer et nytt bibliotek bare for en effekt som kan løses enkelt med
  eksisterende teknologi.
- Unngå nye abstraksjoner før minst ett konkret gjenbruksbehov finnes.

## Kvalitetskontroll

Tilpass kontrollen til endringens risiko og omfang. For en vanlig UI-endring:

1. Kontroller at hovedoppgaven fortsatt er tydelig og gjennomførbar.
2. Sammenlign mot `PROJECT.MD`, lokal stilguide og eksisterende komponenter.
3. Kontroller mobil og desktop.
4. Kontroller tastaturnavigasjon, fokus, kontrast og relevante tilstander.
5. Kontroller at tall, enheter, perioder og kilder er konsistente.
6. Kjør relevante prosjektkontroller når oppgaven gir tillatelse til det.
7. Rapporter hva som ble endret, hva som ble kontrollert og eventuell usikkerhet.

Ikke påstå at en flate er visuelt kontrollert dersom den ikke er rendret eller
inspisert. Ikke påstå at tilgjengelighet eller ytelse er godkjent uten relevante
kontroller.

## Avgrensninger

- Ikke endre produktstrategi, faglige definisjoner eller datalogikk som en
  bieffekt av designarbeid.
- Ikke publiser eller deploy automatisk.
- Ikke hent inn eksterne skrifter, bilder eller tjenester uten at oppgaven
  krever det og konsekvensene er vurdert.
- Ikke overskriv brukerens etablerte designvalg med skillens preferanser.
- Ikke gjør en helhetlig redesign når oppgaven gjelder én komponent eller én
  konkret feil.
- Be om retning før irreversible eller omfattende visuelle endringer.

## Opphav

Arbeidsmåten er inspirert av det open-source prosjektet Impeccable av Paul
Bakaus, lisensiert under Apache License 2.0:
`https://github.com/pbakaus/impeccable`.

Dette utkastet er skrevet spesielt for Lønnsinnsikt og kopierer ikke
Impeccables kjørbare motor, hooks, automatiske kontroller eller Live Mode.
