import assert from "node:assert/strict";
import test from "node:test";
import { getRestaurantMinimumWageForDate, restaurantMinimumWageRates, validateRestaurantMinimumWageRates } from "./restaurant-minimum-wage";

test("restaurantdatasettet har gyldige perioder, satser og kilder", () => {
  assert.deepEqual(validateRestaurantMinimumWageRates(), []);
});

test("velger riktig sats på periodegrensene", () => {
  assert.equal(getRestaurantMinimumWageForDate("2017-12-31"), null);
  assert.equal(getRestaurantMinimumWageForDate("2018-01-01")?.adultRate, 157.18);
  assert.equal(getRestaurantMinimumWageForDate("2018-11-30")?.adultRate, 157.18);
  assert.equal(getRestaurantMinimumWageForDate("2018-12-01")?.adultRate, 161.87);
  assert.equal(getRestaurantMinimumWageForDate("2019-05-31")?.adultRate, 161.87);
  assert.equal(getRestaurantMinimumWageForDate("2019-06-01")?.adultRate, 167.9);
  assert.equal(getRestaurantMinimumWageForDate("2021-06-30")?.adultRate, 167.9);
  assert.equal(getRestaurantMinimumWageForDate("2021-07-01")?.adultRate, 175.47);
  assert.equal(getRestaurantMinimumWageForDate("2022-12-14")?.adultRate, 175.47);
  assert.equal(getRestaurantMinimumWageForDate("2022-12-15")?.adultRate, 179.94);
  assert.equal(getRestaurantMinimumWageForDate("2023-06-14")?.adultRate, 179.94);
  assert.equal(getRestaurantMinimumWageForDate("2023-06-15")?.adultRate, 190.79);
  assert.equal(getRestaurantMinimumWageForDate("2024-10-31")?.adultRate, 190.79);
  assert.equal(getRestaurantMinimumWageForDate("2024-11-01")?.adultRate, 197.79);
  assert.equal(getRestaurantMinimumWageForDate("2025-06-14")?.adultRate, 197.79);
  assert.equal(getRestaurantMinimumWageForDate("2025-06-15")?.adultRate, 204.79);
});

test("foreslått 2026-sats returneres aldri som gjeldende sats", () => {
  assert.equal(getRestaurantMinimumWageForDate("2026-09-26")?.adultRate, 204.79);
  assert.equal(restaurantMinimumWageRates.find((rate) => rate.status === "proposed")?.adultRate, 215.29);
});
