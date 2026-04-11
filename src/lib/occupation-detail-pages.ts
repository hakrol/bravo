export type OccupationDetailPage = {
  occupationCode: string;
  label: string;
  editorialLabel?: string;
  displayLabel?: string;
  slug: string;
  href: string;
  summary: string;
  relatedOccupationCodes: string[];
};

const OCCUPATION_SALARY_SUFFIX = "lonn";
const DYNAMIC_OCCUPATION_DETAIL_BASE_PATH = "/yrke";

type OccupationLabelVariants = {
  editorialLabel?: string;
  displayLabel?: string;
};

const OCCUPATION_LABEL_VARIANTS: Record<string, OccupationLabelVariants> = {
  "2131": {
    editorialLabel: "biologer, botanikere og zoologer mv.",
  },
  "3141": {
    editorialLabel: "bioteknikere i ikke-medisinske laboratorier",
  },
};

function normalizeNorwegianLetters(value: string) {
  return value
    .replace(/\u00E6|\u00C6|Ã¦/g, "ae")
    .replace(/\u00F8|\u00D8|Ã¸/g, "o")
    .replace(/\u00E5|\u00C5|Ã¥/g, "a");
}

function normalizeOccupationLabel(value: string) {
  return value
    .replace(/æ/gim, "ae")
    .replace(/ø/gim, "o")
    .replace(/å/gim, "a")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .toLowerCase();
}

export function buildOccupationSalarySlug(label: string) {
  const normalizedLabel = normalizeOccupationLabel(normalizeNorwegianLetters(label));
  return normalizedLabel.endsWith(`-${OCCUPATION_SALARY_SUFFIX}`)
    ? normalizedLabel
    : `${normalizedLabel}-${OCCUPATION_SALARY_SUFFIX}`;
}

export function formatOccupationDisplayLabel(label: string) {
  return label.replace(/\s+/g, " ").trim();
}

export function getOccupationLabelVariants(occupationCode: string): OccupationLabelVariants {
  const variants = OCCUPATION_LABEL_VARIANTS[occupationCode];

  if (!variants) {
    return {};
  }

  return {
    editorialLabel: variants.editorialLabel?.trim() || undefined,
    displayLabel: variants.displayLabel?.trim() || undefined,
  };
}

export function getOccupationTextContext(page: Pick<
  OccupationDetailPage,
  "occupationCode" | "label" | "editorialLabel" | "displayLabel"
>) {
  const seoLabel = formatOccupationDisplayLabel(page.label);
  const variants = getOccupationLabelVariants(page.occupationCode);
  const displayLabel = page.displayLabel?.trim() || variants.displayLabel || seoLabel;
  const editorialLabel = page.editorialLabel?.trim() || variants.editorialLabel;

  return {
    seoLabel,
    titleLabel: displayLabel,
    sentenceLabel: editorialLabel ?? seoLabel,
    genericReference: "yrket",
  };
}

export function isDynamicOccupationCode(occupationCode: string) {
  return /^\d{4}$/.test(occupationCode);
}

export function buildDynamicOccupationDetailPage(
  occupationCode: string,
  label: string,
): OccupationDetailPage {
  const slug = buildOccupationSalarySlug(label);
  const variants = getOccupationLabelVariants(occupationCode);
  const canonicalLabel = formatOccupationDisplayLabel(label);

  return {
    occupationCode,
    label,
    editorialLabel: variants.editorialLabel,
    displayLabel: variants.displayLabel,
    slug,
    href: `${DYNAMIC_OCCUPATION_DETAIL_BASE_PATH}/${slug}`,
    summary: `${canonicalLabel} er en yrkesgruppe i SSBs yrkesstatistikk som samler roller med lignende arbeidsoppgaver og kompetansekrav.`,
    relatedOccupationCodes: [],
  };
}

export const occupationDetailPages: OccupationDetailPage[] = [
  {
    occupationCode: "3313",
    label: "Regnskapsfører",
    slug: buildOccupationSalarySlug("Regnskapsforer"),
    href: `/${buildOccupationSalarySlug("Regnskapsforer")}`,
    summary:
      "Regnskapsførere fører regnskap, avstemmer tall og utarbeider rapporter og dokumentasjon for virksomheter. Mange jobber også med lønn, skattemelding, årsoppgjør og økonomisk rådgivning.",
    relatedOccupationCodes: ["2411", "2412", "2413"],
  },
  {
    occupationCode: "2411",
    label: "Revisorer, regnskapsrådgivere",
    slug: buildOccupationSalarySlug("Revisorer, regnskapsradgivere"),
    href: `/${buildOccupationSalarySlug("Revisorer, regnskapsradgivere")}`,
    summary:
      "Revisorer og regnskapsrådgivere kontrollerer regnskap, kvalitetssikrer etterlevelse og gir råd om bokføring, skatt og finansiell rapportering.",
    relatedOccupationCodes: ["3313", "2412", "2413"],
  },
  {
    occupationCode: "2412",
    label: "Finans- og investeringsrådgivere",
    slug: buildOccupationSalarySlug("Finans- og investeringsradgivere"),
    href: `/${buildOccupationSalarySlug("Finans- og investeringsradgivere")}`,
    summary:
      "Finans- og investeringsrådgivere gir råd om sparing, finansiering og kapitalplassering, og vurderer risiko, avkastning og kundens økonomiske mål.",
    relatedOccupationCodes: ["3313", "2411", "2413"],
  },
  {
    occupationCode: "2413",
    label: "Finansanalytikere",
    slug: buildOccupationSalarySlug("Finansanalytikere"),
    href: `/${buildOccupationSalarySlug("Finansanalytikere")}`,
    summary:
      "Finansanalytikere analyserer selskaper, markeder og investeringer, og bruker data og prognoser for å vurdere verdiutvikling og beslutningsgrunnlag.",
    relatedOccupationCodes: ["3313", "2411", "2412"],
  },
];

export function getOccupationDetailHref(occupationCode: string, label?: string) {
  if (label && isDynamicOccupationCode(occupationCode)) {
    return buildDynamicOccupationDetailPage(occupationCode, label).href;
  }

  return null;
}
