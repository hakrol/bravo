import assert from "node:assert/strict";
import test from "node:test";
import { buildNationalRealWagePageData, findRealWageLeader } from "./national-real-wage";
import { buildOccupationRealWageDataset } from "./occupation-real-wage";
import { buildQuarterlyRealWageDataset, calculateQuarterlyRealWageSummary } from "./quarterly-real-wage";
import type { SsbNormalizedDataset, SsbQuarterlySalaryDataset } from "./types";

function salaryDataset(
  tableId: string,
  dimensions: Record<string, string[]>,
  valueFor: (cell: Record<string, string>) => number | null,
  hidden?: (cell: Record<string, string>) => boolean,
): SsbQuarterlySalaryDataset {
  const coordinates = Object.entries(dimensions).reduce<Record<string, string>[]>((cells, [dimension, codes]) =>
    cells.flatMap((cell) => codes.map((code) => ({ ...cell, [dimension]: code }))), [{}]);
  return {
    tableId, title: "Test", format: "json-stat2", dimensions: Object.keys(dimensions),
    chunks: [{
      id: Object.keys(dimensions), size: Object.values(dimensions).map((codes) => codes.length),
      dimension: Object.fromEntries(Object.entries(dimensions).map(([dimension, codes]) => [dimension, {
        category: { index: Object.fromEntries(codes.map((code, index) => [code, index])),
          label: Object.fromEntries(codes.map((code) => [code, `${dimension} ${code}`])) },
      }])),
      value: coordinates.map(valueFor), status: coordinates.map((cell) => hidden?.(cell) ? ":" : null),
    }],
  };
}

function sources(hideOccupation = false, missingAgeYear = false) {
  const periods = ["2024K4", "2025K4", "2026K3"];
  const occupationValues: Record<string, [number, number, number]> = {
    "0-9": [100, 110, 115], "1111": [100, 130, 140], "2222": [100, 120, 1000],
    "1": [100, 105, 120], "2": [100, 125, 130], "0000": [100, 900, 1000],
  };
  function occupationChunk(codes: string[]) {
    return salaryDataset("11658", {
      Tid: periods, ContentsCode: ["GjMdTotal", "MedianAvtMndLonn"], Kjonn: ["0"], Alder: ["999D"], Yrke: codes,
    }, (cell) => cell.ContentsCode === "GjMdTotal" ? 9999 : occupationValues[cell.Yrke][periods.indexOf(cell.Tid)],
    (cell) => hideOccupation && cell.Yrke === "1111" && cell.Tid === "2025K4" && cell.ContentsCode === "MedianAvtMndLonn");
  }
  const occupations = occupationChunk(["0-9", "1", "1111"]);
  occupations.chunks.push(...occupationChunk(["2", "2222", "0000"]).chunks);
  const ageValues: Record<string, [number, number, number, number]> = {
    "999A": [100, 900, 1000, 1100], "-24": [100, 140, 150, 200], "25-39": [100, 120, 130, 400],
  };
  const regionalPeriods = [...periods, "2026K4"];
  const norway = salaryDataset("11652", {
    ContentsCode: ["MedianAvtMndLonn", "GjMdTotal"], Alder: ["999A", "-24", "25-39"],
    Region: ["Ialt"], Tid: regionalPeriods, Kjonn: ["0"],
  }, (cell) => cell.ContentsCode === "GjMdTotal" ? 9999
    : missingAgeYear && cell.Tid === "2025K4" ? null : ageValues[cell.Alder][regionalPeriods.indexOf(cell.Tid)]);
  const inflation: SsbNormalizedDataset = {
    tableId: "14700", title: "Test", dimensions: ["Tid", "VareTjenesteGrp", "ContentsCode"],
    rows: Object.entries({ "2024M11": 100, "2025M10": 999, "2025M11": 110, "2025M12": 999, "2026M08": 115, "2026M11": 120 })
      .map(([period, value]) => ({ value, dimensions: {
        Tid: { code: period, label: period }, VareTjenesteGrp: { code: "00", label: "I alt" },
        ContentsCode: { code: "KpiIndMnd", label: "KPI" },
      } })),
  };
  return { occupations, norway, inflation };
}

test("rangerer detaljyrker, publiserte hovedgrupper og aldersgrupper hver for seg i samme hele år", () => {
  const { occupations, norway, inflation } = sources();
  const data = buildNationalRealWagePageData(occupations, norway, inflation);
  assert.equal(data.summary!.lastFullYear.startPeriodCode, "2024K4");
  assert.equal(data.summary!.lastFullYear.endPeriodCode, "2025K4");
  assert.equal(data.leaders.occupation!.code, "1111");
  assert.equal(data.leaders.group!.code, "2");
  assert.equal(data.leaders.age!.code, "-24");
  assert.ok(Math.abs(data.leaders.occupation!.value - (1.3 / 1.1 - 1) * 100) < 1e-10);
  // Gruppe 1 har det sterkeste detaljyrket, men gruppe 2 har høyest samlet medianvekst.
  assert.ok(Math.abs(data.leaders.group!.value - (1.25 / 1.1 - 1) * 100) < 1e-10);
  assert.ok(Math.abs(data.leaders.age!.value - (1.4 / 1.1 - 1) * 100) < 1e-10);
});

test("aldersdiagrammet bruker landets aldersmedianer og samme tidsakse som landstallet", () => {
  const { occupations, norway, inflation } = sources();
  const data = buildNationalRealWagePageData(occupations, norway, inflation);
  assert.equal(data.ageDataset.salaryTableId, "11652");
  assert.equal(data.ageDataset.salaryMeasure, "MedianAvtMndLonn");
  assert.deepEqual(data.ageDataset.ages.map((age) => age.code), ["-24", "25-39"]);
  assert.equal(data.ageDataset.series[0].points.at(-1)!.periodCode, "2026K3");
  assert.equal(data.ageDataset.series[0].points.at(-1)!.salary, 150);
  assert.equal(data.ageDataset.series[0].points.at(-1)!.cpi, 115);
  assert.ok(data.ageDataset.series.every((series) => series.genderCode === "0"));
  assert.equal(data.ageComparisons[0].value, data.leaders.age!.value);
});

test("skjermede yrkestall og manglende aldersmedianer erstattes ikke med gjennomsnitt eller andre perioder", () => {
  const { occupations, norway, inflation } = sources(true, true);
  const data = buildNationalRealWagePageData(occupations, norway, inflation);
  assert.equal(data.leaders.occupation!.code, "2222");
  assert.equal(data.leaders.age, null);
  assert.ok(data.ageComparisons.every((age) => age.value === null));
  assert.equal(data.ageDataset.series[0].points.find((point) => point.periodCode === "2025K4")!.salary, null);
  assert.equal(data.summary!.lastFullYear.endPeriodCode, "2025K4");
});

test("rangering krever KPI for begge referansemåneder", () => {
  const { occupations, norway, inflation } = sources();
  inflation.rows = inflation.rows.filter((row) => row.dimensions.Tid.code !== "2025M11");
  const data = buildNationalRealWagePageData(occupations, norway, inflation);
  assert.deepEqual(data.leaders, { occupation: null, age: null, group: null });
});

test("yrkesvelgerens kompakte data gir samme medianserie som det opprinnelige datagrunnlaget", () => {
  const { occupations, norway, inflation } = sources();
  const data = buildNationalRealWagePageData(occupations, norway, inflation);
  assert.deepEqual(data.occupationData.occupations.map((item) => item.code), ["1111", "2222"]);
  for (const code of ["1111", "2222"]) {
    const selected = buildOccupationRealWageDataset(data.occupationData, code);
    const original = buildQuarterlyRealWageDataset(occupations, inflation, code, "MedianAvtMndLonn");
    assert.deepEqual(selected.series[0].points, original.series[0].points);
    assert.equal(selected.occupationCode, code);
    assert.equal(selected.salaryMeasure, "MedianAvtMndLonn");
    assert.equal(selected.series.length, 1);
    assert.equal(selected.series[0].genderCode, "0");
    assert.equal(selected.series[0].ageCode, "999D");
  }
  const first = calculateQuarterlyRealWageSummary(buildOccupationRealWageDataset(data.occupationData, "1111").series[0].points)!;
  const second = calculateQuarterlyRealWageSummary(buildOccupationRealWageDataset(data.occupationData, "2222").series[0].points)!;
  assert.notEqual(first.lastFullYear.value, second.lastFullYear.value);
  assert.equal(first.lastFullYear.value, data.leaders.occupation!.value);
});

test("yrkesvalg beholder skjermede verdier og avviser ukjente yrker og hovedgrupper", () => {
  const { occupations, norway, inflation } = sources(true);
  const data = buildNationalRealWagePageData(occupations, norway, inflation);
  const selected = buildOccupationRealWageDataset(data.occupationData, "1111");
  assert.equal(selected.series[0].points.find((point) => point.periodCode === "2025K4")!.salary, null);
  assert.equal(calculateQuarterlyRealWageSummary(selected.series[0].points)!.lastFullYear.value, null);
  for (const code of ["9999", "0000", "1", "0-9"]) assert.throws(() => buildOccupationRealWageDataset(data.occupationData, code), RangeError);
});

test("høyest utvikling kan være negativ, null er gyldig, og delte førsteplasser håndteres deterministisk", () => {
  assert.equal(findRealWageLeader([]), null);
  assert.equal(findRealWageLeader([{ code: "1", label: "Mangler", value: null }, { code: "2", label: "Ugyldig", value: NaN }]), null);
  assert.equal(findRealWageLeader([{ code: "1", label: "A", value: -2 }, { code: "2", label: "B", value: -1 }])!.code, "2");
  const tie = findRealWageLeader([{ code: "10", label: "B", value: 0 }, { code: "2", label: "A", value: 0 }])!;
  assert.equal(tie.code, "2");
  assert.equal(tie.value, 0);
  assert.equal(tie.tiedCount, 2);
});
