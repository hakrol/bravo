---
name: nyhetsartikler
description: Opprett, oppdater og kvalitetssikre nyhetsartikler om lønn, minstelønn, tariffoppgjør, allmenngjøring, arbeidsliv og andre aktuelle lønnsendringer i Bravo-prosjektet. Bruk når Codex skal lage en ny lønnsnyhet, bearbeide en nyhetsbrief, kontrollere tidsaktuelle lønnsopplysninger, tagge en nyhet mot berørte yrkessider eller lage artikkelens nyhetsbilde.
---

# Nyhetsartikler

## Grunnlag

- Les `PROJECT.MD`.
- Bruk eksisterende filer i `src/content/nyheter/` som formatreferanse.
- Kontroller feltene mot `src/lib/nyheter.ts` og tilgjengelige MDX-komponenter mot `src/components/news-mdx-components.tsx`.
- Les relevant dokumentasjon i `node_modules/next/dist/docs/` før endringer i visning, routing, metadata, caching eller datahenting.
- Skriv på norsk bokmål.
- Ikke publiser eksternt eller automatisk.

## Arbeidsflyt

1. Fastslå nyhetens skjæringsdato. Skill mellom det som gjelder nå, det som er vedtatt for senere ikrafttredelse, og det som bare er foreslått.
2. Verifiser tidsaktuelle opplysninger på nettet. Bruk primærkilder som Tariffnemnda, Lovdata, Arbeidstilsynet, regjeringen, partene i tariffoppgjøret eller annen ansvarlig myndighet.
3. Kontroller minst status, beløp, datoer, virkeområde, unntak og eventuell ikrafttredelse. Ikke bruk briefen alene som dokumentasjon.
4. Skriv en selvstendig redaksjonell artikkel. Oppsummer og forklar kildene; ikke kopier kildetekst eller bygg artikkelen som en omskriving av ett dokument.
5. Finn eksakte yrkessluger for yrkene som faktisk omfattes. Ikke tagg et yrke bare fordi yrkestittelen ligner på forskriftens virkeområde.
6. Opprett MDX-filen i `src/content/nyheter/` og et unikt bilde i `public/nyheter/<slug>/cover.png`.
7. For hvert yrke i `occupationSlugs`, legg inn minst én naturlig intern lenke til `/yrke/<slug>` i selve artikkelteksten. Metadata alene er ikke nok.
8. Valider frontmatter, MDX, yrkestagging, bildefil, TypeScript og relevante lintregler.

## Redaksjonelle krav

- Presenter hovednyheten i tittelen og første avsnitt.
- Skriv konkret, nøkternt og forståelig. Unngå salgsspråk, SEO-fyll og spekulasjon.
- Bruk aktiv form og korte avsnitt.
- Forklar hva endringen betyr i kroner og prosent når tallgrunnlaget tillater det.
- Bruk et enkelt regneeksempel når det gir leseren praktisk verdi. Merk forutsetningene tydelig.
- Skill mellom lovfestet minstelønn, tariffestet lønn, avtalt lønn og vanlig lønnsstatistikk.
- Forklar hvem reglene gjelder for. Bransje, arbeidstype og forskriftens virkeområde kan være viktigere enn stillingstittelen.
- Oppgi vesentlige unntak og forbehold.
- Bruk konkrete mellomtitler. Ikke legg til seksjoner som ikke tilfører informasjon.
- Bruk tabeller for satser, sammenligninger og historisk utvikling. Ikke lag diagrammer med mindre brukeren ber om det.
- Avslutt med hva som skjer videre og en kort kildeliste med de viktigste primærkildene.

## Forslag, vedtak og ikrafttredelse

Vær konsekvent med status gjennom hele artikkelen.

Når noe ikke er vedtatt, bruk formuleringer som:

- «Det er foreslått en ny minstesats på …»
- «Minstelønnen kan øke til …»
- «Forslaget er på høring og dagens sats gjelder fortsatt.»

Ikke skriv «minstelønnen øker» eller «den nye satsen gjelder» før kilden dokumenterer et endelig vedtak og eventuell ikrafttredelsesdato.

Hvis et forskriftsutkast har `X`, `XX` eller mangler dato for ikrafttredelse, skriv at det ikke finnes en fast dato. Skill en målsetting for behandling fra en vedtatt dato.

## Frontmatter

Alle nyhetsartikler skal bruke denne strukturen:

```yaml
---
title: "Presis nyhetstittel"
description: "Kort ingress til nyhetsoversikten"
slug: "kort-beskrivende-slug"
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD" # bare ved en reell senere oppdatering
coverImage: "/nyheter/<slug>/cover.png"
coverImageAlt: "Konkret beskrivelse av motivet"
imageCaption: "Saklig bildetekst. Illustrasjonsbilde: Lønnsinnsikt."
author: "Redaksjonen"
topic: "Minstelønn"
occupationSlugs:
  - "eksakt-yrkesslug-lonn"
seoTitle: "Presis SEO-tittel"
seoDescription: "Presis beskrivelse av nyheten"
---
```

- `occupationSlugs` er obligatorisk og skal inneholde minst én eksisterende yrkesslug.
- Bruk bare slugen, ikke `/yrke/` eller hele URL-en.
- Tagg alle og bare de yrkessidene som dokumentert omfattes av nyheten.
- Behold `publishedAt` ved oppdateringer. Bruk `updatedAt` bare når artikkelen får en reell innholdsendring etter publisering.
- Bruk `draft: true` hvis brukeren ber om et utkast som ikke skal vises på nettstedet.

## Yrker og interne lenker

- Hvis nyheten har ett eller flere relevante yrker med egne yrkessider, skal yrkene både tagges i `occupationSlugs` og lenkes i selve nyhetsartikkelen.
- Hver slug i `occupationSlugs` skal ha en tilsvarende intern lenke i brødteksten.
- Verifiser at hver yrkesside finnes før slugen legges i `occupationSlugs`.
- Bruk samme slug i interne lenker, for eksempel `[renholdere i bedrifter](/yrke/renholdere-i-bedrifter-lonn)`.
- Skill mellom yrker som kilden nevner uttrykkelig og yrker som bare kan være omfattet etter en konkret vurdering.
- Ikke tagg brede eller nærliggende yrker uten dokumentert kobling.
- Nyheten skal vises i «Nyheter for [yrke]» på hver yrkesside som er tagget.

## Bilder

- Lag ett unikt rasterbilde for hver artikkel og lagre det som `public/nyheter/<slug>/cover.png`.
- Bruk bildegenereringsverktøyet når brukeren ikke har levert et egnet bilde.
- Lag et relevant, redaksjonelt motiv fra bransjen eller arbeidsmiljøet.
- Vis nøyaktig én gjenstand eller ett samlet objekt som tydelig representerer yrket eller saken.
- Bruk en enkel fargebakgrunn eller et rolig, diskret mønster.
- Ikke bygg en scene med arbeidsplass, miljø eller flere rekvisitter. Bildet skal være luftig og umiddelbart forståelig.
- Bruk liggende 16:9-format som tåler beskjæring i nyhetskort.
- Ikke vis mennesker med mindre brukeren uttrykkelig ber om det.
- Ikke ha tekst, lønnstall, diagrammer, logoer, varemerker eller vannmerker i bildet.
- Unngå annonsepreg og generiske, iscenesatte stockfoto.
- Skriv presis `coverImageAlt` og merk genererte bilder som «Illustrasjonsbilde: Lønnsinnsikt» i `imageCaption`.
- Ikke bruk SVG-kode som ferdig nyhetsbilde når artikkelen skal ha et redaksjonelt bilde.

## Tabeller og tall

Bruk de eksisterende MDX-komponentene:

```mdx
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Gjeldende sats</TableHeader>
      <TableHeader>Foreslått sats</TableHeader>
      <TableHeader>Endring</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>236,54 kr</TableCell>
      <TableCell>247,29 kr</TableCell>
      <TableCell>10,75 kr / 4,5 %</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

- Regn prosent fra de oppgitte satsene og kontroller avrundingen.
- Skill nominell utvikling fra reallønnsutvikling.
- Oppgi forutsetninger for måneds- og årsberegninger.
- Sørg for at tall og datoer er identiske i tittel, ingress, brødtekst, tabeller og metadata.

## Kilder

- Bruk lenker til den konkrete siden eller dokumentet, ikke bare institusjonens forside.
- La hovedkilden stå tidlig i artikkelen.
- Koble hver sentrale opplysning til kilden som faktisk dokumenterer den.
- Prioriter gjeldende forskrift for dagens rettstilstand og utkast eller høringsbrev for foreslåtte endringer.
- Bruk historiske vedtak eller forskrifter for en utviklingstabell.
- Oppgi kildebegrensninger hvis et dokument ikke kan åpnes eller kontrolleres.

## Ferdigdefinisjon

Artikkelen er ferdig når:

- MDX-filen ligger i `src/content/nyheter/`.
- Frontmatter er komplett og godtas av `src/lib/nyheter.ts`.
- status, satser, datoer, virkeområde og unntak er kontrollert mot primærkilder.
- artikkelen skiller tydelig mellom gjeldende, vedtatt og foreslått.
- alle yrkestagger bruker eksisterende, dokumentert relevante sluger.
- hvert relevant yrke er tagget, og hver yrkestagg har minst én tilsvarende intern lenke i artikkelteksten.
- tabeller bruker de eksisterende nyhetskomponentene.
- et unikt PNG-bilde finnes på stien i `coverImage`.
- bildet følger kravene til motiv, format og fravær av mennesker og tekst.
- interne og eksterne lenker er kontrollert.
- relevante type- og lintkontroller går uten feil.
