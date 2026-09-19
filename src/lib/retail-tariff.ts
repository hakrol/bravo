export const RETAIL_TARIFF_VERIFIED_AT = "2026-09-19";
export const VIRKE_HK_AGREEMENT_ID = "virke-hk-landsoverenskomsten";
export const RETAIL_HOURLY_DIVISOR = 162.5;

export const retailRateKeys = [
  "under16", "under18", "step1", "step2", "step3", "step4", "step5", "step6",
] as const;
export type RetailRateKey = (typeof retailRateKeys)[number];

export const retailRateLabels: Record<RetailRateKey, string> = {
  under16: "Under 16 år", under18: "Under 18 år", step1: "Lønnstrinn 1",
  step2: "Lønnstrinn 2", step3: "Lønnstrinn 3", step4: "Lønnstrinn 4",
  step5: "Lønnstrinn 5", step6: "Lønnstrinn 6",
};

export type RetailRate = {
  monthly: number;
  hourly: number;
  hourlyRateSource: "official" | "calculated";
};

export type RetailRateSet = {
  agreementId: typeof VIRKE_HK_AGREEMENT_ID;
  agreementName: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  hourlyDivisor: number;
  rates: Record<RetailRateKey, RetailRate>;
  sourceTitle: string;
  sourceUrl: string;
  verifiedAt: string;
};

const historyUrl = "https://www.virke.no/tariff-og-lonn/finn-tariffavtale/landsoverenskomsten-hk/historikk/";
const currentUrl = "https://www.virke.no/tariff-og-lonn/finn-tariffavtale/landsoverenskomsten-hk/";

function rates(monthly: readonly number[], officialHourly?: readonly number[]) {
  return Object.fromEntries(retailRateKeys.map((key, index) => [key, {
    monthly: monthly[index],
    hourly: officialHourly?.[index] ?? round(monthly[index] / RETAIL_HOURLY_DIVISOR),
    hourlyRateSource: officialHourly ? "official" : "calculated",
  }])) as Record<RetailRateKey, RetailRate>;
}

function rateSet(
  effectiveFrom: string,
  effectiveTo: string | null,
  monthly: readonly number[],
  options?: { officialHourly?: readonly number[]; current?: boolean },
): RetailRateSet {
  return {
    agreementId: VIRKE_HK_AGREEMENT_ID,
    agreementName: "Landsoverenskomsten Virke–HK",
    effectiveFrom,
    effectiveTo,
    hourlyDivisor: RETAIL_HOURLY_DIVISOR,
    rates: rates(monthly, options?.officialHourly),
    sourceTitle: options?.current ? "Landsoverenskomsten HK – gjeldende lønnssatser" : "Historiske lønnssatser – Landsoverenskomsten HK",
    sourceUrl: options?.current ? currentUrl : historyUrl,
    verifiedAt: RETAIL_TARIFF_VERIFIED_AT,
  };
}

export const retailTariffRateSets: readonly RetailRateSet[] = [
  rateSet("2016-04-01", "2017-01-31", [18347, 18834, 25030, 25168, 25506, 26089, 27023, 30918]),
  rateSet("2017-02-01", "2018-01-31", [18794, 19281, 25477, 25615, 25953, 26536, 27470, 31365]),
  rateSet("2018-02-01", "2018-03-31", [18794, 19281, 25477, 25615, 25953, 26536, 27470, 32373]),
  rateSet("2018-04-01", "2019-01-31", [18916, 19403, 25599, 25737, 26075, 26658, 27592, 32495]),
  rateSet("2019-02-01", "2019-03-31", [18916, 19403, 25599, 25737, 26075, 26658, 27592, 33438]),
  rateSet("2019-04-01", "2020-01-31", [18916, 19403, 25924, 26062, 26400, 27146, 28405, 33438]),
  rateSet("2020-02-01", "2020-03-31", [18916, 19403, 25924, 26062, 26400, 27146, 28405, 34371]),
  rateSet("2020-04-01", "2021-01-31", [18916, 19403, 25924, 26062, 26400, 27146, 28405, 34371]),
  rateSet("2021-02-01", "2021-03-31", [18916, 19403, 25924, 26062, 26400, 27146, 28405, 34875]),
  rateSet("2021-04-01", "2022-01-31", [18997, 19484, 26330, 26468, 26806, 27714, 29298, 34956]),
  rateSet("2022-02-01", "2022-03-31", [18997, 19484, 26330, 26468, 26806, 27714, 30111, 35769]),
  rateSet("2022-04-01", "2023-01-31", [19241, 19728, 26574, 26712, 27050, 27958, 30355, 36013]),
  rateSet("2023-02-01", "2023-03-31", [19241, 19728, 26574, 26712, 27050, 27958, 30355, 37313]),
  rateSet("2023-04-01", "2024-01-31", [19647, 20134, 27874, 28012, 28350, 29258, 31655, 37882]),
  rateSet("2024-02-01", "2024-03-31", [19647, 20134, 27874, 28012, 28350, 29258, 32468, 39255]),
  rateSet("2024-04-01", "2025-01-31", [20298, 20784, 28849, 28987, 29325, 30233, 33118, 39905]),
  rateSet("2025-02-01", "2025-03-31", [20298, 20784, 28849, 28987, 29325, 30233, 33118, 40485]),
  rateSet("2025-04-01", "2026-01-31", [21111, 21597, 29987, 30125, 30463, 31371, 34256, 41623]),
  rateSet("2026-02-01", "2026-03-31", [21111, 21597, 29987, 30125, 30463, 31371, 34256, 42435.5]),
  rateSet("2026-04-01", null, [22167, 22653, 31694, 31831, 32169, 33077, 35963, 44142], {
    officialHourly: [136.41, 139.4, 195.04, 195.88, 197.96, 203.55, 221.31, 271.64], current: true,
  }),
] as const;

export const retailUbSupplements = {
  weekdayAfter18: 22,
  weekdayAfter21: 45,
  saturdayAfter13: 45,
  saturdayAfter15: 55,
  saturdayAfter18: 110,
  sunday: 115,
  sourceUrl: "https://hk.no/shared-files/3348/?Landsoverenskomsten+HK-Virke+2024-2026+Web.pdf=",
  verifiedAt: RETAIL_TARIFF_VERIFIED_AT,
} as const;

export function getRetailRateSetForDate(value: string) {
  if (!isIsoDate(value)) throw new Error(`Ugyldig dato: ${value}`);
  const matches = retailTariffRateSets.filter((set) => set.effectiveFrom <= value && (!set.effectiveTo || value <= set.effectiveTo));
  if (matches.length > 1) throw new Error(`Flere satssett gjelder for ${value}.`);
  return matches[0] ?? null;
}

export function getCurrentRetailRateSet(date = new Date().toISOString().slice(0, 10)) {
  return getRetailRateSetForDate(date);
}

export function estimateRetailStep(input: { age: number; relevantYears: number; averageWeeklyHours: number; relevantEducationYears: number; shortStudentJob: boolean }) {
  if (input.age < 16) return { key: "under16" as const, reasons: ["Du er under 16 år."] };
  if (input.age < 18) return { key: "under18" as const, reasons: ["Du er under 18 år."] };
  const reasons: string[] = ["Ansatte over 18 år starter normalt minst på trinn 1."];
  let step = input.age >= 25 && !input.shortStudentJob ? 3 : 1;
  if (input.age >= 25 && !input.shortStudentJob) reasons.push("Fra 25 år gjelder normalt minst trinn 3.");
  if (input.shortStudentJob) reasons.push("Kortvarig elev-/studentjobb kan være unntatt 25-årsregelen.");
  const practiceSteps = input.averageWeeklyHours >= 15 ? Math.floor(input.relevantYears) : input.averageWeeklyHours >= 10 ? Math.floor(input.relevantYears / 2) : 0;
  if (practiceSteps) reasons.push(`${practiceSteps} trinn er beregnet fra oppgitt relevant deltids-/heltidspraksis.`);
  const educationSteps = Math.max(0, Math.floor(input.relevantEducationYears));
  if (educationSteps) reasons.push(`${educationSteps} trinn er beregnet fra oppgitt relevant yrkesutdanning.`);
  step = Math.min(6, Math.max(step, 1 + practiceSteps + educationSteps));
  return { key: `step${step}` as RetailRateKey, reasons };
}

export function calculateRetailShift(input: { key: RetailRateKey; day: "weekday" | "saturday" | "sunday"; startMinutes: number; endMinutes: number }, set = retailTariffRateSets.at(-1)!) {
  if (input.endMinutes <= input.startMinutes) throw new Error("Vakten må slutte etter at den starter.");
  const hours = (input.endMinutes - input.startMinutes) / 60;
  let ub = 0;
  for (let minute = input.startMinutes; minute < input.endMinutes; minute += 1) {
    let supplement = 0;
    if (input.day === "sunday") supplement = retailUbSupplements.sunday;
    if (input.day === "weekday" && minute >= 21 * 60) supplement = retailUbSupplements.weekdayAfter21;
    else if (input.day === "weekday" && minute >= 18 * 60) supplement = retailUbSupplements.weekdayAfter18;
    if (input.day === "saturday" && minute >= 18 * 60) supplement = retailUbSupplements.saturdayAfter18;
    else if (input.day === "saturday" && minute >= 15 * 60) supplement = retailUbSupplements.saturdayAfter15;
    else if (input.day === "saturday" && minute >= 13 * 60) supplement = retailUbSupplements.saturdayAfter13;
    ub += supplement / 60;
  }
  const base = set.rates[input.key].hourly * hours;
  return { hours, base: round(base), ub: round(ub), total: round(base + ub) };
}

export function validateRetailTariffData(sets: readonly RetailRateSet[] = retailTariffRateSets) {
  const errors: string[] = [];
  sets.forEach((set, index) => {
    if (!isIsoDate(set.effectiveFrom) || (set.effectiveTo && !isIsoDate(set.effectiveTo))) errors.push(`Ugyldig dato: ${set.effectiveFrom}`);
    if (!set.sourceUrl || !set.sourceTitle || !isIsoDate(set.verifiedAt)) errors.push(`Kilde mangler: ${set.effectiveFrom}`);
    if (set.agreementId !== VIRKE_HK_AGREEMENT_ID) errors.push(`Feil avtale-ID: ${set.effectiveFrom}`);
    for (const key of retailRateKeys) {
      const rate = set.rates[key];
      if (!rate || rate.monthly <= 0 || rate.hourly <= 0) errors.push(`Ugyldig ${key}: ${set.effectiveFrom}`);
      if (rate?.hourlyRateSource === "calculated" && Math.abs(rate.hourly - round(rate.monthly / set.hourlyDivisor)) > 0.001) errors.push(`Feil omregning ${key}: ${set.effectiveFrom}`);
    }
    const previous = sets[index - 1];
    if (previous && (previous.effectiveTo === null || previous.effectiveTo >= set.effectiveFrom)) errors.push(`Overlapp ved ${set.effectiveFrom}`);
    if (previous && previous.effectiveFrom >= set.effectiveFrom) errors.push(`Ikke kronologisk: ${set.effectiveFrom}`);
  });
  return errors;
}

function round(value: number) { return Math.round(value * 100) / 100; }
function isIsoDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value; }
