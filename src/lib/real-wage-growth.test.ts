import assert from "node:assert/strict";
import test from "node:test";
import vekterSnapshot from "../content/blog/data/vektere-interaktiv-lonnsutvikling-2025.json";
import { adjustSalaryPointsForInflation } from "./salary-inflation";
import {
  buildRealWageGeometry, calculateCumulativeRealWageGrowth, calculateRealWageGrowth, formatRealWageBarPercent, formatRealWagePercent,
  prepareRealWageGrowth, realWageExplanation, type RealWageDataset,
} from "./real-wage-growth";

const baseline = { year: 2024, women: 50000, men: 60000, cpi: 100 };
const dataset: RealWageDataset = {
  title: "Test", source: "Testdata", baseline,
  points: [{ year: 2025, women: 53000, men: 61200, cpi: 104 }],
};

test("bruker forholdstall fremfor å trekke KPI direkte fra nominell vekst", () => {
  const [women, men] = prepareRealWageGrowth(dataset)[0];
  assert.ok(Math.abs(women.realGrowth! - (1.06 / 1.04 - 1) * 100) < 1e-10);
  assert.ok(Math.abs(men.realGrowth! - (1.02 / 1.04 - 1) * 100) < 1e-10);
  assert.equal(women.inflation, men.inflation);
  assert.ok(Math.abs(women.nominalGrowth! - 6) < 1e-10);
  assert.ok(Math.abs(men.nominalGrowth! - 2) < 1e-10);
  assert.equal(formatRealWagePercent(women.realGrowth), "+1,9 %");
  assert.equal(formatRealWagePercent(men.realGrowth), "−1,9 %");
});

test("lik nominell vekst og prisvekst gir nøyaktig null", () => {
  assert.equal(calculateRealWageGrowth(1.3, 1.3), 0);
  assert.equal(calculateRealWageGrowth(0, 0), 0);
  assert.equal(formatRealWagePercent(0), "0 %");
  assert.equal(calculateRealWageGrowth(4, -100), null);
  assert.equal(calculateRealWageGrowth(Infinity, 3), null);
  const observation = { ...prepareRealWageGrowth(dataset)[0][0], realGrowth: 0 };
  assert.ok(realWageExplanation(observation).includes("uendret"));
});

test("samlet median følger året for begge kjønn uten å endre lønnsveksten", () => {
  const original = prepareRealWageGrowth(dataset)[0];
  for (const median of [53400, null, undefined, 0, -1, NaN, Infinity]) {
    const observations = prepareRealWageGrowth({ ...dataset, points: [{ ...dataset.points[0], median }] })[0];
    observations.forEach((point, index) => {
      assert.equal(point.median, median === 53400 ? 53400 : null);
      assert.equal(point.salary, original[index].salary);
      assert.equal(point.nominalGrowth, original[index].nominalGrowth);
      assert.equal(point.realGrowth, original[index].realGrowth);
    });
  }
  const missingWomen = prepareRealWageGrowth({ ...dataset, points: [{ ...dataset.points[0], women: null, median: 53400 }] })[0];
  assert.ok(missingWomen.every((point) => point.median === 53400));
  assert.equal(missingWomen[0].salary, null);
});

test("kompakte stolpeetiketter beholder fortegn, prosent og manglende data", () => {
  assert.equal(formatRealWageBarPercent(1.2), "+1,2%");
  assert.equal(formatRealWageBarPercent(-1.2), "−1,2%");
  assert.equal(formatRealWageBarPercent(0), "0%");
  assert.equal(formatRealWageBarPercent(null), "—");
  assert.equal(formatRealWagePercent(1.2), "+1,2 %");
});

test("håndterer deflasjon med riktig fortegn og forklaring", () => {
  const growth = calculateRealWageGrowth(-1, -2);
  assert.ok(growth! > 0);
  assert.ok(Math.abs(growth! - (0.99 / 0.98 - 1) * 100) < 1e-10);
  const observation = { ...prepareRealWageGrowth(dataset)[0][0], realGrowth: growth };
  assert.ok(realWageExplanation(observation).includes("sterkere enn prisene"));
});

test("manglende lønn påvirker bare riktig kjønn, mens KPI påvirker begge", () => {
  const missingWomen = prepareRealWageGrowth({ ...dataset, points: [{ ...dataset.points[0], women: null }] })[0];
  assert.equal(missingWomen[0].realGrowth, null);
  assert.notEqual(missingWomen[1].realGrowth, null);
  assert.equal(missingWomen[0].salary, null);
  assert.equal(formatRealWagePercent(null), "—");
  for (const cpi of [null, undefined, NaN, Infinity, 0, -1]) {
    const observations = prepareRealWageGrowth({ ...dataset, points: [{ ...dataset.points[0], cpi }] })[0];
    assert.ok(observations.every((point) => point.realGrowth === null));
    assert.ok(realWageExplanation(observations[0]).includes("KPI"));
  }
});

test("mangler baseline eller kalenderår gir ikke flerårig vekst eller falske nuller", () => {
  assert.ok(prepareRealWageGrowth({ ...dataset, baseline: undefined })[0].every((point) => point.realGrowth === null));
  const missingYear = prepareRealWageGrowth({ ...dataset, points: [{ ...dataset.points[0], year: 2026 }] })[0];
  assert.ok(missingYear.every((point) => point.realGrowth === null));
  assert.deepEqual(prepareRealWageGrowth({ ...dataset, points: [] }), []);
});

test("sorterer og bruker historikk før de ti visningsårene uten å mutere input", () => {
  const points = Array.from({ length: 12 }, (_, index) => ({ year: 2025 - index, women: 60000, men: 65000, cpi: 100 }));
  const years = prepareRealWageGrowth({ ...dataset, baseline: undefined, points });
  assert.deepEqual(years.map((points) => points[0].year), Array.from({ length: 10 }, (_, index) => 2016 + index));
  assert.ok(years.flat().every((point) => point.realGrowth === 0));
  assert.equal(points[0].year, 2025);
  assert.throws(() => prepareRealWageGrowth({ ...dataset, points: [dataset.points[0], dataset.points[0]] }));
});

function growthHistory(women: (number | null)[], men: (number | null)[], firstYear = 2016) {
  return women.map((rate, index) => prepareRealWageGrowth(dataset)[0].map((point) => ({
    ...point, year: firstYear + index, realGrowth: point.gender === "women" ? rate : men[index],
  })));
}

test("fem og ti årganger bruker fire og ni års endring, separat for kjønnene", () => {
  const years = growthHistory(Array(10).fill(10), Array(10).fill(-2));
  const women5 = calculateCumulativeRealWageGrowth(years, "women", 5)!;
  const women10 = calculateCumulativeRealWageGrowth(years, "women", 10)!;
  const men5 = calculateCumulativeRealWageGrowth(years, "men", 5)!;
  assert.ok(Math.abs(women5.value - ((1.1 ** 4 - 1) * 100)) < 1e-9);
  assert.ok(Math.abs(women10.value - ((1.1 ** 9 - 1) * 100)) < 1e-8);
  assert.ok(Math.abs(men5.value - ((0.98 ** 4 - 1) * 100)) < 1e-9);
  assert.deepEqual({ from: women5.startYear, to: women5.endYear }, { from: 2021, to: 2025 });
  assert.deepEqual({ from: women10.startYear, to: women10.endYear }, { from: 2016, to: 2025 });
});

test("pluss og minus utligner ikke hverandre aritmetisk; nullvekst er et gyldig nøkkeltall", () => {
  const years = growthHistory([null, 10, -10, 0, 0], [null, 0, 0, 0, 0], 2021);
  assert.ok(Math.abs(calculateCumulativeRealWageGrowth(years, "women", 5)!.value - (-1)) < 1e-9);
  assert.equal(calculateCumulativeRealWageGrowth(years, "men", 5)!.value, 0);
  assert.equal(calculateCumulativeRealWageGrowth(years, "women", 10), null);
});

test("krever fem eller ti sammenhengende årganger, uten å fylle hull", () => {
  const years = growthHistory(Array(10).fill(2), Array(10).fill(3));
  assert.equal(calculateCumulativeRealWageGrowth(years.slice(-4), "women", 5), null);
  assert.notEqual(calculateCumulativeRealWageGrowth(years.slice(-5), "women", 5), null);
  assert.equal(calculateCumulativeRealWageGrowth(years.slice(-9), "women", 10), null);
  const missingYear = years.filter((points) => points[0].year !== 2022);
  assert.equal(calculateCumulativeRealWageGrowth(missingYear, "women", 5), null);
  assert.equal(calculateCumulativeRealWageGrowth(missingYear, "women", 10), null);
  assert.equal(calculateCumulativeRealWageGrowth([], "women", 5), null);
});

test("felles siste vekstår gir sammenlignbare perioder og tillater tall for bare ett kjønn", () => {
  const women = Array(10).fill(2);
  women[9] = null;
  const years = growthHistory(women, Array(10).fill(3));
  assert.equal(calculateCumulativeRealWageGrowth(years, "women", 5), null,
    "skal ikke hoppe tilbake til en eldre fullstendig periode for kvinner");
  assert.equal(calculateCumulativeRealWageGrowth(years, "women", 10), null);
  assert.equal(calculateCumulativeRealWageGrowth(years, "men", 5)!.endYear, 2025);
  assert.notEqual(calculateCumulativeRealWageGrowth(years, "men", 10), null);
  for (const invalid of [null, NaN, Infinity, -100]) {
    years[7][0].realGrowth = invalid;
    assert.equal(calculateCumulativeRealWageGrowth(years, "women", 5), null);
  }
});

test("perioder slutter ved siste tilgjengelige vekstår, med eldre historikk ved behov", () => {
  const points = Array.from({ length: 16 }, (_, index) => ({
    year: 2010 + index, women: index === 15 ? null : 50000, men: index === 15 ? null : 60000, cpi: 100,
  }));
  const input = { ...dataset, baseline: undefined, points };
  const history = prepareRealWageGrowth(input, { includeHistory: true });
  assert.equal(prepareRealWageGrowth(input).length, 10);
  assert.equal(history.length, 16);
  const cumulative = calculateCumulativeRealWageGrowth(history, "women", 10)!;
  assert.equal(cumulative.value, 0);
  assert.equal(cumulative.startYear, 2015);
  assert.equal(cumulative.endYear, 2024);
});

test("vekternes reallønnsoppsummering samsvarer med inflasjonsjustert lønnsutvikling", () => {
  const input: RealWageDataset = {
    title: "Vektere", source: vekterSnapshot.source,
    baseline: vekterSnapshot.realWageBaseline,
    points: vekterSnapshot.points.map((point, index) => ({
      year: point.year, women: vekterSnapshot.womenPoints[index].value,
      men: vekterSnapshot.menPoints[index].value, cpi: vekterSnapshot.inflation.points[index].value,
    })),
  };
  // Oppsummeringen må også virke uten året før første visningsår.
  for (const baseline of [input.baseline, undefined]) {
    const history = prepareRealWageGrowth({ ...input, baseline }, { includeHistory: true });
    for (const [gender, salaryPoints] of [["women", vekterSnapshot.womenPoints], ["men", vekterSnapshot.menPoints]] as const) {
      const adjusted = adjustSalaryPointsForInflation(salaryPoints, vekterSnapshot.inflation.points, 2025)!;
      for (const period of [5, 10] as const) {
        const summary = calculateCumulativeRealWageGrowth(history, gender, period)!;
        const start = adjusted.at(-period)!;
        const end = adjusted.at(-1)!;
        assert.equal(summary.startYear, start.year);
        assert.equal(summary.endYear, end.year);
        assert.ok(Math.abs(summary.value - (end.value / start.value - 1) * 100) < 1e-10);
      }
    }
    assert.equal(formatRealWagePercent(calculateCumulativeRealWageGrowth(history, "women", 10)!.value), "−0,6 %");
    assert.equal(formatRealWagePercent(calculateCumulativeRealWageGrowth(history, "men", 10)!.value), "−0,9 %");
  }
});

for (const mode of ["mixed", "positive", "negative", "zero", "missing"] as const) {
  test(`${mode}: nullinje, stolpehøyder og etiketter ved 1, 5 og 10 år`, () => {
    for (const count of [1, 5, 10]) {
      const years = Array.from({ length: count }, (_, index) => prepareRealWageGrowth(dataset)[0].map((point, gender) => ({
        ...point, year: 2016 + index,
        realGrowth: mode === "zero" ? 0 : mode === "missing" ? null
          : mode === "positive" ? 1.2 + gender * 0.05 : mode === "negative" ? -1.2 - gender * 0.05
          : (index % 2 ? 1 : -1) * (1.2 + gender * 0.05),
      })));
      for (const width of [280, 320, 440, 718, 766, 1100]) {
        const chart = buildRealWageGeometry(years, width);
        assert.ok(chart.min < 0 && chart.max > 0);
        assert.ok(chart.ticks.includes(0));
        assert.ok(chart.zeroY > chart.margin.top && chart.zeroY < chart.margin.top + chart.plotHeight);
        assert.equal(chart.bars.length, count * 2);
        assert.equal(chart.yearZones.length, count);
        if (width >= 718) assert.equal(chart.width, width);
        chart.yearZones.forEach((zone, index) => {
          const [women, men] = chart.bars.slice(index * 2, index * 2 + 2);
          assert.equal(zone.year, women.observation.year);
          assert.equal(zone.y, chart.margin.top);
          assert.equal(zone.width, chart.slotWidth);
          assert.ok(zone.height > chart.plotHeight + 48, "årssonen skal dekke både plottet og årstallet");
          assert.ok(Math.abs((women.x + men.x) / 2 - zone.centerX) < 1e-9);
          assert.ok(women.x - chart.barWidth / 2 > zone.x);
          assert.ok(men.x + chart.barWidth / 2 < zone.x + zone.width);
          const innerGap = men.x - women.x - chart.barWidth;
          assert.ok(innerGap < 10, "stolpene innenfor året skal stå tettere enn før");
          if (index > 0) {
            const previousMan = chart.bars[index * 2 - 1];
            const betweenYears = women.x - previousMan.x - chart.barWidth;
            assert.ok(betweenYears >= innerGap + 2 - 1e-9, "mer luft mellom år enn mellom kjønn");
            assert.ok(Math.abs(zone.x - (chart.yearZones[index - 1].x + zone.width)) < 1e-9);
          }
        });
        for (const bar of chart.bars) {
          const value = bar.observation.realGrowth ?? 0;
          assert.ok(Math.abs(bar.height - Math.abs(value) / (chart.max - chart.min) * chart.plotHeight) < 1e-9);
          assert.ok(bar.labelY - chart.fontSize >= 8);
          assert.ok(bar.labelY <= chart.margin.top + chart.plotHeight + 20);
          if (value > 0) assert.ok(bar.top < chart.zeroY && bar.labelY < bar.endY);
          if (value < 0) assert.ok(bar.top === chart.zeroY && bar.labelY > bar.endY);
          if (value === 0) assert.equal(bar.height, 0);
          assert.equal(bar.labelY, bar.endY + (value < 0 ? chart.fontSize + 8 : -8),
            "etiketten skal alltid ligge tett ved sin egen stolpeende");
          assert.ok(chart.barWidth > Math.min(24, chart.slotWidth * 0.22), "stolpene skal være bredere enn før");
          for (const other of chart.bars) {
            if (bar === other) continue;
            assert.ok(Math.abs(bar.x - other.x) >= (bar.labelWidth + other.labelWidth) / 2 + 2
              || Math.abs(bar.labelY - other.labelY) >= chart.fontSize + 6);
            if (other.height > 0 && Math.abs(bar.x - other.x) < bar.labelWidth / 2 + chart.barWidth / 2) {
              assert.ok(bar.labelY + 3 < other.top || bar.labelY - chart.fontSize > other.top + other.height + 3,
                "prosentetiketten må ikke dekke nabostolpen");
            }
          }
          // Symbolrekken ligger under alle prosentetikettene.
          assert.ok(bar.labelY < chart.margin.top + chart.plotHeight + 23 - 10);
        }
      }
    }
  });
}
