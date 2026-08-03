import type {
  OccupationSectorSalaryTimeSeries,
  OccupationSectorSalaryTimeSeriesPoint,
} from "@/lib/ssb";
import { MetricInfoButton } from "@/components/metric-info-button";

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

export function buildOccupationSectorSalarySummary({
  occupationLabel,
  series,
}: {
  occupationLabel: string;
  series: OccupationSectorSalaryTimeSeries;
}) {
  const latestPoint = getLatestPoint(series.points);

  if (!latestPoint) {
    return null;
  }

  const sectorSalaries = sectors.flatMap<{
    label: string;
    menSalary?: number;
    value: number;
    womenSalary?: number;
  }>((sector) => {
    const value = getPointValue(latestPoint, sector.medianFields[0]);

    return value === undefined
      ? []
      : [
          {
            label: sector.summaryLabel,
            menSalary: getPointValue(latestPoint, sector.medianFields[2]),
            value,
            womenSalary: getPointValue(latestPoint, sector.medianFields[1]),
          },
        ];
  });

  if (sectorSalaries.length === 0) {
    return null;
  }

  const salaryList = formatNorwegianList(
    sectorSalaries.map((sector) => `${formatKr(sector.value)} i ${sector.label}`),
  );
  const highestSalary = Math.max(...sectorSalaries.map((sector) => sector.value));
  const highestSectors = sectorSalaries.filter((sector) => sector.value === highestSalary);
  const sortedSectors = [...sectorSalaries].sort((a, b) => b.value - a.value);
  const comparison = buildSectorComparison(highestSectors, sortedSectors);
  const genderDescriptions = sectorSalaries
    .map(buildSectorGenderDescription)
    .filter((description): description is string => Boolean(description));
  const missingSectorLabels = sectors
    .filter((sector) => !hasSectorValues(latestPoint, sector))
    .map((sector) => sector.summaryLabel);
  const missingSectorDescription =
    missingSectorLabels.length > 0
      ? `SSB har ikke publisert lønnstall for ${formatNorwegianList(missingSectorLabels)} for ${occupationLabel}.`
      : null;

  return [
    `For ${occupationLabel} er månedslønnen ${salaryList}.`,
    comparison,
    ...genderDescriptions,
    missingSectorDescription,
  ]
    .filter((sentence): sentence is string => Boolean(sentence))
    .join(" ");
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

  const gridColumns =
    availableSectors.length === 1
      ? "grid-cols-1"
      : availableSectors.length === 2
        ? "xl:grid-cols-2"
        : "xl:grid-cols-3";

  return (
    <div>
      <p className="text-sm font-semibold text-slate-600">
        Siste tilgjengelige år: {formatPeriodLabel(latestPoint.periodLabel)}
      </p>

      <div className={`mt-5 grid gap-4 ${gridColumns}`}>
        {availableSectors.map((sector) => (
          <article
            className="overflow-hidden rounded-[6px] border border-slate-200 bg-white"
            key={sector.key}
          >
            <div className="flex min-h-[57px] items-center gap-2 border-b border-slate-200 px-4 py-4">
              <h4 className="text-base font-semibold text-slate-950">{sector.label}</h4>
              <MetricInfoButton
                description={sector.description}
                label={sector.label}
                modalVariant="compact"
                variant="muted"
              />
            </div>
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

function buildSectorComparison(
  highestSectors: Array<{ label: string; value: number }>,
  sortedSectors: Array<{ label: string; value: number }>,
) {
  if (highestSectors.length > 1) {
    return `${capitalize(formatNorwegianList(highestSectors.map((sector) => sector.label)))} har lik og høyest månedslønn.`;
  }

  const highestSector = highestSectors[0];
  const nextSector = sortedSectors[1];

  if (!nextSector) {
    return `${capitalize(highestSector.label)} har den høyeste publiserte månedslønnen.`;
  }

  return `${capitalize(highestSector.label)} har høyest månedslønn, ${formatKr(highestSector.value - nextSector.value)} mer enn ${nextSector.label}.`;
}

function buildSectorGenderDescription({
  label,
  menSalary,
  womenSalary,
}: {
  label: string;
  menSalary?: number;
  womenSalary?: number;
}) {
  if (womenSalary !== undefined && menSalary !== undefined) {
    return `I ${label} er månedslønnen ${formatKr(womenSalary)} for kvinner og ${formatKr(menSalary)} for menn.`;
  }

  if (womenSalary !== undefined) {
    return `I ${label} er månedslønnen ${formatKr(womenSalary)} for kvinner, mens SSB mangler tall for menn.`;
  }

  if (menSalary !== undefined) {
    return `I ${label} er månedslønnen ${formatKr(menSalary)} for menn, mens SSB mangler tall for kvinner.`;
  }

  return null;
}

function formatNorwegianList(values: string[]) {
  if (values.length < 2) {
    return values[0] ?? "";
  }

  return `${values.slice(0, -1).join(", ")} og ${values.at(-1)}`;
}

function capitalize(value: string) {
  return `${value.charAt(0).toLocaleUpperCase("nb-NO")}${value.slice(1)}`;
}
