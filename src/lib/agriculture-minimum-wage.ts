export type AgricultureMinimumWageRate = {
  effectiveFrom: string;
  effectiveTo: string | null;
  seasonalUnder18Rate: number;
  seasonalAdultUpTo12WeeksRate: number;
  seasonalAdultOver12WeeksRate: number;
  permanentUnder18Rate: number;
  permanentUnskilledRate: number;
  skilledSupplement: number;
  status: "historical" | "active";
  sourceTitle: string;
  sourceUrl: string;
  regulationId: string;
  verifiedAt: string;
};

export const AGRICULTURE_MINIMUM_WAGE_VERIFIED_AT = "2026-09-27";

export const agricultureMinimumWageRates: readonly AgricultureMinimumWageRate[] = [
  rate("2016-01-01", "2017-01-15", 92.65, 111.15, 116.65, 101.65, 131.05, 10, "FOR-2015-04-27-448", "https://lovdata.no/dokument/LTI/forskrift/2015-04-27-448"),
  rate("2017-01-16", "2017-05-31", 93.15, 113.15, 118.65, 102.65, 133.05, 11, "FOR-2016-11-11-1328", "https://lovdata.no/dokument/LTI/forskrift/2016-11-11-1328"),
  rate("2017-06-01", "2018-11-30", 95.15, 115.15, 120.65, 104.65, 135.05, 11, "FOR-2017-05-05-576", "https://lovdata.no/dokument/LTI/forskrift/2017-05-05-576"),
  rate("2018-12-01", "2019-05-31", 98.65, 118.65, 124.15, 108.15, 138.55, 11.75, "FOR-2018-10-12-1701", "https://lovdata.no/dokument/LTI/forskrift/2018-10-12-1701"),
  rate("2019-06-01", "2021-06-30", 103.15, 123.15, 128.65, 112.65, 143.05, 11.75, "FOR-2019-05-21-655", "https://lovdata.no/dokument/LTI/forskrift/2019-05-21-655"),
  rate("2021-07-01", "2022-12-14", 109.4, 129.4, 134.9, 118.9, 149.3, 13, "FOR-2021-05-10-2076", "https://lovdata.no/dokument/LTI/forskrift/2021-05-10-2076"),
  rate("2022-12-15", "2023-06-14", 114.4, 134.4, 139.9, 123.9, 154.3, 14, "FOR-2022-12-09-2158", "https://lovdata.no/dokument/LTI/forskrift/2022-12-09-2158"),
  rate("2023-06-15", "2024-10-31", 124.9, 144.9, 150.4, 134.4, 164.8, 14, "FOR-2023-05-26-775", "https://lovdata.no/dokument/LTI/forskrift/2023-05-26-775"),
  rate("2024-11-01", "2025-06-14", 135.9, 155.9, 161.4, 145.4, 175.8, 14.5, "FOR-2024-10-21-2533", "https://lovdata.no/forskrift/2024-10-21-2533"),
  { ...rate("2025-06-15", null, 142.9, 162.9, 168.4, 152.4, 182.8, 14.5, "FOR-2025-05-28-1052", "https://lovdata.no/dokument/LTI/forskrift/2025-05-28-1052"), status: "active" },
] as const;

export const agricultureMinimumWageRules = {
  weekendHolidaySupplement: 0.25,
  minimumOvertimeSupplement: 0.4,
  regulationUrl: "https://lovdata.no/forskrift/2024-10-21-2533",
  labourInspectionUrl: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/",
  workingEnvironmentActUrl: "https://lovdata.no/lov/2005-06-17-62/§10-6",
} as const;

export const agricultureTariff2026 = {
  generalAndIndustryIncrease: 10.5,
  effectiveFrom: "2026-04-01",
  status: "ikke endelig godkjent per 27. september 2026",
  sourceUrl: "https://www.nhomd.no/525",
} as const;

export const agricultureOccupations = [
  { occupationCode: "6113", title: "Gartnere", href: "/yrke/gartnere-lonn", searchText: "gartner gartneri planteskole hagesenter" },
  { occupationCode: "9214", title: "Hjelpearbeidere i gartneri mv.", href: "/yrke/hjelpearbeidere-i-gartneri-mv-lonn", searchText: "gartneri sesongarbeider innhøsting pakking" },
  { occupationCode: "9212", title: "Hjelpearbeidere i husdyrproduksjon", href: "/yrke/hjelpearbeidere-i-husdyrproduksjon-lonn", searchText: "husdyr røkter avløser gård" },
  { occupationCode: "6121", title: "Melke- og husdyrprodusenter", href: "/yrke/melke-og-husdyrprodusenter-lonn", searchText: "melk husdyr bonde gård røkter avløser" },
] as const;

export function getAgricultureMinimumWageForDate(value: Date | string, rates = agricultureMinimumWageRates) {
  const date = toIsoDate(value);
  const matches = rates.filter((item) => item.effectiveFrom <= date && (item.effectiveTo === null || date <= item.effectiveTo));
  if (matches.length > 1) throw new Error(`Flere minstelønnssatser gjelder for ${date}.`);
  return matches[0] ?? null;
}

export function validateAgricultureMinimumWageRates(rates = agricultureMinimumWageRates) {
  const errors: string[] = [];
  rates.forEach((item, index) => {
    if (!isIsoDate(item.effectiveFrom) || (item.effectiveTo !== null && !isIsoDate(item.effectiveTo))) errors.push(`Ugyldig periode: ${item.effectiveFrom}`);
    const values = [item.seasonalUnder18Rate, item.seasonalAdultUpTo12WeeksRate, item.seasonalAdultOver12WeeksRate, item.permanentUnder18Rate, item.permanentUnskilledRate, item.skilledSupplement];
    if (values.some((value) => value <= 0)) errors.push(`Satser må være positive: ${item.effectiveFrom}`);
    if (!(item.seasonalUnder18Rate < item.permanentUnder18Rate && item.seasonalAdultUpTo12WeeksRate < item.seasonalAdultOver12WeeksRate && item.seasonalAdultOver12WeeksRate < item.permanentUnskilledRate)) errors.push(`Satsrekkefølgen er ugyldig: ${item.effectiveFrom}`);
    const previous = rates[index - 1];
    if (previous?.effectiveTo && previous.effectiveTo >= item.effectiveFrom) errors.push(`Overlapp ved ${item.effectiveFrom}`);
    if (!item.sourceUrl || !item.regulationId || !isIsoDate(item.verifiedAt)) errors.push(`Kilde mangler: ${item.effectiveFrom}`);
  });
  if (rates.filter((item) => item.status === "active").length !== 1) errors.push("Datasettet må ha nøyaktig én aktiv sats.");
  return errors;
}

function rate(effectiveFrom: string, effectiveTo: string | null, seasonalUnder18Rate: number, seasonalAdultUpTo12WeeksRate: number, seasonalAdultOver12WeeksRate: number, permanentUnder18Rate: number, permanentUnskilledRate: number, skilledSupplement: number, regulationId: string, sourceUrl: string): AgricultureMinimumWageRate {
  return { effectiveFrom, effectiveTo, seasonalUnder18Rate, seasonalAdultUpTo12WeeksRate, seasonalAdultOver12WeeksRate, permanentUnder18Rate, permanentUnskilledRate, skilledSupplement, status: "historical", sourceTitle: "Forskrift om allmenngjøring for jordbruks- og gartnerinæringene", sourceUrl, regulationId, verifiedAt: AGRICULTURE_MINIMUM_WAGE_VERIFIED_AT };
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
  return new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}
