import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccupationSalaryDetailPage } from "@/components/occupation-salary-detail-page";
import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import {
  buildDynamicOccupationDetailPage,
  buildOccupationSalarySlug,
  formatOccupationDisplayLabel,
  occupationDetailPages,
} from "@/lib/occupation-detail-pages";
import {
  getLatestSalaryDataset,
  OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
} from "@/lib/ssb";

type OccupationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type DynamicOccupationPageEntry = {
  page: ReturnType<typeof buildDynamicOccupationDetailPage>;
  aliasSlugs: Set<string>;
  medianWomen?: number;
  medianMen?: number;
};

export async function generateMetadata({
  params,
}: OccupationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await resolveOccupationDetailBySlug(slug);

  if (!detail) {
    return {};
  }

  const occupationLabel = formatOccupationDisplayLabel(detail.page.label);

  return {
    title: `Lønn til ${occupationLabel}`,
    description: `Se lønn, lønnsutvikling og andre nøkkeltall for ${occupationLabel.toLowerCase()} med siste tilgjengelige tall fra SSB. ${detail.page.summary}`,
  };
}

export default async function OccupationDetailPage({
  params,
}: OccupationDetailPageProps) {
  const { slug } = await params;
  const detail = await resolveOccupationDetailBySlug(slug);

  if (!detail) {
    notFound();
  }

  return (
    <OccupationSalaryDetailPage
      occupationCode={detail.page.occupationCode}
      detailPageOverride={detail.page}
      relatedPagesOverride={detail.relatedPages}
    />
  );
}

async function resolveOccupationDetailBySlug(slug: string) {
  const pageEntries = await getDynamicOccupationPageEntries();
  const currentIndex = pageEntries.findIndex((entry) => entry.aliasSlugs.has(slug));

  if (currentIndex === -1) {
    return null;
  }

  return {
    page: pageEntries[currentIndex].page,
    relatedPages: pickRelatedPages(
      pageEntries,
      currentIndex,
    ),
  };
}

async function getDynamicOccupationPageEntries(): Promise<DynamicOccupationPageEntry[]> {
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

function pickRelatedPages(
  entries: DynamicOccupationPageEntry[],
  currentIndex: number,
) {
  const currentEntry = entries[currentIndex];

  if (!currentEntry) {
    return [];
  }

  const currentCode = currentEntry.page.occupationCode;
  const level3Prefix = currentCode.slice(0, 3);
  const level2Prefix = currentCode.slice(0, 2);
  const level1Prefix = currentCode.charAt(0);
  const selectedCodes = new Set<string>();
  const relatedEntries: DynamicOccupationPageEntry[] = [];
  const candidates = entries.filter((_, index) => index !== currentIndex);
  const compareCandidates = buildRelatedCandidateComparator(currentEntry);

  function addCandidatesByPrefix(prefix: string) {
    const scopedCandidates = candidates
      .filter((candidate) => !selectedCodes.has(candidate.page.occupationCode))
      .filter((candidate) => candidate.page.occupationCode.startsWith(prefix))
      .sort(compareCandidates);

    for (const candidate of scopedCandidates) {
      selectedCodes.add(candidate.page.occupationCode);
      relatedEntries.push(candidate);
    }
  }

  addCandidatesByPrefix(level3Prefix);
  addCandidatesByPrefix(level2Prefix);
  addCandidatesByPrefix(level1Prefix);

  const remainingCandidates = candidates
    .filter((candidate) => !selectedCodes.has(candidate.page.occupationCode))
    .sort(compareCandidates);

  for (const candidate of remainingCandidates) {
    selectedCodes.add(candidate.page.occupationCode);
    relatedEntries.push(candidate);
  }

  return relatedEntries.slice(0, 12).map((entry) => entry.page);
}

function buildRelatedCandidateComparator(currentEntry: DynamicOccupationPageEntry) {
  return (left: DynamicOccupationPageEntry, right: DynamicOccupationPageEntry) => {
    const completenessDelta =
      getGenderCompletenessScore(right) - getGenderCompletenessScore(left);

    if (completenessDelta !== 0) {
      return completenessDelta;
    }

    const distanceDelta =
      getSalaryDistance(left, currentEntry) - getSalaryDistance(right, currentEntry);

    if (distanceDelta !== 0) {
      return distanceDelta;
    }

    return left.page.label.localeCompare(right.page.label, "nb-NO");
  };
}

function getGenderCompletenessScore(entry: DynamicOccupationPageEntry) {
  return Number(entry.medianWomen !== undefined) + Number(entry.medianMen !== undefined);
}

function getSalaryDistance(
  entry: DynamicOccupationPageEntry,
  currentEntry: DynamicOccupationPageEntry,
) {
  let distance = 0;
  let comparisons = 0;

  if (entry.medianWomen !== undefined && currentEntry.medianWomen !== undefined) {
    distance += Math.abs(entry.medianWomen - currentEntry.medianWomen);
    comparisons += 1;
  }

  if (entry.medianMen !== undefined && currentEntry.medianMen !== undefined) {
    distance += Math.abs(entry.medianMen - currentEntry.medianMen);
    comparisons += 1;
  }

  if (comparisons === 0) {
    return Number.MAX_SAFE_INTEGER;
  }

  return distance;
}
