import { EditorialDivergingBarChart, EditorialVerticalBarChart } from "@/components/editorial-diverging-bar-chart";
import teacherSalarySnapshot from "@/content/blog/data/laerere-lonn-2025.json";

type TeacherSalarySnapshot = {
  source: string;
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
  rows: {
    label: string;
    href: string;
    value: number;
  }[];
};

export function BlogTeacherSalaryChart() {
  const snapshot = teacherSalarySnapshot as TeacherSalarySnapshot;
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
  const snapshot = teacherSalarySnapshot as TeacherSalarySnapshot;
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
