import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { BlogSalaryDevelopmentChart, type BlogSalaryDevelopmentSeries } from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import rorleggerLonn2025Snapshot from "@/content/blog/data/rorlegger-lonn-2025.json";

type RorleggerSalarySnapshot = {
  source: string;
  rows: {
    code: string;
    label: string;
    href: string;
    value: number | null;
    employees?: number;
  }[];
  genderMedian: {
    occupationLabel: string;
    period: string;
    source: string;
    womenMonthlyMedian: number;
    menMonthlyMedian: number;
  };
  salaryDevelopment: {
    occupationLabel: string;
    source: string;
    rows: {
      label: string;
      value: number;
    }[];
  };
};

const editorialLabels = [
  "Kuldemontører mv.",
  "Elektrikere",
  "Rørleggere og VVS-montører",
  "Betongarbeidere",
  "Murere",
  "Tømrere og snekkere",
  "Malere og byggtapetserere",
];

const bubbleLabels = [
  "Elektrikere",
  "Rørleggere og VVS-montører",
  "Betongarbeidere",
  "Tømrere og snekkere",
  "Murere",
  "Kuldemontører mv.",
  "Malere og byggtapetserere",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  Elektrikere: { lane: 0.25, labelOffset: { x: 0, y: -36, anchor: "middle" }, radiusBoost: 4 },
  "Rørleggere og VVS-montører": { lane: 0.48, labelOffset: { x: 0, y: 38, anchor: "middle" }, radiusBoost: 5 },
  Betongarbeidere: { lane: 0.68, labelOffset: { x: 12, y: -28, anchor: "start" } },
  "Tømrere og snekkere": { lane: 0.82, labelOffset: { x: -8, y: 36, anchor: "middle" }, radiusBoost: 6 },
  Murere: { lane: 0.35, labelOffset: { x: -18, y: 10, anchor: "end" } },
  "Kuldemontører mv.": { lane: 0.58, labelOffset: { x: 18, y: -20, anchor: "start" } },
  "Malere og byggtapetserere": { lane: 0.16, labelOffset: { x: 18, y: 10, anchor: "start" } },
};

function getSnapshot() {
  return rorleggerLonn2025Snapshot as RorleggerSalarySnapshot;
}

function getEditorialRows() {
  const snapshot = getSnapshot();

  return editorialLabels.flatMap((label) => {
    const row = snapshot.rows.find((entry) => entry.label === label);

    if (!row || typeof row.value !== "number") {
      return [];
    }

    return [
      {
        href: row.href,
        label: row.label,
        value: row.value,
        highlight: row.label === "Rørleggere og VVS-montører",
      },
    ];
  });
}

function getBubbleData(): BlogChartDatum[] {
  const snapshot = getSnapshot();

  return bubbleLabels.flatMap((label) => {
    const row = snapshot.rows.find((entry) => entry.label === label);

    if (!row || typeof row.value !== "number" || typeof row.employees !== "number") {
      return [];
    }

    return [
      {
        label: row.label,
        value: row.value,
        size: row.employees,
        sizeLabel: `${row.employees.toLocaleString("nb-NO")} lønnstakere`,
        category: row.label === "Rørleggere og VVS-montører" ? "highlight" : undefined,
        note: row.label === "Rørleggere og VVS-montører" ? "Nærmeste tilgjengelige SSB-gruppe for rørleggere." : undefined,
        ...bubbleLayout[row.label],
      },
    ];
  });
}

function getSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  const snapshot = getSnapshot();

  return [
    {
      color: "#14532d",
      label: snapshot.salaryDevelopment.occupationLabel,
      points: snapshot.salaryDevelopment.rows,
    },
  ];
}

export function RorleggerGenderSalaryCards() {
  const gender = getSnapshot().genderMedian;

  return (
    <BlogGenderSalaryCards
      occupationLabel={gender.occupationLabel}
      period={gender.period}
      source={gender.source}
      womenMonthlyMedian={gender.womenMonthlyMedian}
      menMonthlyMedian={gender.menMonthlyMedian}
    />
  );
}

export function RorleggerSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median samlet månedslønn for begge kjønn, alle sektorer og arbeidstid i alt."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median samlet månedslønn for rørleggere og VVS-montører fra 2021 til 2025."
      title="Rørleggerlønnen økte med 9 160 kroner på fem år"
      yAxisLabel="Median samlet månedslønn"
    />
  );
}

export function RorleggerSalaryEditorialChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Rørleggerlønn"
      source={snapshot.source}
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for rørleggere og nærliggende håndverksyrker, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 70000]}
      title="Rørleggere ligger høyt blant bygg- og installasjonsfag"
    />
  );
}

export function RorleggerSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 2025K4 fra SSB tabell 11658."
      source="SSB tabell 11418 og 11658"
      sort="none"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrkesgruppen."
      title="Rørleggere er færre enn elektrikere og snekkere, men ligger høyere i lønn"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
