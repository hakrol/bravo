# Stilguide for lønnskalkulator

Denne siden skal føles som et moderne, premium og tillitsbyggende finansverktøy. Uttrykket skal være rent, rolig og raskt å forstå, med minst mulig visuell støy.

## Designprinsipp

Brukeren skal gå rett fra overskrift til handling. Inputfeltene er selve handlingen, og resultatene skal oppleves som et tydelig dashboard.

Målet er:

- Enkel struktur
- Få visuelle elementer
- Tydelig hierarki
- Høy lesbarhet
- Umiddelbar forståelse

Unngå:

- Bokser inni bokser
- Store forklarende tekstblokker
- Mange badges eller statuser
- Skjemafølelse
- Offentlig kalkulator-uttrykk

## Layout

Siden bygges som en vertikal flyt:

1. Hero med tittel og kort beskrivelse
2. Kompakt inputpanel direkte under hero
3. Hero-KPI-er
4. Resultatseksjoner
5. Feriejustering

Input skal ikke ligge i en egen tung container. Det skal føles som en naturlig forlengelse av heroen.

## Hero

Hero skal være ekstremt enkel.

Bruk:

- Stor, tydelig H1
- Én kort SEO-rettet beskrivelse
- Ingen CTA-knapper
- Ingen dashboard-kort
- Ingen ekstra labels eller piller

Eksempel:

```text
Lønnskalkulator
Beregn lønn, skatt, timelønn, feriepenger og netto utbetaling med en enkel lønnskalkulator.
```

## Inputpanel

Input skal være flatt, kompakt og raskt å skanne.

Struktur:

- Rad 1: Timer per uke i 100 %, faktiske timer per uke, stillingsprosent
- Rad 2: Årslønn, månedslønn, timelønn
- Rad 3: Skattesats, feriepengesats, ferieuker

Retningslinjer:

- Labels skal være korte og konkrete
- Hjelpetekst skal normalt ikke vises under feltene
- Bruk info-ikon for forklaringer
- Aktivt lønnsfelt skal fremheves kun med styling
- Inaktive lønnsfelt skal dempes subtilt
- Ingen badges som “Aktiv”, “Auto” eller “Velg én”

## Resultatdashboard

Resultatene skal være mer visuelt fremtredende enn inputfeltene.

Øverste KPI-rad:

- Netto månedslønn
- Brutto månedslønn
- Månedlig skatt

Deretter grupperes resultatene i:

- Brutto
- Skatt
- Netto
- 100 % stilling / forskjell fra full stilling
- Feriejustering

Alle resultatseksjoner skal bruke samme visuelle system:

- Hvit flate
- Subtil skygge
- God spacing
- Små labels
- Store tall der tallet er viktig

## Farger

Basen skal være lys og nøytral.

Bruk:

- Hvit og svært lys grå som hovedflater
- Mørk skifer/sort til tekst
- Dempet grønn/blå til positive lønnstall
- Dempet rød/rosa til skatt og trekk
- Svært subtil gul/amber kun der ferie/feriepenger trenger egen tone

Farger skal støtte lesing, ikke dekorere.

## Typografi

Typografien skal være stram og selvsikker.

Bruk:

- Store, tydelige tall i KPI-kort
- Små uppercase labels for målepunkter
- Kort sekundærtekst
- Tabular numbers på tall der det passer

Unngå lange forklaringer i selve grensesnittet.

## Interaksjon

Interaksjonen skal være stille og presis.

Bruk:

- Subtil focus-state på input
- Glatte overganger på aktive/inaktive felt
- Info-ikoner for forklaringer
- Live oppdatering uten submit-knapp

Brukeren skal ikke måtte tenke på “neste steg”. Det skal være åpenbart at man bare fyller inn tall.

## Tone

Språket skal være:

- Kort
- Konkret
- Norsk Bokmål
- Tillitsbyggende
- Ikke teknisk

Eksempel på god tekst:

```text
Beregn lønn, skatt, timelønn, feriepenger og netto utbetaling med en enkel lønnskalkulator.
```

Eksempel på tekst som bør unngås:

```text
Start med arbeidstid og én lønnstype. Resten beregnes automatisk og vises nedtonet.
```

## Beslutningsregel

For hvert element på siden:

```text
Hjelper dette brukeren å fylle inn raskere eller forstå resultatet bedre?
```

Hvis svaret er nei, skal elementet fjernes.
