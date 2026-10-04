export type AutomotiveRates = {
  newlyQualifiedSkilled: number;
  skilledOneYear: number;
  helper18Plus: number;
  helperOneYear: number;
};

export const automotiveCategories = [
  { key: "newlyQualifiedSkilled", label: "Nyutlært fagarbeider" },
  { key: "skilledOneYear", label: "Fagarbeider etter ett års praksis" },
  { key: "helper18Plus", label: "Hjelpearbeider, fylt 18 år" },
  { key: "helperOneYear", label: "Hjelpearbeider 18+, etter ett års praksis" },
] as const;

export const automotiveMinimumWage = {
  effectiveFrom: "2026-06-15", effectiveTo: null,
  newlyQualifiedSkilled: 223.5, skilledOneYear: 237,
  helper18Plus: 208, helperOneYear: 212,
  status: "active", regulationId: "FOR-2026-04-13-592", verifiedAt: "2026-10-04",
} as const;

export const automotiveMinimumWageProposal = {
  effectiveFrom: null, newlyQualifiedSkilled: 249, skilledOneYear: 257,
  helper18Plus: 223.5, helperOneYear: 228,
  status: "proposed", verifiedAt: "2026-10-04",
} as const;

export type AutomotiveTariffPoint = AutomotiveRates & { year: number; period: string };
// Tariffhistorikk er et eget datasett. År uten oppgitt endring har ingen ny rad.
// 2016 og 2026 er avtaleperioder, ikke konstruerte ikrafttredelsesdatoer.
export const biloverenskomstenTariffHistory: AutomotiveTariffPoint[] = [
  { year: 2016, period: "2016", newlyQualifiedSkilled: 162, skilledOneYear: 176.5, helper18Plus: 150.5, helperOneYear: 154 },
  { year: 2018, period: "01.05.2018", newlyQualifiedSkilled: 169.5, skilledOneYear: 185, helper18Plus: 157.5, helperOneYear: 161 },
  { year: 2019, period: "01.04.2019", newlyQualifiedSkilled: 172, skilledOneYear: 187.5, helper18Plus: 160, helperOneYear: 163.5 },
  { year: 2020, period: "01.05.2020", newlyQualifiedSkilled: 179, skilledOneYear: 195.5, helper18Plus: 166.5, helperOneYear: 170 },
  { year: 2022, period: "01.05.2022", newlyQualifiedSkilled: 190, skilledOneYear: 207, helper18Plus: 176.5, helperOneYear: 180 },
  { year: 2023, period: "21.04.2023", newlyQualifiedSkilled: 197.5, skilledOneYear: 214.5, helper18Plus: 184, helperOneYear: 187.5 },
  { year: 2024, period: "01.05.2024", newlyQualifiedSkilled: 218.5, skilledOneYear: 232, helper18Plus: 203, helperOneYear: 207 },
  { year: 2025, period: "01.04.2025", newlyQualifiedSkilled: 223.5, skilledOneYear: 237, helper18Plus: 208, helperOneYear: 212 },
  { year: 2026, period: "2026-avtalen", newlyQualifiedSkilled: 249, skilledOneYear: 257, helper18Plus: 223.5, helperOneYear: 228 },
];

export const automotiveSources = {
  regulation: "https://lovdata.no/dokument/SF/forskrift/2026-04-13-592",
  rates: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/",
  proposal: "https://www.tariffnemnda.no/horinger/Bilpleie-biloverenskomsten/",
  tariff: "https://www.fellesforbundet.no/lonn-og-tariff/lonnsoppgjorene/hovedoppgjoret-2026/uravstemming/biloverenskomsten/",
  agreements: "https://www.fellesforbundet.no/lonn-og-tariff/tariffavtaler/",
  tariff2016: "https://www.lo.no/globalassets/okonomi-og-samfunn/ny-lo-lavlonnsutredningen-2021-a4-skjerm.pdf",
  tariff2018: "https://www.fellesforbundet.no/globalassets/lonn-og-tariffsaker/tariffavtaler/overenskomster-2018-2020/biloverenskomsten-2018-2020.pdf",
  tariff2023: "https://www.fellesforbundet.no/globalassets/lonn-og-tariffsaker/mellomoppgjoret-2023/mellomoppgjoret-2023--biloverenskomsten.pdf",
  tariff2024: "https://www.fellesforbundet.no/globalassets/lonn-og-tariffsaker/tariffavtaler/overenskomster-2024-2026/Biloverenskomsten-2024-2026.pdf",
  tariff2025: "https://www.fellesforbundet.no/globalassets/lonn-og-tariffsaker/tariffoppgjoret-2025/mellomoppgjoret-2025--biloverenskomsten.pdf",
  approval: "https://www.arbeidstilsynet.no/godkjenninger/finn-godkjent-bilvask-dekk/sok-godkjenning-bilpleie-hjul/",
  overtime: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/overtid/",
  ssb: "https://www.ssb.no/statbank/table/11418/",
} as const;

export function formatAutomotiveRate(value: number) {
  return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
}
