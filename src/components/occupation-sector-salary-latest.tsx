import type {
  OccupationSectorSalaryTimeSeries,
  OccupationSectorSalaryTimeSeriesPoint,
} from "@/lib/ssb";

type SectorDefinition = {
  key: "private" | "municipal" | "state";
  label: string;
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
    medianFields: ["privateMedianAll", "privateMedianWomen", "privateMedianMen"],
    averageFields: ["privateAverageAll", "privateAverageWomen", "privateAverageMen"],
  },
  {
    key: "municipal",
    label: "Kommuneforvaltningen",
    medianFields: ["municipalMedianAll", "municipalMedianWomen", "municipalMedianMen"],
    averageFields: ["municipalAverageAll", "municipalAverageWomen", "municipalAverageMen"],
  },
  {
    key: "state",
    label: "Statsforvaltningen",
    medianFields: ["stateMedianAll", "stateMedianWomen", "stateMedianMen"],
    averageFields: ["stateAverageAll", "stateAverageWomen", "stateAverageMen"],
  },
] as const satisfies readonly SectorDefinition[];

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

  return (
    <div>
      <p className="text-sm font-semibold text-slate-600">
        Siste tilgjengelige år: {formatPeriodLabel(latestPoint.periodLabel)}
      </p>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {availableSectors.map((sector) => (
          <article
            className="overflow-hidden rounded-[6px] border border-slate-200 bg-white"
            key={sector.key}
          >
            <h4 className="border-b border-slate-200 px-4 py-4 text-base font-semibold text-slate-950">
              {sector.label}
            </h4>
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <th className="w-[32%] px-4 py-3" scope="col">
                    Kjønn
                  </th>
                  <th className="w-[30%] px-2 py-3 text-right" scope="col">
                    Median
                  </th>
                  <th className="w-[38%] px-4 py-3 text-right" scope="col">
                    Snitt
                  </th>
                </tr>
              </thead>
              <tbody>
                {genderLabels.map((label, index) => (
                  <tr className="border-t border-slate-200" key={label}>
                    <th className="px-4 py-3 text-sm font-medium text-slate-700" scope="row">
                      {label}
                    </th>
                    <td className="whitespace-nowrap px-2 py-3 text-right text-sm font-semibold tabular-nums text-slate-950">
                      {formatKr(getPointValue(latestPoint, sector.medianFields[index]))}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold tabular-nums text-slate-950">
                      {formatKr(getPointValue(latestPoint, sector.averageFields[index]))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        Tallene viser månedslønn for heltid og deltid samlet. Manglende tall betyr at SSB ikke har
        publisert verdien for yrket og sektoren.
      </p>
    </div>
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
