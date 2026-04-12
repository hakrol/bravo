# Blogginnhold

Legg nye innlegg som `.mdx`-filer i denne mappen.

Hvert innlegg skal ha frontmatter øverst:

```md
---
title: "Tittel"
description: "Kort beskrivelse"
slug: "min-slug"
publishedAt: "2026-04-03"
coverImage: "/blogg/min-slug/cover.jpg"
author: "Kristian"
seoTitle: "Valgfri SEO-tittel"
seoDescription: "Valgfri SEO-beskrivelse"
---
```

Deretter skriver du selve innholdet i MDX.

## SEO-retningslinjer

Bruk disse feltene bevisst i frontmatter:

- `title`
  Brukes som synlig tittel i innlegget. Hold den tydelig, konkret og skrevet for mennesker.

- `description`
  Brukes som kort oppsummering og bør forklare hva leseren faktisk får ut av innlegget.

- `seoTitle`
  Brukes når du vil ha en litt mer søkevennlig variant enn den synlige tittelen. Hold den kort og tydelig.

- `seoDescription`
  Brukes når du vil ha en mer presis metabeskrivelse enn den vanlige `description`.

- `slug`
  Skal være kort, beskrivende og skrevet med små bokstaver og bindestreker.

Anbefalt praksis:

- La `title` være tydelig og lesbar, ikke pakket med søkeord.
- La `seoTitle` være mer søkespisset hvis det gir mening, men ikke kunstig.
- Hold `description` og `seoDescription` konkrete. Forklar hva innlegget handler om og hvorfor det er nyttig.
- Unngå at `title` og `seoTitle` er identiske hvis du kan lage en bedre SEO-variant.
- Unngå at flere innlegg dekker nøyaktig samme søkeintensjon med nesten like titler.
- Bruk én tydelig hovedintensjon per innlegg.
- Sørg for at viktige nøkkelord finnes naturlig i tittel, ingress, mellomtitler og brødtekst.
- Bruk tydelige `##`-overskrifter som matcher det brukeren faktisk vil vite.
- Bruk beskrivende `alt`-tekst på bilder når bildene har informasjonsverdi.
- Lenke gjerne til relevante interne sider og blogginnlegg når det faktisk hjelper leseren.

Praktiske tommelfingerregler:

- `title`: vanligvis rundt 40 til 70 tegn
- `seoTitle`: vanligvis rundt 50 til 60 tegn når mulig
- `description`: vanligvis rundt 120 til 160 tegn
- `seoDescription`: vanligvis rundt 120 til 160 tegn

Eksempel:

```md
title: "Hvor mye mer kan man be om i lønn?"
description: "En konkret guide til hvor mye du realistisk kan be om i lønn, og hvordan du regner deg frem til et smart krav."
slug: "hvor-mye-mer-kan-man-be-om-i-lonn"
seoTitle: "Hvor mye mer kan man be om i lønn? Konkrete tall og realistiske nivåer"
seoDescription: "Se hva som er normalt lønnshopp ved årlig justering, økt ansvar og jobbskifte, og lær hvordan du beregner et realistisk lønnskrav."
```

## Fast navngivningsregel for bilder

Legg alle blogg-bilder i:

`public/blogg/<slug>/`

Bruk denne faste navngivningen:

- `cover.jpg`, `cover.png` eller `cover.svg`
  Brukes som hero-bilde i toppen av innlegget og i bloggkort.

- `inline-1.jpg`, `inline-2.jpg`, `inline-3.jpg`
  Brukes til vanlige bilder inne i innlegget, i den rekkefølgen de kommer.

- `figure-1.png`, `figure-2.png`
  Brukes til grafer, skjermbilder eller illustrasjoner der `inline-*` blir for uklart.

- `quote-1.jpg`
  Brukes bare hvis et innlegg har et eget illustrasjonsbilde knyttet til et sitat eller eksempel.

Anbefalt praksis:

- Hold deg til små bokstaver.
- Bruk bindestrek, ikke mellomrom eller underscore.
- Ha én mappe per innlegg, basert på `slug`.
- Oppdater `coverImage` i frontmatter til å peke på `cover.*`.
- Hvis SEO er viktig for et hero-bilde, kan du bruke et beskrivende filnavn som fortsatt følger slug-format, for eksempel `cover-hvor-mye-mer-kan-man-be-om-i-lonn.jpg`.
- Unngå filnavn med mellomrom, parenteser eller kopisuffiks som `(1)`.

## SEO på bilder

Beste praksis for bilder i blogginnlegg:

- Bruk filnavn som beskriver motivet eller temaet, ikke bare et internt navn.
- Bruk små bokstaver og bindestreker i filnavn.
- Unngå mellomrom, parenteser, `IMG_1234`, `final-final` og kopinavn som `(1)`.
- Bruk relevant `alt`-tekst på bilder som tilfører informasjon.
- La `alt`-teksten beskrive hva bildet viser i konteksten av innlegget.
- Ikke fyll `alt`-teksten med søkeord.
- Hvis bildet er dekorativt og ikke tilfører informasjon, bruk tom `alt`.
- Bruk hero-bilder som faktisk passer til temaet i innlegget, siden de også brukes i deling og metadata.
- Bruk gode filstørrelser og komprimerte bilder, slik at siden ikke blir treg.

Eksempler på gode filnavn:

- `cover-hvor-mye-mer-kan-man-be-om-i-lonn.jpg`
- `figure-lonnsutvikling-radgivere-2021-2025.png`
- `inline-lonnssamtale-med-leder.jpg`

Eksempler på gode `alt`-tekster:

- `alt="Eksempel på lønnsutvikling for rådgivere fra 2021 til 2025"`
- `alt="Illustrasjon av en lønnssamtale mellom ansatt og leder"`

Eksempler på svake `alt`-tekster:

- `alt="bilde"`
- `alt="hero image"`
- `alt="lønn lønnssamtale høyere lønn jobb marked"`

Eksempel:

- `public/blogg/hvor-mye-mer-kan-man-be-om-i-lonn/cover.jpg`
- `public/blogg/hvor-mye-mer-kan-man-be-om-i-lonn/inline-1.jpg`
- `public/blogg/hvor-mye-mer-kan-man-be-om-i-lonn/figure-1.png`

Eksempel i MDX:

```mdx
![Lønnsutvikling for lignende roller](/blogg/hvor-mye-mer-kan-man-be-om-i-lonn/figure-1.png)
```

## Gjenbrukbare bloggkomponenter

Bruk felles bloggkomponenter i MDX når mønsteret skal kunne gjenbrukes i flere innlegg.

- `Example`
  Brukes til formuleringer, manus, eksempler og konkrete setninger leseren kan bruke selv.

- `Table`
  Brukes til tabeller i innlegg i stedet for rå HTML eller inline-styling.

- `ToolCallout`
  Brukes når et innlegg naturlig bør peke videre til et verktøy, for eksempel Lønnsjekk.

Eksempel:

```mdx
<ToolCallout
  title="Vil du sjekke om lønnen din ligger høyt, lavt eller midt på?"
  description="Bruk Lønnsjekk for å sammenligne lønnen din med relevante tall og få et mer konkret grunnlag før du bestemmer hva du skal be om."
/>
```
