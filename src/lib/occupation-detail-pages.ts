export type OccupationDetailPage = {
  occupationCode: string;
  label: string;
  slug: string;
  href: string;
  summary: string;
  relatedOccupationCodes: string[];
  salaryDistribution?: OccupationSalaryDistribution;
};

export type OccupationSalaryQuartiles = {
  p25: number;
  median: number;
  p75: number;
};

export type OccupationSalaryDistribution = {
  title?: string;
  description?: string;
  total?: OccupationSalaryQuartiles;
  women?: OccupationSalaryQuartiles;
  men?: OccupationSalaryQuartiles;
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
    label: "Regnskapsforer",
    slug: buildOccupationSalarySlug("Regnskapsforer"),
    href: `/${buildOccupationSalarySlug("Regnskapsforer")}`,
    summary:
      "Regnskapsforere forer regnskap, avstemmer tall og utarbeider rapporter og dokumentasjon for virksomheter. Mange jobber ogsa med lonn, skattemelding, arsoppgjor og okonomisk radgivning.",
    relatedOccupationCodes: ["2411", "2412", "2413"],
    salaryDistribution: {
      title: "Typisk lonnsspenn",
      description:
        "Midtre 50 prosent ligger mellom 25.- og 75.-persentilen, mens medianen markerer midtpunktet i fordelingen.",
      total: {
        p25: 58900,
        median: 64800,
        p75: 71900,
      },
      women: {
        p25: 56200,
        median: 61900,
        p75: 67200,
      },
      men: {
        p25: 62400,
        median: 68700,
        p75: 75400,
      },
    },
  },
  {
    occupationCode: "2411",
    label: "Revisorer, regnskapsradgivere",
    slug: buildOccupationSalarySlug("Revisorer, regnskapsradgivere"),
    href: `/${buildOccupationSalarySlug("Revisorer, regnskapsradgivere")}`,
    summary:
      "Revisorer og regnskapsradgivere kontrollerer regnskap, kvalitetssikrer etterlevelse og gir rad om bokforing, skatt og finansiell rapportering.",
    relatedOccupationCodes: ["3313", "2412", "2413"],
  },
  {
    occupationCode: "2412",
    label: "Finans- og investeringsradgivere",
    slug: buildOccupationSalarySlug("Finans- og investeringsradgivere"),
    href: `/${buildOccupationSalarySlug("Finans- og investeringsradgivere")}`,
    summary:
      "Finans- og investeringsradgivere gir rad om sparing, finansiering og kapitalplassering, og vurderer risiko, avkastning og kundens okonomiske mal.",
    relatedOccupationCodes: ["3313", "2411", "2413"],
  },
  {
    occupationCode: "2413",
    label: "Finansanalytikere",
    slug: buildOccupationSalarySlug("Finansanalytikere"),
    href: `/${buildOccupationSalarySlug("Finansanalytikere")}`,
    summary:
      "Finansanalytikere analyserer selskaper, markeder og investeringer, og bruker data og prognoser for a vurdere verdiutvikling og beslutningsgrunnlag.",
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
