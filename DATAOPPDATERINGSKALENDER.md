# Kalender for oppdatering av artikler, yrker og lønnsdata

Sist kontrollert: 26. september 2026  
Tidssone: Europe/Oslo

Denne filen er en vedlikeholdskalender for Lønnsinnsikt. Den viser når datagrunnlag og innhold bør kontrolleres, men er ikke en fasit for når en endring faktisk trer i kraft. Kontroller alltid primærkilden før tall eller påstander publiseres.

## Sjekk nå

### Minstelønn og allmenngjøring

- **Fra 26. september 2026: kontroller fiskeindustrien minst ukentlig.** Tariffnemndas høringsfrist var 25. september 2026. Den tidligere forskriften opphørte 3. august 2026, og Arbeidstilsynet opplyser at ny allmenngjøring er til behandling. Oppdater først artikler og satser når Tariffnemnda eller Lovdata dokumenterer et endelig vedtak og en virkningsdato.
- **Kontroller Tariffnemnda minst ukentlig inntil sakene er avgjort.** Forslagene for byggfag, elektrofag, godstransport, bilbransjen, overnatting/servering/catering, renhold, skips- og verftsindustri og turbil hadde høringsfrist 20. august 2026 og står som under behandling.
- **Elektro og renhold krever særskilt kontroll i kodebasen.** Prosjektene `src/lib/electrician-minimum-wage.ts` og `src/lib/cleaning-minimum-wage.ts` inneholder 2026-forslag som ikke skal behandles som gjeldende minstelønn før endelig forskrift og virkningsdato foreligger.

Når et vedtak kommer, kontroller samme dag:

1. endelig sats og hvem den gjelder for
2. vedtaksdato, publiseringsdato og virkningsdato
3. tillegg, aldersgrenser og andre vilkår
4. relevante kodefiler, yrkessider, forklaringsartikler og nyhetsartikler
5. om gamle satser må få en sluttdato

## Kommende, kjente datoer

| Dato | Kilde eller hendelse | Hva som bør kontrolleres | Handling i prosjektet |
| --- | --- | --- | --- |
| 7. oktober 2026 | Forslag til statsbudsjett for 2027 | Foreslåtte endringer i skatt, fradrag, ytelser og arbeidslivsregler | Lag eventuelt nyhetssaker, men merk forslag som forslag. Vent med varige kalkulator- og faktatekstendringer til endelig vedtak. |
| 9. oktober 2026 | SSB Konsumprisindeksen, tabell 14700 | Nye KPI-tall for september og eventuelle revisjoner | Kjør `npm run ssb:sync`, kontroller reallønnsberegninger og vurder oppdatering av inflasjonsaktuelle artikler. Unngå SSBs høylastvindu rundt kl. 08.00. |
| 5. november 2026 | SSB Antall arbeidsforhold og lønn, tall for 3. kvartal | Tabell 11658 med lønn, antall lønnstakere, jobber, alder og arbeidstid per yrke | Kjør `npm run ssb:sync`, kontroller genererte filer og test et utvalg yrkessider før deploy. Vurder nye artikler om kvartalsutviklingen. |
| November–desember 2026 | Tariffnemnda, dato ikke fastsatt | Endelige vedtak etter høringene fra august og september | Kontroller ukentlig. Oppdater minstelønn først når vedtak og virkningsdato er dokumentert. |
| Desember 2026 | Endelig statsbudsjett og skattesatser for 2027 | Vedtatte satser, grenser og regler som gjelder fra 2027 | Oppdater berørte forklaringsartikler og beregninger. Skill mellom vedtaksdato og virkning fra 1. januar. |
| 2.–15. januar 2027 | Intern årlig innholdsrevisjon | Årstall, «i år»-formuleringer, metadata, utdaterte satser, brutte kildelenker og foreldede yrkesbeskrivelser | Gjennomgå artikler og yrkessider. Historiske artikler skal beholde frosne snapshots; de skal ikke kobles om til `latest`-data. |
| 4. februar 2027 | SSB Lønn, årlig publisering | Nye årstall for lønn per yrke, kjønn, sektor og lærlinger. Særlig tabell 11418 og 12851 | Kjør `npm run ssb:sync`. Kontroller alle genererte lønnsdata, yrkeskort, yrkessider, lærlingesider, rangeringer og lønnsartikler. Følg tabell 12851 ukentlig dersom lærlingtallene ikke oppdateres samme dag. |
| Midten av februar 2027, dato ikke fastsatt | TBU, foreløpig rapport | Foreløpig lønnsvekst, prisprognose, overheng og grunnlag for lønnsoppgjøret | Vurder nyhet og oppdater artikler om forventet lønnsvekst. Merk prognoser som prognoser. |
| Slutten av mars 2027, dato ikke fastsatt | TBU, endelig rapport før oppgjørene | Endelig grunnlag for inntektsoppgjørene | Erstatt foreløpige TBU-tall der det er relevant, og behold publiseringshistorikken i artiklene. |
| April–mai 2027 | Tariff- og lønnsoppgjør | Resultater, nye tariffbestemte satser og mulige krav om endret allmenngjøring | Følg hovedorganisasjonene, Riksmekleren og Tariffnemnda. Tariffsats er ikke automatisk lovfestet minstelønn. |
| 1. mai 2027 | Virkningstidspunkt for nytt grunnbeløp i folketrygden | Nytt G og følger for grenser, ytelser og artikler | Beløpet blir normalt fastsatt senere i mai med virkning fra 1. mai. Kjør `npm run nav:sync` først når NAV har publisert det fastsatte beløpet. |
| Slutten av mai 2027, dato ikke fastsatt | Trygdeoppgjøret | Endelig nytt grunnbeløp og gjennomsnittlig G | Kjør `npm run nav:sync`, kontroller `src/lib/generated/nav-grunnbeloep-history.json` og oppdater artikler eller beregninger som bruker G. |
| Juni 2027, dato ikke fastsatt | TBU, rapport etter lønnsoppgjørene | Oppsummerte resultater fra årets lønnsoppgjør | Oppdater oppgjørsartikler og sammenlign faktiske resultater med tidligere prognoser. |

## Fast kontrollrytme

### Månedlig

- **Rundt den 10. hver måned:** Kontroller SSBs publiseringskalender for KPI. Tabell 14700 brukes i prosjektets kjøpekrafts- og inflasjonsgrunnlag. Neste bekreftede publisering ved denne kontrollen er 9. oktober 2026.
- **Første arbeidsdag i måneden:** Kontroller SSBs kommende publiseringer for de neste tre månedene. SSB varsler datoer løpende, så denne filen må ikke være eneste kalenderkilde.
- **Første arbeidsdag i måneden:** Kontroller Arbeidstilsynets minstelønnsside, Tariffnemndas høringer og Lovdata for endringsforskrifter.
- **Første arbeidsdag i måneden:** Kontroller om Utdanning.no har endret yrkesbeskrivelser eller koblinger som brukes i `src/lib/utdanning/yrkesbeskrivelser.json`. Gjør innholdskontroll før et lokalt snapshot erstattes.

### Kvartalsvis

- **Februar, mai, august og november:** SSBs tabell 11658 oppdateres normalt 5–6 uker etter utløpet av kvartalet. Kontroller den konkrete datoen i SSBs kalender og kjør `npm run ssb:sync` etter publisering.
- Etter synk skal du kontrollere at perioden faktisk er ny. En vellykket synk betyr ikke nødvendigvis at SSB har publisert en ny periode.
- Test minst ett høytlønnet yrke, ett lavtlønnet yrke, ett lite yrke, ett lærlingyrke og kjønnsdelte visninger.

### Årlig

- **Tidlig februar:** Hovedoppdateringen av årlige lønnsdata. Tabell 11418 og 12851 er viktigst for yrkes- og lærlinginnhold.
- **Februar, mars og juni:** Kontroller de tre sentrale TBU-publiseringene.
- **April–juni:** Følg lønnsoppgjør, tariffrevisjoner, trygdeoppgjør og allmenngjøring tettere enn ellers i året.
- **Mai:** Kontroller NAVs grunnbeløp og kjør `npm run nav:sync` etter at beløpet er fastsatt.
- **Oktober–desember:** Følg statsbudsjettet fra forslag til endelig vedtak. Oppdater artikler i to trinn dersom et forslag senere blir vedtatt med endringer.
- **Januar:** Gjennomfør redaksjonell årsrevisjon av alle tidssensitive artikler og yrkessider.

## Datasett som må følges

| Datasett | Frekvens | Bruk i prosjektet | Kontroll |
| --- | --- | --- | --- |
| SSB 11418 – yrkesfordelt månedslønn | Årlig, med mulige revisjoner | Median, fordelinger, kjønn, sektor, tillegg og rangeringer | Hovedkontroll tidlig i februar, deretter kontroll ved SSB-revisjoner. |
| SSB 11658 – lønnstakere, jobber og lønn per yrke | Kvartalsvis | Gjennomsnittslønn, antall lønnstakere, jobber, alder og arbeidstid | Ved hver kvartalspublisering. Neste bekreftede dato er 5. november 2026. |
| SSB 12851 – lærlinglønn per yrke | Årlig | Lærlingesider og lærlingrangeringer | Start kontroll ved den årlige lønnspubliseringen og følg ukentlig til tabellen har ny periode. |
| SSB 14700 – KPI | Månedlig | Kjøpekraft og inflasjonsjustering | Rundt den 10. hver måned. |
| NAVs grunnbeløp | Årlig, virkning fra 1. mai | Artikler, terskler og sammenligninger der G er riktig mål | Etter trygdeoppgjøret i mai. |
| Utdanning.no yrkesbeskrivelser | Ingen fast publiseringsdato lagt til grunn | Arbeidsoppgaver, arbeidssted og utdanningsvei på yrkessider | Månedlig endringskontroll og grundigere revisjon i januar. |
| Tariffnemnda og Lovdata | Hendelsesstyrt | Lovfestet minstelønn og vilkår i allmenngjorte bransjer | Månedlig normalt, ukentlig mens saker er under behandling. |

## Slik gjennomføres en dataoppdatering

1. Les primærkilden og noter publiseringsdato, dataperiode og eventuell virkningsdato.
2. Kontroller om kilden har revidert historiske tall, tabellstruktur, koder eller definisjoner.
3. Kjør relevant synk:
   - `npm run ssb:sync` for prosjektets SSB-datasett
   - `npm run nav:sync` for NAVs grunnbeløp
4. Se over endringene i `src/lib/generated` og manifestet. Kontroller at forventet periode og kildens oppdateringstidspunkt er med.
5. Test yrkessider, lærlingesider, rangeringer, kjønnssammenligninger, sektorvisninger og kjøpekraft.
6. Finn artikler som bruker berørte tall eller formuleringer. Oppdater `updatedAt` bare ved en reell innholdsendring, og behold opprinnelig `publishedAt`.
7. Behold frosne snapshots i historiske, periodespesifikke artikler. Lag et nytt snapshot når en artikkel skal omtale en ny periode.
8. Commit og deploy genererte filer. Nye SSB-tall blir ikke synlige i produksjon bare fordi SSB har publisert dem.
9. Publiser aldri automatisk. Gjennomfør redaksjonell og faglig kontroll først.

## Beslutningsregler

- **Forslag er ikke vedtak.** Bruk formuleringer som «foreslått sats» og «under behandling» til endelig vedtak foreligger.
- **Tariffsats er ikke nødvendigvis minstelønn.** En ny sats i en tariffavtale blir ikke lovfestet minstelønn før den er allmenngjort for den aktuelle bransjen.
- **Publiseringsdato er ikke virkningsdato.** Oppgi begge når de er forskjellige.
- **Ny kildeoppdatering er ikke alltid ny dataperiode.** Kontroller periodefeltet før innhold revideres.
- **Revisjoner kan endre historikken.** Sammenlign mer enn bare siste observasjon.
- **Bruk offisielle kilder.** SSB for statistikk, NAV for G, Tariffnemnda og Lovdata for allmenngjøring, Arbeidstilsynet for samlet veiledning og regjeringen/TBU for inntektsoppgjørene.

## Primærkilder og kalendere

- [SSB: Kommende publiseringer](https://www.ssb.no/kommende-publiseringer)
- [SSB: Lønn](https://www.ssb.no/arbeid-og-lonn/lonn-og-arbeidskraftkostnader/statistikk/lonn)
- [SSB: Antall arbeidsforhold og lønn](https://www.ssb.no/arbeid-og-lonn/sysselsetting/statistikk/antall-arbeidsforhold-og-lonn)
- [SSB: Konsumprisindeksen](https://www.ssb.no/priser-og-prisindekser/konsumpriser/statistikk/konsumprisindeksen)
- [SSB Statistikkbanken: tabell 11418](https://www.ssb.no/statbank/table/11418)
- [SSB Statistikkbanken: tabell 11658](https://www.ssb.no/statbank/table/11658)
- [SSB Statistikkbanken: tabell 12851](https://www.ssb.no/statbank/table/12851)
- [SSB Statistikkbanken: tabell 14700](https://www.ssb.no/statbank/table/14700)
- [Arbeidstilsynet: Minstelønn](https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/)
- [Tariffnemnda: Høringer og bransjer](https://www.tariffnemnda.no/horinger/)
- [Tariffnemnda: Saksgang](https://www.tariffnemnda.no/saksgang/)
- [Tariffnemnda: Fiskeindustribedrifter](https://www.tariffnemnda.no/horinger/fiskeindustribedrifter/)
- [Lovdata: Sentrale forskrifter](https://lovdata.no/register/forskrifter)
- [NAV: Grunnbeløpet i folketrygden](https://www.nav.no/grunnbelopet)
- [Regjeringen: TBU-rapporter](https://www.regjeringen.no/no/tema/arbeidsliv/lonn-og-inntekt/innsikt/inntektspolitikk-og-lonnsoppgjor/det-tekniske-beregningsutvalget-for-inntektsoppgjorene-tbu/rapporter-fra-det-tekniske-beregningsutvalget-for/id450757/)
- [Regjeringen: Statsbudsjettet 2027](https://www.regjeringen.no/no/statsbudsjett/2027/id3161417/)

## Vedlikehold av denne kalenderen

- Oppdater feltet «Sist kontrollert» hver gang datoene gjennomgås mot primærkildene.
- Erstatt passerte, bekreftede datoer med neste annonserte dato.
- Behold bare passerte datoer som fortsatt utløser oppfølgingsarbeid.
- Skriv «dato ikke fastsatt» når kilden bare oppgir et tidsrom. Ikke gjett en eksakt dato.
