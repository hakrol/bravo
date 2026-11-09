import type { OccupationQuadrantDataset, OccupationQuadrantGender } from "@/lib/occupation-quadrant";
import { getOccupationDetailHref } from "@/lib/occupation-detail-pages";

/** Fiktive lønninger og persontall for å utvikle masteren med nærliggende yrker. */
const examples = [
  { code: "7421", name: "Serviceelektronikere",
    all: { employees: 1700, salary: 49000 }, men: { employees: 1380, salary: 49900 }, women: { employees: 320, salary: 47000 } },
  { code: "7413", name: "Energimontører",
    all: { employees: 4300, salary: 66500 }, men: { employees: 3900, salary: 68000 }, women: { employees: 400, salary: 63500 } },
  { code: "7422", name: "Tele- og IKT-installatører",
    all: { employees: 5800, salary: 53500 }, men: { employees: 4900, salary: 54800 }, women: { employees: 900, salary: 51000 } },
  { code: "7412", name: "Automatikere",
    all: { employees: 6400, salary: 62000 }, men: { employees: 5400, salary: 63500 }, women: { employees: 1000, salary: 59000 } },
  { code: "7127", name: "Kuldemontører mv.",
    all: { employees: 7200, salary: 56200 }, men: { employees: 6500, salary: 57500 }, women: { employees: 700, salary: 54000 } },
  { code: "7126", name: "Rørleggere og VVS-montører",
    all: { employees: 19600, salary: 58500 }, men: { employees: 17800, salary: 59800 }, women: { employees: 1800, salary: 55800 } },
  { code: "7233", name: "Anleggsmaskin- og industrimekanikere",
    all: { employees: 23000, salary: 59500 }, men: { employees: 20700, salary: 61000 }, women: { employees: 2300, salary: 56800 } },
  { code: "7411", name: "Elektrikere",
    all: { employees: 28500, salary: 57000 }, men: { employees: 25000, salary: 58400 }, women: { employees: 3500, salary: 54500 } },
];

function testSeries(gender: OccupationQuadrantGender) {
  return {
    excludedCount: 0,
    points: examples.map((point) => ({
      code: point.code, name: point.name, href: getOccupationDetailHref(point.code, point.name) ?? undefined, ...point[gender],
    })).sort((a, b) => a.employees - b.employees || a.code.localeCompare(b.code)),
  };
}

export const occupationQuadrantTestDataset: OccupationQuadrantDataset = {
  title: "Interaktivt plottdiagram",
  subtitle: "Sammenligning av lønn og antall lønnstakere i nærliggende tekniske håndverksyrker.",
  source: "Fiktive testdata for diagramutvikling. Tallene er ikke hentet fra SSB.",
  testDataNote: "Alle lønninger og persontall er fiktive. Yrkesnavn og yrkeskoder brukes som eksempler.",
  year: "2025",
  workforcePeriod: "2025K4",
  ...testSeries("all"),
  men: testSeries("men"),
  women: testSeries("women"),
};
