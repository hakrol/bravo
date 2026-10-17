import snapshot from "@/content/blog/data/automatiker-lonn-2025.json";
import type { OccupationSalaryComparisonDataset } from "@/lib/occupation-salary-comparison";

// Bare medianlønn og yrkeskoder gjenbrukes fra referansebildets eksisterende snapshot.
// Vekstrater, KPI og persontall nedenfor er bevisst fiktive, også der snapshotet har persontall.
const examples = [
  { code: "7412", nominalGrowth: 3.8, employees: 6450 },
  { code: "7413", nominalGrowth: 5.1, employees: 4280 },
  { code: "7411", nominalGrowth: 4.2, employees: 28450 },
  { code: "7126", nominalGrowth: 3.5, employees: 19600 },
  { code: "7421", nominalGrowth: 2.1, employees: 1680 },
  { code: "7233", nominalGrowth: 4.7, employees: 23100 },
  { code: "7422", nominalGrowth: 2.8, employees: 5820 },
];

export const occupationComparisonTestDataset: OccupationSalaryComparisonDataset = {
  year: 2025,
  points: examples.map((example) => {
    const row = snapshot.rows.find((point) => point.code === example.code)!;
    return {
      occupationCode: row.code, occupationName: row.label, year: 2025,
      href: row.href,
      medianMonthlySalary: row.value, nominalGrowth: example.nominalGrowth, employees: example.employees,
      source: "Medianlønn: referansebildet / SSB tabell 11418 (2025). Vekst og sysselsatte: fiktive testdata",
    };
  }),
  inflation: { year: 2025, annualGrowth: 2.8, source: "Fiktiv årlig KPI-vekst for 2025" },
  salaryPopulation: "Median månedslønn per heltidsekvivalent, alle sektorer, begge kjønn, heltid og deltid samlet.",
  employmentPopulation: "Sysselsatte er fiktive persontall for 2025, heltid og deltid samlet; ikke årsverk eller arbeidsforhold.",
  source: "Medianlønninger fra referansebildet, oppgitt som SSB tabell 11418 · 2025",
  testDataNote: "Testdata: Lønnsvekst, prisvekst (KPI) og antall sysselsatte er fiktive. Reallønnsvekst beregnes fra fiktiv lønnsvekst og KPI.",
};
