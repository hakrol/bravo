import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node sin innebygde TypeScript-kjøring krever filendelsen.
import * as retailTariff from "./retail-tariff.ts";

const {
  calculateRetailShift,
  estimateRetailStep,
  getRetailRateSetForDate,
  retailRateKeys,
  retailTariffRateSets,
  validateRetailTariffData,
  VIRKE_HK_AGREEMENT_ID,
} = retailTariff;

test("datasettet er kronologisk, komplett og uten overlapp", () => {
  assert.deepEqual(validateRetailTariffData(), []);
  for (const set of retailTariffRateSets) {
    assert.equal(set.agreementId, VIRKE_HK_AGREEMENT_ID);
    assert.deepEqual(Object.keys(set.rates), [...retailRateKeys]);
  }
});

test("velger satsen før og på ikrafttredelsesdatoen i 2026", () => {
  assert.equal(getRetailRateSetForDate("2026-03-31")?.rates.step1.monthly, 29987);
  assert.equal(getRetailRateSetForDate("2026-04-01")?.rates.step1.monthly, 31694);
});

test("fanger garantiendringen på trinn 6 fra februar 2026", () => {
  assert.equal(getRetailRateSetForDate("2026-01-31")?.rates.step6.monthly, 41623);
  assert.equal(getRetailRateSetForDate("2026-02-01")?.rates.step6.monthly, 42435.5);
  assert.equal(getRetailRateSetForDate("2026-04-01")?.rates.step6.monthly, 44142);
});

test("bruker alder og deltidspraksis i veiledende innplassering", () => {
  assert.equal(estimateRetailStep({ age: 17, relevantYears: 9, averageWeeklyHours: 37.5, relevantEducationYears: 0, shortStudentJob: false }).key, "under18");
  assert.equal(estimateRetailStep({ age: 25, relevantYears: 0, averageWeeklyHours: 37.5, relevantEducationYears: 0, shortStudentJob: false }).key, "step3");
  assert.equal(estimateRetailStep({ age: 20, relevantYears: 4, averageWeeklyHours: 10, relevantEducationYears: 0, shortStudentJob: false }).key, "step3");
});

test("deler lørdagsvakt korrekt mellom UB-sonene", () => {
  const result = calculateRetailShift({ key: "step1", day: "saturday", startMinutes: 14 * 60, endMinutes: 20 * 60 });
  assert.equal(result.hours, 6);
  assert.equal(result.base, 1170.24);
  assert.equal(result.ub, 430);
  assert.equal(result.total, 1600.24);
});

test("avviser overlapp og fremmed avtale-ID", () => {
  const overlapping = retailTariffRateSets.map((set, index) => index === 0 ? { ...set, effectiveTo: "2017-02-01" } : set);
  assert.match(validateRetailTariffData(overlapping).join(" "), /Overlapp/);
  const foreign = retailTariffRateSets.map((set, index) => index === 0 ? { ...set, agreementId: "nho" as never } : set);
  assert.match(validateRetailTariffData(foreign).join(" "), /Feil avtale-ID/);
});
