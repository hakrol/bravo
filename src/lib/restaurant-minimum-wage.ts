export type RestaurantMinimumWageStatus = "active" | "historical" | "proposed";

type RestaurantMinimumWageRateBase = {
  effectiveTo: string | null;
  under17Rate: number;
  age17Rate: number;
  age18Rate: number;
  adultRate: number;
  singleRoomDeduction: number | null;
  doubleRoomDeduction: number | null;
  sourceTitle: string;
  sourceUrl: string;
  regulationId: string;
  verifiedAt: string;
};

export type RestaurantMinimumWageRate = RestaurantMinimumWageRateBase & (
  | { effectiveFrom: string; status: Exclude<RestaurantMinimumWageStatus, "proposed"> }
  | { effectiveFrom: null; status: "proposed" }
);

export const RESTAURANT_MINIMUM_WAGE_VERIFIED_AT = "2026-09-26";

export const restaurantMinimumWageRates: readonly RestaurantMinimumWageRate[] = [
  {
    effectiveFrom: "2018-01-01",
    effectiveTo: "2018-11-30",
    under17Rate: 102.18,
    age17Rate: 111.68,
    age18Rate: 125.94,
    adultRate: 157.18,
    singleRoomDeduction: null,
    doubleRoomDeduction: null,
    status: "historical",
    sourceTitle: "Første allmenngjøring av Riksavtalen",
    sourceUrl: "https://lovdata.no/dokument/LTI/forskrift/2017-12-05-1922",
    regulationId: "FOR-2017-12-05-1922",
    verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2018-12-01",
    effectiveTo: "2019-05-31",
    under17Rate: 105.83,
    age17Rate: 115.33,
    age18Rate: 129.59,
    adultRate: 161.87,
    singleRoomDeduction: null,
    doubleRoomDeduction: null,
    status: "historical",
    sourceTitle: "Allmenngjøring av Riksavtalen 2018–2020",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2018-10-12-1700",
    regulationId: "FOR-2018-10-12-1700",
    verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2019-06-01",
    effectiveTo: "2021-06-30",
    under17Rate: 110.33,
    age17Rate: 119.83,
    age18Rate: 134.09,
    adultRate: 167.9,
    singleRoomDeduction: null,
    doubleRoomDeduction: null,
    status: "historical",
    sourceTitle: "Endring i allmenngjøringsforskriften for Riksavtalen",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2019-05-21-653",
    regulationId: "FOR-2019-05-21-653",
    verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2021-07-01",
    effectiveTo: "2022-12-14",
    under17Rate: 114.08,
    age17Rate: 123.58,
    age18Rate: 137.84,
    adultRate: 175.47,
    singleRoomDeduction: null,
    doubleRoomDeduction: null,
    status: "historical",
    sourceTitle: "Allmenngjøring av Riksavtalen 2020–2022",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2021-05-10-2074",
    regulationId: "FOR-2021-05-10-2074",
    verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2022-12-15",
    effectiveTo: "2023-06-14",
    under17Rate: 118.08,
    age17Rate: 127.58,
    age18Rate: 141.84,
    adultRate: 179.94,
    singleRoomDeduction: null,
    doubleRoomDeduction: null,
    status: "historical",
    sourceTitle: "Allmenngjøring av Riksavtalen 2022–2024",
    sourceUrl: "https://lovdata.no/LTI/forskrift/2022-12-09-2156",
    regulationId: "FOR-2022-12-09-2156",
    verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2023-06-15",
    effectiveTo: "2024-10-31",
    under17Rate: 128.58,
    age17Rate: 138.08,
    age18Rate: 152.34,
    adultRate: 190.79,
    singleRoomDeduction: null,
    doubleRoomDeduction: null,
    status: "historical",
    sourceTitle: "Endring i allmenngjøringsforskriften for Riksavtalen",
    sourceUrl: "https://lovdata.no/dokument/LTI/forskrift/2023-05-26-773",
    regulationId: "FOR-2023-05-26-773",
    verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2024-11-01",
    effectiveTo: "2025-06-14",
    under17Rate: 135.58,
    age17Rate: 145.08,
    age18Rate: 159.34,
    adultRate: 197.79,
    singleRoomDeduction: 660.48,
    doubleRoomDeduction: 429.58,
    status: "historical",
    sourceTitle: "Forskrift om delvis allmenngjøring av Riksavtalen",
    sourceUrl: "https://lovdata.no/forskrift/2024-10-21-2543",
    regulationId: "FOR-2024-10-21-2543",
    verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: "2025-06-15",
    effectiveTo: null,
    under17Rate: 142.58,
    age17Rate: 152.08,
    age18Rate: 166.34,
    adultRate: 204.79,
    singleRoomDeduction: 675.67,
    doubleRoomDeduction: 439.46,
    status: "active",
    sourceTitle: "Endring i forskrift om delvis allmenngjøring av Riksavtalen",
    sourceUrl: "https://lovdata.no/forskrift/2025-05-28-905",
    regulationId: "FOR-2025-05-28-905",
    verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
  },
  {
    effectiveFrom: null,
    effectiveTo: null,
    under17Rate: 153.08,
    age17Rate: 162.58,
    age18Rate: 176.84,
    adultRate: 215.29,
    singleRoomDeduction: 699.99,
    doubleRoomDeduction: 455.28,
    status: "proposed",
    sourceTitle: "Tariffnemndas utkast til ny forskrift for overnatting, servering og catering",
    sourceUrl: "https://www.tariffnemnda.no/horinger/overnattings--serverings--og-cateringvirksomheter/",
    regulationId: "UTKAST-2026-OSC",
    verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
  },
] as const;

export const restaurantImplementedMinimumWageRates = restaurantMinimumWageRates.filter(
  (rate): rate is RestaurantMinimumWageRate & { effectiveFrom: string; status: "active" | "historical" } => rate.status !== "proposed",
);

export const restaurantAllmenngjoringStatus2026 = {
  status: "under behandling",
  hearingDeadline: "2026-08-20",
  sourceUrl: "https://www.tariffnemnda.no/horinger/overnattings--serverings--og-cateringvirksomheter/",
  verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
} as const;

export const restaurantMinimumWageRules = {
  minimumOvertimeSupplement: 0.4,
  practiceMonths: 4,
  practiceStartsAtAge: 18,
  regulationUrl: "https://lovdata.no/forskrift/2024-10-21-2543",
  labourInspectionUrl: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/",
  workingEnvironmentActUrl: "https://lovdata.no/lov/2005-06-17-62/§10-6",
} as const;

export const restaurantTariff2026 = {
  effectiveFrom: "2026-06-01",
  otherUnskilledStartingRate: 215.29,
  otherSkilledStartingRate: 230.29,
  cookUnskilledStartingRate: 220.21,
  cookSkilledStartingRate: 235.21,
  eveningSupplement: 16.59,
  weekendSupplement: 31.52,
  nightWatchSupplement: 43.94,
  nightOtherSupplement: 58.04,
  apprenticeRates37_5Hours: [93.1, 104.74, 128.01, 139.65],
  sourceUrl: "https://www.fellesforbundet.no/lonn-og-tariff/tariffavtaler/riksavtalen/",
  verifiedAt: RESTAURANT_MINIMUM_WAGE_VERIFIED_AT,
} as const;

export const restaurantOccupationSalary2025 = [
  { occupation: "Kokker", code: "5120", median: 41610, average: 43160, href: "/yrke/kokker-lonn" },
  { occupation: "Servitører", code: "5131", median: 37350, average: 38370, href: "/yrke/servitorer-lonn" },
  { occupation: "Bartendere", code: "5132", median: 37480, average: 38710, href: "/yrke/bartendere-lonn" },
  { occupation: "Gatekjøkken- og kafémedarbeidere", code: "5246", median: 36360, average: 37120, href: "/yrke/gatekjokken-og-kafemedarbeidere-mv-lonn" },
] as const;

export function getRestaurantMinimumWageForDate(
  value: Date | string,
  rates: readonly RestaurantMinimumWageRate[] = restaurantMinimumWageRates,
) {
  const date = toIsoDate(value);
  const matches = rates.filter(
    (rate): rate is RestaurantMinimumWageRate & { effectiveFrom: string; status: "active" | "historical" } =>
      rate.status !== "proposed" &&
      rate.effectiveFrom <= date &&
      (rate.effectiveTo === null || date <= rate.effectiveTo),
  );
  if (matches.length > 1) throw new Error(`Flere minstelønnssatser gjelder for ${date}.`);
  return matches[0] ?? null;
}

export function validateRestaurantMinimumWageRates(
  rates: readonly RestaurantMinimumWageRate[] = restaurantMinimumWageRates,
) {
  const errors: string[] = [];
  const implemented = rates
    .filter((rate): rate is RestaurantMinimumWageRate & { effectiveFrom: string; status: "active" | "historical" } => rate.status !== "proposed")
    .sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));

  rates.forEach((rate) => {
    if (rate.status !== "proposed" && !isIsoDate(rate.effectiveFrom)) errors.push(`Ugyldig effectiveFrom: ${rate.effectiveFrom}`);
    if (rate.status === "proposed" && rate.effectiveFrom !== null) errors.push("Forslag skal ikke ha ikrafttredelsesdato før vedtak.");
    if (rate.effectiveTo !== null && !isIsoDate(rate.effectiveTo)) errors.push(`Ugyldig effectiveTo: ${rate.effectiveTo}`);
    if ([rate.under17Rate, rate.age17Rate, rate.age18Rate, rate.adultRate].some((value) => value <= 0)) errors.push(`Satser må være positive: ${rate.effectiveFrom}`);
    if (rate.singleRoomDeduction !== null && rate.singleRoomDeduction <= 0) errors.push(`Trekk for enkeltrom må være positivt: ${rate.effectiveFrom}`);
    if (rate.doubleRoomDeduction !== null && rate.doubleRoomDeduction <= 0) errors.push(`Trekk for dobbeltrom må være positivt: ${rate.effectiveFrom}`);
    if (!(rate.under17Rate < rate.age17Rate && rate.age17Rate < rate.age18Rate && rate.age18Rate < rate.adultRate)) errors.push(`Alderssatsene må være stigende: ${rate.effectiveFrom}`);
    if (!rate.sourceTitle || !rate.sourceUrl || !rate.regulationId || !isIsoDate(rate.verifiedAt)) errors.push(`Kilde eller kontrolldato mangler: ${rate.effectiveFrom}`);
  });

  implemented.forEach((rate, index) => {
    const previous = implemented[index - 1];
    if (previous?.effectiveTo === null) errors.push(`Åpen periode før siste rad: ${previous.effectiveFrom}`);
    if (previous?.effectiveTo && previous.effectiveTo >= rate.effectiveFrom) errors.push(`Overlapp mellom ${previous.effectiveFrom} og ${rate.effectiveFrom}`);
  });
  if (implemented.filter((rate) => rate.status === "active").length !== 1) errors.push("Datasettet må ha nøyaktig én aktiv sats.");
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

function isIsoDate(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
