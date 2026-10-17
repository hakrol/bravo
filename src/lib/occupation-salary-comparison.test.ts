import assert from "node:assert/strict";
import test from "node:test";
import {
  buildOccupationComparisonScale, occupationComparisonInsight, prepareOccupationComparison,
  salaryDifference, sortOccupationComparison, summarizeOccupationComparison,
  type OccupationSalaryComparisonDataset,
} from "./occupation-salary-comparison";

const dataset: OccupationSalaryComparisonDataset = {
  year: 2025,
  points: [60080, 58140, 54930, 53750, 53570, 53540, 48590].map((salary, index) => ({
    occupationCode: String(index), occupationName: ["Automatikere", "Energimontører", "Elektrikere", "Rørleggere og VVS-montører", "Serviceelektronikere", "Anleggsmaskin- og industrimekanikere", "Tele- og IKT-installatører"][index],
    year: 2025, medianMonthlySalary: salary, nominalGrowth: [3.8, 5.1, 4.2, 3.5, 2.1, 4.7, 2.8][index], employees: 100 + index, source: "Testdata",
  })),
  inflation: { year: 2025, annualGrowth: 2.8, source: "Testdata" },
  salaryPopulation: "Heltidsekvivalenter", employmentPopulation: "Personer", source: "Testdata",
};

test("differanser bruker valgt yrke som nevner og beholder fortegn", () => {
  assert.deepEqual(salaryDifference(54930, 60080), { amount: -5150, percent: -5150 / 60080 * 100 });
  assert.equal(salaryDifference(58140, 60080)!.amount, -1940);
  assert.equal(salaryDifference(53750, 60080)!.amount, -6330);
  assert.ok(salaryDifference(60080, 54930)!.percent > 0);
  assert.deepEqual(salaryDifference(60080, 60080), { amount: 0, percent: 0 });
  for (const missing of [null, 0, -1, NaN, Infinity]) {
    assert.equal(salaryDifference(50000, missing), null);
    assert.equal(salaryDifference(missing, 50000), null);
  }
});

test("oppsummeringen bruker medianen av de øvrige yrkenes medianlønninger, uten vekting", () => {
  const points = prepareOccupationComparison(dataset);
  const summary = summarizeOccupationComparison(points, "0");
  assert.equal(summary.peerMedian, 53660);
  assert.equal(summary.rank, 1);
  assert.equal(summary.count, 7);
  assert.equal(summary.peerCount, 6);
  assert.equal(summary.tied, false);
  assert.ok(Math.abs(summary.difference!.percent - 11.964219157659337) < 1e-10);
  const subset = summarizeOccupationComparison(points.slice(0, 4), "0");
  assert.equal(subset.peerMedian, 54930);
  assert.equal(subset.count, 4);
  const single = summarizeOccupationComparison(points.slice(0, 1), "0");
  assert.equal(single.peerMedian, null);
  assert.equal(single.difference, null);
});

test("manglende verdier utelates fra nevner og rangering; lik lønn gir delt plassering", () => {
  const points = prepareOccupationComparison(dataset);
  points[1].medianMonthlySalary = points[0].medianMonthlySalary;
  points[2].medianMonthlySalary = null;
  const summary = summarizeOccupationComparison(points, "0");
  assert.equal(summary.tied, true);
  assert.equal(summary.rank, 1);
  assert.equal(summary.count, 6);
  assert.equal(summary.peerCount, 5);
  points[0].medianMonthlySalary = null;
  const missing = summarizeOccupationComparison(points, "0");
  assert.equal(missing.rank, null);
  assert.equal(missing.difference, null);
  assert.equal(summarizeOccupationComparison([], "0").rank, null);
});

test("alle sorteringer er stabile, uten mutasjon, og plasserer manglende verdier sist", () => {
  const points = prepareOccupationComparison(dataset);
  assert.deepEqual(sortOccupationComparison(points, "salary-desc").map((point) => point.occupationCode), ["0", "1", "2", "3", "4", "5", "6"]);
  assert.deepEqual(sortOccupationComparison(points, "salary-asc").map((point) => point.occupationCode), ["6", "5", "4", "3", "2", "1", "0"]);
  for (const sort of ["nominal", "real"] as const) {
    assert.deepEqual(sortOccupationComparison(points, sort).map((point) => point.occupationCode), ["1", "5", "2", "0", "3", "6", "4"]);
  }
  assert.equal(points[0].occupationCode, "0");
  points[0] = { ...points[0], medianMonthlySalary: null, nominalGrowth: null, realGrowth: null };
  for (const sort of ["salary-desc", "salary-asc", "nominal", "real"] as const) {
    assert.equal(sortOccupationComparison(points, sort).at(-1)!.occupationCode, "0");
  }
});

test("reallønnsvekst bruker forholdstall og prisvekst i samme år, og null er gyldig", () => {
  const points = prepareOccupationComparison(dataset);
  assert.ok(Math.abs(points[2].realGrowth! - (1.042 / 1.028 - 1) * 100) < 1e-10);
  assert.equal(points[6].realGrowth, 0);
  assert.ok(points[4].realGrowth! < 0);
  for (const inflation of [null, NaN, Infinity, -100]) {
    assert.ok(prepareOccupationComparison({ ...dataset, inflation: { ...dataset.inflation, annualGrowth: inflation } }).every((point) => point.realGrowth === null));
  }
  assert.ok(prepareOccupationComparison({ ...dataset, inflation: { ...dataset.inflation, year: 2024 } }).every((point) => point.realGrowth === null));
  const missingGrowth = prepareOccupationComparison({ ...dataset, points: [{ ...dataset.points[0], nominalGrowth: null, employees: 0 }] })[0];
  assert.equal(missingGrowth.realGrowth, null);
  assert.equal(missingGrowth.employees, 0);
});

test("ugyldige verdier og blandede år blir aldri oppdiktede tall", () => {
  for (const invalid of [null, NaN, Infinity, -1]) {
    const point = prepareOccupationComparison({ ...dataset, points: [{ ...dataset.points[0], medianMonthlySalary: invalid, employees: invalid }] })[0];
    assert.equal(point.medianMonthlySalary, null);
    assert.equal(point.employees, null);
  }
  assert.deepEqual(prepareOccupationComparison({ ...dataset, year: 2024 }), []);
  assert.deepEqual(prepareOccupationComparison(dataset, ["2", "6"]).map((point) => point.occupationCode), ["2", "6"]);
  assert.throws(() => prepareOccupationComparison({ ...dataset, points: [dataset.points[0], dataset.points[0]] }));
});

test("skalaen starter på null for lønn og har symmetrisk nullinje for alle differanser", () => {
  const points = prepareOccupationComparison(dataset);
  const salaryScale = buildOccupationComparisonScale(points, 60080, "salary");
  assert.equal(salaryScale.min, 0);
  assert.equal(salaryScale.zero, 0);
  assert.ok(salaryScale.max >= 60080);
  for (const reference of [60080, 54930, 48590]) {
    const scale = buildOccupationComparisonScale(points, reference, "difference");
    assert.equal(scale.min, -scale.max);
    assert.equal(scale.zero, 50);
    assert.ok(scale.ticks.includes(0));
    for (const point of points) {
      const value = point.medianMonthlySalary! - reference;
      assert.ok(scale.position(value) >= 0 && scale.position(value) <= 100);
      if (value < 0) assert.ok(scale.position(value) < scale.zero);
      if (value > 0) assert.ok(scale.position(value) > scale.zero);
    }
  }
  for (const points of [[], prepareOccupationComparison({ ...dataset, points: dataset.points.map((point) => ({ ...point, medianMonthlySalary: null })) })]) {
    const scale = buildOccupationComparisonScale(points, null, "difference");
    assert.ok(Number.isFinite(scale.zero));
    assert.ok(scale.ticks.includes(0));
  }
});

test("innsiktsteksten følger lønn og vekst, med ryddig håndtering av manglende grunnlag", () => {
  const points = prepareOccupationComparison(dataset);
  assert.match(occupationComparisonInsight(points[2], points[0]), /lavere medianlønn.*men.*sterkere lønnsvekst/);
  assert.match(occupationComparisonInsight(points[4], points[0]), /lavere medianlønn.*og.*svakere lønnsvekst/);
  assert.match(occupationComparisonInsight(points[0], points[0]), /referanseyrket.*sterkere enn prisveksten/);
  assert.match(occupationComparisonInsight(points[4], points[4]), /Prisene har steget mer/);
  assert.match(occupationComparisonInsight(points[6], points[6]), /uendret/);
  assert.match(occupationComparisonInsight({ ...points[2], nominalGrowth: null }, points[0]), /data mangler/);
  assert.match(occupationComparisonInsight(points[2], undefined), /lønnstall mangler/);
});
