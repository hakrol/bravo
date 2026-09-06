import assert from "node:assert/strict";
import test from "node:test";
import { calculateVernepleierSalary } from "./vernepleier-salary-calculator";
import { vernepleierTariffAgreements } from "./vernepleier-tariffs";

const expectedRates = {
  ks: {
    vernepleier: [545_400, 558_400, 568_600, 620_800, 639_900],
    spesialvernepleier: [586_400, 601_800, 622_000, 647_900, 673_200],
  },
  spekter: {
    "spekter-vernepleier": [522_000, 539_000, 543_000, 567_000, 629_000],
    "spekter-spesialutdanning": [574_000, 598_000, 609_000, 637_000, 718_000],
  },
  oslo: {
    "oslo-vernepleier": [545_150, 545_150, 545_150, 550_050, 550_050, 550_050, 554_750, 559_350, 566_600, 571_000, 576_000, 581_200, 586_800, 592_700, 599_100, 606_200, 614_600],
    "oslo-vernepleierkonsulent": Array.from({ length: 17 }, () => 614_600),
  },
} as const;

test("alle implementerte 2026-satser samsvarer med kontrolltabellen", () => {
  for (const [areaId, agreement] of Object.entries(vernepleierTariffAgreements)) {
    assert.equal(agreement.validFrom, "2026-05-01");
    assert.ok(agreement.sources.some((source) => source.documents === "satser"));

    for (const position of agreement.positions) {
      const expected = expectedRates[areaId as keyof typeof expectedRates][position.id as never];
      assert.deepEqual(position.steps.map((step) => step.annualSalary), expected);
      assert.ok(position.tariffCode.length > 0);
      assert.ok(position.steps.every((step, index) => index === 0 || step.seniorityYears > position.steps[index - 1].seniorityYears));
    }
  }
});

test("beregner månedslønn og bruker nærmeste lavere trinn", () => {
  const result = calculateVernepleierSalary("ks", "vernepleier", 7);
  assert.equal(result?.appliedStepYears, 6);
  assert.equal(result?.annualSalary, 558_400);
  assert.equal(result?.monthlySalary, 46_533);
});

test("avviser ugyldig ansiennitet", () => {
  assert.equal(calculateVernepleierSalary("ks", "vernepleier", -1), null);
  assert.equal(calculateVernepleierSalary("ks", "vernepleier", Number.NaN), null);
});
