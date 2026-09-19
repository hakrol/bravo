export type ElectricianMinimumWageSourceType =
  | "forskrift"
  | "endringsforskrift";

export type ElectricianMinimumWageRate = {
  effectiveFrom: string;
  effectiveTo: string | null;
  skilledRate: number;
  otherRate: number;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: ElectricianMinimumWageSourceType;
  regulationId: string;
  verifiedAt: string;
  comment?: string;
};

export const ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT = "2026-09-19";

export const electricianMinimumWageRates: readonly ElectricianMinimumWageRate[] = [
  {
    effectiveFrom: "2015-05-01",
    effectiveTo: "2015-05-07",
    skilledRate: 196.44,
    otherRate: 169.62,
    sourceTitle:
      "Forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2015-02-03-394",
    sourceType: "forskrift",
    regulationId: "FOR-2015-02-03-394",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
    comment: "Første allmenngjøringsforskrift for elektrofagene.",
  },
  {
    effectiveFrom: "2015-05-08",
    effectiveTo: "2016-09-22",
    skilledRate: 201.97,
    otherRate: 174.35,
    sourceTitle:
      "Endring i forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2015-05-04-446",
    sourceType: "endringsforskrift",
    regulationId: "FOR-2015-05-04-446",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2016-09-23",
    effectiveTo: "2017-05-31",
    skilledRate: 207.29,
    otherRate: 180.35,
    sourceTitle:
      "Forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2016-09-23-1243",
    sourceType: "forskrift",
    regulationId: "FOR-2016-09-23-1243",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2017-06-01",
    effectiveTo: "2018-11-30",
    skilledRate: 210.4,
    otherRate: 183.06,
    sourceTitle:
      "Endring i forskrift om allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2017-05-05-569",
    sourceType: "endringsforskrift",
    regulationId: "FOR-2017-05-05-569",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2018-12-01",
    effectiveTo: "2019-05-31",
    skilledRate: 211.7,
    otherRate: 184.36,
    sourceTitle:
      "Forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2018-10-11-1685",
    sourceType: "forskrift",
    regulationId: "FOR-2018-10-11-1685",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2019-06-01",
    effectiveTo: "2021-06-30",
    skilledRate: 217.63,
    otherRate: 189.52,
    sourceTitle:
      "Endring i forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2019-05-21-650",
    sourceType: "endringsforskrift",
    regulationId: "FOR-2019-05-21-650",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2021-07-01",
    effectiveTo: "2022-12-14",
    skilledRate: 225.15,
    otherRate: 196.47,
    sourceTitle:
      "Forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2021-05-10-2071",
    sourceType: "forskrift",
    regulationId: "FOR-2021-05-10-2071",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2022-12-15",
    effectiveTo: "2023-06-14",
    skilledRate: 234.14,
    otherRate: 205.77,
    sourceTitle:
      "Forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2022-12-05-2152",
    sourceType: "forskrift",
    regulationId: "FOR-2022-12-05-2152",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2023-06-15",
    effectiveTo: "2024-10-31",
    skilledRate: 242.34,
    otherRate: 213.66,
    sourceTitle:
      "Endring i forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/forskrift/2023-05-25-758",
    sourceType: "endringsforskrift",
    regulationId: "FOR-2023-05-25-758",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2024-11-01",
    effectiveTo: "2025-06-14",
    skilledRate: 257.79,
    otherRate: 229.11,
    sourceTitle:
      "Forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2024-10-21-2536",
    sourceType: "forskrift",
    regulationId: "FOR-2024-10-21-2536",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2025-06-15",
    effectiveTo: null,
    skilledRate: 270.45,
    otherRate: 241.77,
    sourceTitle:
      "Endring i forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    sourceUrl: "https://lovdata.no/forskrift/2025-05-28-958",
    sourceType: "endringsforskrift",
    regulationId: "FOR-2025-05-28-958",
    verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
  },
] as const;

export const electricianMinimumWageRules = {
  normalWeeklyHours: 37.5,
  shiftSupplements: {
    twoShift: 0.17,
    threeShift: 0.273,
  },
  workingTimeCompensation: [
    { weeklyHours: 36.5, supplement: 0.0274 },
    { weeklyHours: 35.5, supplement: 0.0563 },
    { weeklyHours: 33.6, supplement: 0.1161 },
  ],
  overtimeSupplements: {
    ordinary: 0.5,
    nightSundayHoliday: 1,
  },
  sourceUrl: "https://lovdata.no/forskrift/2024-10-21-2536",
  verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
} as const;

export const electricianTariff2026 = {
  skilledRate: 282.95,
  otherRate: 254.27,
  effectiveFrom: "2026-05-01",
  label: "Tariffsats i Landsoverenskomsten 2026–2028",
  sourceUrl:
    "https://www.nhoelektro.no/contentassets/af0d4782bb424e72a73cfed110f6b162/2026/landsoverenskomsten-2026-2028.pdf",
  verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
} as const;

export const electricianAllmenngjoringStatus2026 = {
  status: "under behandling",
  proposedSkilledRate: 282.95,
  proposedOtherRate: 254.27,
  hearingDeadline: "2026-08-20",
  sourceUrl: "https://www.tariffnemnda.no/horinger/elektrofagene2/",
  verifiedAt: ELECTRICIAN_MINIMUM_WAGE_VERIFIED_AT,
} as const;

export function getElectricianMinimumWageForDate(
  value: Date | string,
  rates: readonly ElectricianMinimumWageRate[] = electricianMinimumWageRates,
) {
  const date = toIsoDate(value);
  const matches = rates.filter(
    (rate) =>
      rate.effectiveFrom <= date &&
      (rate.effectiveTo === null || date <= rate.effectiveTo),
  );

  if (matches.length > 1) {
    throw new Error(`Flere minstelønnssatser gjelder for ${date}.`);
  }

  return matches[0] ?? null;
}

export function calculateRateChange(
  current: ElectricianMinimumWageRate,
  previous: ElectricianMinimumWageRate | undefined,
) {
  if (!previous) {
    return null;
  }

  const amount = current.skilledRate - previous.skilledRate;
  return {
    amount,
    percent: (amount / previous.skilledRate) * 100,
  };
}

export function validateElectricianMinimumWageRates(
  rates: readonly ElectricianMinimumWageRate[] = electricianMinimumWageRates,
) {
  const errors: string[] = [];
  const sorted = [...rates].sort((a, b) =>
    a.effectiveFrom.localeCompare(b.effectiveFrom),
  );

  sorted.forEach((rate, index) => {
    if (!isIsoDate(rate.effectiveFrom)) {
      errors.push(`Ugyldig effectiveFrom: ${rate.effectiveFrom}`);
    }
    if (rate.effectiveTo !== null && !isIsoDate(rate.effectiveTo)) {
      errors.push(`Ugyldig effectiveTo: ${rate.effectiveTo}`);
    }
    if (rate.effectiveTo !== null && rate.effectiveTo <= rate.effectiveFrom) {
      errors.push(`effectiveTo må være etter effectiveFrom: ${rate.effectiveFrom}`);
    }
    if (rate.skilledRate <= 0 || rate.otherRate <= 0) {
      errors.push(`Satser må være positive: ${rate.effectiveFrom}`);
    }
    if (!rate.sourceTitle || !rate.sourceUrl || !rate.regulationId) {
      errors.push(`Kilde mangler: ${rate.effectiveFrom}`);
    }
    if (!isIsoDate(rate.verifiedAt)) {
      errors.push(`Kontrolldato mangler eller er ugyldig: ${rate.effectiveFrom}`);
    }

    const previous = sorted[index - 1];
    if (previous?.effectiveTo === null) {
      errors.push(`Åpen periode før siste rad: ${previous.effectiveFrom}`);
    }
    if (
      previous?.effectiveTo !== null &&
      previous &&
      previous.effectiveTo >= rate.effectiveFrom
    ) {
      errors.push(
        `Overlapp mellom ${previous.effectiveFrom} og ${rate.effectiveFrom}`,
      );
    }
  });

  return errors;
}

function toIsoDate(value: Date | string) {
  if (typeof value === "string") {
    if (!isIsoDate(value)) {
      throw new Error(`Ugyldig dato: ${value}`);
    }
    return value;
  }

  if (Number.isNaN(value.getTime())) {
    throw new Error("Ugyldig dato.");
  }

  return value.toISOString().slice(0, 10);
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
