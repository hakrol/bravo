import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import {
  buildDynamicOccupationDetailPage,
  buildOccupationSalarySlug,
  occupationDetailPages,
} from "@/lib/occupation-detail-pages";
import {
  getLatestSalaryDataset,
  OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
} from "@/lib/ssb";

export type DynamicOccupationPageEntry = {
  page: ReturnType<typeof buildDynamicOccupationDetailPage>;
  aliasSlugs: Set<string>;
  medianWomen?: number;
  medianMen?: number;
};

export async function getDynamicOccupationPageEntries(): Promise<DynamicOccupationPageEntry[]> {
  const [averageDataset, medianDataset] = await Promise.all([
    getLatestSalaryDataset("occupationDetailed", OCCUPATION_MONTHLY_SALARY_FILTERS),
    getLatestSalaryDataset("occupationDetailed", OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS),
  ]);
  const medianRows = buildOccupationSalaryOverview(medianDataset).rows;
  const medianRowsByCode = new Map(
    medianRows.map((row) => [row.occupationCode, row] as const),
  );
  const rowsByCode = new Map<
    string,
    {
      occupationCode: string;
      labels: Set<string>;
    }
  >();

  for (const dataset of [averageDataset, medianDataset]) {
    const rows = buildOccupationSalaryOverview(dataset).rows;

    for (const row of rows) {
      const existing = rowsByCode.get(row.occupationCode) ?? {
        occupationCode: row.occupationCode,
        labels: new Set<string>(),
      };

      existing.labels.add(row.occupationLabel);
      rowsByCode.set(row.occupationCode, existing);
    }
  }

  return Array.from(rowsByCode.values())
    .sort((left, right) =>
      Array.from(left.labels)[0].localeCompare(Array.from(right.labels)[0], "nb-NO"),
    )
    .map((row) => {
      const labels = Array.from(row.labels);
      const primaryLabel = labels[0];

      return {
        page: buildDynamicOccupationDetailPage(row.occupationCode, primaryLabel),
        aliasSlugs: new Set([
          ...labels.map((label) => buildOccupationSalarySlug(label)),
          ...getLegacySlugAliases(row.occupationCode),
        ]),
        medianWomen: medianRowsByCode.get(row.occupationCode)?.salaryWomen,
        medianMen: medianRowsByCode.get(row.occupationCode)?.salaryMen,
      };
    });
}

function getLegacySlugAliases(occupationCode: string) {
  const legacyPage = occupationDetailPages.find((page) => page.occupationCode === occupationCode);

  if (!legacyPage) {
    return [];
  }

  return Array.from(
    new Set([
      legacyPage.slug,
      ...getManualLegacySlugAliases(occupationCode),
    ]),
  );
}

function getManualLegacySlugAliases(occupationCode: string) {
  switch (occupationCode) {
    case "3313":
      return ["regnskapsforere-lonn"];
    default:
      return [];
  }
}
