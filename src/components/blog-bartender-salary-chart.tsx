import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import bartenderLonn2025Snapshot from "@/content/blog/data/bartender-lonn-2025.json";

type BartenderSalarySnapshot = {
  rows: {
    label: string;
    value: number | null;
    href?: string;
    employees?: number;
    averageAge?: number;
  }[];
  distribution: {
    p25: number;
    median: number;
    average: number;
    p75: number;
    source: string;
  };
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
  realSalaryDevelopment: {
    source: string;
    rows: {
      label: string;
      real2025: number;
    }[];
  };
};

const bubbleLabels = [
  "Restaurantsjefer",
  "Kokker",
  "Hotellresepsjonister",
  "Bartendere",
  "Servitører",
  "Gatekjøkken- og kafémedarbeidere mv.",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "labelOffset" | "showLabel" | "radiusBoost">> = {
  Restaurantsjefer: { labelOffset: { x: 20, y: -18, anchor: "start" }, radiusBoost: 2, showLabel: true },
  Kokker: { labelOffset: { x: 20, y: -18, anchor: "start" }, radiusBoost: 7, showLabel: true },
  Hotellresepsjonister: { labelOffset: { x: 20, y: 18, anchor: "start" }, radiusBoost: 3, showLabel: true },
  Bartendere: { labelOffset: { x: -24, y: -18, anchor: "end" }, radiusBoost: 5, showLabel: true },
  Servitører: { labelOffset: { x: 0, y: 42, anchor: "middle" }, radiusBoost: 8, showLabel: true },
  "Gatekjøkken- og kafémedarbeidere mv.": { labelOffset: { x: -24, y: -18, anchor: "end" }, radiusBoost: 5, showLabel: true },
};

const bubbleDisplayLabels: Record<string, string> = {
  "Gatekjøkken- og kafémedarbeidere mv.": "Gatekjøkken-\nog kafémedarbeidere",
};

function getSnapshot() {
  return bartenderLonn2025Snapshot as BartenderSalarySnapshot;
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
        shortLabel: bubbleDisplayLabels[row.label],
        value: row.value,
        size: row.employees,
        sizeLabel: `${row.employees.toLocaleString("nb-NO")} lønnstakere, snittalder ${row.averageAge?.toLocaleString("nb-NO")} år`,
        category: row.label === "Bartendere" ? "highlight" : undefined,
        note: row.label === "Bartendere" ? "Median månedslønn for bartendere i 2025." : undefined,
        lane: typeof row.averageAge === "number" ? getAgeLane(row.averageAge) : undefined,
        ...bubbleLayout[row.label],
      },
    ];
  });
}

function getAgeLane(averageAge: number) {
  const minAge = 30;
  const maxAge = 49;
  const ratio = (averageAge - minAge) / Math.max(maxAge - minAge, 1);

  return 0.9 - Math.max(0, Math.min(1, ratio)) * 0.72;
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

function getRealSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  const snapshot = getSnapshot();

  return [
    {
      color: "#1d4ed8",
      label: "Reallønn i 2025-kroner",
      points: snapshot.realSalaryDevelopment.rows.map((row) => ({
        label: row.label,
        value: row.real2025,
      })),
    },
  ];
}

export function BartenderGenderSalaryCards() {
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

export function BartenderSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median månedslønn for STYRK-08 5132 Bartendere, begge kjønn, alle sektorer og arbeidstid i alt."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median månedslønn for bartendere fra 2021 til 2025."
      title="Bartenderlønnen økte med 7 360 kroner på fem år"
      yAxisLabel="Median månedslønn"
    />
  );
}

export function BartenderRealSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Reallønn er beregnet ved å justere median månedslønn med årlig gjennomsnitt av KPI, der 2025=100."
      series={getRealSalaryDevelopmentSeries()}
      source={snapshot.realSalaryDevelopment.source}
      subtitle="Median månedslønn justert til 2025-kroner."
      title="Reallønnen økte svakere enn den nominelle lønnen"
      yAxisLabel="Månedslønn i 2025-kroner"
    />
  );
}

export function BartenderSalaryDistributionChart() {
  const distribution = getSnapshot().distribution;

  return (
    <EditorialDivergingBarChart
      data={[
        { label: "Nedre kvartil", value: distribution.p25 },
        { label: "Median", value: distribution.median, highlight: true },
        { label: "Gjennomsnitt", value: distribution.average },
        { label: "Øvre kvartil", value: distribution.p75 },
      ]}
      format="currency"
      kicker="Lønnsfordeling"
      note="Nedre og øvre kvartil viser hvor midtre halvdel av lønnsfordelingen ligger. Gjennomsnittet kan trekkes opp av høyere lønninger."
      source={distribution.source}
      subtitleLabel="Kroner per måned"
      subtitleText="Median, gjennomsnitt og kvartiler for bartendere i 2025."
      ticks={[0, 20000, 35000, 45000]}
      title="Midten av bartenderlønnen ligger rundt 37 500 kroner"
    />
  );
}

export function BartenderSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere og gjennomsnittsalder gjelder 4. kvartal 2025 fra SSB tabell 11658. Yngre yrkesgrupper er plassert lavere i figuren."
      source="SSB tabell 11418 og 11658"
      sort="none"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrkesgruppen."
      title="Bartendere ligger nær servitører, men gruppen er betydelig mindre"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
