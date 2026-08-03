# AdSense-tiltaksplan for Lønnsinnsikt

Dato for kartleggingen: 3. august 2026
Status: Klar for gjennomføring

## Hovedkonklusjon

Lønnsinnsikt har mye godt innhold, men Google møter et nettsted der omtrent 83 prosent av sitemapet består av programmatisk produserte yrkes-, lærling- og katalogsider. Flere av disse sidene lover lønnsinnhold uten å ha faktiske lønnstall.

Den mest sannsynlige årsaken til AdSense-avslaget er kombinasjonen av:

1. Et svært stort programmatisk sideunivers sammenlignet med mengden redaksjonelt innhold.
2. Yrkesdetaljer med tomme eller mangelfulle lønnsseksjoner.
3. AdSense-tillatelse på alle yrkessider, uavhengig av datadekning.
4. Mange katalogsider som primært fungerer som navigasjon.
5. Enkelte korte og generelle forklaringsartikler med begrenset selvstendig verdi.

Løsningen er ikke å produsere flest mulig nye artikler. Lønnsinnsikt trenger en streng publiseringsgrense som hindrer at svake programmatisk produserte sider blir indeksert eller får annonser.

Det er ikke mulig å garantere godkjenning, men tiltakene nedenfor retter seg mot de tydeligste risikosignalene i den nåværende kodebasen og på det publiserte nettstedet.

## Kartlagt sideomfang

| Sidetype | Antall |
| --- | ---: |
| Statiske sider | 43 |
| Yrkesgrupper | 8 |
| Yrkesdetaljer | 407 URL-er |
| Lærlingdetaljer | 51 |
| Bloggartikler | 60 |
| Forklarer-artikler | 24 |
| Bloggkategorier | 2 |
| Estimert totalt sitemap | **593 URL-er** |

466 av 593 URL-er er programmatisk produserte yrkes-, lærling- eller yrkesgruppesider. Bare 84 URL-er er redaksjonelle blogg- eller forklaringsartikler.

## Kritiske funn

### 1. AdSense tillates på alle yrkessider

AdSense-konfigurasjonen godkjenner enhver URL som matcher `/yrke/[slug]`, uten å kontrollere om siden faktisk har tilstrekkelig lønnsinnhold.

Dette inkluderer:

- 26 yrkessider uten både lønnstrend og lønnsfordeling
- 45 sider uten lønnsfordeling
- 38 sider uten median lønnsserie
- 48 sider for yrker med færre enn 100 registrerte lønnstakere
- 24 sider for yrker med færre enn 20 registrerte lønnstakere

Eksempler på utsatte sider er:

- ystere i gårdsproduksjon
- privatetterforskere
- andre dyreoppdrettere og røktere
- saftere og syltere
- kodere
- kunsthåndverkere i tre
- birøktere
- fangstfolk
- gips- og sparklingsarbeidere

På disse sidene kan brukeren møte overskrifter som «Lønnsfordeling», «Lønnsutvikling» og «Reallønnsvekst» uten at det finnes faktiske lønnstall under seksjonene. Dette gir en tydelig risiko for at Google vurderer sidene som innhold av lav verdi.

Relevant kode:

- `src/lib/adsense-routes.ts`
- `src/components/adsense-script.tsx`
- `src/components/occupation-detail-page.tsx`

### 2. Svært korte yrkesintroduksjoner

Alle de 406 yrkesmodellene har unike introduksjoner, som er positivt. Introduksjonene er likevel svært korte:

- median: 17 ord
- korteste: 13 ord
- lengste: 32 ord

Resten av teksten produseres i stor grad fra samme komponent og de samme tekstmalene. Sidene inneholder unik statistikk og egne beregninger, men helheten kan likevel fremstå som skalert malinnhold med lite menneskelig, yrkesspesifikk bearbeiding.

Relevant kode og data:

- `src/components/occupation-detail-page.tsx`
- `src/lib/occupation-detail-pages.ts`
- `src/lib/generated/occupation-detail-view-models/`

### 3. Yrkesfamilier og yrkesområder er fjernet

Status 3. august 2026: Gjennomført i kodebasen.

122 yrkesfamiliesider, 43 yrkesområdesider og de to tilhørende oversiktssidene er fjernet som egne brukerflater og tatt ut av sitemapet. Footerlenker og filtre for yrkesfamilie og yrkesområde er også fjernet. Gamle URL-er videresendes permanent til `/yrker`.

Nettstedet beholder hovedoversikten `/yrker` og de åtte brede yrkesgruppene. Yrkesoversikten kan fortsatt søkes og filtreres på yrkesgruppe.

Relevant kode:

- `src/app/sitemap.ts`
- `src/app/yrker/page.tsx`
- `src/app/yrkesgrupper/[slug]/page.tsx`
- `src/components/occupation-directory.tsx`
- `next.config.ts`

### 4. Enkelte forklaringsartikler er svært korte

13 av 24 forklaringsartikler har under 500 ord. Korthet er ikke automatisk et kvalitetsproblem, og Google har ingen fast ordgrense. De svakeste artiklene er likevel generelle og har begrenset egen analyse, praktisk anvendelse og kildebruk.

De korteste er:

| Artikkel | Omtrentlig antall ord |
| --- | ---: |
| `lonnsfordeling.mdx` | 185 |
| `gjennomsnittslonn.mdx` | 188 |
| `grunnlonn.mdx` | 206 |
| `disponibel-arbeidstid.mdx` | 220 |

Bloggen er betydelig sterkere. Medianen er omtrent 819 ord, og mange innlegg har egne diagrammer, tabeller, beregninger og SSB-kilder.

Relevant innhold:

- `src/content/forklarer/`
- `src/content/blog/`

### 5. Tekniske oppryddingspunkter

Kartleggingen avdekket også:

- 407 yrke-URL-er for 406 modellfiler fordi regnskapsførere finnes med to slugs.
- `/kvinner-vs-menn` og `/topp-jobber` er merket `noindex`, men ligger likevel i sitemapet.
- To temasider finnes parallelt med og uten `ø` i URL-en. Canonical peker til foretrukket URL, men permanente videresendinger mangler.

Disse punktene er neppe hovedårsaken til avslaget alene, men de bidrar til inntrykket av et stort og maskinelt sideunivers.

## Det som allerede er bra

Lønnsinnsikt har flere sterke tillitssignaler og innholdselementer som bør beholdes:

- Håkon Rolfsen er identifisert som ansvarlig.
- Organisasjonsnummer og kontaktmuligheter er oppgitt.
- Metode, datakilder, AI-bruk og begrensninger forklares åpent.
- Nettstedet har rettelsespolicy, redaksjonelle retningslinjer og personvernside.
- Blogg- og forklaringsartikler bruker en tydelig forfatterbyline.
- Yrkesdata viser periode og lenker til SSB.
- 361 av 406 yrkessider har full lønnsfordeling.
- 380 av 406 yrkessider har lønnstrend.
- 368 av 406 yrkessider har sektordata.
- 405 av 406 yrkessider har aldersdata.
- Alle 51 lærlingdetaljer har lønnstrend og lønnsfordeling.
- Flere blogginnlegg har egne analyser, diagrammer, tabeller og beregninger.

Prosjektet trenger derfor ikke en total innholdsmessig ombygging. Det trenger konsolidering og en streng kvalitetsgrense for indeksering og annonser.

## Prioritert tiltaksplan

### Fase 1: Stopp annonser på svake sider

Dette skal gjennomføres før det bes om en ny AdSense-gjennomgang.

#### 1. Fjern generell AdSense-tillatelse for `/yrke/[slug]`

- Fjern den generelle regulære uttrykksregelen som tillater annonser på alle yrkessider.
- Erstatt den med en eksplisitt eller datadrevet tillatelsesliste.
- Tillat bare AdSense på yrkessider som har komplett datadekning og er kvalitetskontrollert.
- Sørg for at nye yrkessider ikke automatisk får annonser.
- Kontroller tilsvarende sideunntak i AdSense-kontoens Auto Ads-innstillinger.

#### 2. Definer en minimumsgrense for annonser

En yrkesside skal ikke få AdSense før den minst har:

- faktisk publisert lønnsnivå eller lønnsfordeling
- en fungerende lønnsserie eller annen selvstendig lønnsanalyse
- ingen tomme eller misvisende innholdsseksjoner
- tydelig periode og kilde
- en yrkesspesifikk introduksjon
- tilstrekkelig datagrunnlag til å gi brukeren et meningsfullt svar
- gjennomført redaksjonell kontroll

Antall lønnstakere skal ikke være det eneste kriteriet. Små yrker kan beholdes dersom siden har god datadekning og tydelig forklarer begrensningene.

### Fase 2: Reduser svakt innhold i Google-indeksen

#### 1. Skjerm de 26 svakeste yrkessidene

Yrkesdetaljer uten både lønnstrend og lønnsfordeling skal:

- få `noindex`
- fjernes fra sitemapet
- ikke laste AdSense
- fortsatt kunne beholdes for intern navigasjon hvis arbeidsmarkedsdataene er nyttige

Sidene skal ikke blokkeres i `robots.txt`, fordi Google må kunne besøke dem og lese `noindex`-signalet.

#### 2. Vurder de resterende sidene uten lønnsfordeling

De 19 øvrige sidene uten lønnsfordeling skal vurderes manuelt. En side kan beholdes som indekserbar dersom den har en sterk lønnsserie, annen selvstendig analyse og et komplett svar. Sider med tomme lønnsseksjoner skal skjermes.

#### 3. Fjern svake katalogsider

Status 3. august 2026: Gjennomført i kodebasen.

- Alle yrkesfamiliesider og yrkesområdesider er fjernet.
- De to oversiktssidene er fjernet.
- Alle tilhørende URL-er er tatt ut av sitemapet.
- Footerlenker og filtre er fjernet.
- Gamle URL-er videresendes permanent til `/yrker`.
- Hovedoversikten `/yrker` og de åtte brede yrkesgruppene er beholdt.

#### 4. Bruk Search Console i den endelige prioriteringen

Før større grupper av sider skjermes, skal Search Console-data brukes til å kontrollere:

- visninger og klikk de siste tre til seks månedene
- hvilke sider som faktisk svarer på relevante søk
- hvilke sider som er oppdaget, men ikke indeksert
- hvilke sider Google vurderer som duplikater eller alternative canonical-sider
- hvilke programmatisk produserte sider som allerede har dokumentert bruk

Sider med god organisk bruk skal vurderes særskilt før `noindex` innføres.

### Fase 3: Innfør en automatisk publiseringsgrense

Indeksering, sitemap og AdSense skal styres av samme sentrale kvalitetsvurdering.

En yrkesside skal ikke automatisk bli indekserbar bare fordi det finnes en generert modellfil.

Kvalitetsvurderingen bør kontrollere:

- om siden har faktisk lønnsdata
- om lønnsfordeling finnes
- om lønnsutvikling finnes
- om relevante grafer har datapunkter
- om tomme seksjoner skjules
- om kilde og periode finnes
- om yrkesbeskrivelsen finnes
- om datagrunnlaget er stort nok eller begrensningene er tydelig forklart
- om siden er manuelt godkjent der det kreves

Den samme vurderingen skal brukes av:

- `generateMetadata` for `index` eller `noindex`
- `src/app/sitemap.ts`
- `src/lib/adsense-routes.ts`
- selve yrkeskomponenten når seksjoner skal vises eller skjules

Dette hindrer at sitemap, metadata, annonser og synlig innhold kommer i konflikt med hverandre.

### Fase 4: Styrk de viktigste yrkessidene

Prioriter yrker med dokumentert søkeetterspørsel, komplett datadekning og høy brukerrelevans.

De viktigste sidene bør få:

- en mer utfyllende, manuelt kontrollert yrkesintroduksjon
- en unik oppsummering av lønnsnivå og utvikling
- forklaring av hva som særpreger akkurat dette yrket
- relevant sammenligning med nærliggende yrker
- tydelig tolkning av median, gjennomsnitt og lønnsspredning
- forklaring av statistiske begrensninger
- konkrete eksempler på hvordan tallene kan brukes i en lønnssamtale
- lenke til metode, kilde og eventuell lærlinginformasjon
- synlig dato for siste datakontroll
- tydelig redaksjonelt ansvar

Målet er ikke en bestemt ordmengde. Målet er at siden skal gi mer praktisk verdi enn en direkte oppslagsside i Statistikkbanken.

### Fase 5: Forbedre eller slå sammen korte forklaringer

Start med:

- `src/content/forklarer/lonnsfordeling.mdx`
- `src/content/forklarer/gjennomsnittslonn.mdx`
- `src/content/forklarer/grunnlonn.mdx`
- `src/content/forklarer/disponibel-arbeidstid.mdx`

Artiklene bør utvides med relevante elementer som:

- konkrete regneeksempler
- praktisk anvendelse
- vanlige misforståelser
- forskjeller mellom beslektede begreper
- lenker til relevante SSB-, NAV-, Arbeidstilsynet- eller lovkilder
- kobling til aktuelle kalkulatorer og yrkessider

Artikler med samme søkeintensjon skal vurderes slått sammen fremfor å bli utvidet kunstig.

### Fase 6: Teknisk opprydding

#### 1. Fjern duplikat for regnskapsførere

- Velg én foretrukket slug for yrkeskode `3313`.
- Videresend den alternative URL-en permanent.
- Sørg for at bare den foretrukne URL-en finnes i sitemap og yrkesindeks.

#### 2. Fjern `noindex`-sider fra sitemapet

- Fjern `/kvinner-vs-menn` fra sitemapet.
- Fjern `/topp-jobber` fra sitemapet.
- Legg inn en kontroll som hindrer at fremtidige `noindex`-sider tas med.

#### 3. Samle alternative norske URL-er

- Velg URL-ene med norske bokstaver som foretrukket variant der dette allerede er canonical.
- Legg inn permanente videresendinger fra variantene uten norske bokstaver.
- Sørg for at interne lenker bare bruker foretrukket variant.

#### 4. Kontroller produksjonssignaler

Etter utrulling skal følgende kontrolleres på det publiserte domenet:

- canonical-URL
- `robots`-metadata
- sitemap
- videresendinger
- `ads.txt`
- AdSense-script på tillatte og blokkerte sider
- Clickio CMP og samtykkeoppførsel
- mobil- og desktopvisning

## Kontrolliste før ny AdSense-søknad

Det skal ikke bes om en ny gjennomgang før alle punktene nedenfor er bekreftet:

- [ ] Den generelle AdSense-tillatelsen for alle yrkessider er fjernet.
- [ ] De 26 svakeste yrkessidene har `noindex` og er fjernet fra sitemapet.
- [ ] De øvrige sidene uten lønnsfordeling er manuelt vurdert.
- [x] Yrkesfamilier og yrkesområder er fjernet fra brukergrensesnittet og sitemapet.
- [ ] Tomme lønnsseksjoner vises ikke.
- [ ] Sitemapet inneholder ingen kjente `noindex`-sider.
- [ ] Duplikatsluggen for regnskapsførere er ryddet.
- [ ] Alternative URL-er videresendes til foretrukket variant.
- [ ] De korteste forklaringsartiklene er forbedret eller slått sammen.
- [ ] Search Console-data er brukt til å kontrollere endelig sideutvalg.
- [ ] Canonical, sitemap, robots og annonser er kontrollert i produksjon.
- [ ] Representative sider er visuelt kontrollert på mobil og desktop.
- [ ] AdSense Auto Ads har tilsvarende sideunntak som kodebasen.

## Måling etter gjennomføring

Følgende skal dokumenteres før ny søknad:

- antall URL-er i sitemap før og etter oppryddingen
- antall indekserbare yrkessider
- antall yrkessider som kan laste AdSense
- antall sider uten lønnsfordeling eller lønnstrend som fortsatt er indekserbare
- utvikling i «Oppdaget – foreløpig ikke indeksert» i Search Console
- utvikling i organiske visninger og klikk for sidene som beholdes
- dato for produksjonsutrulling og siste kvalitetskontroll

## Offisielle Google-kilder

- [What to do when your site is not ready to show ads](https://support.google.com/adsense/answer/12176698?hl=en)
- [Your AdSense account was not approved](https://support.google.com/adsense/answer/81904?hl=en)
- [Eligibility requirements for AdSense](https://support.google.com/adsense/answer/9724?hl=en)
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search spam policies: scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content)

## Anbefaling

Lønnsinnsikt bør ikke sende en ny AdSense-søknad før fase 1–3 og de tekniske oppryddingspunktene er gjennomført og kontrollert i produksjon.

Den viktigste endringen er ikke å skrive flere blogginnlegg. Den viktigste endringen er å hindre at Google vurderer de svakeste programmatisk produserte sidene som representative for hele nettstedet.
