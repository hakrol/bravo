export type ConstructionMinimumWageStatus = "active" | "historical" | "proposed";

type ConstructionMinimumWageRateBase = {
  effectiveTo: string | null;
  skilledRate: number;
  unskilledNoExperienceRate: number;
  unskilledOneYearRate: number;
  under18Rate: number;
  sourceTitle: string;
  sourceUrl: string;
  regulationId: string;
  verifiedAt: string;
};

export type ConstructionMinimumWageRate = ConstructionMinimumWageRateBase & (
  | { effectiveFrom: string; status: Exclude<ConstructionMinimumWageStatus, "proposed"> }
  | { effectiveFrom: null; status: "proposed" }
);

export const CONSTRUCTION_MINIMUM_WAGE_VERIFIED_AT = "2026-09-27";

export const constructionMinimumWageRates: readonly ConstructionMinimumWageRate[] = [
  rate("2016-09-23", "2017-05-31", 193.6, 174, 181.5, 116.7, "FOR-2016-09-23-1241", "https://www.regjeringen.no/no/dokumenter/forskrift-om-delvis-allmenngjoring-av-fellesoverenskomsten-for-byggfag/id2512548/"),
  rate("2017-06-01", "2017-06-08", 197.9, 177.8, 185.8, 119.3, "FOR-2017-05-05-572", "https://lovdata.no/LTI/forskrift/2017-05-05-572"),
  rate("2017-06-09", "2018-11-30", 197.9, 177.8, 185.5, 119.3, "FOR-2017-06-08-711", "https://lovdata.no/dokument/LTI/forskrift/2017-06-08-711"),
  rate("2018-12-01", "2019-05-31", 203.8, 183.1, 191, 122.9, "FOR-2018-10-11-1684", "https://lovdata.no/dokument/LTI/forskrift/2018-10-11-1684"),
  rate("2019-06-01", "2021-06-30", 209.7, 188.4, 196.5, 126.5, "FOR-2019-05-21-649", "https://lovdata.no/dokument/LTI/forskrift/2019-05-21-649"),
  rate("2021-07-01", "2022-12-14", 220, 198.3, 206.5, 132.9, "FOR-2021-05-10-2070", "https://lovdata.no/LTI/forskrift/2021-05-10-2070"),
  rate("2022-12-15", "2023-06-14", 230, 207.4, 216, 139, "FOR-2022-12-09-2155", "https://lovdata.no/dokument/LTI/forskrift/2022-12-09-2155/KAPITTEL_2"),
  rate("2023-06-15", "2024-10-31", 238.3, 214.9, 223.8, 146.5, "FOR-2023-05-26-761", "https://lovdata.no/LTI/forskrift/2023-05-26-761"),
  rate("2024-11-01", "2025-06-14", 250.3, 226.9, 235.8, 153.83, "FOR-2024-10-21-2544", "https://lovdata.no/dokument/SF/forskrift/2024-10-21-2544"),
  {
    ...rate("2025-06-15", null, 264.32, 239.61, 249, 162.44, "FOR-2025-05-28-960", "https://lovdata.no/dokument/LTI/forskrift/2025-05-28-960"),
    status: "active",
  },
  {
    effectiveFrom: null,
    effectiveTo: null,
    skilledRate: 276.48,
    unskilledNoExperienceRate: 250.63,
    unskilledOneYearRate: 260.45,
    under18Rate: 169.91,
    status: "proposed",
    sourceTitle: "Tariffnemndas utkast til ny forskrift for byggfag",
    sourceUrl: "https://www.tariffnemnda.no/horinger/byggfag/",
    regulationId: "UTKAST-2026-BYGGFAG",
    verifiedAt: CONSTRUCTION_MINIMUM_WAGE_VERIFIED_AT,
  },
] as const;

export const constructionImplementedMinimumWageRates = constructionMinimumWageRates.filter(
  (item): item is ConstructionMinimumWageRate & { effectiveFrom: string; status: "active" | "historical" } => item.status !== "proposed",
);

export const constructionAllmenngjoringStatus2026 = {
  status: "under behandling",
  hearingDeadline: "2026-08-20",
  targetEffectiveBy: "2026-10-31",
  sourceUrl: "https://www.tariffnemnda.no/horinger/byggfag/",
  verifiedAt: CONSTRUCTION_MINIMUM_WAGE_VERIFIED_AT,
} as const;

export const constructionMinimumWageRules = {
  minimumOvertimeSupplement: 0.4,
  regulationUrl: "https://lovdata.no/dokument/SF/forskrift/2024-10-21-2544",
  labourInspectionUrl: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/",
  workingEnvironmentActUrl: "https://lovdata.no/lov/2005-06-17-62/§10-6",
} as const;

export const constructionTariff2026 = {
  effectiveFrom: "2026-04-01",
  skilledRate: 276.48,
  unskilledNoExperienceRate: 250.63,
  unskilledOneYearRate: 260.45,
  under18Rate: 169.91,
  sourceUrl: "https://www.nhobyggenaringen.no/lonn-og-tariff/lonns--og-satstabeller/",
  verifiedAt: CONSTRUCTION_MINIMUM_WAGE_VERIFIED_AT,
} as const;

export const constructionOccupationSalary2025 = [
  { occupation: "Murere", median: 48710, href: "/yrke/murere-lonn" },
  { occupation: "Betongarbeidere", median: 53420, href: "/yrke/betongarbeidere-lonn" },
  { occupation: "Tømrere og snekkere", median: 47900, href: "/yrke/tomrere-og-snekkere-lonn" },
  { occupation: "Rørleggere og VVS-montører", median: 53750, href: "/yrke/rorleggere-og-vvs-montorer-lonn" },
  { occupation: "Malere og byggtapetserere", median: 45900, href: "/yrke/malere-og-byggtapetserere-lonn" },
  { occupation: "Anleggsmaskinførere", median: 51510, href: "/yrke/anleggsmaskinforere-lonn" },
] as const;

export function getConstructionMinimumWageForDate(value: Date | string, rates: readonly ConstructionMinimumWageRate[] = constructionMinimumWageRates) {
  const date = toIsoDate(value);
  const matches = rates.filter(
    (item): item is ConstructionMinimumWageRate & { effectiveFrom: string; status: "active" | "historical" } =>
      item.status !== "proposed" && item.effectiveFrom <= date && (item.effectiveTo === null || date <= item.effectiveTo),
  );
  if (matches.length > 1) throw new Error(`Flere minstelønnssatser gjelder for ${date}.`);
  return matches[0] ?? null;
}

export function validateConstructionMinimumWageRates(rates: readonly ConstructionMinimumWageRate[] = constructionMinimumWageRates) {
  const errors: string[] = [];
  const implemented = rates
    .filter((item): item is ConstructionMinimumWageRate & { effectiveFrom: string; status: "active" | "historical" } => item.status !== "proposed")
    .sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));

  rates.forEach((item) => {
    if (item.status !== "proposed" && !isIsoDate(item.effectiveFrom)) errors.push(`Ugyldig effectiveFrom: ${item.effectiveFrom}`);
    if (item.status === "proposed" && item.effectiveFrom !== null) errors.push("Forslag skal ikke ha ikrafttredelsesdato før vedtak.");
    if (item.effectiveTo !== null && !isIsoDate(item.effectiveTo)) errors.push(`Ugyldig effectiveTo: ${item.effectiveTo}`);
    if ([item.skilledRate, item.unskilledNoExperienceRate, item.unskilledOneYearRate, item.under18Rate].some((value) => value <= 0)) errors.push(`Satser må være positive: ${item.effectiveFrom}`);
    if (!(item.under18Rate < item.unskilledNoExperienceRate && item.unskilledNoExperienceRate < item.unskilledOneYearRate && item.unskilledOneYearRate < item.skilledRate)) errors.push(`Satsrekkefølgen er ugyldig: ${item.effectiveFrom}`);
    if (!item.sourceTitle || !item.sourceUrl || !item.regulationId || !isIsoDate(item.verifiedAt)) errors.push(`Kilde eller kontrolldato mangler: ${item.effectiveFrom}`);
  });
  implemented.forEach((item, index) => {
    const previous = implemented[index - 1];
    if (previous?.effectiveTo === null) errors.push(`Åpen periode før siste rad: ${previous.effectiveFrom}`);
    if (previous?.effectiveTo && previous.effectiveTo >= item.effectiveFrom) errors.push(`Overlapp mellom ${previous.effectiveFrom} og ${item.effectiveFrom}`);
  });
  if (implemented.filter((item) => item.status === "active").length !== 1) errors.push("Datasettet må ha nøyaktig én aktiv sats.");
  return errors;
}

function rate(effectiveFrom: string, effectiveTo: string | null, skilledRate: number, unskilledNoExperienceRate: number, unskilledOneYearRate: number, under18Rate: number, regulationId: string, sourceUrl: string): ConstructionMinimumWageRate & { effectiveFrom: string; status: "historical" } {
  return { effectiveFrom, effectiveTo, skilledRate, unskilledNoExperienceRate, unskilledOneYearRate, under18Rate, status: "historical", sourceTitle: "Forskrift om allmenngjøring for byggeplasser i Norge", sourceUrl, regulationId, verifiedAt: CONSTRUCTION_MINIMUM_WAGE_VERIFIED_AT };
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
