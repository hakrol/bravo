import assert from "node:assert/strict";
import test from "node:test";
import { getAgricultureMinimumWageForDate, validateAgricultureMinimumWageRates } from "./agriculture-minimum-wage";

test("jordbruksdatasettet har gyldige perioder, satser og kilder", () => {
  assert.deepEqual(validateAgricultureMinimumWageRates(), []);
});

test("velger riktig sats på periodegrensene", () => {
  assert.equal(getAgricultureMinimumWageForDate("2024-10-31")?.permanentUnskilledRate, 164.8);
  assert.equal(getAgricultureMinimumWageForDate("2024-11-01")?.permanentUnskilledRate, 175.8);
  assert.equal(getAgricultureMinimumWageForDate("2025-06-14")?.permanentUnskilledRate, 175.8);
  assert.equal(getAgricultureMinimumWageForDate("2025-06-15")?.permanentUnskilledRate, 182.8);
  assert.equal(getAgricultureMinimumWageForDate("2026-09-27")?.permanentUnskilledRate, 182.8);
});
