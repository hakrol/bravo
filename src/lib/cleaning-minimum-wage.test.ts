import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateCleaningRateChange,
  cleaningImplementedMinimumWageRates,
  cleaningMinimumWageRates,
  getCleaningMinimumWageForDate,
  validateCleaningMinimumWageRates,
} from "./cleaning-minimum-wage";

test("datasettet har gyldige perioder, satser og kilder", () => {
  assert.deepEqual(validateCleaningMinimumWageRates(), []);
});

const boundaries = [
  ["2017-05-31", 169.37], ["2017-06-01", 177.63],
  ["2018-11-30", 177.63], ["2018-12-01", 181.43],
  ["2021-06-30", 187.66], ["2021-07-01", 196.04],
  ["2022-12-14", 196.04], ["2022-12-15", 204.54],
  ["2023-06-14", 204.54], ["2023-06-15", 216.04],
  ["2024-10-31", 216.04], ["2024-11-01", 227.54],
  ["2025-06-14", 227.54], ["2025-06-15", 236.54],
] as const;

for (const [date, expected] of boundaries) {
  test(`velger riktig sats ${date}`, () => assert.equal(getCleaningMinimumWageForDate(date)?.adultRate, expected));
}

test("foreslått sats kan aldri returneres som dagens sats", () => {
  assert.equal(getCleaningMinimumWageForDate("2026-09-20")?.adultRate, 236.54);
  assert.equal(cleaningMinimumWageRates.find((rate) => rate.status === "proposed")?.adultRate, 247.29);
});

test("beregner siste prosentendring korrekt", () => {
  const previous = cleaningImplementedMinimumWageRates.at(-2);
  const current = cleaningImplementedMinimumWageRates.at(-1);
  assert.ok(previous && current);
  const change = calculateCleaningRateChange(current, previous);
  assert.equal(Number(change?.amount.toFixed(2)), 9);
  assert.equal(Number(change?.percent.toFixed(1)), 4);
});

test("avviser overlapp", () => {
  const invalid = cleaningMinimumWageRates.map((rate, index) => index === 0 ? { ...rate, effectiveTo: "2017-06-01" } : rate);
  assert.match(validateCleaningMinimumWageRates(invalid).join(" "), /Overlapp/);
});
