import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateRateChange,
  electricianMinimumWageRates,
  getElectricianMinimumWageForDate,
  validateElectricianMinimumWageRates,
} from "./electrician-minimum-wage";

test("datasettet har gyldige, ikke-overlappende perioder og komplette kilder", () => {
  assert.deepEqual(validateElectricianMinimumWageRates(), []);
});

test("velger gammel sats dagen før endringen i 2025", () => {
  const rate = getElectricianMinimumWageForDate("2025-06-14");
  assert.equal(rate?.skilledRate, 257.79);
  assert.equal(rate?.otherRate, 229.11);
});

test("velger ny sats på ikrafttredelsesdagen i 2025", () => {
  const rate = getElectricianMinimumWageForDate("2025-06-15");
  assert.equal(rate?.skilledRate, 270.45);
  assert.equal(rate?.otherRate, 241.77);
});

test("kun én sats kan gjelde på hver dokumenterte grensedato", () => {
  for (const rate of electricianMinimumWageRates) {
    assert.equal(getElectricianMinimumWageForDate(rate.effectiveFrom), rate);
    if (rate.effectiveTo) {
      assert.equal(getElectricianMinimumWageForDate(rate.effectiveTo), rate);
    }
  }
});

test("beregner prosentvis endring fra forrige sats", () => {
  const previous = electricianMinimumWageRates.at(-2);
  const current = electricianMinimumWageRates.at(-1);
  assert.ok(previous && current);

  const change = calculateRateChange(current, previous);
  assert.ok(change);
  assert.equal(Number(change.amount.toFixed(2)), 12.66);
  assert.equal(Number(change.percent.toFixed(1)), 4.9);
});

test("avviser et overlappende datasett", () => {
  const invalid = electricianMinimumWageRates.map((rate, index) =>
    index === 0 ? { ...rate, effectiveTo: "2017-06-01" } : rate,
  );
  assert.match(validateElectricianMinimumWageRates(invalid).join(" "), /Overlapp/);
});
