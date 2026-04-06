import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccupationSalaryDetailPage } from "@/components/occupation-salary-detail-page";
import {
  formatOccupationDisplayLabel,
} from "@/lib/occupation-detail-pages";
import { getDynamicOccupationPageEntries, type DynamicOccupationPageEntry } from "@/lib/occupation-detail-page-resolver";
import { getOccupationDescription, type OccupationDescription } from "@/lib/occupation-descriptions";

type OccupationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ResolvedOccupationDetail = {
  page: DynamicOccupationPageEntry["page"];
  relatedPages: DynamicOccupationPageEntry["page"][];
  occupationDescription: OccupationDescription | null;
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
  const occupationDescription = detail.occupationDescription?.intro;

  return {
    title: `Lønn til ${occupationLabel}`,
    description: `Se lønn, lønnsutvikling og andre nøkkeltall for ${occupationLabel.toLowerCase()} med siste tilgjengelige tall fra SSB. ${occupationDescription ?? detail.page.summary}`,
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
      occupationDescription={detail.occupationDescription}
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

  const page = pageEntries[currentIndex].page;

  return {
    page,
    relatedPages: pickRelatedPages(
      pageEntries,
      currentIndex,
    ),
    occupationDescription: getOccupationDescription(page.occupationCode),
  } satisfies ResolvedOccupationDetail;
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
