import type {
  OccupationSectorSalaryTimeSeries,
  OccupationSectorSalaryTimeSeriesPoint,
} from "@/lib/ssb";
import {
  OccupationSectorSalaryCards,
  type OccupationSectorSalaryCardData,
} from "@/components/occupation-sector-salary-cards";

type SectorDefinition = {
  key: "private" | "municipal" | "state";
  label: string;
  summaryLabel: string;
  description: string;
  medianFields: readonly [
    keyof OccupationSectorSalaryTimeSeriesPoint,
    keyof OccupationSectorSalaryTimeSeriesPoint,
    keyof OccupationSectorSalaryTimeSeriesPoint,
  ];
  averageFields: readonly [
    keyof OccupationSectorSalaryTimeSeriesPoint,
    keyof OccupationSectorSalaryTimeSeriesPoint,
    keyof OccupationSectorSalaryTimeSeriesPoint,
  ];
};

const genderLabels = ["Alle", "Kvinner", "Menn"] as const;

const sectors = [
  {
    key: "private",
    label: "Privat sektor og offentlig eide foretak",
    summaryLabel: "privat sektor og offentlig eide foretak",
    description: "Private virksomheter og offentlig eide foretak som driver markedsrettet virksomhet.",
    medianFields: ["privateMedianAll", "privateMedianWomen", "privateMedianMen"],
    averageFields: ["privateAverageAll", "privateAverageWomen", "privateAverageMen"],
  },
  {
    key: "municipal",
    label: "Kommuneforvaltningen",
    summaryLabel: "kommuneforvaltningen",
    description: "Kommuner og fylkeskommuner, inkludert virksomheter som inngår i kommuneforvaltningen.",
    medianFields: ["municipalMedianAll", "municipalMedianWomen", "municipalMedianMen"],
    averageFields: ["municipalAverageAll", "municipalAverageWomen", "municipalAverageMen"],
  },
  {
    key: "state",
    label: "Statsforvaltningen",
    summaryLabel: "statsforvaltningen",
    description: "Statlige virksomheter som inngår i statsforvaltningen.",
    medianFields: ["stateMedianAll", "stateMedianWomen", "stateMedianMen"],
    averageFields: ["stateAverageAll", "stateAverageWomen", "stateAverageMen"],
  },
] as const satisfies readonly SectorDefinition[];

export function buildOccupationSectorSalarySummary(series: OccupationSectorSalaryTimeSeries) {
  const latestPoint = getLatestPoint(series.points);

  if (!latestPoint) {
    return null;
  }

  const descriptions = sectors.flatMap((sector) => {
    const median = getPointValue(latestPoint, sector.medianFields[0]);

    return median === undefined
      ? []
      : [`For ${sector.summaryLabel} er samlet median månedslønn ${formatKr(median)}.`];
  });

  return descriptions.length > 0 ? descriptions.join(" ") : null;
}

export function OccupationSectorSalaryLatest({
  series,
}: {
  series: OccupationSectorSalaryTimeSeries;
}) {
  const latestPoint = getLatestPoint(series.points);

  if (!latestPoint) {
    return null;
  }

  const availableSectors = sectors.filter((sector) => hasSectorValues(latestPoint, sector));

  if (availableSectors.length === 0) {
    return null;
  }

  const cards: OccupationSectorSalaryCardData[] = availableSectors.map((sector) => ({
    description: sector.description,
    key: sector.key,
    label: sector.label,
    rows: genderLabels.map((label, index) => ({
      average: getPointValue(latestPoint, sector.averageFields[index]),
      label,
      median: getPointValue(latestPoint, sector.medianFields[index]),
    })),
  }));

  return (
    <OccupationSectorSalaryCards
      cards={cards}
      periodLabel={formatPeriodLabel(latestPoint.periodLabel)}
    />
  );
}

function getLatestPoint(points: OccupationSectorSalaryTimeSeriesPoint[]) {
  for (let index = points.length - 1; index >= 0; index -= 1) {
    const point = points[index];

    if (sectors.some((sector) => hasSectorValues(point, sector))) {
      return point;
    }
  }

  return null;
}

function hasSectorValues(point: OccupationSectorSalaryTimeSeriesPoint, sector: SectorDefinition) {
  return [...sector.medianFields, ...sector.averageFields].some(
    (field) => getPointValue(point, field) !== undefined,
  );
}

function getPointValue(
  point: OccupationSectorSalaryTimeSeriesPoint,
  field: keyof OccupationSectorSalaryTimeSeriesPoint,
) {
  const value = point[field];
  return typeof value === "number" ? value : undefined;
}

function formatKr(value?: number) {
  return value === undefined
    ? "Mangler tall"
    : `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

function formatPeriodLabel(value: string) {
  return value.replace(/\s+/g, " ").trim();
}
