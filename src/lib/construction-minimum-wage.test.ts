import assert from "node:assert/strict";
import test from "node:test";
import { constructionMinimumWageRates, getConstructionMinimumWageForDate, validateConstructionMinimumWageRates } from "./construction-minimum-wage";

test("byggdatasettet har gyldige perioder og kilder", () => {
  assert.deepEqual(validateConstructionMinimumWageRates(), []);
});

test("velger riktig sats rundt endringen i 2025", () => {
  assert.equal(getConstructionMinimumWageForDate("2025-06-14")?.skilledRate, 250.3);
  assert.equal(getConstructionMinimumWageForDate("2025-06-15")?.skilledRate, 264.32);
});

test("foreslått sats kan aldri bli gjeldende sats", () => {
  assert.equal(getConstructionMinimumWageForDate("2026-09-27")?.skilledRate, 264.32);
  assert.equal(constructionMinimumWageRates.at(-1)?.status, "proposed");
});

test("bevarer den åtte dager lange perioden i 2017", () => {
  assert.equal(getConstructionMinimumWageForDate("2017-06-08")?.unskilledOneYearRate, 185.8);
  assert.equal(getConstructionMinimumWageForDate("2017-06-09")?.unskilledOneYearRate, 185.5);
});
