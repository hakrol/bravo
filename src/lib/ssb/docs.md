# Yrkeskoder

## Yrkeskatalogen
Yrkeskatalogen er basert på standard for yrkesklassifisering (STYRK98). Den sjusifrete yrkeskoden brukes ved innrapportering.

Endret: 3. januar 2025

Søk etter yrkeskode i yrkeskatalogen
Søk gjøres i SSB sin base for klassifikasjoner og kodelister (Klass).

## Tips om hvordan søke
For å søke etter yrkeskoder til en yrkestittel: Skriv inn yrkestittelen evt. deler av yrkestittelen i søkefeltet.
For å søke etter flere yrkestitler innenfor samme yrke: Skriv inn de første fire sifrene i yrkeskode
Trykk "Filtrer" for å starte søket.
Internet explorer kan ha problem med søket. Prøv evt. en annen nettleser.
Nedlasting  av yrkeskatalogen
Yrkeskatalogen kan lastes ned via API-et til Klassifikasjoner og kodelister: 

CSV
JSON
XML
Brukerveiledning for dette API-et se: Klass API guide. Her er noen enkle eksempler på bruk av Klass API-et mot Yrkeskatalogen:

Yrkeskatalogen har ID 145. Da kan en bruke adressen: 
https://data.ssb.no/api/klass/v1/classifications/145. 
Standard utformat er XML. Du får JSON i stedet ved å legge på .json slik: 
https://data.ssb.no/api/klass/v1/classifications/145.json

Av og til er det mulig å få ut CSV ved å legge på .csv. Et eksempel for å få en spesifikk kode med selectCodes, og utformat som CSV:
https://data.ssb.no/api/klass/v1/classifications/145/codes.csv?from=2010-01-01&selectCodes=1227153

## Yrkeskode bestemmes av faktiske arbeidsoppgaver
Hvilken yrkeskode en stilling skal ha, bestemmes av arbeidsoppgavene. Det vil si at yrkeskoden skal tilsvare konkrete arbeidsoppgaver, ikke utdanning hos den enkelte, type ansettelsesforhold, kontrakt, lønn eller bransje. Hovedregelen er at ansatte som utfører samme arbeidsoppgaver, skal ha samme yrkeskode. Dette gjelder alle arbeidsforhold som skal rapporteres i a-ordningen, uansett om det er ordinært eller av typen frilanser, oppdragstaker og personer som mottar honorar.

Dersom en person kun har én kontrakt med en arbeidsgiver, men ulike arbeidsoppgaver, skal personen få en yrkeskode som tilsvarer det han eller hun bruker mest tid på.

Dersom en person har to ulike arbeidsforhold med ulike arbeidsoppgaver, skal personen rapporteres med to ulike yrkeskoder. Det er altså stillingen som er avgjørende for yrkeskoden, ikke personen.

## 10 hovedgrupper
Når du skriver inn en tittel, eller del av en yrkestittel i søket, får du opp flere yrkestitler med tilhørende sjusifret yrkeskode. Hvilket yrkesfelt yrket hører til, ser du av det første sifferet i yrkeskoden:

Yrkeskoder som begynner på 1 er administrative ledere og politikere
Yrkeskoder som begynner på 2 er akademiske yrker
Yrkeskoder som begynner på 3 er høyskoleyrker
Yrkeskoder som begynner på 4 er kontor- og kundeserviceyrker
Yrkeskoder som begynner på 5 er salgs-, service- og omsorgsyrker
Yrkeskoder som begynner på 6 er yrker innen jordbruk, skogbruk og fiske
Yrkeskoder som begynner på 7 er håndverkere og lignende
Yrkeskoder som begynner på 8 er prosess- og maskinoperatører, transportarbeidere mv.
Yrkeskoder som begynner på 9 er yrker uten krav til utdanning
Yrkeskoder som begynner på 0 er militære yrker (ikke sivile stillinger i forsvaret)
Det første sifferet i yrkeskoden sier også noe om kompetansenivå: 

2: Kompetanse tilsvarende minst 4-års utdanning fra universitet eller høyskole.
3: Kompetanse tilsvarende 1-3 års utdanning fra universitet eller høyskole.
4 - 8: Kompetanse tilsvarende videregående skole, altså 11-14 års skolegang.
0, 1 og 9: Har ikke bestemte kompetansenivå.
Kompetanse betyr reelle kunnskaper og ferdigheter, ikke nødvendigvis formell utdanning.

Spørsmål om yrkeskoding og forslag til nye yrkestitler kan sendes: yrke@ssb.no

## STYRK-08
Statistisk sentralbyrå har tatt i bruk en ny yrkesstandard STYRK-08 som er basert på en internasjonal standard fra ILO, ISCO-08 (International Standard Classification of Occupation 2008). Imidlertid skal arbeidsgivere fortsatt bruke den samme standarden som tidligere ved rapportering av yrkeskoder til a-ordningen (7 siffer).

SSB foretar en omkoding av alle 7 siffer kodene til 4 siffer STYRK-08. Denne tabellen viser omkodingen: Korrespondansetabell mellom yrkeskatalogen, basert på STYRK-98, og STYRK-08.

Den sjusifrete yrkeskoden brukes ved innrapportering til A-ordningen.