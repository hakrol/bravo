import { cache } from "react";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { getDynamicOccupationPageEntries } from "@/lib/occupation-detail-page-resolver";

export type HourlySalaryPage = {
  slug: string;
  occupationCode: string;
  occupationLabel: string;
  titleOccupationLabel: string;
  title: string;
  description: string;
  href: string;
  detailHref: string;
};

const HOURLY_SALARY_BASE_PATH = "/timelonn";

const getResolvedHourlySalaryPages = cache(async () => {
  const entries = await getDynamicOccupationPageEntries();
  return entries.map((entry) => createHourlySalaryPage(entry));
});

export async function getHourlySalaryPages() {
  return getResolvedHourlySalaryPages();
}

export const resolveHourlySalaryPageBySlug = cache(async (slug: string) => {
  const pages = await getResolvedHourlySalaryPages();
  return pages.find((page) => page.slug === slug) ?? null;
});

function createHourlySalaryPage(
  entry: Awaited<ReturnType<typeof getDynamicOccupationPageEntries>>[number],
): HourlySalaryPage {
  const formattedOccupationLabel = formatOccupationDisplayLabel(entry.page.label);
  const titleOccupationLabel = formattedOccupationLabel.toLowerCase();
  const slug = buildHourlySalarySlugFromOccupationSlug(entry.page.slug);

  return {
    slug,
    occupationCode: entry.page.occupationCode,
    occupationLabel: entry.page.label,
    titleOccupationLabel,
    title: `Timelønn for ${titleOccupationLabel}`,
    description: `Se estimert timelønn for ${titleOccupationLabel} med utvikling over tid, lønnsspredning og nivå for kvinner og menn. Beregnet fra lønnsdata i SSB for ${titleOccupationLabel}.`,
    href: `${HOURLY_SALARY_BASE_PATH}/${slug}`,
    detailHref: entry.page.href,
  };
}

function buildHourlySalarySlugFromOccupationSlug(occupationSlug: string) {
  if (occupationSlug.endsWith("-lonn")) {
    return `${occupationSlug.slice(0, -"-lonn".length)}-timelonn`;
  }

  return `${occupationSlug}-timelonn`;
}