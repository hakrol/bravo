import { prepareQuarterlyRealWage, type QuarterlyRealWageDataset } from "@/lib/quarterly-real-wage";

/** Kun én lønnsserie per yrke. Tidsakse og KPI deles mellom alle yrkene. */
export type OccupationRealWageData = Pick<QuarterlyRealWageDataset,
  "salaryTableId" | "inflationTableId" | "salaryUpdated" | "inflationUpdated"> & {
  periods: string[];
  cpi: (number | null)[];
  occupations: { code: string; label: string; salaries: (number | null)[] }[];
};

export function searchRealWageOccupations(occupations: OccupationRealWageData["occupations"], query: string) {
  function normalize(value: string) {
    return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("nb-NO").replace(/æ/g, "ae").replace(/ø/g, "o").trim();
  }
  const search = normalize(query);
  if (!search) return occupations;
  const terms = search.split(/\s+/);
  const matches = occupations.filter((item) => {
    const text = normalize(`${item.label} ${item.code}`);
    return terms.every((term) => text.includes(term));
  });
  function score(item: OccupationRealWageData["occupations"][number]) {
    const label = normalize(item.label);
    return item.code === search || label === search ? 0 : label.startsWith(search) || item.code.startsWith(search) ? 1 : 2;
  }
  return matches.sort((a, b) => score(a) - score(b) || a.label.localeCompare(b.label, "nb-NO"));
}

export function buildOccupationRealWageDataset(data: OccupationRealWageData, occupationCode: string): QuarterlyRealWageDataset {
  const occupation = data.occupations.find((item) => item.code === occupationCode);
  if (!occupation) throw new RangeError("Fant ikke dette yrket i reallønnsdataene.");
  return {
    occupationCode: occupation.code, occupationLabel: occupation.label,
    salaryTableId: data.salaryTableId, salaryMeasure: "MedianAvtMndLonn", inflationTableId: data.inflationTableId,
    salaryUpdated: data.salaryUpdated, inflationUpdated: data.inflationUpdated,
    genders: [{ code: "0", label: "Begge kjønn" }], ages: [{ code: "999D", label: "Alle aldre" }],
    series: [{
      genderCode: "0", ageCode: "999D",
      points: prepareQuarterlyRealWage(data.periods.map((periodCode, index) => ({
        periodCode, salary: occupation.salaries[index] ?? null, cpi: data.cpi[index] ?? null,
      }))),
    }],
  };
}
