import assert from "node:assert/strict";
import test from "node:test";
import { calculateOvertimePay, calculateRealWage } from "./forklarer-calculators";

test("prisjusterer lønnen og skiller reallønnsvekst fra prosentpoeng", () => {
  const result = calculateRealWage(50000, 52500, 3)!;
  assert.equal(Math.round(result.adjustedSalary), 50971);
  assert.equal(result.growthPercent.toFixed(1), "1.9");
});

test("håndterer uendret kjøpekraft, fall, deflasjon og bortfall av lønn", () => {
  assert.equal(calculateRealWage(50000, 51500, 3)!.growthPercent, 0);
  assert.equal(calculateRealWage(50000, 50000, 5)!.growthPercent.toFixed(1), "-4.8");
  assert.equal(calculateRealWage(50000, 50000, -5)!.growthPercent.toFixed(1), "5.3");
  assert.equal(calculateRealWage(50000, 0, 3)!.growthPercent, -100);
});

test("avviser ugyldig prisjustering og beregninger uten endelig resultat", () => {
  for (const args of [[0, 52500, 3], [-1, 52500, 3], [50000, -1, 3], [50000, 52500, -100], [50000, 52500, -101], [NaN, 52500, 3], [50000, Infinity, 3], [1, Number.MAX_VALUE, -99]]) {
    assert.equal(calculateRealWage(...args as [number, number, number]), null);
  }
});

test("skiller grunnbetaling fra overtidstillegg", () => {
  assert.deepEqual(calculateOvertimePay(250, 2, 40), { basePay: 500, supplement: 200, total: 700 });
  assert.deepEqual(calculateOvertimePay(250, 2.5, 50), { basePay: 625, supplement: 312.5, total: 937.5 });
  assert.deepEqual(calculateOvertimePay(250, 2, 100), { basePay: 500, supplement: 500, total: 1000 });
  assert.deepEqual(calculateOvertimePay(250, 0, 40), { basePay: 0, supplement: 0, total: 0 });
});

test("avviser negative timer, tillegg under minstesatsen og ugyldige tall", () => {
  for (const args of [[-1, 2, 40], [250, -1, 40], [250, 2, 39], [250, NaN, 40], [250, 2, Infinity], [Number.MAX_VALUE, 2, 40]]) {
    assert.equal(calculateOvertimePay(...args as [number, number, number]), null);
  }
});
