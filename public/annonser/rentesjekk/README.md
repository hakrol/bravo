# Rentesjekk – bildemateriell

Hentet 23. november 2026 fra Rentesjekk.no. Originalfilene er lagret uendret med beskrivende lokale filnavn. Filene brukes av den felles annonsekomponenten `src/components/rentesjekk-ad.tsx`.

## Utvalgte filer

| Fil | Dimensjoner | Størrelse | Innhold og anbefalt bruk |
| --- | --- | ---: | --- |
| rentesjekk-logo.png | 1297 × 334 px | 38 406 byte | Transparent logo i turkis/grågrønt. Førstevalg på lys annonsebakgrunn. |
| rentesjekk-logo-hvit.png | 2593 × 665 px | 60 201 byte | Transparent hvit logo. Alternativ på mørk bakgrunn. |
| rentesjekk-mynter-og-plante.png | 1920 × 1080 px | 582 639 byte | Transparent illustrasjon av mynter og en plante, hentet fra kampanjesiden. Anbefalt hovedillustrasjon. |
| rentesjekk-forsidefoto.jpg | 1161 × 760 px | 178 889 byte | Foto av en kvinne i telefon fra forsiden. Alternativ til illustrasjonen, særlig i større flater. |

## Anbefalt retning

Hovedbudskapet er bedre rente og lavere kostnader på eksisterende gjeld. Bredt og kompakt format bruker «Ta en rentesjekk – se hva du kan spare» med teksten «En bedre rente kan gi lavere kostnader på gjelden du allerede har. Sjekk om du kan spare.» Knappen er «Sjekk renten din». Bruk den fargede logoen og illustrasjonen med mynter og plante på lys bakgrunn. Tilpass bildeplassen etter kompakt, horisontalt og vertikalt annonseformat.

Illustrasjonen inneholder ikke overskrift, knapp eller premiepåstand. Disse kan derfor settes som tilgjengelig HTML-tekst i annonsen. Den originale filen har et bredt bildeformat og transparent bakgrunn; vurder luft rundt motivet når annonsen utformes.

Naturbakgrunnen ble vurdert som mindre relevant. Bilder av personer med premiesjekk ble ikke valgt til denne retningen.

## Kilder

- Forside og logoer: https://rentesjekk.no/
- Kampanje og illustrasjon: https://rentesjekk.no/nyttar-kampanje/

- **rentesjekk-logo.png**: https://rentesjekk.no/wp-content/uploads/2024/11/Logo-2-1.png
- **rentesjekk-logo-hvit.png**: https://rentesjekk.no/wp-content/uploads/2024/11/Logo-3.png
- **rentesjekk-mynter-og-plante.png**: https://rentesjekk.no/wp-content/uploads/2026/09/Rentesjekk-Q4-konkurranse.png
- **rentesjekk-forsidefoto.jpg**: https://rentesjekk.no/wp-content/uploads/2025/11/oda-ny.jpg

Kildehenvisningene dokumenterer opphav. Bruk i affiliateannonser følger Rentesjekk/Zen Finans sine partnervilkår og eventuelle retningslinjer for materiell.

## Status

Alle tidligere uScore-plasseringer bruker nå Rentesjekk. Sidene, plasseringene og reglene for hvilke sider som kan vise annonser er videreført. Sidefelt følger fortsatt nettstedets eksisterende skjermbreddegrenser.

- Komponent og design: `src/components/rentesjekk-ad.tsx` og `src/components/rentesjekk-ad.module.css`.
- Lenker, kampanjefrist og variant: `src/lib/rentesjekk.ts`.
- Sidetilgang: `src/lib/rentesjekk-routes.ts`.
- Sporing: `src/lib/rentesjekk-analytics.ts`.
- Personvernteksten i `src/app/personvern/page.tsx` omtaler Rentesjekk/Zen Finans og målingen.
- Lokal forhåndsvisning: `/dev/rentesjekk`. Området sperres i produksjon av eksisterende dev-layout, og visninger/klikk på denne siden sendes ikke til GA4.

## Format og kampanje

Sidefeltene bruker en egen, kort versjon med «Bedre rente starter med en rentesjekk», «Sjekk om gjelden din kan koste mindre.», knappen «Sjekk renten din» og et forkortet kostnadseksempel. Konkurransetekst, vilkår og nedtelling er fjernet fra sidefeltene. Teksten i alle formater handler om å redusere kostnader på eksisterende gjeld.

Formatnavnene `300x250`, `980x120` og `160x600` er beholdt som sporings-ID-er. De beskriver variantene; høyden tilpasses nå innholdet slik at kostnadseksempel og konkurransevilkår er lesbare uten klipping. Kompaktformatet er opptil 360 px bredt, og horisontalt format velges fra 640 px tilgjengelig bredde.

Konkurransen vises bare i perioden 2. oktober–31. desember 2026. Siste deltakerminutt er 31. desember kl. 23.59 norsk tid. Konkurransetekst og nedtelling fjernes automatisk 1. januar 2027 kl. 00.00 (`2026-12-31T23:00:00Z`). Vanlig rentesjekk-annonse fortsetter. Nedtellingen viser gjenstående døgn avrundet opp; det siste døgnet vises «Under ett døgn igjen». Fristen er fast og starter ikke på nytt per besøkende. Etterlasting på klienten hindrer at en utløpt konkurranse blir stående i bufret server-HTML.

Kostnadseksemplet og konkurranseopplysningene er hentet 23. november 2026 fra:

- https://rentesjekk.no/nyttar-kampanje/
- https://rentesjekk.no/vilkar-kampanje-q4-26/

Rentesjekks forbrukslånseksempel: 100 000 kr over 5 år, nominell rente 11,70 %, effektiv rente 14,13 %, etablering 990 kr, kostnad 37 412 kr og totalt 137 412 kr. Opplysningene må vedlikeholdes dersom annonsøren endrer betingelsene.

## Annonsebar

`src/components/rentesjekk-bar.tsx` og `src/components/rentesjekk-bar.module.css` styrer en lukkbar bar helt øverst, over hovedmenyen. `src/components/app-shell.tsx` plasserer den i en egen sticky-region med egen tilgjengelighets- og samtykkehåndtering. Den tar plass i sideflyten og dytter menyen og innholdet ned. `ResizeObserver` holder `--site-ad-bar-height` oppdatert, slik at menyen, yrkessidenes seksjonslenker og faste sideannonser får riktig avstand også ved linjebryting og lukking.

Baren viser «Sjekk om du kan få bedre rente hos opptil 15 banker.», en enkel tekstlenke «Sjekk renten», reklamemerking, et lite lukkekryss og et kort, lesbart kostnadseksempel. Formuleringen om opptil 15 banker er kontrollert mot https://rentesjekk.no/ 23. november 2026. Baren har ikke konkurransebudskap eller nedtelling. På mobil brytes innholdet over flere linjer. Baren skjules ved utskrift.

Den vises på sider som allerede tillater Rentesjekk-annonser og på `/dev/rentesjekk`. Spesialsiden med egen helskjermsopplevelse bruker fortsatt sin eksisterende visning uten vanlig hovedmeny. Lukking huskes med `rentesjekk-bar-dismissed-v1` i `sessionStorage`, uten å legge til identifikatorer eller sende lukking som et annonseklikk. Hvis lagring er blokkert, fungerer lukkeknappen fortsatt mens appen er åpen.

På forhåndsvisningssiden brukes ikke øktlagringen, og siden kan lastes på nytt for å få tilbake en lukket bar. Barens visninger og klikk i forhåndsvisningen sendes ikke til GA4. På vanlige sider gjenbrukes annonsemålingen med `ad_placement=site-top-bar` og `ad_format=top-bar`; disse verdiene sendes også som EPI2 og EPI4 i affiliatelenken.

## GA4 og Adtraction

- `rentesjekk_ad_view`: minst 50 % av annonsens hovedlenke er synlig i ett sammenhengende sekund i en synlig fane. Én visning per rendret format. Et formatskifte kan gi en ny formatvisning.
- `rentesjekk_ad_click`: vanlig klikk eller midtklikk på hovedlenken. Vilkårslenken er ikke et affiliateklikk.
- Begge sender `page_path`, `ad_placement`, `ad_format`, `ad_variant=lavere-rente-v1` og `ad_campaign` (`rentesjekk-q4-2026` mens konkurransen pågår, ellers `rentesjekk-lavere-rente`).
- Målingen krever `NEXT_PUBLIC_GA_ID` og bruker eksisterende Google Analytics-/samtykkeoppsett. Ingen nye sporingsskript er lagt til.
- For rapportering per plassering/format/variant/kampanje opprettes hendelsesbaserte egendefinerte dimensjoner for disse fire parameterne i GA4. Totalt antall visninger og klikk kan leses fra hendelsesrapporten uten dimensjonene.
- Affiliatelenken er https://on.rentesjekk.no/t/t?a=2069142437&as=2113271977&t=2&tk=1 med `epi` (sidetype), `epi2` (plassering), `epi3` (sidesti), `epi4` (format) og `epi5=lavere-rente-v1`. Lønn, skjemasvar og søkeparametere legges ikke til.

Dette er en lokal implementasjon for gjennomgang; den er ikke publisert.
