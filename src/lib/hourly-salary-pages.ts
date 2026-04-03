import {
  buildDynamicOccupationDetailPage,
  formatOccupationDisplayLabel,
} from "@/lib/occupation-detail-pages";

export type HourlySalaryPage = {
  slug: string;
  occupationCode: string;
  occupationLabel: string;
  titleOccupationLabel: string;
  title: string;
  description: string;
  intro: string;
  href: string;
  detailHref: string;
};

const hourlySalaryPages: HourlySalaryPage[] = [
  createHourlySalaryPage({
    slug: "elektriker",
    occupationCode: "7411",
    occupationLabel: "Elektrikere",
    titleOccupationLabel: "elektriker",
    intro:
      "Denne siden viser estimert timelønn for elektriker basert på median avtalt månedslønn fra SSB. Du får nivå i siste periode og utvikling over tid for begge kjønn, kvinner og menn.",
  }),
];

export function getHourlySalaryPages() {
  return hourlySalaryPages;
}

export function getHourlySalaryPageBySlug(slug: string) {
  return hourlySalaryPages.find((page) => page.slug === slug) ?? null;
}

function createHourlySalaryPage({
  slug,
  occupationCode,
  occupationLabel,
  titleOccupationLabel,
  intro,
}: {
  slug: string;
  occupationCode: string;
  occupationLabel: string;
  titleOccupationLabel: string;
  intro: string;
}): HourlySalaryPage {
  const formattedOccupationLabel = formatOccupationDisplayLabel(occupationLabel);
  const detailPage = buildDynamicOccupationDetailPage(occupationCode, occupationLabel);

  return {
    slug,
    occupationCode,
    occupationLabel,
    titleOccupationLabel,
    title: `Timelønn for ${titleOccupationLabel}`,
    description: `Se estimert timelønn for ${titleOccupationLabel} med utvikling over tid for begge kjønn, kvinner og menn. Beregnet fra median avtalt månedslønn i SSB for ${formattedOccupationLabel.toLowerCase()}.`,
    intro,
    href: `/timelonn/${slug}`,
    detailHref: detailPage.href,
  };
}
