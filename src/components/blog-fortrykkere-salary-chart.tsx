import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import fortrykkereLonn2025Snapshot from "@/content/blog/data/fortrykkere-lonn-2025.json";

type FortrykkereSalarySnapshot = {
  rows: {
    label: string;
    href: string;
    value: number | null;
  }[];
  genderMedian: {
    occupationLabel: string;
    period: string;
    source: string;
    womenMonthlyMedian: number;
    menMonthlyMedian: number;
  };
  salaryDevelopment: {
    source: string;
    rows: {
      label: string;
      nominal: number;
      real2025: number;
    }[];
  };
};

const editorialLabels = [
  "Presisjonsinstrumentmakere og -reparatører",
  "Førtrykkere",
  "Trykkere",
  "Andre kunsthåndverkere",
  "Innbindere mv.",
];

function getSnapshot() {
  return fortrykkereLonn2025Snapshot as FortrykkereSalarySnapshot;
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
        highlight: row.label === "Førtrykkere",
      },
    ];
  });
}

function getSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  const snapshot = getSnapshot();

  return [
    {
      color: "#14532d",
      label: "Nominell medianlønn",
      points: snapshot.salaryDevelopment.rows.map((row) => ({
        label: row.label,
        value: row.nominal,
      })),
    },
    {
      color: "#1d4ed8",
      label: "Reallønn i 2025-kroner",
      points: snapshot.salaryDevelopment.rows.map((row) => ({
        label: row.label,
        value: row.real2025,
      })),
    },
  ];
}

export function FortrykkereGenderSalaryCards() {
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

export function FortrykkereSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Nominell lønn viser median månedslønn for STYRK-08 7321 Førtrykkere, begge kjønn, alle sektorer og arbeidstid i alt. Reallønn er justert med årlig gjennomsnitt av KPI, der 2025=100."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median månedslønn fra 2021 til 2025, med samme serie justert til 2025-kroner."
      title="Førtrykkerlønnen steg nominelt, men reallønnen var nesten flat"
      yAxisLabel="Median månedslønn"
    />
  );
}

export function FortrykkereSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Grafiske yrker"
      note="Tallene gjelder median månedslønn for alle sektorer, begge kjønn og heltid og deltid samlet."
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for førtrykkere og utvalgte grafiske eller nærliggende håndverksyrker, SSB 2025"
      ticks={[0, 20000, 40000, 60000]}
      title="Førtrykkere ligger litt over trykkere i 2025"
    />
  );
}
