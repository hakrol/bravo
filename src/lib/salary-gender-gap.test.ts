import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSalaryGenderGapGeometry, formatGenderGapPercent, getSalaryGenderGap,
  placeSalaryGenderGapValues, prepareSalaryGenderGapPoints, type SalaryGenderGapPoint,
} from "./salary-gender-gap";

test("menns lønn er prosentens referanse i begge retninger", () => {
  const menHigher = getSalaryGenderGap({ year: 2025, men: 60000, women: 55000 });
  assert.equal(menHigher.percent, (5000 / 60000) * 100);
  assert.equal(menHigher.higherGender, "men");
  assert.equal(menHigher.absoluteDifference, 5000);
  const womenHigher = getSalaryGenderGap({ year: 2025, men: 55000, women: 60000 });
  assert.equal(womenHigher.percent, (-5000 / 55000) * 100);
  assert.equal(womenHigher.higherGender, "women");
  assert.equal(womenHigher.difference, -5000);
  assert.equal(formatGenderGapPercent(menHigher.percent), "8,3 %");
  assert.equal(formatGenderGapPercent(womenHigher.percent), "9,1 %");
});

test("lik lønn gir 0 %, ingen differanse og ingen målelinje", () => {
  const [bar] = buildSalaryGenderGapGeometry([{ year: 2020, men: 54000, women: 54000 }], 320).bars;
  assert.equal(bar.gap.higherGender, null);
  assert.equal(bar.gap.percent, 0);
  assert.equal(bar.gapHeight, 0);
  assert.equal(bar.lowY, bar.highY);
  assert.equal(bar.arrowSize, 0);
  assert.equal(formatGenderGapPercent(bar.gap.percent), "0 %");
});

test("små forskjeller beholder riktig geometri og retning, med prosent uten fortegn", () => {
  for (const women of [59999, 60001]) {
    const chart = buildSalaryGenderGapGeometry([{ year: 2025, men: 60000, women }], 320);
    const [bar] = chart.bars;
    assert.ok(bar.gapHeight > 0 && bar.gapHeight < 1);
    assert.ok(Math.abs(bar.gapHeight - (330 / (chart.max - chart.min))) < 1e-9);
    assert.ok(bar.arrowSize * 2 <= bar.gapHeight);
    assert.equal(bar.gap.higherGender, women < 60000 ? "men" : "women");
    assert.equal(formatGenderGapPercent(bar.gap.percent), "0,0 %");
  }
});

test("sorterer og begrenser perioden uten å endre datagrunnlaget", () => {
  const input = Array.from({ length: 12 }, (_, index) => ({ year: 2025 - index, men: 60000, women: 58000 }));
  const prepared = prepareSalaryGenderGapPoints(input);
  assert.deepEqual(prepared.map((point) => point.year), Array.from({ length: 10 }, (_, index) => 2016 + index));
  assert.equal(input[0].year, 2025);
  assert.deepEqual(prepareSalaryGenderGapPoints([]), []);
});

test("avviser duplikate år og ugyldige lønninger", () => {
  for (const value of [0, -1, NaN, Infinity]) {
    assert.throws(() => prepareSalaryGenderGapPoints([{ year: 2025, men: value, women: 55000 }]));
    assert.throws(() => prepareSalaryGenderGapPoints([{ year: 2025, men: 55000, women: value }]));
  }
  assert.throws(() => prepareSalaryGenderGapPoints([{ year: 2025, men: 55000, women: 54000 }, { year: 2025, men: 56000, women: 54000 }]));
  assert.throws(() => prepareSalaryGenderGapPoints([{ year: 2025.5, men: 55000, women: 54000 }]));
});

test("ti år får plass på mobil, i blogg og på utviklingssiden uten horisontal scrolling", () => {
  const points = Array.from({ length: 10 }, (_, index) => ({
    year: 2016 + index, men: 48000 + index * 2200, women: 45500 + index * 2400,
  }));
  for (const width of [280, 320, 375, 440, 640, 718, 766, 768, 960]) {
    const chart = buildSalaryGenderGapGeometry(points, width);
    assert.equal(chart.width, width, "diagrammet skal ikke være bredere enn beholderen");
    assert.equal(chart.bars.length, 10);
    for (const bar of chart.bars) {
      assert.ok(bar.x - chart.barWidth / 2 > chart.margin.left);
      assert.ok(bar.measureX + bar.arrowSize < width - chart.margin.right);
    }
    if (width <= 768) {
      assert.ok(chart.barWidth < 28.8, "stolpene skal krympe fra den gamle minimumsbredden");
      assert.ok(chart.slotWidth - chart.barWidth < 43.2, "også mellomrommet skal krympe");
    }
  }
});

for (const count of [1, 5, 10]) {
  test(`${count} år: stolpehøyder, avkorting, luft og etiketter ved alle bredder`, () => {
    const points: SalaryGenderGapPoint[] = Array.from({ length: count }, (_, index) => ({
      year: 2016 + index, men: 48000 + index * 2200,
      women: 48000 + index * 2200 + (index % 3 === 0 ? -2800 : index % 3 === 1 ? 1600 : 0),
    }));
    for (const width of [280, 320, 440, 768, 1100]) {
      const chart = buildSalaryGenderGapGeometry(points, width);
      assert.equal(chart.bars.length, count);
      assert.ok(chart.min > 0 && chart.min < Math.min(...points.flatMap((point) => [point.men, point.women])));
      assert.ok(chart.max > Math.max(...points.flatMap((point) => [point.men, point.women])));
      assert.ok(chart.ticks.length >= 3 && chart.ticks.length <= 8);
      assert.equal(chart.ticks[0], chart.min);
      assert.equal(chart.ticks.at(-1), chart.max);
      for (const [index, bar] of chart.bars.entries()) {
        const high = Math.max(points[index].men, points[index].women);
        const low = Math.min(points[index].men, points[index].women);
        const totalHeight = bar.baseHeight + bar.gapHeight;
        const expectedHeight = ((high - chart.min) / (chart.max - chart.min)) * chart.plotHeight;
        assert.ok(Math.abs(totalHeight - expectedHeight) < 1e-8);
        assert.equal(bar.highY, chart.y(high));
        assert.equal(bar.lowY, chart.y(low));
        assert.equal(bar.gapHeight, chart.y(low) - chart.y(high));
        assert.ok(bar.percentY >= chart.margin.top);
        assert.ok(bar.measureX > bar.x + chart.barWidth / 2);
        assert.ok(bar.measureX < bar.x + chart.slotWidth / 2);
        if (!chart.compactLabels) {
          const halfLabelWidth = formatGenderGapPercent(bar.gap.percent).length * 7.5 / 2;
          assert.ok(bar.x + 3 - halfLabelWidth > bar.x - chart.slotWidth / 2);
          assert.ok(bar.x + 3 + halfLabelWidth < bar.x + chart.slotWidth / 2);
        }
      }
    }
  });
}

test("lønnsverdier holder seg innenfor synlig bredde og over stolper og prosentetiketter", () => {
  for (const count of [1, 5, 10]) {
    const points = Array.from({ length: count }, (_, index) => ({
      year: 2016 + index, men: 48000 + index * 2200,
      women: 48000 + index * 2200 + (index % 3 === 0 ? -2800 : index % 3 === 1 ? 1600 : 0),
    }));
    for (const width of [280, 320, 768, 1100]) {
      const chart = buildSalaryGenderGapGeometry(points, width);
      const maxScroll = Math.max(0, chart.width - width);
      for (const scroll of [0, maxScroll / 2, maxScroll]) {
        for (const active of chart.bars) {
          const labels = placeSalaryGenderGapValues(chart, active.point.year, { left: scroll, width });
          if (active.x + chart.barWidth / 2 <= scroll || active.x - chart.barWidth / 2 >= scroll + width) {
            assert.equal(labels, null);
            continue;
          }
          assert.ok(labels);
          assert.ok(labels.left >= Math.max(chart.margin.left, scroll) + 8);
          assert.ok(labels.right <= Math.min(chart.width - chart.margin.right, scroll + width) - 8);
          assert.ok(labels.top >= 28, "verdiene må ikke dekke sammendraget øverst");
          assert.ok(Math.max(labels.menY, labels.womenY) < active.highY);
          assert.ok(active.point.women > active.point.men
            ? labels.womenY < labels.menY : labels.menY < labels.womenY,
          "høyeste lønn skal stå øverst; lik lønn beholder stabil rekkefølge");
          assert.equal(labels.menText.replace(/[^0-9]/g, ""), String(active.point.men));
          assert.equal(labels.womenText.replace(/[^0-9]/g, ""), String(active.point.women));
          for (const other of chart.bars) {
            const halfWidth = formatGenderGapPercent(other.gap.percent).length * 7.5 / 2 + 4;
            if (labels.left < other.x + 3 + halfWidth && labels.right > other.x + 3 - halfWidth) {
              assert.ok(labels.bottom <= other.percentY - 20);
            }
            if (labels.left < other.x + chart.barWidth / 2 && labels.right > other.x - chart.barWidth / 2) {
              assert.ok(labels.bottom <= other.highY - 8);
            }
          }
        }
      }
    }
  }
});
