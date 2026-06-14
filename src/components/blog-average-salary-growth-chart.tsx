import Link from "next/link";
import { BlogChart } from "@/components/blog-chart";
import { BlogSalaryDevelopmentChart, type BlogSalaryDevelopmentSeries } from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import salaryGrowthSnapshot from "@/content/blog/data/gjennomsnittlig-lonnsvekst-norge-2026.json";

type SalaryDevelopmentRow = {
  label: string;
  value: number;
};

type GrowthRow = {
  label: string;
  salaryGrowth: number;
  inflationGrowth: number;
  realGrowth: number;
};

type OccupationGrowthRow = {
  label: string;
  href: string;
  salary2021: number;
  salary2026: number;
  change: number;
  growth: number;
  employees: number;
};

type SalaryGrowthSnapshot = {
  source: string;
  note: string;
  salaryDevelopment: SalaryDevelopmentRow[];
  growthRows: GrowthRow[];
  topOccupationGrowthRows: OccupationGrowthRow[];
};

const snapshot = salaryGrowthSnapshot as SalaryGrowthSnapshot;

function getSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  return [
    {
      color: "#14532d",
      label: "Alle yrker",
      points: snapshot.salaryDevelopment,
    },
  ];
}

export function NorwayAverageSalaryDevelopmentChart() {
  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser gjennomsnittlig avtalt månedslønn for begge kjønn, alle aldre og alle yrker. Hvert punkt gjelder 1. kvartal."
      series={getSalaryDevelopmentSeries()}
      source="SSB tabell 11658"
      subtitle="Gjennomsnittlig avtalt månedslønn for alle yrker fra 1. kvartal 2016 til 1. kvartal 2026."
      title="Gjennomsnittslønnen økte fra 40 920 til 58 900 kroner"
      yAxisLabel="Gjennomsnittlig avtalt månedslønn"
    />
  );
}

export function NorwayRealSalaryGrowthChart() {
  return (
    <BlogChart
      format="percent"
      note="Reallønnsvekst er beregnet som nominell lønnsvekst justert for KPI-vekst. KPI er totalindeks fra SSB tabell 14700, regnet om til kvartalssnitt."
      series={[
        {
          label: "Lønnsvekst",
          color: "#14532d",
          points: snapshot.growthRows.map((row) => ({ label: row.label, value: row.salaryGrowth })),
        },
        {
          label: "Reallønnsvekst",
          color: "#b45309",
          points: snapshot.growthRows.map((row) => ({ label: row.label, value: row.realGrowth })),
        },
      ]}
      source="SSB tabell 11658 og 14700"
      subtitle="Årlig endring fra 1. kvartal året før. Reallønnsvekst viser lønnsvekst etter prisvekst."
      title="Reallønnen falt i 2022 og 2023, men steg igjen etterpå"
      type="line"
      yAxisLabel="Prosent"
    />
  );
}

export function NorwayTopOccupationSalaryGrowthChart() {
  return (
    <EditorialDivergingBarChart
      data={snapshot.topOccupationGrowthRows.map((row) => ({
        label: row.label,
        value: row.growth,
        href: row.href,
      }))}
      format="percent"
      kicker="Femårsvekst"
      note="Listen viser nominell vekst i gjennomsnittlig avtalt månedslønn fra 1. kvartal 2021 til 1. kvartal 2026. Bare yrker med minst 1 000 lønnstakere i 1. kvartal 2026 er tatt med."
      source="SSB tabell 11658"
      subtitleLabel="Målt i prosent"
      subtitleText="gjennomsnittlig avtalt månedslønn, begge kjønn og alle aldre."
      ticks={[0, 10, 20, 30, 40]}
      title="Tollere og energikontrolloperatører økte mest"
    />
  );
}

export function NorwayTopOccupationSalaryGrowthTable() {
  return (
    <div className="blog-table-wrap">
      <table className="blog-table">
        <thead className="blog-table-head">
          <tr className="blog-table-row">
            <th className="blog-table-header" scope="col">
              Yrke
            </th>
            <th className="blog-table-header" scope="col">
              2021
            </th>
            <th className="blog-table-header" scope="col">
              2026
            </th>
            <th className="blog-table-header" scope="col">
              Vekst
            </th>
            <th className="blog-table-header" scope="col">
              Lønnstakere
            </th>
          </tr>
        </thead>
        <tbody className="blog-table-body">
          {snapshot.topOccupationGrowthRows.map((row) => (
            <tr className="blog-table-row" key={row.href}>
              <td className="blog-table-cell">
                <Link href={row.href}>{row.label}</Link>
              </td>
              <td className="blog-table-cell">{formatCurrency(row.salary2021)}</td>
              <td className="blog-table-cell">{formatCurrency(row.salary2026)}</td>
              <td className="blog-table-cell">
                {formatSignedCurrency(row.change)} / {formatPercent(row.growth)}
              </td>
              <td className="blog-table-cell">{row.employees.toLocaleString("nb-NO")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO")} kr`;
}

function formatSignedCurrency(value: number) {
  return `${value > 0 ? "+" : ""}${formatCurrency(value)}`;
}

function formatPercent(value: number) {
  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} %`;
}
