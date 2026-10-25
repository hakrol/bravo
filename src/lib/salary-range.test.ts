import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSalaryRangeGeometry, compareSalaryRange, parseSalaryRangeInput, prepareSalaryRange,
  salaryRangePosition, salaryRangeSegments, toSalaryRangeMonthly, type SalaryRangeDataset,
} from "./salary-range";

const quartiles = { p25: 80000, median: 100000, p75: 120000 };
const dataset: SalaryRangeDataset = {
  title: "Test", source: "Testdata", points: [
    { year: 2024, women: quartiles, men: { p25: 85000, median: 105000, p75: 115000 } },
    { year: 2025, women: { p25: 85000, median: 110000, p75: 130000 }, men: quartiles },
  ],
};

test("norske lønnsbeløp godtar mellomrom og desimalkomma, uten å gjette ugyldig input", () => {
  assert.equal(parseSalaryRangeInput("1 150 000"), 1150000);
  assert.equal(parseSalaryRangeInput("95\u00a0833,33"), 95833.33);
  assert.equal(parseSalaryRangeInput("95\u202f833,33"), 95833.33);
  assert.equal(parseSalaryRangeInput("95833.33"), 95833.33);
  for (const raw of ["", " ", "0", "-100", "NaN", "Infinity", "1e6", "1.150.000", "1,2,3", "100 kr", "100,001", "99999999999999999"]) {
    assert.equal(parseSalaryRangeInput(raw), null, raw);
  }
});

test("årslønn omregnes uten tidlig avrunding og gir samme sammenligning som månedslønn", () => {
  const monthly = toSalaryRangeMonthly(1150000, "year");
  assert.equal(monthly, 1150000 / 12);
  assert.equal(toSalaryRangeMonthly(95833.33, "month"), 95833.33);
  assert.deepEqual(compareSalaryRange(monthly, quartiles), compareSalaryRange(1150000 / 12, quartiles));
  const comparison = compareSalaryRange(110000, quartiles);
  assert.equal(comparison.difference, 10000);
  assert.equal(comparison.percent, 10);
  assert.equal(compareSalaryRange(90000, quartiles).percent, -10);
});

test("kvartilplassering skiller grensene og lik median uten å anslå persentil", () => {
  assert.equal(salaryRangePosition(79999, quartiles), "Under nedre kvartil · laveste 25 %");
  assert.equal(salaryRangePosition(80000, quartiles), "På nedre kvartil");
  assert.equal(salaryRangePosition(90000, quartiles), "Mellom nedre kvartil og medianen");
  assert.equal(salaryRangePosition(100000, quartiles), "På medianen");
  assert.equal(salaryRangePosition(110000, quartiles), "Mellom medianen og øvre kvartil");
  assert.equal(salaryRangePosition(120000, quartiles), "På øvre kvartil");
  assert.equal(salaryRangePosition(120001, quartiles), "Over øvre kvartil · høyeste 25 %");
  assert.equal(compareSalaryRange(100000, quartiles).difference, 0);
  assert.equal(salaryRangePosition(100000, { p25: 100000, median: 100000, p75: 100000 }), "På medianen");
});

test("manglende og ugyldige kvartiler lager hull bare for aktuelt kjønn og år", () => {
  for (const women of [null, undefined, { ...quartiles, p25: 0 }, { ...quartiles, p75: Infinity },
    { ...quartiles, median: NaN }, { ...quartiles, p25: -1 }, { ...quartiles, p25: 100001 }, { ...quartiles, p75: 99999 }]) {
    const prepared = prepareSalaryRange({ ...dataset, points: [{ year: 2025, women, men: quartiles }] });
    assert.equal(prepared[0].women, null);
    assert.deepEqual(prepared[0].men, quartiles);
  }
  assert.deepEqual(prepareSalaryRange({ ...dataset, points: [{ year: 2025, women: { p25: 1, median: 1, p75: 1 } }] })[0].women, { p25: 1, median: 1, p75: 1 });
});

test("begge kjønn bruker en egen samlet fordeling, aldri et gjennomsnitt av kjønnskvartilene", () => {
  const all = { p25: 82000, median: 102000, p75: 119000 };
  const prepared = prepareSalaryRange({ ...dataset, points: [{ ...dataset.points[0], all }] });
  assert.deepEqual(prepared[0].all, all);
  assert.notEqual(prepared[0].all!.median, (prepared[0].women!.median + prepared[0].men!.median) / 2);
  assert.deepEqual(salaryRangeSegments(prepared, "all")[0][0].values, all);
  const missing = prepareSalaryRange(dataset);
  assert.equal(missing[0].all, null);
  assert.deepEqual(salaryRangeSegments(missing, "all"), []);
  const invalid = prepareSalaryRange({ ...dataset, points: [{ ...dataset.points[0], all: { ...all, p25: 130000 } }] });
  assert.equal(invalid[0].all, null);
  assert.deepEqual(invalid[0].women, quartiles);
});

test("sammenligningen viser hver kjønnsmedian separat når lønnen ligger mellom dem", () => {
  const women = { p25: 76000, median: 96000, p75: 121000 };
  const men = { p25: 79000, median: 95500, p75: 114000 };
  const salary = 95750;
  assert.equal(compareSalaryRange(salary, women).difference, -250);
  assert.ok(compareSalaryRange(salary, women).percent < 0);
  assert.equal(compareSalaryRange(salary, men).difference, 250);
  assert.ok(compareSalaryRange(salary, men).percent > 0);
});

test("sorterer uten mutasjon, viser ti siste år og avviser duplikater og ugyldige år", () => {
  const points = Array.from({ length: 12 }, (_, index) => ({ year: 2025 - index, women: quartiles }));
  const years = prepareSalaryRange({ ...dataset, points });
  assert.deepEqual(years.map((point) => point.year), Array.from({ length: 10 }, (_, index) => 2016 + index));
  assert.equal(points[0].year, 2025);
  assert.throws(() => prepareSalaryRange({ ...dataset, points: [points[0], points[0]] }), /unike/);
  assert.throws(() => prepareSalaryRange({ ...dataset, points: [{ year: 2025.5, women: quartiles }] }), /hele årstall/);
});

test("bånd og medianlinjer trekkes ikke over manglende verdier eller kalenderår", () => {
  const years = prepareSalaryRange({ ...dataset, points: [
    { year: 2020, women: quartiles, men: quartiles },
    { year: 2021, women: null, men: quartiles },
    { year: 2022, women: quartiles, men: quartiles },
    { year: 2024, women: quartiles, men: quartiles },
  ] });
  assert.deepEqual(salaryRangeSegments(years, "women").map((segment) => segment.map((point) => point.year)), [[2020], [2022], [2024]]);
  assert.deepEqual(salaryRangeSegments(years, "men").map((segment) => segment.map((point) => point.year)), [[2020, 2021, 2022], [2024]]);
});

test("geometrien bruker begge kjønn, kalenderavstand og meningsfulle skalaer for ett år", () => {
  for (const width of [280, 342, 768]) {
    const years = prepareSalaryRange(dataset);
    const geometry = buildSalaryRangeGeometry(years, width)!;
    assert.ok(geometry.min < 80000);
    assert.ok(geometry.max > 130000);
    assert.ok(geometry.y(80000) > geometry.y(130000));
    assert.ok(geometry.ticks.length <= 10);
    assert.ok(geometry.plotWidth > 0);
    const single = buildSalaryRangeGeometry([years[0]], width)!;
    assert.equal(single.x(2024), single.margin.left + single.plotWidth / 2);
    const equal = buildSalaryRangeGeometry([{ year: 2025, all: null, women: { p25: 1, median: 1, p75: 1 }, men: null }], width)!;
    assert.ok(Number.isFinite(equal.y(1)));
  }
  const geometry = buildSalaryRangeGeometry(prepareSalaryRange({ ...dataset, points: [
    { year: 2020, women: quartiles }, { year: 2022, women: quartiles }, { year: 2023, women: quartiles },
  ] }), 768)!;
  assert.ok(Math.abs((geometry.x(2022) - geometry.x(2020)) / (geometry.x(2023) - geometry.x(2022)) - 2) < 1e-10);
  assert.equal(buildSalaryRangeGeometry([], 768), null);
  assert.equal(buildSalaryRangeGeometry([{ year: 2025, all: null, women: null, men: null }], 768), null);
});
