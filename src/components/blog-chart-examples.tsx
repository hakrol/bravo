import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";

const electricianSalaryData: BlogChartDatum[] = [
  { label: "Automatikere", value: 60080 },
  { label: "Energimontører", value: 58140 },
  { label: "Alle yrker", value: 55800 },
  { label: "Elektrikere", value: 54930, category: "highlight" },
  { label: "Rørleggere og VVS-montører", value: 53750 },
  { label: "Serviceelektronikere", value: 53570 },
  { label: "Tele- og IKT-installatører", value: 48590 },
  { label: "Tømrere og snekkere", value: 47900 },
];

export function BlogElectricianSalaryChart() {
  return (
    <BlogChart
      data={electricianSalaryData}
      format="currency"
      highlightLabel="Elektrikere"
      note="Målemetode: median. Sektor: alle sektorer. Kjønn: begge kjønn. Arbeidstid: i alt. Tid: 2025."
      sort="descending"
      source="SSB tabell 11418"
      subtitle="Median månedslønn i 2025. Elektrikere sammenlignes med totalnivået og nærliggende håndverksyrker."
      title="Elektrikere ligger tett på totalmedianen"
      type="bar-horizontal"
      xAxisLabel="Kroner per måned"
    />
  );
}

const psychologistSalaryData: BlogChartDatum[] = [
  { label: "Legespesialister", value: 107160 },
  { label: "Allmennpraktiserende leger", value: 83080 },
  { label: "Tannleger", value: 75000 },
  { label: "Psykologer", value: 66270, category: "highlight" },
  { label: "Kiropraktorer mv.", value: 65900 },
  { label: "Spesialsykepleiere", value: 63810 },
  { label: "Sykepleiere", value: 57830 },
  { label: "Alle yrker", value: 55800 },
];

export function BlogPsychologistSalaryChart() {
  return (
    <BlogChart
      data={psychologistSalaryData}
      format="currency"
      highlightLabel="Psykologer"
      note="Målemetode: median. Sektor: alle sektorer. Kjønn: begge kjønn. Arbeidstid: i alt. Tid: 2025."
      sort="descending"
      source="SSB tabell 11418"
      subtitle="Median månedslønn i utvalgte helseyrker. Stolpene viser 2025-tall fra SSB."
      title="Psykologer ligger over mange helseyrker"
      type="bar-horizontal"
      xAxisLabel="Kroner per måned"
    />
  );
}

const healthSalaryBubbleData: BlogChartDatum[] = [
  {
    label: "Jordmødre",
    value: 69660,
    size: 2976,
    note: "Høyest median månedslønn i dette utvalget.",
  },
  {
    label: "Spesialsykepleiere",
    value: 63810,
    size: 30211,
  },
  {
    label: "Farmasøyter",
    value: 62840,
    size: 1882,
  },
  {
    label: "Ambulansepersonell",
    value: 59260,
    size: 5638,
  },
  {
    label: "Radiografer mv.",
    value: 58080,
    size: 3157,
  },
  {
    label: "Sykepleiere",
    value: 57830,
    size: 61314,
    category: "highlight",
    note: "Median månedslønn for sykepleiere i 2025.",
  },
  {
    label: "Helsefagarbeidere",
    value: 51430,
    size: 96139,
    note: "Største yrkesgruppe i dette helseutvalget målt i antall lønnstakere.",
  },
  {
    label: "Helsesekretærer",
    value: 45710,
    size: 9284,
  },
  {
    label: "Andre pleiemedarbeidere",
    value: 45070,
    size: 71067,
  },
];

export function HealthSalaryBubbleChart() {
  return (
    <BlogChart
      data={healthSalaryBubbleData}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 2025K4 fra SSB tabell 11658, begge kjønn og alle aldre."
      source="SSB tabell 11418 og 11658"
      sort="none"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Lønn og arbeidstakere i helsesektoren"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}

export function SalaryJumpBarChart() {
  return (
    <BlogChart
      categories={[
        {
          label: "Jobbskifte",
          segments: [
            { label: "Standardnivå", value: 8, color: "#e9c46a", note: "Nedre del av et vanlig jobbskifte." },
            { label: "Realistisk spenn", value: 7, color: "#4d7c5b", note: "Området mange kan argumentere for med riktig marked og rolle." },
            { label: "Ambisiøst nivå", value: 5, color: "#14532d", note: "Øvre del når marked, kompetanse og timing trekker i samme retning." },
          ],
        },
        {
          label: "Økt ansvar",
          segments: [
            { label: "Standardnivå", value: 5, color: "#e9c46a" },
            { label: "Realistisk spenn", value: 4, color: "#4d7c5b" },
            { label: "Ambisiøst nivå", value: 3, color: "#14532d" },
          ],
        },
        {
          label: "Årlig justering",
          segments: [
            { label: "Standardnivå", value: 3, color: "#e9c46a" },
            { label: "Realistisk spenn", value: 2, color: "#4d7c5b" },
            { label: "Ambisiøst nivå", value: 1, color: "#14532d" },
          ],
        },
      ]}
      format="percent"
      normalizeStacked={false}
      note="Intervallene er redaksjonelle tommelfingerregler, ikke SSB-statistikk."
      source="Lønnsinnsikt, basert på vanlige forhandlingssituasjoner"
      subtitle="Stablede stolper viser hvordan et lønnskrav kan bygges opp fra standardnivå til mer ambisiøse nivåer. Skalaen går til 100 %, men disse situasjonene stopper naturlig langt tidligere."
      title="Hvor høyt kan et lønnskrav typisk ligge?"
      type="stacked-bar"
    />
  );
}

const ssbLikeMonthlySalaryData: BlogChartDatum[] = [
  {
    label: "Ledere",
    value: 78020,
    note: "Median månedslønn for hovedgruppen i 2025.",
  },
  {
    label: "Akademiske yrker",
    value: 62040,
    note: "Representativ SSB-struktur for yrkesfordelt månedslønn.",
  },
  {
    label: "Alle yrker",
    value: 55800,
    category: "highlight",
    note: "Totalnivået gjør det enklere å lese avstanden til markedet.",
  },
  {
    label: "Kontoryrker",
    value: 52110,
    note: "Gjennomsnittlig nivå i eksempelet.",
  },
  {
    label: "Salgs- og serviceyrker",
    value: 45260,
    note: "Lavere median enn totalnivået.",
  },
];

export function SsbSalaryExampleChart() {
  return (
    <BlogChart
      data={ssbLikeMonthlySalaryData}
      format="currency"
      highlightLabel="Alle yrker"
      note="Eksempeldata følger samme dimensjoner som SSB-tabell 11418: målemetode, yrke, sektor, kjønn, arbeidstid, innhold og tid."
      source="SSB tabell 11418, strukturert eksempel for Lønnsinnsikt"
      sort="descending"
      subtitle="Median månedslønn etter yrkesgruppe. Stolpene er sortert fra høyest til lavest, med totalnivået markert."
      title="Median månedslønn varierer mye mellom yrkesgrupper"
      type="bar-horizontal"
      xAxisLabel="Kroner per måned"
    />
  );
}

export function SalaryLevelStackedChart() {
  return (
    <BlogChart
      categories={[
        {
          label: "Ledere",
          note: "representativ fordeling",
          segments: [
            { label: "Under 50k", value: 12, color: "#e9c46a", note: "Andel under 50 000 kroner i måneden." },
            { label: "50-70k", value: 38, color: "#4d7c5b", note: "Andel mellom 50 000 og 70 000 kroner." },
            { label: "Over 70k", value: 46, color: "#14532d", note: "Andel over 70 000 kroner i måneden." },
            { label: "Uoppgitt", value: 4, color: "#cbd5e1", note: "Manglende eller skjermet verdi." },
          ],
        },
        {
          label: "Akademiske yrker",
          segments: [
            { label: "Under 50k", value: 21, color: "#e9c46a" },
            { label: "50-70k", value: 52, color: "#4d7c5b" },
            { label: "Over 70k", value: 22, color: "#14532d" },
            { label: "Uoppgitt", value: 5, color: "#cbd5e1" },
          ],
        },
        {
          label: "Alle yrker",
          note: "referanse",
          segments: [
            { label: "Under 50k", value: 36, color: "#e9c46a" },
            { label: "50-70k", value: 43, color: "#4d7c5b" },
            { label: "Over 70k", value: 15, color: "#14532d" },
            { label: "Uoppgitt", value: 6, color: "#cbd5e1" },
          ],
        },
        {
          label: "Salgs- og serviceyrker",
          segments: [
            { label: "Under 50k", value: 58, color: "#e9c46a" },
            { label: "50-70k", value: 31, color: "#4d7c5b" },
            { label: "Over 70k", value: 6, color: "#14532d" },
            { label: "Uoppgitt", value: 5, color: "#cbd5e1" },
          ],
        },
      ]}
      format="percent"
      note="Eksempelet viser et redaksjonelt fordelingsformat for SSB-lignende lønnsdata. Segmentene normaliseres til 100 prosent per rad."
      normalizeStacked
      showLegend
      source="SSB-lignende eksempelstruktur for Lønnsinnsikt"
      subtitle="Hver rad viser hvordan lønnsnivået fordeler seg innenfor en yrkesgruppe. Mørkere grønn betyr høyere lønnsnivå."
      title="Fordelingen sier mer enn ett enkelt lønnstall"
      type="stacked-bar"
    />
  );
}

const norwayOccupationSalary2025Data: BlogChartDatum[] = [
  {
    label: "Flygeledere",
    value: 121910,
    note: "Høyeste median månedslønn blant fire-sifrede yrkeskoder i utvalget.",
  },
  {
    label: "Ledere av olje- og gassutvinning mv.",
    value: 120670,
  },
  {
    label: "Toppledere i offentlig administrasjon",
    value: 119520,
  },
  {
    label: "Dommere",
    value: 118470,
  },
  {
    label: "Flygere",
    value: 118440,
  },
  {
    label: "Ledere av forsikring og finansvirksomhet",
    value: 108190,
  },
  {
    label: "Alle yrker",
    value: 55800,
    category: "highlight",
    note: "Median månedslønn for alle yrker samlet.",
  },
  {
    label: "Mannekenger og modeller",
    value: 35600,
  },
  {
    label: "Hjelpearbeidere i skogbruk",
    value: 34910,
  },
  {
    label: "Intervjuere",
    value: 32540,
  },
  {
    label: "Hjelpearbeidere i husdyrproduksjon",
    value: 32470,
  },
  {
    label: "Hjelpearbeidere i nyttevekstproduksjon",
    value: 31390,
    note: "Laveste median månedslønn blant fire-sifrede yrkeskoder i utvalget.",
  },
];

export function NorwayOccupationSalary2025Chart() {
  return (
    <BlogChart
      data={norwayOccupationSalary2025Data}
      format="currency"
      highlightLabel="Alle yrker"
      note="Målemetode: median. Sektor: alle sektorer. Kjønn: begge kjønn. Arbeidstid: i alt. Tid: 2025. Utvalget viser fire-sifrede yrkeskoder, mens aggregater og uoppgitte yrker er utelatt fra topp- og bunnutvalget."
      sort="descending"
      source="SSB tabell 11418"
      subtitle="Utvalget viser de seks høyeste yrkene, totalnivået for alle yrker og fem av de laveste yrkene i SSBs 2025-tall."
      title="Median månedslønn varierer kraftig mellom yrker"
      type="bar-horizontal"
      xAxisLabel="Kroner per måned"
    />
  );
}

const doctorSalaryBubbleData: BlogChartDatum[] = [
  {
    label: "Legespesialister",
    value: 107160,
    size: 18271,
    sizeLabel: "18 271 lønnstakere",
    category: "highlight",
    note: "Høyest median månedslønn i dette utvalget.",
  },
  {
    label: "Allmennpraktiserende leger",
    value: 83080,
    size: 8888,
    sizeLabel: "8 888 lønnstakere",
  },
  {
    label: "Spesialsykepleiere",
    value: 63810,
    size: 30211,
    sizeLabel: "30 211 lønnstakere",
  },
  {
    label: "Sykepleiere",
    value: 57830,
    size: 61314,
    sizeLabel: "61 314 lønnstakere",
  },
];

export function DoctorSalaryBubbleChart() {
  return (
    <BlogChart
      data={doctorSalaryBubbleData}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 2025K4 fra SSB tabell 11658."
      sort="none"
      source="SSB tabell 11418 og 11658"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere."
      title="Legeyrkene er høytlønte, men ikke størst"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
