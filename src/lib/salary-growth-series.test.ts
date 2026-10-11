import assert from "node:assert/strict";
import test from "node:test";
import { findClosestSalaryGrowthSeries } from "./salary-growth-series";

test("finner kjønnslinjen mellom årspunktene", () => {
  const series = [
    { key: "all" as const, points: [{ x: 0, y: 60 }, { x: 100, y: 60 }] },
    { key: "women" as const, points: [{ x: 0, y: 40 }, { x: 100, y: 40 }] },
    { key: "men" as const, points: [{ x: 0, y: 80 }, { x: 100, y: 80 }] },
  ];
  const women = findClosestSalaryGrowthSeries(series, { x: 30, y: 41 }, "all");
  assert.equal(women?.key, "women");
  assert.equal(women?.index, 0);
  assert.equal(women?.distance, 1);
  const men = findClosestSalaryGrowthSeries(series, { x: 70, y: 81 }, "all");
  assert.equal(men?.key, "men");
  assert.equal(men?.index, 1);
  assert.equal(men?.distance, 1);
});

test("beholder fokus der kurvene krysser hverandre", () => {
  const series = [
    { key: "women" as const, points: [{ x: 0, y: 0 }, { x: 100, y: 100 }] },
    { key: "men" as const, points: [{ x: 0, y: 100 }, { x: 100, y: 0 }] },
  ];
  assert.equal(findClosestSalaryGrowthSeries(series, { x: 50, y: 50 }, "men")?.key, "men");
  assert.equal(findClosestSalaryGrowthSeries(series, { x: 50, y: 50 }, "women")?.key, "women");
  assert.equal(findClosestSalaryGrowthSeries(series, { x: 75, y: 25 }, "women")?.key, "men");
});

test("støtter tomme serier, enkeltpunkter og pekere langt fra linjene", () => {
  assert.equal(findClosestSalaryGrowthSeries([], { x: 0, y: 0 }, "all"), null);
  const series = [{ key: "all" as const, points: [{ x: 10, y: 20 }] }];
  assert.equal(findClosestSalaryGrowthSeries(series, { x: 10, y: 20 }, "all")?.distance, 0);
  assert.ok(findClosestSalaryGrowthSeries(series, { x: 10, y: 60 }, "all")!.distance > 24);
});
