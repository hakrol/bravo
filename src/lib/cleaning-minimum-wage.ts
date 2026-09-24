export type CleaningMinimumWageStatus = "active" | "historical" | "proposed";

type CleaningMinimumWageRateBase = {
  effectiveTo: string | null;
  adultRate: number;
  under18Rate: number;
  nightSupplement: number;
  sourceTitle: string;
  sourceUrl: string;
  regulationId: string;
  verifiedAt: string;
};

export type CleaningMinimumWageRate = CleaningMinimumWageRateBase & (
  | { effectiveFrom: string; status: Exclude<CleaningMinimumWageStatus, "proposed"> }
  | { effectiveFrom: null; status: "proposed" }
);

export const CLEANING_MINIMUM_WAGE_VERIFIED_AT = "2026-09-20";

export const cleaningMinimumWageRates: readonly CleaningMinimumWageRate[] = [
  {
    effectiveFrom: "2015-05-08",
    effectiveTo: "2017-05-31",
    adultRate: 169.37,
    under18Rate: 122.76,
    nightSupplement: 26,
    status: "historical",
    sourceTitle: "Forskrift om allmenngjøring av tariffavtale for renholdsbedrifter",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2014-11-27-1483",
    regulationId: "FOR-2014-11-27-1483",
    verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2017-06-01",
    effectiveTo: "2018-11-30",
    adultRate: 177.63,
    under18Rate: 129.59,
    nightSupplement: 26,
    status: "historical",
    sourceTitle: "Endring i forskrift om allmenngjøring av tariffavtale for renholdsbedrifter",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2017-05-05-570",
    regulationId: "FOR-2017-05-05-570",
    verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2018-12-01",
    effectiveTo: "2019-05-31",
    adultRate: 181.43,
    under18Rate: 133.39,
    nightSupplement: 26,
    status: "historical",
    sourceTitle: "Endring i forskrift om delvis allmenngjøring for renholdsbedrifter",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2018-11-22-1766",
    regulationId: "FOR-2018-11-22-1766",
    verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2019-06-01",
    effectiveTo: "2021-06-30",
    adultRate: 187.66,
    under18Rate: 139.62,
    nightSupplement: 26,
    status: "historical",
    sourceTitle: "Endring i forskrift om delvis allmenngjøring for renholdsbedrifter",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2019-05-21-654",
    regulationId: "FOR-2019-05-21-654",
    verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2021-07-01",
    effectiveTo: "2022-12-14",
    adultRate: 196.04,
    under18Rate: 146.27,
    nightSupplement: 27,
    status: "historical",
    sourceTitle: "Forskrift om delvis allmenngjøring for renholdsbedrifter",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2021-05-10-2075",
    regulationId: "FOR-2021-05-10-2075",
    verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2022-12-15",
    effectiveTo: "2023-06-14",
    adultRate: 204.54,
    under18Rate: 153.55,
    nightSupplement: 27,
    status: "historical",
    sourceTitle: "Forskrift om delvis allmenngjøring for renholdsbedrifter",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2022-12-09-2169",
    regulationId: "FOR-2022-12-09-2169",
    verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2023-06-15",
    effectiveTo: "2024-10-31",
    adultRate: 216.04,
    under18Rate: 165.05,
    nightSupplement: 27,
    status: "historical",
    sourceTitle: "Endring i forskrift om delvis allmenngjøring for renholdsbedrifter",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2023-05-25-759",
    regulationId: "FOR-2023-05-25-759",
    verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2024-11-01",
    effectiveTo: "2025-06-14",
    adultRate: 227.54,
    under18Rate: 176.55,
    nightSupplement: 29,
    status: "historical",
    sourceTitle: "Forskrift om delvis allmenngjøring for renholdsbedrifter",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2024-10-21-2545",
    regulationId: "FOR-2024-10-21-2545",
    verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2025-06-15",
    effectiveTo: null,
    adultRate: 236.54,
    under18Rate: 185.55,
    nightSupplement: 29,
    status: "active",
    sourceTitle: "Endring i forskrift om delvis allmenngjøring for renholdsbedrifter",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2025-05-28-957",
    regulationId: "FOR-2025-05-28-957",
    verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: null,
    effectiveTo: null,
    adultRate: 247.29,
    under18Rate: 196.05,
    nightSupplement: 29,
    status: "proposed",
    sourceTitle: "Tariffnemndas utkast til ny forskrift for renholdsbedrifter",
    sourceUrl: "https://www.tariffnemnda.no/horinger/renhold/",
    regulationId: "UTKAST-2026-30",
    verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
  },
] as const;

export const cleaningImplementedMinimumWageRates = cleaningMinimumWageRates.filter(
  (rate): rate is CleaningMinimumWageRate & { effectiveFrom: string; status: "active" | "historical" } => rate.status !== "proposed",
);

export const cleaningAllmenngjoringStatus2026 = {
  status: "under behandling",
  hearingDeadline: "2026-08-20",
  proposedAdultRate: 247.29,
  proposedUnder18Rate: 196.05,
  proposedNightSupplement: 29,
  sourceUrl: "https://www.tariffnemnda.no/horinger/renhold/",
  verifiedAt: CLEANING_MINIMUM_WAGE_VERIFIED_AT,
} as const;

export const cleaningMinimumWageRules = {
  nightFrom: "21:00",
  nightTo: "06:00",
  minimumOvertimeSupplement: 0.4,
  sourceUrl: "https://lovdata.no/forskrift/2024-10-21-2545",
  labourInspectionUrl: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/",
} as const;

export function getCleaningMinimumWageForDate(
  value: Date | string,
  rates: readonly CleaningMinimumWageRate[] = cleaningMinimumWageRates,
) {
  const date = toIsoDate(value);
  const matches = rates.filter(
    (rate): rate is CleaningMinimumWageRate & { effectiveFrom: string; status: "active" | "historical" } =>
      rate.status !== "proposed" &&
      rate.effectiveFrom <= date &&
      (rate.effectiveTo === null || date <= rate.effectiveTo),
  );

  if (matches.length > 1) {
    throw new Error(`Flere minstelønnssatser gjelder for ${date}.`);
  }

  return matches[0] ?? null;
}

export function calculateCleaningRateChange(
  current: CleaningMinimumWageRate,
  previous: CleaningMinimumWageRate | undefined,
) {
  if (!previous) return null;
  const amount = current.adultRate - previous.adultRate;
  return { amount, percent: (amount / previous.adultRate) * 100 };
}

export function validateCleaningMinimumWageRates(
  rates: readonly CleaningMinimumWageRate[] = cleaningMinimumWageRates,
) {
  const errors: string[] = [];
  const implemented = rates
    .filter((rate): rate is CleaningMinimumWageRate & { effectiveFrom: string; status: "active" | "historical" } => rate.status !== "proposed")
    .sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));

  rates.forEach((rate) => {
    if (rate.status !== "proposed" && !isIsoDate(rate.effectiveFrom)) errors.push(`Ugyldig effectiveFrom: ${rate.effectiveFrom}`);
    if (rate.status === "proposed" && rate.effectiveFrom !== null) errors.push("Forslag uten vedtatt ikrafttredelse skal ikke ha effectiveFrom.");
    if (rate.effectiveTo !== null && !isIsoDate(rate.effectiveTo)) errors.push(`Ugyldig effectiveTo: ${rate.effectiveTo}`);
    if (rate.effectiveTo !== null && rate.effectiveFrom !== null && rate.effectiveTo <= rate.effectiveFrom) errors.push(`effectiveTo må være etter effectiveFrom: ${rate.effectiveFrom}`);
    if (rate.adultRate <= 0 || rate.under18Rate <= 0 || rate.nightSupplement <= 0) errors.push(`Satser må være positive: ${rate.effectiveFrom}`);
    if (rate.under18Rate >= rate.adultRate) errors.push(`Satsen under 18 år må være lavere: ${rate.effectiveFrom}`);
    if (!rate.sourceTitle || !rate.sourceUrl || !rate.regulationId) errors.push(`Kilde mangler: ${rate.effectiveFrom}`);
    if (!isIsoDate(rate.verifiedAt)) errors.push(`Kontrolldato mangler eller er ugyldig: ${rate.effectiveFrom}`);
  });

  implemented.forEach((rate, index) => {
    const previous = implemented[index - 1];
    if (previous?.effectiveTo === null) errors.push(`Åpen periode før siste rad: ${previous.effectiveFrom}`);
    if (previous?.effectiveTo && previous.effectiveTo >= rate.effectiveFrom) errors.push(`Overlapp mellom ${previous.effectiveFrom} og ${rate.effectiveFrom}`);
  });

  if (implemented.filter((rate) => rate.status === "active").length !== 1) {
    errors.push("Datasettet må ha nøyaktig én aktiv sats.");
  }

  return errors;
}

function toIsoDate(value: Date | string) {
  if (typeof value === "string") {
    if (!isIsoDate(value)) throw new Error(`Ugyldig dato: ${value}`);
    return value;
  }
  if (Number.isNaN(value.getTime())) throw new Error("Ugyldig dato.");
  return value.toISOString().slice(0, 10);
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
