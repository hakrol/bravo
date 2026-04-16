import {
  buildDynamicOccupationDetailPage,
  buildOccupationSalarySlug,
  formatOccupationDisplayLabel,
  getOccupationLabelVariants,
} from "@/lib/occupation-detail-pages";

const DYNAMIC_APPRENTICESHIP_DETAIL_BASE_PATH = "/laerling";

export type ApprenticeshipDetailPage = {
  occupationCode: string;
  label: string;
  editorialLabel?: string;
  displayLabel?: string;
  slug: string;
  href: string;
  detailHref: string;
  summary: string;
  relatedOccupationCodes: string[];
};

export function buildApprenticeshipSalarySlug(label: string) {
  const occupationSlug = buildOccupationSalarySlug(label);

  if (occupationSlug.endsWith("-lonn")) {
    return `${occupationSlug.slice(0, -"-lonn".length)}-laerling-lonn`;
  }

  return `${occupationSlug}-laerling-lonn`;
}

export function buildDynamicApprenticeshipDetailPage(
  occupationCode: string,
  label: string,
): ApprenticeshipDetailPage {
  const slug = buildApprenticeshipSalarySlug(label);
  const variants = getOccupationLabelVariants(occupationCode);
  const canonicalLabel = formatOccupationDisplayLabel(label);
  const occupationPage = buildDynamicOccupationDetailPage(occupationCode, label);

  return {
    occupationCode,
    label,
    editorialLabel: variants.editorialLabel,
    displayLabel: variants.displayLabel,
    slug,
    href: `${DYNAMIC_APPRENTICESHIP_DETAIL_BASE_PATH}/${slug}`,
    detailHref: occupationPage.href,
    summary: `${canonicalLabel} er blant yrkene som har egne lærlingtall i SSB, og siden samler lønnsutvikling og lønnsnivå for lærlinger i faget.`,
    relatedOccupationCodes: [],
  };
}
