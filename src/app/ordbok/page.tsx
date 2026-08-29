import type { Metadata } from "next";
import { DictionaryFilter, type DictionaryEntry } from "@/components/dictionary-filter";
import { getAllForklarerPosts } from "@/lib/forklarer";
import { siteConfig } from "@/lib/site-config";

const description =
  "Ordbok for lønn, lønnsstatistikk og vanlige begreper brukt på Lønnsinnsikt.";

const baseDictionaryEntries: DictionaryEntry[] = [
  {
    term: "Avtalt månedslønn",
    definition:
      "Månedslønn som er avtalt for jobben, vanligvis før tillegg som overtid, bonus og uregelmessige tillegg.",
  },
  {
    term: "Bonus",
    definition:
      "Variabel betaling som kan komme i tillegg til fast lønn, ofte basert på resultater, måloppnåelse eller virksomhetens ordninger.",
  },
  {
    term: "Benchmark",
    definition:
      "Et sammenligningsgrunnlag som brukes for å vurdere om lønnen ligger lavt, normalt eller høyt sammenlignet med markedet.",
  },
  {
    term: "Bruttolønn",
    definition:
      "Lønn før skatt, forskuddstrekk og andre fratrekk. Når lønn sammenlignes i statistikk, er det ofte bruttobeløp som brukes.",
  },
  {
    term: "Deltid",
    definition:
      "Arbeidstid som er lavere enn full stilling. Deltidsarbeid kan gjøre direkte sammenligning av månedslønn mer krevende hvis tallene ikke er justert.",
  },
  {
    term: "Fastlønn",
    definition:
      "Avtalt lønn som betales regelmessig, uavhengig av bonus, overtid og andre variable tillegg.",
  },
  {
    term: "Fagforening",
    definition:
      "En organisasjon for arbeidstakere som kan forhandle om lønn, arbeidsvilkår og rettigheter på vegne av medlemmene.",
    explanationHref: "/forklarer/fagforening",
  },
  {
    term: "Feriepengegrunnlag",
    definition:
      "Beløpet feriepengene beregnes av, vanligvis arbeidsvederlag som er utbetalt i opptjeningsåret.",
    explanationHref: "/forklarer/feriepengegrunnlag",
  },
  {
    term: "Gjennomsnittslønn",
    definition:
      "Summen av lønn delt på antall personer eller arbeidsforhold. Gjennomsnitt kan påvirkes mye av svært høye eller lave lønninger.",
    explanationHref: "/forklarer/gjennomsnittslonn",
  },
  {
    term: "Grunnlønn",
    definition:
      "Den faste lønnen før tillegg som overtid, bonus, skifttillegg eller andre variable ytelser.",
  },
  {
    term: "Heltid",
    definition:
      "Arbeidstid som tilsvarer full stilling. Hva som regnes som heltid kan variere mellom yrker, tariffområder og arbeidstidsordninger.",
  },
  {
    term: "Helgetillegg",
    definition:
      "Ekstra betaling for arbeid i helgen, vanligvis bestemt av tariffavtale, arbeidsavtale eller lokale lønnsregler.",
    explanationHref: "/forklarer/helgetillegg",
  },
  {
    term: "Indeks",
    definition:
      "Et mål som viser utvikling over tid med et valgt startpunkt. Lønnsindekser brukes ofte for å se om lønn øker eller faller relativt til tidligere perioder.",
  },
  {
    term: "Inflasjon",
    definition:
      "Prisvekst i samfunnet. Når inflasjonen er høy, må lønnen ofte øke mer for at kjøpekraften skal holde seg oppe.",
  },
  {
    term: "Kvartil",
    definition:
      "En inndeling av en fordeling i fire like store deler. I lønnsstatistikk kan kvartiler vise hvor de laveste, midterste og høyeste lønningene ligger.",
  },
  {
    term: "Kjøpekraft",
    definition:
      "Hva lønnen faktisk kan kjøpe når prisnivået tas med i vurderingen. Lønnen kan øke i kroner samtidig som kjøpekraften faller hvis prisene stiger mer.",
  },
  {
    term: "Konsumprisindeks",
    definition:
      "En indeks fra SSB som måler prisutviklingen på varer og tjenester husholdninger kjøper. Brukes ofte som mål på inflasjon.",
  },
  {
    term: "Lønnsgap",
    definition:
      "Forskjellen i lønn mellom to grupper, for eksempel kvinner og menn, sektorer eller yrkesgrupper.",
  },
  {
    term: "Lønnsfordeling",
    definition:
      "Hvordan lønnen er spredt i en gruppe. Fordelingen kan vise om de fleste ligger tett rundt et nivå, eller om det er store forskjeller.",
    explanationHref: "/forklarer/lonnsfordeling",
  },
  {
    term: "Lønnsnivå",
    definition:
      "Det typiske lønnsområdet for et yrke, en rolle, en bransje eller en gruppe arbeidstakere.",
  },
  {
    term: "Lønnsoppgjør",
    definition:
      "Forhandlinger om lønn og arbeidsvilkår, ofte mellom arbeidsgiver- og arbeidstakerorganisasjoner.",
  },
  {
    term: "Lønnsvekst",
    definition:
      "Hvor mye lønnen øker over tid, vanligvis målt i kroner eller prosent fra én periode til en annen.",
  },
  {
    term: "Markedsverdi",
    definition:
      "En praktisk vurdering av hva kompetanse, erfaring og rolle typisk er verdt i arbeidsmarkedet.",
  },
  {
    term: "Medianlønn",
    definition:
      "Lønnen i midten av fordelingen. Halvparten tjener mindre og halvparten tjener mer. Median er ofte nyttig når du vil forstå hva som er vanlig lønn.",
    explanationHref: "/forklarer/medianlonn",
  },
  {
    term: "Minstelønn",
    definition:
      "Den laveste lønnen en arbeidstaker kan ha når lov, forskrift, tariffavtale eller arbeidsavtale setter en bindende nedre grense.",
    explanationHref: "/forklarer/minstelonn",
  },
  {
    term: "Månedslønn",
    definition:
      "Lønn oppgitt per måned. Mange av lønnstallene fra SSB vises som månedslønn, ofte før skatt.",
  },
  {
    term: "Nominell lønn",
    definition:
      "Lønn målt i kroner uten å justere for prisvekst. Nominell lønn kan øke selv om kjøpekraften står stille eller faller.",
  },
  {
    term: "Overtid",
    definition:
      "Arbeid utover avtalt eller lovbestemt arbeidstid. Overtidsbetaling kan gjøre faktisk utbetalt lønn høyere enn avtalt månedslønn.",
  },
  {
    term: "Persentil",
    definition:
      "Et punkt i lønnsfordelingen. For eksempel betyr 25-persentilen at 25 prosent tjener mindre og 75 prosent tjener mer.",
  },
  {
    term: "Prosentvis avvik",
    definition:
      "Forskjellen mellom to tall målt i prosent. Brukes for å vise hvor mye en lønn ligger over eller under et sammenligningsnivå.",
  },
  {
    term: "Reallønn",
    definition:
      "Lønn justert for prisvekst. Reallønn sier mer om kjøpekraft enn nominell lønn alene.",
  },
  {
    term: "Sektor",
    definition:
      "Inndeling av arbeidsmarkedet, for eksempel privat sektor, kommunal forvaltning eller statlig forvaltning.",
  },
  {
    term: "Skifttillegg",
    definition:
      "Tillegg som kan gis for arbeid på ubekvemme tider, for eksempel kveld, natt, helg eller turnus.",
  },
  {
    term: "Tariffavtale",
    definition:
      "En avtale mellom arbeidsgiver eller arbeidsgiverorganisasjon og arbeidstakerorganisasjon om lønn og arbeidsvilkår.",
    explanationHref: "/forklarer/tariffavtale",
  },
  {
    term: "Timelønn",
    definition:
      "Lønn oppgitt per time. Timelønn kan beregnes fra månedslønn, men resultatet avhenger av antall arbeidstimer som legges til grunn.",
  },
  {
    term: "Uregelmessige tillegg",
    definition:
      "Tillegg som ikke nødvendigvis kommer hver måned, for eksempel enkelte vakt-, skift- eller ulempetillegg.",
  },
  {
    term: "Årslønn",
    definition:
      "Lønn oppgitt per år. Årslønn brukes ofte i jobbtilbud og forhandlinger, mens SSB ofte viser månedslønn i statistikken.",
  },
  {
    term: "Yrkesgruppe",
    definition:
      "En samling beslektede yrker. Yrkesgrupper gjør det mulig å se lønn i bredere kategorier før man går ned på enkeltyrker.",
  },
  {
    term: "Arbeidsgiverperioden",
    definition:
      "Den første delen av et sykefravær der arbeidsgiveren normalt har ansvar for å betale sykepenger. For ansatte er dette vanligvis de første 16 kalenderdagene.",
  },
  {
    term: "Avkorting",
    definition:
      "At en godtgjøring eller annen ytelse reduseres fordi mottakeren har annen inntekt eller mottar en annen ytelse.",
  },
  {
    term: "Beregningsgrunnlag",
    definition:
      "Beløpet eller satsen som brukes som utgangspunkt når lønn, godtgjøring eller en annen ytelse skal beregnes.",
  },
  {
    term: "Ettergodtgjøring",
    definition:
      "Godtgjøring som kan utbetales i en begrenset periode etter at et politisk verv eller annet oppdrag er avsluttet.",
  },
  {
    term: "Fast godtgjøring",
    definition:
      "Et fast beløp som betales for et verv, uavhengig av antall møter eller registrerte arbeidstimer.",
  },
  {
    term: "Folkevalgt",
    definition:
      "En person som er valgt av innbyggerne, eller valgt inn i et politisk organ etter reglene i kommuneloven.",
  },
  {
    term: "Frikjøp",
    definition:
      "En ordning der en folkevalgt får godtgjøring for å ta helt eller delvis fri fra sitt vanlige arbeid for å utføre politiske verv.",
  },
  {
    term: "Godtgjøring",
    definition:
      "Betaling for et verv, oppdrag eller bestemte utgifter. Godtgjøring er ikke nødvendigvis lønn fra et ansettelsesforhold.",
  },
  {
    term: "Godtgjøringstak",
    definition:
      "En øvre grense for hvor mye en person samlet kan motta i godtgjøring og bestemte tilknyttede ytelser.",
  },
  {
    term: "Honorar",
    definition:
      "Betaling for et oppdrag eller verv, ofte utenfor et ordinært ansettelsesforhold.",
  },
  {
    term: "Møtegodtgjøring",
    definition:
      "Betaling en folkevalgt eller et utvalgsmedlem får for å delta i et møte.",
  },
  {
    term: "Politisk verv",
    definition:
      "En offentlig politisk rolle eller oppgave som en person er valgt eller oppnevnt til.",
  },
  {
    term: "Tapt arbeidsfortjeneste",
    definition:
      "Erstatning for arbeidsinntekt en person faktisk mister på grunn av et verv, møte eller annet godkjent fravær. Omtales også som tapt arbeidsinntekt.",
  },
  {
    term: "Tjenestepensjon",
    definition:
      "Pensjon som opptjenes gjennom en arbeidsgiver eller en særskilt pensjonsordning knyttet til arbeid eller verv.",
  },
  {
    term: "Utgiftsgodtgjøring",
    definition:
      "Betaling eller refusjon som skal dekke bestemte utgifter, for eksempel reise, kost eller overnatting.",
  },
].sort((left, right) => left.term.localeCompare(right.term, "nb-NO"));

export const metadata: Metadata = {
  title: "Ordbok",
  description,
  alternates: {
    canonical: "/ordbok",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/ordbok",
    siteName: siteConfig.name,
    title: `Ordbok | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Ordbok | ${siteConfig.name}`,
    description,
  },
};

export default async function OrdbokPage() {
  const forklarerPosts = await getAllForklarerPosts();
  const dictionaryEntriesByTerm = new Map(
    baseDictionaryEntries.map((entry) => [entry.term.toLocaleLowerCase("nb-NO"), entry]),
  );

  forklarerPosts.forEach((post) => {
    const key = post.term.toLocaleLowerCase("nb-NO");
    const existingEntry = dictionaryEntriesByTerm.get(key);

    dictionaryEntriesByTerm.set(key, {
      term: post.term,
      definition: existingEntry?.definition ?? post.description,
      explanationHref: `/forklarer/${post.slug}`,
    });
  });

  const dictionaryEntries = Array.from(dictionaryEntriesByTerm.values()).sort((left, right) =>
    left.term.localeCompare(right.term, "nb-NO"),
  );

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <section className="bg-[#f4f7f1] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
              Begreper
            </p>
            <h1 className="mt-4 text-6xl font-extrabold leading-[0.98] text-slate-950 sm:text-7xl">
              Ordbok
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
              Forklaringer på ord og uttrykk som brukes i lønnssammenheng og lønnsstatistikk.
            </p>
          </div>

          <DictionaryFilter entries={dictionaryEntries} />
        </div>
      </section>
    </main>
  );
}
