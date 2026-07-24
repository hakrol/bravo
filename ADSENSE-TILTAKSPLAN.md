# AdSense: vurdering og tiltaksplan for Lønnsinnsikt

Dato for vurderingen: 22. juli 2026  
Sist oppdatert: 23. juli 2026

## Sammendrag

Google oppgir ikke et bestemt minstekrav til antall artikler, antall ord eller antall besøk. «Innhold av lav verdi» er en bred vurdering av nettstedet som helhet: originalitet, menneskelig bearbeiding, nytte, navigasjon, avsender og hvor stor del av de indeksérbare sidene som faktisk gir selvstendig verdi.

Lønnsinnsikt har et godt faglig fundament, men Google ser sannsynligvis et nettsted med svært mange malbaserte URL-er sammenlignet med mengden tydelig redaksjonell bearbeiding.

De viktigste tiltakene er derfor ikke å produsere flest mulig nye artikler. Nettstedet bør i stedet:

1. Rette tekniske og juridiske AdSense-problemer.
2. Redusere mengden svakt eller overlappende indeksérbart malinnhold.
3. Synliggjøre menneskelig kontroll, avsender og metode.
4. Forbedre de viktigste eksisterende sidene.
5. Gjennomføre en full kvalitetskontroll før det bes om ny gjennomgang.

Det er ikke mulig å garantere godkjenning, men tiltakene nedenfor retter seg direkte mot de sterkeste risikosignalene i Googles retningslinjer og dagens kodebase.

## Fremdriftsstatus

Følgende tiltak er gjennomført i kodebasen eller konfigurert i de tilhørende tjenestene:

- Publisher-ID-en er avstemt mellom AdSense-scriptet og `public/ads.txt`.
- E-postadressen `lonnsinnsikt@gmail.com` er opprettet.
- Resend-konto og nytt API-oppsett er opprettet.
- DNS-postene for Resend sitt avsenderdomene er verifisert.
- En tidligere eksponert API-nøkkel er tilbakekalt og erstattet.
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL` og `CONTACT_FROM_EMAIL` er lagt inn som sensitive miljøvariabler for Production og Preview i Vercel.
- Kontaktsiden `/kontakt` er implementert med ett enkelt, sentrert skjema.
- Skjemaet samler inn navn, e-postadresse og melding.
- Skjemaet bruker serverbasert validering, honeypot, tidskontroll og en enkel rate limit.
- Resend-kallet skjer bare på serveren, og API-nøkkelen eksponeres ikke i nettleseren eller kildekoden.
- Innsenderens e-postadresse brukes som `Reply-To`, slik at svar fra Gmail går direkte til innsenderen.
- Kontakt er lagt til i footer og sitemap.
- Personvernerklæringen er utvidet med behandling av kontakthenvendelser, Resend og Gmail.
- Målrettet ESLint, TypeScript-kontroll og fullt Next.js-produksjonsbygg er bestått.

Følgende gjenstår for kontaktløsningen:

- Endringene må distribueres i en ny Vercel-utrulling.
- Det publiserte skjemaet må testes med en reell melding til `lonnsinnsikt@gmail.com`.
- Det må kontrolleres at svarfunksjonen i Gmail bruker innsenderens adresse.
- Lokal e-postsending i dev-modus krever de tre miljøvariablene i `.env.local`. De er foreløpig bare konfigurert i Vercel for Production og Preview.

## Hva Google krever

Google sier at et nettsted som skal godkjennes for AdSense, må ha unikt og relevant innhold og en god brukeropplevelse. Navigasjonen skal være tydelig, og innholdet skal være originalt og interessant.

Google tillater ikke annonser på sider:

- uten publisistinnhold eller med innhold av lav verdi
- som er under utvikling
- som primært brukes til navigasjon eller andre handlinger
- med automatisk generert innhold som ikke er manuelt gjennomgått eller kuratert
- med kopiert eller omskrevet innhold uten selvstendig kommentar eller merverdi
- hvor annonser eller betalt promotering utgjør mer enn hovedinnholdet

Google definerer «scaled content abuse» som mange sider som er laget primært for å manipulere søkerangeringer og ikke for å hjelpe brukeren. Risikoen gjelder uavhengig av om sidene er laget med AI, kode, maler eller manuelt.

Google anbefaler også at nettstedet tydelig svarer på:

- Hvem har laget innholdet?
- Hvordan ble innholdet laget og kontrollert?
- Hvorfor ble innholdet laget?

### Offisielle Google-kilder

- [Make sure your site's pages are ready for AdSense](https://support.google.com/adsense/answer/7299563?hl=en)
- [Eligibility requirements for AdSense](https://support.google.com/adsense/answer/9724?hl=en)
- [AdSense Program policies](https://support.google.com/adsense/answer/48182?hl=en)
- [Google-served ads on screens without publisher-content](https://support.google.com/publisherpolicies/answer/11112688?hl=en)
- [Google-served ads on screens with replicated content](https://support.google.com/publisherpolicies/answer/11190248?hl=en)
- [More ads or paid promotional material than publisher-content](https://support.google.com/publisherpolicies/answer/11169917?hl=en)
- [Required content in the privacy policy](https://support.google.com/adsense/answer/1348695?hl=en)
- [Google consent management requirements for publishers](https://support.google.com/adsense/answer/13554116?hl=en)
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search spam policies: scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content)

## Funn i Lønnsinnsikt

### 1. Et svært stort, skalert sideunivers

Kodebasen inneholder blant annet:

- 407 genererte yrkesmodeller.
- 52 genererte lærlingmodeller.
- Egne URL-familier for yrker, timelønn, lønnsvekst, lærlinger, yrkesgrupper, yrkesfamilier og yrkesområder.
- 59 blogginnlegg.
- 24 forklaringsartikler.
- 361 yrker på den publiserte yrkesoversikten.

Mange yrkessider bruker samme standardtekst, eksempelvis:

> «… er en yrkesgruppe i SSBs yrkesstatistikk som samler roller med lignende arbeidsoppgaver og kompetansekrav.»

Sidene inneholder mye unik statistikk. Det er et godt utgangspunkt, men malstrukturen kan likevel få nettstedet til å fremstå automatisk generert. Risikoen oppstår når Google ikke tydelig kan se den redaksjonelle merverdien utover SSB-data og en felles mal.

Relevant kode:

- `src/lib/occupation-detail-pages.ts`
- `src/lib/generated/occupation-detail-view-models/`
- `src/lib/generated/apprenticeship-detail-view-models/`
- `src/app/sitemap.ts`

### 2. Svak avsenderidentitet

Alle blogg- og forklaringsartiklene oppgir bare «Kristian». Navnet er ikke lenket til en forfatterside, og nettstedet forklarer ikke fullt navn, relevant bakgrunn, kompetanse eller redaksjonelt ansvar.

Om-siden forklarer produktet, men ikke tydelig hvem som står bak. En kontaktside og synlig
e-postadresse er nå implementert, men fullt navn på ansvarlig person, organisasjonsinformasjon,
forfatterside og en tydelig rettelseskanal gjenstår.

Dette svekker signalene Google omtaler som «Who, How and Why», særlig for innhold om lønn, økonomi og arbeidsliv.

Relevant kode:

- `src/components/blog-post-header.tsx`
- `src/app/om/page.tsx`
- `src/app/redaksjonelle-retningslinjer/page.tsx`

### 3. Personvernerklæringens AdSense- og samtykkedel er ferdigstilt

Personvernsiden identifiserer nå Håkon Rolfsen og enkeltpersonforetakets organisasjonsnummer som
eier og behandlingsansvarlig. Den beskriver opplysningstyper, formål og behandlingsgrunnlag,
kontaktskjemaet, Resend og Gmail, teknisk drift, Vercel Analytics og Speed Insights. Den forklarer
også Google AdSense, personlig tilpassede og ikke-personlig tilpassede annonser, annonseformål,
informasjonskapsler og lignende teknologier, aktuelle mottakere, internasjonale overføringer,
lagring, samtykke, tilbaketrekking, brukerrettigheter og klageadgang.

Erklæringen lenker til Googles forklaring av databruk, Mitt annonsesenter, informasjon om
annonseteknologileverandører og Datatilsynet. Den dynamiske og fullstendige leverandørlisten med
formål, behandlingsgrunnlag og lagringstid skal vises i CMP-en, slik at den følger det faktiske
leverandørvalget i AdSense.

Clickio CMP er integrert i kodebasen med TCF-stub, standardinnstillinger for Google Consent
Mode v2 og Clickios hovedtagg før AdSense. En permanent lenke for å åpne personvernvalgene på
nytt er lagt i bunnteksten. Personvernsiden er unntatt fra AdSense-scriptet, og Clickio-lenkene
bruker `?showConsent=no` slik at siden kan åpnes uten ny samtykkedialog.

For norsk trafikk bør nettstedet også bruke en Google-sertifisert samtykkeplattform, CMP, som støtter IAB TCF.

Relevant kode:

- `src/app/personvern/page.tsx`
- `src/app/layout.tsx`

### 4. Publisher-ID-en er rettet

Publisher-ID-en er bekreftet mot AdSense-kontoen. Den globale AdSense-koden og `public/ads.txt` bruker nå samme konto-ID:

```text
ca-pub-3073306475357950
pub-3073306475357950
```

Relevant kode:

- `src/app/layout.tsx`
- `public/ads.txt`

### 5. AdSense-lastingen er begrenset med en tillatelsesliste

AdSense-scriptet bruker nå en sentral tillatelsesliste. Forsiden, ferdige artikler, utvalgte
ressurser og analyser, yrkesdetaljer samt kalkulator- og verktøysidene kan laste AdSense.
Admin, innlogging, utviklingsruter, idésider, personvern, kontakt, feilsider, katalogsider og
genererte URL-familier som fortsatt skal kvalitetsvurderes, er blokkert som standard.

Nye ruter får ikke AdSense før de legges uttrykkelig til i tillatelseslisten. Dette reduserer
risikoen for at Auto Ads forsøker å plassere annonser på sider uten tilstrekkelig
publisistinnhold. Tilsvarende sideunntak må fortsatt konfigureres i AdSense-kontoen og
kontrolleres etter produksjonsutrulling, særlig ved intern navigasjon uten full sidelasting.

Relevant kode:

- `src/app/layout.tsx`
- `src/components/adsense-script.tsx`
- `src/lib/adsense-routes.ts`

### 6. Domenesignaler bør samordnes

Produksjon videresender fra `lonnsinnsikt.no` til `www.lonnsinnsikt.no`, mens fallback-verdien i nettstedskonfigurasjonen bruker domenet uten `www`.

Sitemap, canonical, Open Graph, AdSense-registrering og interne absolutte URL-er bør bruke samme foretrukne domene uten å gå gjennom en videresending.

Relevant kode:

- `src/lib/site-config.ts`
- `src/app/sitemap.ts`
- `src/app/layout.tsx`

### 7. Flere overlappende URL-familier

Nettstedet har separate sider for blant annet:

- hovedinformasjon om et yrke
- timelønn for samme yrke
- lønnsvekst for samme yrke
- lærlinglønn
- yrkesfamilie
- yrkesområde
- yrkesgruppe

Timelønn og lønnsvekst finnes allerede som naturlige deler av en fullstendig yrkesside. Separate URL-er kan derfor gi flere sider som svarer på nesten samme søkeintensjon.

Det finnes også parallelle ruter med og uten norske bokstaver for enkelte temasider. Canonical reduserer problemet, men en permanent videresending til én valgt URL er ryddigere.

### 8. Det eksisterende innholdet har flere sterke sider

De nyere fagartiklene er betydelig bedre enn et typisk nettsted med lavverdiinnhold. Artiklene om blant annet betongarbeidere og bilmekanikere:

- skiller mellom median, gjennomsnitt, årslønn og beregnet timelønn
- oppgir SSB-tabell og periode
- forklarer statistiske begrensninger
- sammenligner relevante yrker
- tilfører egen analyse, diagrammer og praktisk tolkning

Kildesiden, redaksjonelle retningslinjer, kalkulatorene og de interaktive sammenligningene er også gode byggesteiner.

Strategien bør derfor være konsolidering, menneskelig kvalitetskontroll og tydeligere redaksjonell verdi – ikke masseproduksjon av flere artikler.

## Prioritert utviklingsplan

### Fase 1: Rett tekniske og juridiske sperrer

Dette bør gjennomføres før nytt innholdsarbeid og før ny AdSense-gjennomgang.

#### 1. Bekreft riktig AdSense publisher-ID

Status: Gjennomført i kodebasen. Publisert `ads.txt` bør kontrolleres etter neste utrulling.

- Kontroller publisher-ID-en i den faktiske AdSense-kontoen.
- Bruk samme ID i AdSense-scriptet og `public/ads.txt`.
- Kontroller den publiserte `ads.txt`-filen etter utrulling.

#### 2. Implementer en Google-sertifisert CMP

Status: Implementert i kodebasen med Clickio CMP, TCF-stub og Google Consent Mode v2.
Produksjonsutrulling og kontroll for norske og øvrige EØS-brukere gjenstår.

- Velg Google sin egen CMP eller en annen Google-sertifisert CMP.
- Sørg for støtte for gjeldende IAB TCF-versjon.
- Ikke last personlig tilpassede annonser før gyldig samtykke foreligger.
- Kontroller oppførselen for norske og øvrige EØS-brukere.

#### 3. Skriv en fullstendig personvernerklæring

Status: Innholdet er gjennomført, personvernsiden er unntatt fra AdSense-scriptet, og en
permanent lenke for å åpne personvernvalgene på nytt er lagt i bunnteksten. Produksjonstest
av personvernsiden og Clickio-dialogen gjenstår.

Personvernerklæringen bør minst forklare:

- hvem som er behandlingsansvarlig
- kontaktinformasjon
- hvilke data som samles inn
- behandlingsgrunnlag og formål
- bruk av Google AdSense, Vercel Analytics og Speed Insights
- informasjonskapsler og lokal lagring
- personlig tilpassede og ikke-personlig tilpassede annonser
- relevante tredjepartsleverandører
- hvordan samtykke kan endres eller trekkes tilbake
- hvordan brukeren kan reservere seg mot personlig tilpassede annonser
- lagringstid og brukerens rettigheter

#### 4. Opprett en kontaktside

Status: Implementert og teknisk validert. Utrulling og reell produksjonstest gjenstår.

Kontaktsiden inneholder nå:

- fungerende e-postadresse
- kanal for feilretting og redaksjonelle henvendelser
- sikkert kontaktskjema via Resend
- servervalidering og grunnleggende spamvern
- lenke til personvernerklæringen

Følgende bør fortsatt legges til senere:

- navn på ansvarlig person eller virksomhet
- eventuelt organisasjonsnummer
- tydelig forventning til svartid

#### 5. Begrens hvor AdSense lastes

- Ikke last AdSense på admin og innlogging.
- Ikke last AdSense på utviklingsruter.
- Ikke vis annonser på feil- eller tomtilstander.
- Vurder katalog-, søke- og kalkulatorsider særskilt.
- Bruk annonser bare der det finnes tilstrekkelig, selvstendig hovedinnhold.
- Kontroller Auto Ads-innstillingene i AdSense.

#### 6. Velg ett canonical-domene

- Velg enten `https://www.lonnsinnsikt.no` eller `https://lonnsinnsikt.no`.
- Bruk valgt domene i miljøvariabler, metadata, sitemap og AdSense.
- Videresend alle alternative vertsnavn permanent til valgt domene.

### Fase 2: Kartlegg og reduser indeksérbart malinnhold

Lag en full URL-oversikt fra sitemap og Google Search Console, gruppert etter sidetype:

- `/yrke/[slug]`
- `/timelonn/[slug]`
- `/lonnsvekst/yrke/[slug]`
- `/laerling/[slug]`
- yrkesfamilier
- yrkesområder
- yrkesgrupper
- blogg
- Forklarer
- kalkulatorer og verktøy

Vurder følgende for hver URL:

1. Har siden søkevisninger, klikk eller dokumentert bruk?
2. Gir siden et selvstendig svar som ikke allerede finnes på en annen side?
3. Har siden komplett og oppdatert datadekning?
4. Har siden en manuelt kontrollert og yrkesspesifikk forklaring?
5. Har siden synlig kilde, periode, metode og oppdateringsdato?
6. Har siden nyttig analyse, ikke bare tall og grafikk?
7. Fungerer alle grafer, tabeller og relaterte lenker?

Sider som ikke består kontrollen bør:

- tas ut av sitemap
- få `noindex`
- beholdes for brukere hvis de fortsatt har en nyttig intern funksjon
- forbedres før de eventuelt åpnes for indeksering igjen

Sidene skal ikke nødvendigvis slettes.

#### Konsolider overlappende innhold

En anbefalt hovedstruktur er:

- Én fullstendig hovedside per yrke.
- Timelønn, lønnsvekst, lønnsspredning, kjøpekraft og kjønnsforskjeller samles på hovedsiden.
- Separate undersider beholdes bare når de dekker en tydelig annen brukeroppgave og har selvstendig innhold.
- Alternative URL-er videresendes permanent til foretrukket side.

### Fase 3: Innfør en publiseringsgrense for yrkessider

En yrkesside bør ikke være indeksérbar før den har:

- en manuelt gjennomgått yrkesbeskrivelse
- en unik oppsummering av hva som kjennetegner akkurat dette yrket
- tolkning av lønnsnivå, utvikling og spredning
- forklaring på hva statistikken ikke kan fortelle
- relevant sammenligning med nærliggende yrker
- direkte lenker til aktuelle SSB-tabeller
- tydelig periode og dato for siste kontroll
- navngitt redaktør eller faglig kontrollør
- forklaring av alle beregnede tall
- fungerende grafer og tabeller
- ingen tomme felt eller kunstige standardavsnitt

Det bør ikke brukes en vilkårlig ordgrense. Kravet skal være et komplett, presist og nyttig svar på brukerens spørsmål.

#### Forslag til redaksjonell kontrolliste for hver yrkesside

- Er yrkesgruppen og STYRK-koden forklart korrekt?
- Er siste tilgjengelige periode oppgitt?
- Er median og gjennomsnitt brukt riktig?
- Er årslønn og timelønn tydelig merket som beregninger?
- Er kjønnstall tolket forsiktig når gruppene er små?
- Er mulige brudd i tidsserien forklart?
- Er sammenligningsyrkene faglig relevante?
- Er alle påstander sporbare til en kilde?
- Har et menneske kontrollert teksten og tallene?
- Gir siden mer verdi enn det brukeren får direkte i Statistikkbanken?

### Fase 4: Styrk tillit og redaksjonell transparens

#### 1. Opprett en forfatterside

Forfattersiden bør vise:

- fullt navn
- bilde, hvis ønskelig
- relevant arbeidserfaring og kompetanse
- hvorfor personen arbeider med lønnsdata
- redaksjonelt ansvarsområde
- lenker til publiserte artikler
- kontaktmulighet

Navnet i artikkelens byline bør lenke til denne siden.

#### 2. Utvid om-siden

Om-siden bør forklare:

- hvem som eier og driver Lønnsinnsikt
- hvorfor nettstedet ble opprettet
- hvilken praktisk brukeroppgave nettstedet løser
- hvordan innholdet finansieres
- forholdet mellom redaksjonelt innhold og annonser

#### 3. Opprett en rettelsespolicy

Forklar:

- hvordan feil kan meldes
- hvem som vurderer rettelser
- hvordan vesentlige endringer synliggjøres
- hvordan oppdateringsdatoer brukes

#### 4. Lag en detaljert metodeside

Metodesiden bør dokumentere:

- SSB-tabellene som brukes
- valgte variabler og avgrensninger
- forskjellen mellom månedslønn, avtalt lønn og årslønn
- beregning av timelønn
- beregning av kjøpekraft og reallønnsvekst
- behandling av manglende data
- oppdateringsfrekvens
- manuell kvalitetskontroll
- kjente begrensninger

#### 5. Konkretiser AI-policyen

Forklar tydelig:

- hvor AI brukes
- hvorfor AI brukes
- hvilke deler som alltid kontrolleres manuelt
- at AI aldri brukes som kilde til lønnsdata
- hvem som har redaksjonelt ansvar for sluttproduktet

#### 6. Vis kontrollinformasjon på innholdet

Artikler og viktige datasider bør vise:

- skrevet av
- eventuelt kontrollert av
- publisert dato
- sist oppdatert eller sist kontrollert
- dataperiode
- metode- og kildelenker

### Fase 5: Forbedre eksisterende innhold før nye artikler

Av de 59 blogginnleggene er 18 kortere enn omtrent 800 ord. Ordtallet er ikke et Google-krav, men disse artiklene bør gjennomgås først for å se om de mangler:

- original analyse
- konkrete eksempler
- direkte kildelenker
- forbehold og avgrensninger
- praktiske handlinger leseren kan ta
- en tydelig forskjell fra yrkessiden om samme tema

Prioriter først eksisterende artikler som allerede får visninger eller klikk i Search Console.

Ikke publiser mange svært like «Hva tjener X?»-artikler i rask rekkefølge. Bygg heller sterke hovedressurser om:

- hvordan man leser og sammenligner lønnsstatistikk
- hvordan median, kvartiler og kjøpekraft brukes i en lønnssamtale
- hvorfor en SSB-gruppe kan avvike fra den konkrete stillingstittelen
- hvordan arbeidstid, sektor, tillegg og ansvar påvirker sammenligningen
- hvordan man sammenligner et jobbtilbud med markedet
- hva lønnsdata kan og ikke kan si om lønnsforskjeller
- egne analyser av utvikling som ikke kan leses direkte ut av én SSB-tabell

#### Prioriter original merverdi

Den tydeligste konkurransefordelen er ikke å gjengi SSB-tall. Den er å:

- koble flere SSB-tabeller sammen
- forklare databrudd og begrensninger
- vise relevante sammenligninger
- gjøre beregninger transparente
- trekke nøkterne, etterprøvbare konklusjoner
- gi leseren et konkret beslutningsgrunnlag

### Fase 6: Navigasjon og intern struktur

Navigasjonen er i hovedsak ryddig, men sidehierarkiet bør gjennomgås etter konsolideringen.

Målet bør være:

1. Brukeren finner raskt riktig yrke.
2. Hovedsiden for yrket gir et fullstendig svar.
3. Dypere guider forklarer metode og praktisk bruk.
4. Relaterte yrker og artikler er faglig relevante.
5. Ingen sider fungerer primært som mellomstasjoner for flere annonsevisninger.

Katalogsider med mange lenker bør ha tydelig egenverdi gjennom filtrering, forklaring og sammenligning. De bør ikke fylles med annonser som gjør hovedfunksjonen vanskelig å bruke.

### Fase 7: Kvalitetssikring før ny gjennomgang

Før det klikkes «Be om gjennomgang», skal følgende være kontrollert:

#### Teknisk

- Publisher-ID er riktig og samsvarer med `ads.txt`.
- Valgt canonical-domene brukes konsekvent.
- Sitemap inneholder bare sider som skal indekseres.
- Alle alternative URL-er videresendes riktig.
- Admin, utvikling og andre interne sider har `noindex` og ingen annonser.
- Ingen indeksérbare sider gir 404, 500 eller tomt innhold.
- Alle viktige sider fungerer uten JavaScript-feil.
- Mobilvisning og Core Web Vitals er akseptable.

#### Innhold

- Alle indeksérbare sidetyper er manuelt kontrollert.
- Ingen sider har tomme dataseksjoner eller ødelagte grafer.
- Ingen yrkessider består hovedsakelig av standardtekst.
- Tall har kilde og periode.
- Beregninger er tydelig merket.
- Artikler har navngitt forfatter og oppdateringsdato.
- Personvern, kontakt, metode, om-side og redaksjonelle retningslinjer er publisert.

#### Annonser

- Annonser vises bare på egnede innholdssider.
- Annonser er tydelig skilt fra innhold og navigasjon.
- Det er alltid mer hovedinnhold enn annonser og promotering.
- Auto Ads er kontrollert på mobil og desktop.
- CMP fungerer for norske og øvrige EØS-brukere.

#### Google Search Console

- Ingen manuelle tiltak er registrert.
- Sitemap er lest uten kritiske feil.
- De viktigste sidene er rekrypet etter endringene.
- «Crawled – currently not indexed» er analysert per sidetype.
- «Discovered – currently not indexed» er analysert per sidetype.
- Svake URL-familier er fjernet fra sitemap og satt til `noindex`.
- Google velger samme canonical som nettstedet oppgir.

## Foreslått fremdriftsplan

### Uke 1: Compliance og grunnmur

- [x] Bekreft og rett publisher-ID.
- [x] Implementer CMP i kodebasen.
- [x] Utvid personvernerklæringen for kontaktskjema, Resend og Gmail.
- [x] Ferdigstill AdSense- og samtykkedelen av personvernerklæringen.
- [x] Opprett kontaktside og integrasjon mot Resend.
- [x] Distribuer kontaktsiden og test reell e-postlevering.
- Velg canonical-domene.
- [x] Begrens AdSense-lasting med en sentral tillatelsesliste i kodebasen.
- Konfigurer tilsvarende sideunntak for Auto Ads i AdSense-kontoen.

### Uke 2: URL- og indeksanalyse

- Eksporter data fra Search Console.
- Lag oversikt per URL-familie.
- Identifiser overlappende, tomme og svake sider.
- Bestem hvilke sider som skal beholdes, slås sammen eller få `noindex`.
- Oppdater sitemap og redirects.

### Uke 3 og 4: Redaksjonell kvalitet

- Opprett forfatter-, metode- og rettelsessider.
- Utvid om-siden og redaksjonelle retningslinjer.
- Innfør publiseringskrav for yrkessider.
- Forbedre de viktigste eksisterende yrkessidene.
- Forbedre eksisterende artikler med søkevisninger.

### Uke 5: Produksjonskontroll

- Test et representativt utvalg av alle sidetyper på mobil og desktop.
- Kontroller annonser, CMP, navigasjon, grafer og datatilstander.
- Kontroller Search Console, sitemap, canonical og indeksering.
- Rett resterende feil.

### Uke 6 eller når Google har rekrypet endringene

- Kontroller at Google ser den nye strukturen og de nye tillitssidene.
- Bekreft at svake sider ikke lenger ligger i sitemap eller indeksen.
- Dokumenter internt at alle kontrollpunkter er bestått.
- Be først da om en ny AdSense-gjennomgang.

Det finnes ingen garanti for at Google rekryper eller godkjenner nettstedet innen en bestemt tidsperiode. Det bør derfor ikke søkes på nytt bare fordi et visst antall dager har gått. Den faktiske indeksprofilen og kvaliteten på den publiserte siden bør være avgjørende.

## Kontrollpunkter før ny søknad

Ny gjennomgang bør ikke bestilles før alle punktene nedenfor kan besvares med ja:

- [x] Riktig publisher-ID brukes både i AdSense-scriptet og `ads.txt`.
- [x] Google-sertifisert CMP er implementert og testet.
- [ ] Personvernerklæringen oppfyller AdSense-kravene.
- [ ] Kontaktside og fungerende e-postadresse er publisert.
- [x] Kontaktsiden er implementert og teknisk validert.
- [x] Resend-domene og DNS-poster er verifisert.
- [x] Resend-hemmeligheter er konfigurert som sensitive Vercel-variabler.
- [ ] En reell kontakthenvendelse er sendt og mottatt etter utrulling.
- [ ] Ansvarlig eier og redaktør er tydelig oppgitt.
- [ ] Forfattersiden er publisert og byline lenker til den.
- [ ] Metode og AI-bruk er forklart konkret.
- [ ] AdSense lastes ikke på admin-, utviklings-, feil- eller tomme sider.
- [ ] Canonical-domene, redirects og sitemap samsvarer.
- [ ] Overlappende URL-er er slått sammen eller tatt ut av indeksen.
- [ ] Sitemap inneholder bare sider som tilfredsstiller kvalitetskravene.
- [ ] Alle indeksérbare yrkessider er manuelt gjennomgått.
- [ ] Alle indeksérbare sider gir selvstendig verdi utover rå SSB-data.
- [ ] Grafer, tabeller og kalkulatorer fungerer på mobil og desktop.
- [ ] Ingen side har mer annonser eller promotering enn hovedinnhold.
- [ ] De viktigste endringene er rekrypet av Google.
- [ ] Search Console viser ingen manuelle tiltak eller kritiske indeksfeil.

## Anbefalt rekkefølge

Den mest effektive rekkefølgen er:

1. Publisher-ID, personvern, CMP og kontakt.
2. Kartlegging og `noindex` av svake eller overlappende URL-er.
3. Avsender, metode og redaksjonell kontroll.
4. Forbedring av de viktigste eksisterende yrkes- og bloggsidene.
5. Produksjonskontroll og ny AdSense-gjennomgang.

Det anbefales ikke å be om ny gjennomgang med dagens oppsett. Først bør nettstedet vise Google et mindre, tydeligere og mer menneskelig kuratert sett med sider.

## Begrensning ved vurderingen

Den innebygde visuelle nettleseren var ikke tilgjengelig under gjennomgangen. Vurderingen bygger derfor på:

- offisielle Google-retningslinjer
- publisert innhold som kunne leses via webindeksen
- lokal gjennomgang av kodebase, innhold, sitemap og robots-oppsett

En full visuell produksjonskontroll på mobil og desktop må derfor inngå før ny AdSense-søknad.
