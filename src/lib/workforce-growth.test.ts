import assert from "node:assert/strict";
import test from "node:test";
import {
  buildWorkforceGrowthDataset, buildWorkforceScale, formatWorkforceCount, formatWorkforcePercent,
  prepareWorkforceGrowth, workforceValue, type WorkforceGrowthDataset,
} from "./workforce-growth";

const metadata = { occupationCode: "test", occupationLabel: "Testyrke" };
const dataset = (points: WorkforceGrowthDataset["points"]): WorkforceGrowthDataset => ({ ...metadata, points });

test("totalen består av to segmenter og andelene summerer til 100", () => {
  const [first, last] = prepareWorkforceGrowth(dataset([
    { year: 2024, men: 60, women: 40, reportedTotal: 100 },
    { year: 2025, men: 66, women: 54, reportedTotal: 120 },
  ]));
  assert.equal(last.total, 120);
  assert.ok(Math.abs(last.menShare! - 55) < 1e-10);
  assert.equal(last.womenShare, 45);
  assert.equal(last.annualChange, 20);
  assert.equal(last.totalMismatch, false);
  assert.equal(first.annualChange, null);
  assert.equal(last.womenShare! - first.womenShare!, 5);
});

test("beholder avvikende kildetotal separat uten å forvrenge stabel eller andeler", () => {
  const [point] = prepareWorkforceGrowth(dataset([{ year: 2025, men: 60, women: 40, reportedTotal: 103 }]));
  assert.equal(point.total, 100);
  assert.equal(point.reportedTotal, 103);
  assert.equal(point.totalMismatch, true);
  assert.equal(point.menShare! + point.womenShare!, 100);
});

test("null er et gyldig antall, men gir ingen andeler eller vekst fra null", () => {
  const [empty, next] = prepareWorkforceGrowth(dataset([
    { year: 2024, men: 0, women: 0 }, { year: 2025, men: 1, women: 0 },
  ]));
  assert.equal(empty.total, 0);
  assert.equal(empty.womenShare, null);
  assert.equal(next.womenShare, 0);
  assert.equal(next.menShare, 100);
  assert.equal(next.annualChange, null);
  const decline = prepareWorkforceGrowth(dataset([{ year: 2024, men: 4, women: 6 }, { year: 2025, men: 0, women: 0 }]));
  assert.equal(decline[1].annualChange, -100);
});

test("manglende kjønn utledes aldri fra en separat total", () => {
  for (const missing of [undefined, null, NaN, Infinity, -1, 1.5]) {
    const [point] = prepareWorkforceGrowth(dataset([{ year: 2025, men: 10, women: missing, reportedTotal: 15 }]));
    assert.equal(point.women, null);
    assert.equal(point.total, null);
    assert.equal(point.men, 10);
    assert.equal(point.menShare, null);
    assert.equal(workforceValue(point, "men"), 10);
    assert.equal(workforceValue(point, "all"), null);
  }
});

test("sorterer og setter inn manglende år uten å beregne vekst over hullet", () => {
  const points = prepareWorkforceGrowth(dataset([{ year: 2025, men: 20, women: 30 }, { year: 2023, men: 10, women: 20 }]));
  assert.deepEqual(points.map((point) => point.year), [2023, 2024, 2025]);
  assert.equal(points[1].total, null);
  assert.equal(points[2].annualChange, null);
});

test("avviser tvetydige år og ugyldig kvartal, og håndterer tomme data", () => {
  assert.throws(() => prepareWorkforceGrowth(dataset([{ year: 2025 }, { year: 2025 }])));
  assert.throws(() => prepareWorkforceGrowth(dataset([{ year: 2025.5 }])));
  assert.throws(() => prepareWorkforceGrowth({ ...dataset([]), quarter: 5 }));
  assert.deepEqual(prepareWorkforceGrowth(dataset([])), []);
});

test("sammenligner siste kvartal med samme kvartal i tidligere år", () => {
  const result = buildWorkforceGrowthDataset([
    { periodCode: "2024K4", periodLabel: "2024K4", employeesAll: 200 },
    { periodCode: "2025K2", periodLabel: "2025K2", employeesAll: 120, employeesMen: 70, employeesWomen: 50 },
    { periodCode: "2024K2", periodLabel: "2024K2", employeesAll: 100, employeesMen: 60, employeesWomen: 40 },
  ], metadata);
  assert.equal(result.quarter, 2);
  assert.deepEqual(result.points.map((point) => point.year), [2024, 2025]);
  assert.equal(prepareWorkforceGrowth(result)[1].annualChange, 20);
});

test("skalaen starter på null og følger valgt kjønn, også ved små og tomme datasett", () => {
  const points = prepareWorkforceGrowth(dataset([{ year: 2025, men: 9000, women: 1000 }]));
  const all = buildWorkforceScale(points, "all");
  const women = buildWorkforceScale(points, "women");
  assert.equal(all.ticks[0], 0);
  assert.ok(all.maximum >= 10000);
  assert.ok(women.maximum >= 1000 && women.maximum < all.maximum);
  assert.equal(workforceValue(points[0], "women"), 1000);
  for (const maximum of [0, 1, 3, 21, 101, 5000000]) {
    const scale = buildWorkforceScale(prepareWorkforceGrowth(dataset([{ year: 2025, men: maximum, women: 0 }])), "all");
    assert.ok(scale.maximum >= maximum && scale.maximum > 0);
    assert.ok(scale.ticks.every(Number.isInteger));
  }
  assert.ok(buildWorkforceScale([], "all").maximum > 0);
});

test("norsk tallformatering bruker mellomrom og desimalkomma", () => {
  assert.match(formatWorkforceCount(12345), /^12\s345$/u);
  assert.equal(formatWorkforcePercent(12.34), "12,3 %");
  assert.equal(formatWorkforcePercent(-1.25, true, "pp."), "−1,3 pp.");
  assert.equal(formatWorkforcePercent(-0.01, true), "0,0 %");
  assert.equal(formatWorkforceCount(null), "—");
});
