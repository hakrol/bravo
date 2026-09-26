# SEO-plan for minstelønnssider

## Mål

Lønnsinnsikt skal dekke relevante søk om minstelønn uten å opprette mange nesten identiske sider. Sidene skal følge hvordan minstelønnsreglene faktisk er organisert, gi et presist svar på brukerens spørsmål og tilføre mer verdi enn en ren gjengivelse av offentlige satser.

Den anbefalte hovedmodellen er:

- Én autoritativ hovedside per allmenngjort bransje eller regelsett.
- En kort, yrkesspesifikk minstelønnsseksjon på relevante yrkes- og lønnssider.
- En egen minstelønnsside for et enkelt yrke bare når yrket har en tydelig egen søkeintensjon og siden kan tilby vesentlig unikt innhold.

## Hvorfor sidene bør organiseres etter regelverk

Minstelønn bestemmes ofte av bransjen, virksomheten, arbeidsoppgavene og forskriftens virkeområde. Yrkestittelen alene er ikke alltid avgjørende.

Eksempler:

- Byggereglene gjelder faglærte og ufaglærte arbeidstakere som utfører bygningsarbeid på byggeplasser.
- Restaurantreglene gjelder ansatte innen overnatting, servering, catering og lignende virksomheter på land.
- Elektro er et eget allmenngjort område, og «elektriker» er samtidig den naturlige folkelige søkeintensjonen. Den eksisterende elektrik­ersiden kan derfor beholdes som en selvstendig side.

En bransjebasert struktur gjør det mulig å vedlikeholde én korrekt versjon av regelverket og samtidig forklare hvordan det treffer flere yrker.

## Risiko ved nesten identiske yrkessider

Vanlig internt duplikatinnhold gir normalt ikke en automatisk Google-straff. Google kan i stedet:

- velge én av sidene som canonical
- unnlate å indeksere de andre sidene
- spre interne og eksterne rangeringssignaler mellom flere konkurrerende sider
- få problemer med å forstå hvilken side som er den viktigste

Hvis det opprettes mange sider for svært like søk uten vesentlig selvstendig verdi, kan det ligne doorway-innhold eller skalert innhold laget primært for søkemotorer.

Derfor bør vi ikke lage egne sider for eksempelvis tømrer, murer, maler, servitør og bartender dersom hovedinnholdet bare er den samme tabellen med et nytt yrkesnavn i tittelen.

Google-kilder:

- Canonicalisering: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Spamretningslinjer: https://developers.google.com/search/docs/essentials/spam-policies
- Nyttig og menneskeorientert innhold: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## Anbefalt informasjonsarkitektur

```text
/minstelonn
├── /minstelonn/minstelonn-restaurant
├── /minstelonn/minstelonn-bygg
├── /minstelonn/minstelonn-elektriker
├── /minstelonn/minstelonn-renholder
└── øvrige bransjesider
       ↓
Relevante yrkessider:
- /yrke/servitorer-lonn
- /yrke/kokker-lonn
- /yrke/tomrere-lonn
- /yrke/murere-lonn
```

Eksisterende URL-mønster kan beholdes for å unngå unødvendige migreringer. Å gjenta «minstelonn» i URL-en er ikke ideelt språklig, men er heller ikke et SEO-problem som alene forsvarer endring av eksisterende adresser.

### Nivå 1: Samlesiden `/minstelonn`

Samlesiden skal:

- forklare forskjellen mellom lovpålagt minstelønn, tariff og vanlig lønnsnivå
- vise alle aktuelle bransjeområder
- skille tydelig mellom lovpålagte og tariffbaserte sider
- sende brukeren til riktig bransje
- være inngangen for det brede søket «minstelønn i Norge»

### Nivå 2: Én hovedside per bransje eller regelsett

Aktuelle områder omfatter blant annet:

- restaurant, hotell og catering
- bygg
- elektro
- renhold
- bilbransjen
- godstransport
- persontransport med turbil
- jordbruk og gartneri
- skips- og verftsindustrien
- andre områder som til enhver tid har en gyldig allmenngjøringsforskrift

Listen må kontrolleres mot gjeldende forskrifter ved publisering og oppdatering. Forskrifter kan utløpe, bli erstattet eller få nye satser.

### Nivå 3: Yrkesvise seksjoner på eksisterende lønnssider

En yrkesside kan ha en egen seksjon som målretter et relevant long-tail-søk.

Eksempel på en tømrerside:

> ## Minstelønn for tømrere
>
> Jobber du med bygningsarbeid på en byggeplass, kan du være omfattet av den lovpålagte minstelønnen i byggebransjen.

Seksjonen kan vise den viktigste satsen kort, men bør lenke til byggsiden for fullstendige regler, historikk, unntak og kilder.

Dette lar yrkessiden dekke «minstelønn tømrer» uten å kopiere hele bransjesiden.

## Restaurant: anbefalt hovedside

«Minstelønn restaurant» bør prioriteres som en egen, permanent bransjeside. Søkeordet er folkelig, mens forskriften bruker betegnelsen «overnattings-, serverings- og cateringvirksomheter». Begge språkvariantene bør brukes naturlig på samme side.

### Foreslått metadata og overskrift

- URL: `/minstelonn/minstelonn-restaurant`
- SEO-tittel: `Minstelønn restaurant i 2026 – satser for voksne og unge`
- H1: `Minstelønn i restaurantbransjen`
- Innledning: `Den lovpålagte minstelønnen gjelder ansatte i restaurant, servering, hotell, catering og lignende virksomheter på land.`

Årstallet i tittelen må være dynamisk eller vedlikeholdes. Dersom gjeldende lovpålagte sats ble innført året før, skal siden tydelig si både «gjeldende i 2026» og «gjelder fra 15. juni 2025». Vi må ikke gi inntrykk av at en sats er nyere enn den faktisk er.

### Foreslåtte seksjoner

1. Gjeldende minstelønn i restaurant
2. Minstelønn for ansatte under 18 år
3. Minstelønn for servitører
4. Minstelønn for kokker
5. Minstelønn for bartendere og kaféansatte
6. Slik beregnes fire måneders praksis
7. Teller tips som lønn?
8. Har du krav på kvelds-, helge- eller nattillegg?
9. Overtid i restaurantbransjen
10. Lovpålagt minstelønn kontra Riksavtalen
11. Hva tjener kokker og servitører vanligvis?

Servitører, kokker, bartendere og kaféansatte kan behandles i egne H2-seksjoner uten at vi lager fire kopier av samme side.

### Viktig skille mellom lovpålagt minstelønn og tariff

Den lovpålagte satsen gjelder alle arbeidstakere som omfattes av forskriften. Riksavtalen kan ha mer detaljerte og høyere yrkes- og praksisbaserte satser, blant annet for kokker.

Restaurantsiden bør derfor forklare:

- hvilken sats alle som omfattes minst skal ha
- når en tariffavtale gjelder
- at en ny tariffsats ikke automatisk er ny lovpålagt minstelønn
- hvordan fagbrev, praksis og ukentlig arbeidstid påvirker tariffsatsen

Dette skillet er en viktig kilde til unikt og praktisk nyttig innhold.

### Forholdet til eksisterende innhold

- Nyhetssiden om Riksavtalen bør målrette «nye lønnssatser hotell og restaurant 2026» og andre tidsavgrensede nyhetssøk.
- Bloggsiden om servitørlønn bør målrette faktisk lønnsnivå og «hva tjener en servitør».
- Den nye restaurantsiden bør eie den eviggrønne søkeintensjonen «minstelønn restaurant».

Sidene skal lenke tydelig til hverandre, men ha forskjellige hovedspørsmål og primære søkeintensjoner.

## Bygg: anbefalt hovedside

Opprett én hovedside for det allmenngjorte regelsettet i byggebransjen.

### Foreslått metadata og overskrift

- URL: `/minstelonn/minstelonn-bygg`
- SEO-tittel: `Minstelønn bygg og anlegg i 2026 – gjeldende satser`
- H1: `Minstelønn i byggebransjen`

Uttrykket «bygg og anlegg» kan brukes for å møte søkespråket, men siden må være juridisk presis om forskriftens virkeområde. Vi må ikke hevde at absolutt alle jobber i bygg- og anleggsnæringen omfattes.

### Søkeord og spørsmål siden kan dekke

- minstelønn byggebransjen
- minstelønn bygg og anlegg
- minstelønn tømrer
- minstelønn murer
- minstelønn maler
- minstelønn rørlegger
- minstelønn ufaglært bygg
- minstelønn hjelpearbeider
- minstelønn bygg under 18 år

### Anbefalt yrkestabell

| Yrke eller situasjon | Vanligvis omfattet? | Hva må kontrolleres? |
|---|---:|---|
| Tømrer på byggeplass | Ja | Faglært eller ufaglært |
| Murer på byggeplass | Ja | Fagbrev og arbeidsoppgaver |
| Maler på byggeplass | Vanligvis | Om arbeidet er bygningsarbeid |
| Rørlegger på byggeplass | Kan være | Arbeidets art og forskriftens virkeområde |
| Elektriker | Eget regelsett | Elektroforskriften |
| Kontoransatt i byggefirma | Normalt ikke | Utfører ikke bygningsarbeid |

Alle slike vurderinger må kvalitetssikres mot gjeldende forskrift og offisiell veiledning før publisering.

## Når et yrke kan få en egen minstelønnsside

En egen, indekserbar yrkesside bør normalt bare opprettes dersom minst to eller tre av disse kriteriene er oppfylt:

- Søket har stabil etterspørsel i Google Search Console eller et søkeordsverktøy.
- Søkeintensjonen er tydelig forskjellig fra bransjesiden.
- Yrket har egne tarifftrinn, tillegg eller avgrensninger.
- Vi kan tilføre betydelig yrkesspesifikt innhold.
- Søkeresultatene domineres av yrkesspesifikke sider.
- Siden kan kobles til egne SSB-data om faktisk lønn.

Hvis kriteriene ikke er oppfylt, bruker vi en yrkesseksjon på bransjesiden og en kort minstelønnsmodul på yrkessiden.

### Eksempel: mulig side om minstelønn for kokker

En selvstendig kokkeside kan forsvares hvis den behandler flere av følgende temaer grundig:

- lovpålagt minstelønn som gjelder restaurantansatte generelt
- Riksavtalens egne satser for kokker
- fagbrev og praksistrinn
- forskjellen mellom 35,5 og 37,5 timers arbeidsuke
- faktisk kokkelønn fra SSB
- restaurantkokk kontra institusjonskokk eller kantine
- lærlinglønn og relevante unntak

Da svarer siden på et annet og mer detaljert spørsmål enn den generelle restaurantsiden. Hvis siden bare gjentar restaurantens lovpålagte sats, skal den ikke opprettes.

## Innhold hver hovedside bør ha

En god minstelønnsside bør inneholde:

- et kort svar og gjeldende sats øverst
- nøyaktig ikrafttredelsesdato
- en «Gjelder dette meg?»-veiviser
- satser etter alder, fagbrev og erfaring
- konkrete regneeksempler per uke, måned og overtid
- lovpålagt minstelønn sammenlignet med tariff
- minstelønn sammenlignet med faktisk medianlønn
- tillegg, reise, kost, losji og arbeidstøy der det er relevant
- historisk utvikling
- yrker og arbeidssituasjoner som omfattes
- tydelige unntak og gråsoner
- primærkilder
- dato for siste faglige kontroll
- lenker til relevante yrkes-, lønns- og nyhetssider

Innholdet skal skille klart mellom:

- fakta fra forskrift eller offisiell veiledning
- tariffbestemmelser
- Lønnsinnsikts forklaring eller tolkning
- faktisk lønnsstatistikk

## Datamodell og vedlikehold

Data bør organiseres rundt regelsettet, ikke rundt hver enkelt side.

Anbefalt prinsipp:

```text
Regelsett
├── offisielt navn og virkeområde
├── kilde og status
├── satser med gyldighetsperioder
├── tillegg og andre arbeidsvilkår
├── unntak
├── yrker og søkeord som peker til regelsettet
└── yrkesspesifikke forklaringer
```

Samme sentrale sats kan vises både på bransjesiden og i en kort modul på yrkessiden, men satsen skal ha én datakilde i kodebasen. Dette reduserer risikoen for at sidene viser forskjellige eller utdaterte beløp.

Yrkesforklaringene må likevel være individuelt skrevet. En felles datakilde er bra; identisk hovedinnhold på mange indekserbare sider er ikke ønskelig.

## Internlenking

Bransjesider og yrkessider skal støtte hverandre.

Eksempler:

- Fra servitørsiden: `Se lovpålagt minstelønn for servitører og restaurantansatte`.
- Fra restaurantsiden: `Se hva servitører faktisk tjener` og `Se hva kokker faktisk tjener`.
- Fra tømrersiden: `Se alle satser og regler for minstelønn i byggebransjen`.
- Fra byggsiden: lenker til tømrer-, murer-, maler- og andre relevante lønnssider.
- Fra `/minstelonn`: lenker til alle publiserte bransjesider.

Interne lenker skal peke til canonical-URL-en og bruke beskrivende, naturlige lenketekster.

## Teknisk SEO

- Bruk self-referencing canonical på hver reelt unik side.
- Ikke canonicaliser en tynn yrkesside til bransjesiden og forvent at yrkessiden skal rangere.
- Hvis innholdet ikke er unikt nok, skal URL-en ikke opprettes.
- Bruk `BreadcrumbList` og logisk navigasjon.
- Bruk beskrivende metadata, men unngå å gjenta søkeord unaturlig.
- Ikke forvent vesentlig SEO-effekt av `FAQPage`-schema alene.
- Behold årstall i title og synlig innhold, ikke i URL-en.
- Oppdater `dateModified` bare når innholdet faktisk er vesentlig oppdatert.
- Vis gyldighetsdato og dato for siste kontroll separat.
- Ikke presenter nye tariffsatser som lovpålagt minstelønn før en eventuell ny allmenngjøringsforskrift har trådt i kraft.
- Inkluder bare canonical, indekserbare sider i sitemap.
- Unngå flere URL-er for samme innhold. Bruk permanent videresending hvis en adresse må erstattes.

## Kvalitet og tillit

Minstelønn er juridisk og økonomisk informasjon. Sidene bør derfor ha sterke tillitssignaler:

- tydelige lenker til Arbeidstilsynet, Lovdata og Tariffnemnda
- informasjon om hvem som har skrevet eller kontrollert innholdet
- siste kontroll- og oppdateringsdato
- presise formuleringer om usikkerhet og virkeområde
- forklaring av forskjellen mellom lov, forskrift, tariff og statistikk
- ingen automatiske årstallsoppdateringer som får gammelt innhold til å se nytt ut

Primærkilder:

- Arbeidstilsynets oversikt over minstelønn: https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/
- Arbeidstilsynet om allmenngjøringsregelverket: https://www.arbeidstilsynet.no/regelverk/om-regelverket/
- Forskrift for overnatting, servering og catering: https://www.arbeidstilsynet.no/regelverk/forskrifter/forskrift-om-delvis-allmenngjoring-av-tariffavtale-for-overnattings--serverings--og-cateringvirksomheter/

## Måling og beslutningsgrunnlag

Før vi oppretter nye yrkesbaserte minstelønnssider, bør vi bruke Google Search Console til å undersøke:

- hvilke minstelønnssøk som allerede gir visninger
- hvilken eksisterende URL Google viser for søket
- om flere egne sider konkurrerer om samme søk
- klikkrate og gjennomsnittlig posisjon
- om brukerne søker etter bransje, yrke, alder, fagbrev, tillegg eller tariff

Etter publisering bør restaurant- og byggsidene få tre til seks måneder med data før vi avgjør om eksempelvis kokk eller tømrer trenger en selvstendig minstelønnsside.

## Prioritert utrulling

1. Lag den permanente restaurantsiden.
2. Lag den permanente byggsiden.
3. Utvid minstelønnshuben med alle gjeldende bransjeområder og et tydelig skille mellom lovpålagt minstelønn og tariff.
4. Legg korte, unike minstelønnsseksjoner på relevante yrkessider.
5. Koble restaurantsiden til eksisterende innhold om servitørlønn og Riksavtalen.
6. Koble byggsiden til relevante yrkes- og lønnssider.
7. Mål faktiske søk og eventuell kannibalisering i Search Console.
8. Vurder egne sider for kokk, tømrer eller andre yrker først når data og innholdskriteriene forsvarer dem.

## Hovedregel

Én sterk bransjeside skal eie og forklare regelverket. Yrkes­sidene skal eie spørsmålet om hva yrket faktisk tjener og kort forklare hvordan minstelønnsreglene treffer yrket. En egen yrkesbasert minstelønnsside skal bare opprettes når den kan gi et genuint annet og mer komplett svar.
