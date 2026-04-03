export type OccupationDetailPage = {
  occupationCode: string;
  label: string;
  slug: string;
  href: string;
  summary: string;
  relatedOccupationCodes: string[];
};

const OCCUPATION_SALARY_SUFFIX = "lonn";
const DYNAMIC_OCCUPATION_DETAIL_BASE_PATH = "/yrke";

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
  return label
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" og ");
}

export function isDynamicOccupationCode(occupationCode: string) {
  return /^\d{4}$/.test(occupationCode);
}

export function buildDynamicOccupationDetailPage(
  occupationCode: string,
  label: string,
): OccupationDetailPage {
  const slug = buildOccupationSalarySlug(label);

  return {
    occupationCode,
    label,
    slug,
    href: `${DYNAMIC_OCCUPATION_DETAIL_BASE_PATH}/${slug}`,
    summary: `${formatOccupationDisplayLabel(label)} er en yrkesgruppe i SSBs yrkesstatistikk som samler roller med lignende arbeidsoppgaver og kompetansekrav.`,
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
