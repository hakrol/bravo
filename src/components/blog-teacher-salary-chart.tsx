import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart, EditorialVerticalBarChart } from "@/components/editorial-diverging-bar-chart";
import teacherSalarySnapshot from "@/content/blog/data/laerere-lonn-2025.json";

type TeacherSalarySnapshot = {
  source: string;
  rows: {
    label: string;
    href: string;
    value: number;
    employees?: number;
  }[];
  genderMedian?: {
    occupationLabel: string;
    period: string;
    source: string;
    womenMonthlyMedian: number;
    menMonthlyMedian: number;
  };
  salaryDevelopment?: {
    occupationLabel: string;
    source: string;
    rows: {
      label: string;
      value: number;
    }[];
  };
  chart: {
    title: string;
    kicker: string;
    subtitleLabel: string;
    subtitleText: string;
    brandText: string | null;
    rows: {
      label: string;
      value: number;
      highlight?: boolean;
    }[];
  };
  hourlyChart: {
    title: string;
    kicker: string;
    subtitleLabel: string;
    subtitleText: string;
    rows: {
      label: string;
      value: number;
      hrefLabel: string;
      highlight?: boolean;
    }[];
  };
};

const bubbleLabels = [
  "Ledere av utdanning og undervisning",
  "Universitets- og høyskolelektorer/-lærere",
  "Lektorer mv. (videregående skole)",
  "Grunnskolelærere",
  "Førskole-/barnehagelærere",
  "Spesiallærere / spesialpedagoger",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  "Ledere av utdanning og undervisning": {
    lane: 0.17,
    labelOffset: { x: -28, y: -18, anchor: "end" },
    showLabel: true,
    radiusBoost: 5,
  },
  "Universitets- og høyskolelektorer/-lærere": {
    lane: 0.33,
    labelOffset: { x: -26, y: -18, anchor: "end" },
    showLabel: true,
    radiusBoost: 8,
  },
  "Lektorer mv. (videregående skole)": {
    lane: 0.47,
    labelOffset: { x: 20, y: -20, anchor: "start" },
    showLabel: true,
    radiusBoost: 6,
  },
  Grunnskolelærere: {
    lane: 0.66,
    labelOffset: { x: 0, y: 42, anchor: "middle" },
    showLabel: true,
    radiusBoost: 10,
  },
  "Førskole-/barnehagelærere": {
    lane: 0.84,
    labelOffset: { x: 20, y: 18, anchor: "start" },
    showLabel: true,
    radiusBoost: 7,
  },
  "Spesiallærere / spesialpedagoger": {
    lane: 0.55,
    labelOffset: { x: -24, y: 20, anchor: "end" },
    showLabel: true,
  },
};

const bubbleDisplayLabels: Record<string, string> = {
  "Ledere av utdanning og undervisning": "Ledere av\nutdanning",
  "Universitets- og høyskolelektorer/-lærere": "UH-lektorer\n/-lærere",
  "Lektorer mv. (videregående skole)": "Lektorer\nvgs",
  "Førskole-/barnehagelærere": "Barnehage-\nlærere",
  "Spesiallærere / spesialpedagoger": "Spesial-\nlærere",
};

function getSnapshot() {
  return teacherSalarySnapshot as TeacherSalarySnapshot;
}

function getSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  const salaryDevelopment = getSnapshot().salaryDevelopment;

  if (!salaryDevelopment) {
    return [];
  }

  return [
    {
      color: "#14532d",
      label: salaryDevelopment.occupationLabel,
      points: salaryDevelopment.rows,
    },
  ];
}

function getBubbleData(): BlogChartDatum[] {
  const snapshot = getSnapshot();

  return bubbleLabels.flatMap((label) => {
    const row = snapshot.rows.find((entry) => entry.label === label);

    if (!row || typeof row.employees !== "number") {
      return [];
    }

    return [
      {
        label: row.label,
        shortLabel: bubbleDisplayLabels[row.label],
        value: row.value,
        size: row.employees,
        sizeLabel: `${row.employees.toLocaleString("nb-NO")} lønnstakere`,
        category: row.label === "Ledere av utdanning og undervisning" ? "highlight" : undefined,
        note:
          row.label === "Ledere av utdanning og undervisning"
            ? "SSB-gruppen som inkluderer rektorer og andre ledere innen utdanning og undervisning."
            : undefined,
        ...bubbleLayout[row.label],
      },
    ];
  });
}

export function BlogTeacherSalaryChart() {
  const snapshot = getSnapshot();
  const hrefByLabel = new Map(snapshot.rows.map((row) => [row.label, row.href]));
  const chartRows = snapshot.chart.rows.map((row) => ({
    ...row,
    href: hrefByLabel.get(row.label),
  }));

  return (
    <EditorialDivergingBarChart
      brandText={snapshot.chart.brandText}
      data={chartRows}
      format="currency"
      kicker={snapshot.chart.kicker}
      source={snapshot.source}
      subtitleLabel={snapshot.chart.subtitleLabel}
      subtitleText={snapshot.chart.subtitleText}
      ticks={[0, 20000, 40000, 60000, 70000]}
      title={snapshot.chart.title}
    />
  );
}

export function BlogTeacherHourlySalaryChart() {
  const snapshot = getSnapshot();
  const hrefByLabel = new Map(snapshot.rows.map((row) => [row.label, row.href]));
  const chartRows = snapshot.hourlyChart.rows.map((row) => ({
    ...row,
    href: hrefByLabel.get(row.hrefLabel),
  }));

  return (
    <EditorialVerticalBarChart
      axisMax={420}
      data={chartRows}
      format="currency"
      kicker={snapshot.hourlyChart.kicker}
      source={snapshot.source}
      subtitleLabel={snapshot.hourlyChart.subtitleLabel}
      subtitleText={snapshot.hourlyChart.subtitleText}
      ticks={[0, 100, 200, 300, 400]}
      title={snapshot.hourlyChart.title}
    />
  );
}

export function TeacherLeaderGenderSalaryCards() {
  const gender = getSnapshot().genderMedian;

  if (!gender) {
    return null;
  }

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

export function TeacherLeaderSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  if (!snapshot.salaryDevelopment) {
    return null;
  }

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median månedslønn for STYRK-08 1345 Ledere av utdanning og undervisning, alle sektorer og arbeidstid i alt."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median månedslønn for ledere av utdanning og undervisning fra 2021 til 2025."
      title="Lederlønnen i undervisning økte med 12 820 kroner på fem år"
      yAxisLabel="Median månedslønn"
    />
  );
}

export function TeacherSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 4. kvartal 2025 fra SSB tabell 11658."
      source="SSB tabell 11418 og 11658"
      sort="none"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrkesgruppen."
      title="Grunnskolelærere er størst, men ledere tjener mest"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
