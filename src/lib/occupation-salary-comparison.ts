import { calculateRealWageGrowth } from "./real-wage-growth";

export type OccupationSalaryPoint = {
  occupationCode: string;
  occupationName: string;
  href?: string;
  year: number;
  medianMonthlySalary: number | null;
  /** Årlig endring i medianlønn mot samme populasjon året før, i prosent. */
  nominalGrowth?: number | null;
  /** Lønnstakere (personer), ikke arbeidsforhold eller årsverk. */
  employees?: number | null;
  employeesPeriodLabel?: string;
  source: string;
};

export type OccupationSalaryComparisonDataset = {
  year: number;
  points: OccupationSalaryPoint[];
  /** Prisvekst fra året før, med samme periode som lønnsveksten. */
  inflation: { year: number; annualGrowth: number | null; source: string };
  salaryPopulation: string;
  employmentPopulation: string;
  source: string;
  testDataNote?: string;
};

export type OccupationSalaryObservation = OccupationSalaryPoint & {
  nominalGrowth: number | null;
  realGrowth: number | null;
  employees: number | null;
};
export type OccupationComparisonSort = "salary-desc" | "salary-asc" | "nominal" | "real";
export type OccupationComparisonView = "salary" | "difference";

function finite(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Samme år og populasjonsdefinisjon må brukes for alle inkluderte yrker. */
export function prepareOccupationComparison(dataset: OccupationSalaryComparisonDataset, codes?: readonly string[]): OccupationSalaryObservation[] {
  const seen = new Set<string>();
  return dataset.points.filter((point) => point.year === dataset.year && (!codes || codes.includes(point.occupationCode))).map((point) => {
    if (seen.has(point.occupationCode)) throw new Error("Yrkessammenligningen krever unike yrkeskoder per år.");
    seen.add(point.occupationCode);
    const nominalGrowth = finite(point.nominalGrowth) && point.nominalGrowth > -100 ? point.nominalGrowth : null;
    const inflation = dataset.inflation.year === point.year ? dataset.inflation.annualGrowth : null;
    return {
      ...point,
      medianMonthlySalary: finite(point.medianMonthlySalary) && point.medianMonthlySalary > 0 ? point.medianMonthlySalary : null,
      employees: finite(point.employees) && point.employees >= 0 && Number.isInteger(point.employees) ? point.employees : null,
      nominalGrowth,
      realGrowth: nominalGrowth !== null && finite(inflation) ? calculateRealWageGrowth(nominalGrowth, inflation) : null,
    };
  });
}

export function salaryDifference(salary: number | null, reference: number | null) {
  if (!finite(salary) || salary <= 0 || !finite(reference) || reference <= 0) return null;
  const amount = salary - reference;
  return { amount, percent: amount / reference * 100 };
}

export function sortOccupationComparison(points: readonly OccupationSalaryObservation[], sort: OccupationComparisonSort) {
  const value = (point: OccupationSalaryObservation) => sort === "nominal" ? point.nominalGrowth : sort === "real" ? point.realGrowth : point.medianMonthlySalary;
  return [...points].sort((a, b) => {
    const first = value(a), second = value(b);
    if (first === null && second !== null) return 1;
    if (second === null && first !== null) return -1;
    return first !== null && second !== null && first !== second
      ? (sort === "salary-asc" ? first - second : second - first)
      : a.occupationCode.localeCompare(b.occupationCode, "nb");
  });
}

export function summarizeOccupationComparison(points: readonly OccupationSalaryObservation[], referenceCode: string) {
  const reference = points.find((point) => point.occupationCode === referenceCode);
  const salary = reference?.medianMonthlySalary ?? null;
  const salaries = points.flatMap((point) => point.medianMonthlySalary === null ? [] : [point.medianMonthlySalary]);
  const others = points.flatMap((point) => point.occupationCode === referenceCode || point.medianMonthlySalary === null ? [] : [point.medianMonthlySalary]).sort((a, b) => a - b);
  const middle = Math.floor(others.length / 2);
  const peerMedian = others.length ? others.length % 2 ? others[middle] : (others[middle - 1] + others[middle]) / 2 : null;
  return {
    salary, peerMedian, peerCount: others.length, count: salaries.length,
    rank: salary === null ? null : 1 + salaries.filter((value) => value > salary).length,
    tied: salary !== null && salaries.filter((value) => value === salary).length > 1,
    difference: salaryDifference(salary, peerMedian),
  };
}

/** Symmetrisk differanseskala gjør nullinjen tydelig også når alle avvik er negative. */
export function buildOccupationComparisonScale(points: readonly OccupationSalaryObservation[], referenceSalary: number | null, view: OccupationComparisonView) {
  const values = points.flatMap((point) => {
    const value = view === "salary" ? point.medianMonthlySalary : salaryDifference(point.medianMonthlySalary, referenceSalary)?.amount;
    return finite(value) ? [Math.abs(value)] : [];
  });
  const maximum = Math.max(view === "difference" ? 1000 : 10000, ...values);
  const power = 10 ** Math.floor(Math.log10(maximum / 4));
  const fraction = maximum / 4 / power;
  const step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * power;
  const limit = Math.ceil(maximum / step) * step;
  const min = view === "difference" ? -limit : 0;
  const max = limit;
  const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, index) => min + index * step);
  const position = (value: number) => (value - min) / (max - min) * 100;
  return { min, max, ticks, position, zero: position(0) };
}

export function occupationComparisonInsight(point: OccupationSalaryObservation, reference: OccupationSalaryObservation | undefined) {
  const difference = salaryDifference(point.medianMonthlySalary, reference?.medianMonthlySalary ?? null);
  if (!reference || difference === null) return "Lønnsforskjellen kan ikke beregnes fordi lønnstall mangler for yrket eller referanseyrket.";
  if (point.occupationCode === reference.occupationCode) {
    return point.realGrowth === null ? "Dette er referanseyrket. Reallønnsvekst mangler fordi lønnsvekst eller prisvekst ikke er tilgjengelig."
      : point.realGrowth > 0 ? "Dette er referanseyrket. Lønnsveksten har vært sterkere enn prisveksten det siste året."
      : point.realGrowth < 0 ? "Dette er referanseyrket. Prisene har steget mer enn lønnen det siste året."
      : "Dette er referanseyrket. Kjøpekraften er uendret fra året før.";
  }
  const salaryText = `${point.occupationName} har ${difference.amount === 0 ? "samme medianlønn som" : difference.amount > 0 ? "høyere medianlønn enn" : "lavere medianlønn enn"} ${reference.occupationName.toLocaleLowerCase("nb-NO")}`;
  if (point.nominalGrowth === null || reference.nominalGrowth === null) return `${salaryText}. Lønnsvekst kan ikke sammenlignes fordi data mangler.`;
  const growthDifference = point.nominalGrowth - reference.nominalGrowth;
  return `${salaryText}, ${difference.amount * growthDifference < 0 ? "men" : "og"} har hatt ${growthDifference > 0 ? "sterkere" : growthDifference < 0 ? "svakere" : "like sterk"} lønnsvekst det siste året.`;
}
