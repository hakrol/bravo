export type OccupationDetailPage = {
  occupationCode: string;
  label: string;
  slug: string;
  href: string;
  summary: string;
  relatedOccupationCodes: string[];
};

const OCCUPATION_SALARY_SUFFIX = "lonn";

function normalizeOccupationLabel(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .toLowerCase();
}

export function buildOccupationSalarySlug(label: string) {
  const normalizedLabel = normalizeOccupationLabel(label);
  return normalizedLabel.endsWith(`-${OCCUPATION_SALARY_SUFFIX}`)
    ? normalizedLabel
    : `${normalizedLabel}-${OCCUPATION_SALARY_SUFFIX}`;
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

export function getOccupationDetailPage(occupationCode: string) {
  return occupationDetailPages.find((page) => page.occupationCode === occupationCode) ?? null;
}

export function getOccupationDetailPageBySlug(slug: string) {
  return occupationDetailPages.find((page) => page.slug === slug) ?? null;
}

export function getOccupationDetailHref(occupationCode: string) {
  return getOccupationDetailPage(occupationCode)?.href ?? null;
}

export function getRelatedOccupationDetailPages(occupationCode: string) {
  const page = getOccupationDetailPage(occupationCode);

  if (!page) {
    return [];
  }

  const relatedCodes = new Set(page.relatedOccupationCodes);

  return occupationDetailPages.filter((candidate) => relatedCodes.has(candidate.occupationCode));
}

export const accountantOccupationDetailPage =
  occupationDetailPages.find((page) => page.occupationCode === "3313") ?? null;
