import assert from "node:assert/strict";
import test from "node:test";
import { buildQuarterlyRealWageDataset, calculateFiveYearQuarterlyRealWageGrowth, calculateQuarterlyRealWageSummary, formatRealWageQuarter, prepareQuarterlyRealWage } from "./quarterly-real-wage";
import type { JsonStat2Dataset, SsbNormalizedDataset, SsbQuarterlySalaryDataset } from "./types";

test("bruker eksakt geometrisk realvekst fra kvartalet før", () => {
  const points = prepareQuarterlyRealWage([
    { periodCode: "2016K2", salary: 110, cpi: 105 },
    { periodCode: "2016K1", salary: 100, cpi: 100 },
  ]);
  assert.equal(points[0].realGrowth, null);
  assert.match(points[0].missingReason!, /foregående kvartal/);
  assert.ok(Math.abs(points[1].realGrowth! - (1.1 / 1.05 - 1) * 100) < 1e-10);
  assert.notEqual(points[1].realGrowth, 5);
});

test("første kvartal sammenlignes med fjerde kvartal året før", () => {
  const points = prepareQuarterlyRealWage([
    { periodCode: "2020K1", salary: 70, cpi: 95 },
    { periodCode: "2020K4", salary: 100, cpi: 100 },
    { periodCode: "2021K1", salary: 100, cpi: 102 },
  ]);
  assert.ok(Math.abs(points[2].realGrowth! - (100 / 102 - 1) * 100) < 1e-10);
  assert.equal(formatRealWageQuarter("2021K1"), "1. kvartal 2021");
});

test("oppsummeringen beregner fire kvartaler geometrisk og skiller markering fra referansekvartal", () => {
  const points = prepareQuarterlyRealWage([
    { periodCode: "2025K3", salary: 100, cpi: 100 },
    { periodCode: "2025K4", salary: 110, cpi: 100 },
    { periodCode: "2026K1", salary: 121, cpi: 100 },
    { periodCode: "2026K2", salary: 133.1, cpi: 100 },
    { periodCode: "2026K3", salary: 146.41, cpi: 110 },
  ]);
  const summary = calculateQuarterlyRealWageSummary([...points].reverse())!;
  assert.equal(summary.fourQuarters.startPeriodCode, "2025K3");
  assert.equal(summary.fourQuarters.endPeriodCode, "2026K3");
  assert.equal(summary.highlightStartPeriodCode, "2025K4");
  assert.ok(Math.abs(summary.fourQuarters.value! - ((146.41 / 100) / 1.1 - 1) * 100) < 1e-10);
  const changes = points.slice(1);
  const compounded = (changes.reduce((product, point) => product * (1 + point.realGrowth! / 100), 1) - 1) * 100;
  assert.ok(Math.abs(summary.fourQuarters.value! - compounded) < 1e-10);
  assert.ok(Math.abs(summary.fourQuarters.value! - changes.reduce((sum, point) => sum + point.realGrowth!, 0)) > 1);
  assert.equal(summary.lastQuarter.value, points.at(-1)!.realGrowth);
});

test("årsoppsummeringen bruker Q4 mot Q4 og inkluderer året når siste kvartal er Q4", () => {
  const levels = [
    { periodCode: "2024K4", salary: 100, cpi: 100 },
    { periodCode: "2025K1", salary: 200, cpi: 100 },
    { periodCode: "2025K4", salary: 120, cpi: 110 },
    { periodCode: "2026K1", salary: 125, cpi: 112 },
  ];
  const atYearEnd = calculateQuarterlyRealWageSummary(levels.slice(0, 3))!;
  const nextYear = calculateQuarterlyRealWageSummary(levels)!;
  assert.equal(atYearEnd.lastFullYear.startPeriodCode, "2024K4");
  assert.equal(atYearEnd.lastFullYear.endPeriodCode, "2025K4");
  assert.deepEqual(nextYear.lastFullYear, atYearEnd.lastFullYear);
  assert.ok(Math.abs(nextYear.lastFullYear.value! - (1.2 / 1.1 - 1) * 100) < 1e-10);
  assert.equal(nextYear.lastQuarter.startPeriodCode, "2025K4");
  assert.equal(nextYear.lastQuarter.endPeriodCode, "2026K1");
});

test("oppsummeringen flytter ikke perioder når siste eller foregående kvartal mangler data", () => {
  const summary = calculateQuarterlyRealWageSummary([
    { periodCode: "2024K4", salary: 100, cpi: 100 },
    { periodCode: "2025K3", salary: 110, cpi: 105 },
    { periodCode: "2026K2", salary: 120, cpi: 110 },
    { periodCode: "2026K3", salary: null, cpi: 112 },
  ])!;
  assert.deepEqual(summary.lastFullYear, { startPeriodCode: "2024K4", endPeriodCode: "2025K4", value: null });
  assert.deepEqual(summary.fourQuarters, { startPeriodCode: "2025K3", endPeriodCode: "2026K3", value: null });
  assert.deepEqual(summary.lastQuarter, { startPeriodCode: "2026K2", endPeriodCode: "2026K3", value: null });
  const missingPrevious = calculateQuarterlyRealWageSummary([
    { periodCode: "2025K3", salary: 100, cpi: 100 },
    { periodCode: "2026K3", salary: 110, cpi: 100 },
  ])!;
  assert.equal(missingPrevious.lastQuarter.value, null);
  assert.ok(Math.abs(missingPrevious.fourQuarters.value! - 10) < 1e-10);
});

test("oppsummeringen skiller nullvekst fra nedgang, ugyldige verdier og tom historikk", () => {
  assert.equal(calculateQuarterlyRealWageSummary([]), null);
  const start = { periodCode: "2025K3", salary: 100, cpi: 100 };
  const end = { periodCode: "2026K3", salary: 120, cpi: 120 };
  assert.equal(calculateQuarterlyRealWageSummary([start, end])!.fourQuarters.value, 0);
  assert.ok(calculateQuarterlyRealWageSummary([start, { ...end, salary: 90 }])!.fourQuarters.value! < 0);
  for (const value of [null, 0, -1, NaN, Infinity]) {
    for (const field of ["salary", "cpi"] as const) {
      assert.equal(calculateQuarterlyRealWageSummary([{ ...start, [field]: value }, end])!.fourQuarters.value, null);
      assert.equal(calculateQuarterlyRealWageSummary([start, { ...end, [field]: value }])!.fourQuarters.value, null);
    }
  }
  assert.throws(() => calculateQuarterlyRealWageSummary([start, start]), /Duplikat/);
  assert.throws(() => calculateQuarterlyRealWageSummary([{ ...start, periodCode: "2025K5" }]), /Ugyldig/);
});

test("oppsummeringen for 2026K3 bruker 2025 som siste hele år", () => {
  const { salary, inflation } = sources();
  const points = buildQuarterlyRealWageDataset(salary, inflation).series[0].points;
  const summary = calculateQuarterlyRealWageSummary(points)!;
  assert.equal(summary.highlightStartPeriodCode, "2025K4");
  assert.equal(summary.fourQuarters.endPeriodCode, "2026K3");
  assert.equal(summary.lastFullYear.startPeriodCode, "2024K4");
  assert.equal(summary.lastFullYear.endPeriodCode, "2025K4");
  assert.equal(summary.lastQuarter.startPeriodCode, "2026K2");
  assert.equal(summary.lastQuarter.endPeriodCode, "2026K3");
});

test("hopper ikke over manglende kvartaler eller manglende KPI", () => {
  const points = prepareQuarterlyRealWage([
    { periodCode: "2016K1", salary: 100, cpi: 100 },
    { periodCode: "2016K3", salary: 110, cpi: 105 },
    { periodCode: "2016K4", salary: 115, cpi: null },
    { periodCode: "2017K1", salary: 120, cpi: 107 },
    { periodCode: "2017K2", salary: 120, cpi: 107 },
  ]);
  assert.equal(points[1].realGrowth, null);
  assert.equal(points[2].realGrowth, null);
  assert.equal(points[3].realGrowth, null);
  assert.equal(points[4].realGrowth, 0);
});

test("ugyldige lønns- og indekstall er manglende data, aldri nullvekst", () => {
  for (const value of [null, NaN, Infinity, 0, -1]) {
    for (const field of ["salary", "cpi"] as const) {
      const points = prepareQuarterlyRealWage([
        { periodCode: "2016K1", salary: 100, cpi: 100 },
        { periodCode: "2016K2", salary: 110, cpi: 105, [field]: value },
        { periodCode: "2016K3", salary: 115, cpi: 106 },
      ]);
      assert.equal(points[1].realGrowth, null);
      assert.equal(points[2].realGrowth, null);
    }
  }
  assert.deepEqual(prepareQuarterlyRealWage([]), []);
  assert.throws(() => prepareQuarterlyRealWage([{ periodCode: "2016K5", salary: 100, cpi: 100 }]));
  assert.throws(() => prepareQuarterlyRealWage([
    { periodCode: "2016K1", salary: 100, cpi: 100 }, { periodCode: "2016K1", salary: 110, cpi: 100 },
  ]));
});

function sources(occupationCodes = ["0-9", "3313"]) {
  const periods = Array.from({ length: 43 }, (_, index) => `${2016 + Math.floor(index / 4)}K${index % 4 + 1}`);
  // Annen dimensjonsrekkefølge enn de faktiske filene avdekker hardkodede celleindekser.
  const codes: Record<string, string[]> = {
    Tid: periods, ContentsCode: ["GjMdTotal", "GjAvtaltMdlonn", "MedianAvtMndLonn"], Alder: ["999D", "0-39", "40-54", "55+"],
    Kjonn: ["0", "1", "2"], Yrke: occupationCodes,
  };
  const id = Object.keys(codes);
  const size = Object.values(codes).map((values) => values.length);
  const value = Array.from({ length: size.reduce((a, b) => a * b, 1) }, (_, flatIndex) => {
    let remaining = flatIndex;
    const coordinates: Record<string, number> = {};
    for (let index = id.length - 1; index >= 0; index -= 1) {
      coordinates[id[index]] = remaining % size[index];
      remaining = Math.floor(remaining / size[index]);
    }
    return 40000 + coordinates.Yrke * 10000 + coordinates.Kjonn * 1000 + coordinates.Alder * 2500 + coordinates.Tid * 100 - coordinates.ContentsCode * 5000;
  });
  const chunk: JsonStat2Dataset = {
    id, size, value,
    dimension: Object.fromEntries(Object.entries(codes).map(([key, values]) => [key, {
      category: { index: Object.fromEntries(values.map((code, index) => [code, index])), label: Object.fromEntries(values.map((code) => [code, code])) },
    }])),
  };
  const salary: SsbQuarterlySalaryDataset = { tableId: "11658", title: "Test", format: "json-stat2", dimensions: id, chunks: [chunk] };
  const inflation: SsbNormalizedDataset = {
    tableId: "14700", title: "Test", dimensions: ["VareTjenesteGrp", "ContentsCode", "Tid"],
    rows: periods.flatMap((periodCode, index) => [2, 1, 3].map((offset) => {
      const month = `${periodCode.slice(0, 4)}M${String((Number(periodCode.at(-1)) - 1) * 3 + offset).padStart(2, "0")}`;
      return { value: offset === 2 ? 100 + index : 1000, dimensions: {
        VareTjenesteGrp: { code: "00", label: "I alt" }, ContentsCode: { code: "KpiIndMnd", label: "KPI" }, Tid: { code: month, label: month },
      } };
    })),
  };
  return { salary, inflation, chunk };
}

test("leser alle 12 filterkombinasjoner og beholder 43 kvartaler fra 2016K1", () => {
  const { salary, inflation } = sources();
  const dataset = buildQuarterlyRealWageDataset(salary, inflation);
  assert.deepEqual(dataset.genders.map((gender) => gender.code), ["0", "2", "1"]);
  assert.equal(dataset.ages.length, 4);
  assert.equal(dataset.series.length, 12);
  for (const series of dataset.series) {
    assert.equal(series.points.length, 43);
    assert.equal(series.points[0].periodCode, "2016K1");
    assert.equal(series.points.at(-1)!.periodCode, "2026K3");
    assert.equal(series.points[0].realGrowth, null);
  }
  assert.equal(dataset.series.find((series) => series.genderCode === "0" && series.ageCode === "999D")!.points[0].salary, 40000);
  assert.equal(dataset.series.find((series) => series.genderCode === "2" && series.ageCode === "0-39")!.points[0].salary, 44500);
});

test("bruker KPI for midtmåneden og ingen gjennomsnittsberegning av kjønn", () => {
  const { salary, inflation } = sources();
  const points = buildQuarterlyRealWageDataset(salary, inflation).series[0].points;
  assert.equal(points[0].cpi, 100);
  assert.equal(points[1].cpi, 101);
  assert.ok(Math.abs(points[1].realGrowth! - ((40100 / 40000) / (101 / 100) - 1) * 100) < 1e-10);
});

test("median avtalt månedslønn brukes i både kvartalsvekst og periodeoppsummering", () => {
  const { salary, inflation } = sources();
  const median = buildQuarterlyRealWageDataset(salary, inflation, "0-9", "MedianAvtMndLonn");
  const average = buildQuarterlyRealWageDataset(salary, inflation);
  const points = median.series[0].points;
  assert.equal(median.salaryMeasure, "MedianAvtMndLonn");
  assert.equal(points[0].salary, 30000);
  assert.equal(points[1].salary, 30100);
  assert.ok(Math.abs(points[1].realGrowth! - ((30100 / 30000) / 1.01 - 1) * 100) < 1e-10);
  assert.notEqual(points[1].realGrowth, average.series[0].points[1].realGrowth);
  const summary = calculateQuarterlyRealWageSummary(points)!;
  const end = points.at(-1)!;
  const start = points.at(-5)!;
  assert.ok(Math.abs(summary.fourQuarters.value! - ((end.salary! / start.salary!) / (end.cpi! / start.cpi!) - 1) * 100) < 1e-10);
  assert.equal(summary.lastQuarter.value, end.realGrowth);
});

test("manglende median erstattes ikke med gjennomsnitt", () => {
  const { salary, inflation, chunk } = sources();
  delete chunk.dimension.ContentsCode.category.index.MedianAvtMndLonn;
  const median = buildQuarterlyRealWageDataset(salary, inflation, "0-9", "MedianAvtMndLonn");
  assert.ok(median.series[0].points.every((point) => point.salary === null && point.realGrowth === null));
  assert.equal(calculateQuarterlyRealWageSummary(median.series[0].points)!.fourQuarters.value, null);
  assert.equal(buildQuarterlyRealWageDataset(salary, inflation).series[0].points[0].salary, 40000);
});

test("konfidensielle celler påvirker bare aktuell kombinasjon og påfølgende vekst", () => {
  const { salary, inflation, chunk } = sources();
  chunk.status = { "0": ":" };
  const dataset = buildQuarterlyRealWageDataset(salary, inflation);
  const both = dataset.series[0].points;
  assert.equal(both[0].salary, null);
  assert.equal(both[1].realGrowth, null);
  assert.notEqual(both[2].realGrowth, null);
  const women = dataset.series.find((series) => series.genderCode === "2" && series.ageCode === "999D")!.points;
  assert.equal(women[0].salary, 42000);
  assert.notEqual(women[1].realGrowth, null);
});

test("fast yrke kan kombineres med kjønn og alder uten å bruke den nasjonale serien", () => {
  const { salary, inflation } = sources();
  const dataset = buildQuarterlyRealWageDataset(salary, inflation, "3313");
  assert.equal(dataset.occupationCode, "3313");
  assert.equal(dataset.occupationLabel, "3313");
  assert.equal(dataset.series.length, 12);
  const womenUnder40 = dataset.series.find((series) => series.genderCode === "2" && series.ageCode === "0-39")!.points;
  assert.equal(womenUnder40[0].salary, 54500);
  assert.equal(womenUnder40[1].salary, 54600);
  assert.ok(Math.abs(womenUnder40[1].realGrowth! - ((54600 / 54500) / (101 / 100) - 1) * 100) < 1e-10);
  const national = buildQuarterlyRealWageDataset(salary, inflation);
  assert.equal(national.occupationCode, "0-9");
  assert.equal(national.series.find((series) => series.genderCode === "2" && series.ageCode === "0-39")!.points[0].salary, 44500);
});

test("finner yrker i senere JSON-stat-deler og avviser ukjente eller aggregerte koder", () => {
  const { salary, inflation } = sources(["0-9"]);
  const second = sources(["3313", "431"]);
  second.chunk.value = second.chunk.value.map((value) => value === null ? null : value + 10000);
  salary.chunks.push(second.chunk);
  const dataset = buildQuarterlyRealWageDataset(salary, inflation, "3313");
  assert.equal(dataset.series[0].points[0].salary, 50000);
  assert.equal(dataset.occupationCode, "3313");
  assert.throws(() => buildQuarterlyRealWageDataset(salary, inflation, "9999"), RangeError);
  assert.throws(() => buildQuarterlyRealWageDataset(salary, inflation, "431"), RangeError);
});

test("femårsvekst bruker samme kvartal nøyaktig fem år tidligere og en samlet realendring", () => {
  const result = calculateFiveYearQuarterlyRealWageGrowth([
    { periodCode: "2026K3", salary: 150, cpi: 120 },
    { periodCode: "2026K2", salary: 1000, cpi: 100 },
    { periodCode: "2021K3", salary: 100, cpi: 100 },
  ])!;
  assert.equal(result.startPeriodCode, "2021K3");
  assert.equal(result.endPeriodCode, "2026K3");
  assert.equal(result.value, 25);
});

test("femårsperioden flyttes ikke når start- eller sluttdata mangler", () => {
  assert.equal(calculateFiveYearQuarterlyRealWageGrowth([]), null);
  const short = calculateFiveYearQuarterlyRealWageGrowth([
    { periodCode: "2021K4", salary: 100, cpi: 100 },
    { periodCode: "2026K3", salary: 150, cpi: 120 },
  ])!;
  assert.equal(short.startPeriodCode, "2021K3");
  assert.equal(short.value, null);
  const missingLatest = calculateFiveYearQuarterlyRealWageGrowth([
    { periodCode: "2021K2", salary: 100, cpi: 100 },
    { periodCode: "2021K3", salary: 100, cpi: 100 },
    { periodCode: "2026K2", salary: 150, cpi: 120 },
    { periodCode: "2026K3", salary: null, cpi: 120 },
  ])!;
  assert.equal(missingLatest.endPeriodCode, "2026K3");
  assert.equal(missingLatest.value, null);
});

test("femårsvekst skiller mellom ugyldige endepunkter, uendret kjøpekraft og nedgang", () => {
  for (const value of [null, 0, -1, NaN, Infinity]) {
    for (const field of ["salary", "cpi"] as const) {
      for (const missingAtStart of [true, false]) {
        const start = { periodCode: "2021K3", salary: 100, cpi: 100 };
        const end = { periodCode: "2026K3", salary: 120, cpi: 120 };
        const levels = missingAtStart ? [{ ...start, [field]: value }, end] : [start, { ...end, [field]: value }];
        assert.equal(calculateFiveYearQuarterlyRealWageGrowth(levels)!.value, null);
      }
    }
  }
  const start = { periodCode: "2021K3", salary: 100, cpi: 100 };
  assert.equal(calculateFiveYearQuarterlyRealWageGrowth([start, { periodCode: "2026K3", salary: 120, cpi: 120 }])!.value, 0);
  assert.equal(calculateFiveYearQuarterlyRealWageGrowth([start, { periodCode: "2026K3", salary: 90, cpi: 100 }])!.value! < 0, true);
});

test("femårstallet følger valgt kjønns- og aldersserie og tåler manglende mellomkvartaler", () => {
  const { salary, inflation } = sources();
  const dataset = buildQuarterlyRealWageDataset(salary, inflation, "3313");
  const all = dataset.series.find((series) => series.genderCode === "0" && series.ageCode === "999D")!.points;
  const womenUnder40 = dataset.series.find((series) => series.genderCode === "2" && series.ageCode === "0-39")!.points;
  const allGrowth = calculateFiveYearQuarterlyRealWageGrowth(all)!;
  const womenGrowth = calculateFiveYearQuarterlyRealWageGrowth(womenUnder40)!;
  assert.notEqual(allGrowth.value, womenGrowth.value);
  const endpoints = womenUnder40.filter((point) => ["2021K3", "2026K3"].includes(point.periodCode));
  assert.equal(calculateFiveYearQuarterlyRealWageGrowth(endpoints)!.value, womenGrowth.value);
  assert.equal(womenGrowth.startPeriodCode, "2021K3");
  assert.equal(womenGrowth.endPeriodCode, "2026K3");
});
