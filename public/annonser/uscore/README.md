# uScore – bildemateriell

Hentet 24. oktober 2026 fra https://uscore.no/kredittscore.

Originalfilene er lagret uten bildeendringer. Logoen er hentet fra sidens innebygde SVG i toppmenyen. Dette er bildemateriell til en annonse, ikke ferdige annonsebannere.

## Filer

| Fil | Dimensjoner | Størrelse | Innhold |
| --- | --- | ---: | --- |
| uscore-hovedillustrasjon.png | 480 × 481 px | 122 KiB | Mobilskjermer med uScore-oversikt. Anbefalt hovedbilde til annonsen. |
| kredittscore-oversikt.png | 1441 × 1441 px | 681 KiB | Detaljert illustrasjon av kredittscore på mobil. Inneholder eksempeltekst fra kildesiden. |
| renteoversikt.png | 485 × 485 px | 141 KiB | Illustrasjon av lån og renter med eksempelbeløp. |
| kredittscore-utvikling.gif | 471 × 541 px | 493 KiB | Animert kredittscore-widget, bevart som GIF. |
| kredittscore-innsikt.png | 2082 × 2357 px | 3675 KiB | Mobil i hånden med illustrert kredittscore og sammenligning. |
| gronn-bakgrunn.png | 2100 × 1000 px | 11 KiB | Grønn bakgrunn fra sidens toppseksjon. |
| uscore-logo.svg | viewBox 0 0 835 344 | Vektor | uScore-logo med transparent bakgrunn. |

## Aktiv annonse

Alle tidligere BookBeat-plasseringer bruker nå `src/components/uscore-ad.tsx`. Annonsene er bygd med tekst, logo og hovedillustrasjon. Originalbildene over er uendret.

- Kompakt: 300 × 250 px, med tilpasning til smalere beholdere.
- Horisontal: opptil 980 × 120 px, fra 640 px tilgjengelig bredde. Mobilillustrasjonen vises fra 880 px.
- Vertikal: 160 × 600 px i sidefeltene, med eksisterende synlighetsregler.
- Alle varianter er merket «Annonse» og åpner i en ny fane.

Sporingslenke: https://go.adt284.net/t/t?a=2109876869&as=2113271977&t=2&tk=1

`src/lib/uscore.ts` legger til EPI for sidetype, plassering, side, format og kampanjen `uscore-2026-10`. Parametrene inneholder ikke lønn, skjemasvar eller søkeparametere. Formatverdiene er navn på variantene; det horisontale formatet tilpasses beholderens bredde.

## Anbefalt bruk

Start med `uscore-logo.svg` og `uscore-hovedillustrasjon.png`. PNG-bildet er 480 × 481 piksler og passer til en kompakt annonse.

Illustrasjonene viser eksempeldata fra uScore og skal ikke fremstilles som brukerens personlige resultat. `kredittscore-oversikt.png` inneholder også eksempeltekst. `renteoversikt.png` og `kredittscore-innsikt.png` inneholder rente-/låneeksempler.

## Originalkilder

- **uscore-hovedillustrasjon.png**: https://5gnwa48gpxxr.b-cdn.net/2ybjigig1668/w_480/uscore-images.png
- **kredittscore-oversikt.png**: https://i3qr2d7h0k5.b-cdn.net/22kwn02q73ew-themetheme13.png
- **renteoversikt.png**: https://i3qr2d7h0k5.b-cdn.net/65hfrfyydhci-refinance-hero-image-simple-norway.png
- **kredittscore-utvikling.gif**: https://i3qr2d7h0k5.b-cdn.net/348hafrd9nt1-credit-score-animated-widget-1757075899232.gif
- **kredittscore-innsikt.png**: https://i3qr2d7h0k5.b-cdn.net/5z40yf53f5za-credit-score-insights.png
- **gronn-bakgrunn.png**: https://5gnwa48gpxxr.b-cdn.net/6rn7nwxwxv6e/w_2100/flat-green.png
- **uscore-logo.svg**: Innebygd SVG i toppmenyen på https://uscore.no/kredittscore.
