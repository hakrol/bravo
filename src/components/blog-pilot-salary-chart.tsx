import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import { BlogSalaryDevelopmentChart, type BlogSalaryDevelopmentSeries } from "@/components/blog-salary-development-chart";
import pilotSalarySnapshot from "@/content/blog/data/piloter-lonn-2025.json";

type PilotSalarySnapshot = {
  source: string;
  rows: {
    label: string;
    href: string;
    value: number | null;
  }[];
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
  "Flygeledere",
  "Flygere",
  "Teknikere innen luftfartssikkerhet",
  "Dekksoffiserer og loser",
  "Flyverter, båtverter mv.",
  "Alle yrker samlet",
];

function getSnapshot() {
  return pilotSalarySnapshot as PilotSalarySnapshot;
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
        highlight: row.label === "Flygere",
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

export function PilotSalaryEditorialChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Pilotlønn"
      source={snapshot.source}
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for piloter og nærliggende luftfartsyrker, SSB 2025"
      ticks={[0, 30000, 60000, 90000, 120000, 150000]}
      title="Piloter ligger helt i toppen av lønnsstatistikken"
    />
  );
}

export function PilotSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median samlet månedslønn for begge kjønn, alle sektorer og arbeidstid i alt."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median samlet månedslønn for flygere fra 2021 til 2025."
      title="Pilotlønnen økte med over 20 000 kroner på fem år"
      yAxisLabel="Median samlet månedslønn"
    />
  );
}
