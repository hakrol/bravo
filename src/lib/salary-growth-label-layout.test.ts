import assert from "node:assert/strict";
import test from "node:test";
import { placeSalaryGrowthLabels } from "./salary-growth-label-layout";

const scenarios = {
  stigende: [42000, 43200, 44900, 46700, 47200, 49500, 52400, 55600, 58700, 61800],
  inflasjonsjustert: [56000, 56471, 57197, 58229, 57914, 58929, 58876, 59465, 60515, 61800],
  fallende: [61800, 58700, 55600, 52400, 49500, 47200, 46700, 44900, 43200, 42000],
  flatt: Array.from({ length: 10 }, () => 50000),
  topper: [42000, 61000, 45000, 59000, 46000, 62000, 43000, 60000, 44000, 58000],
};

test("beløpsetiketter unngår alle tre kjønnskurvene", () => {
  const curves = [0, 18, -18].map((offset) => Array.from({ length: 10 }, (_, index) => ({
    x: 80 + index * 68,
    y: 300 - index * 24 + offset,
    text: "61 800 kr",
  })));
  for (const points of curves) {
    for (let active = 0; active < points.length; active += 1) {
      const indexes = active === 9 ? [9] : [9, active];
      const labels = placeSalaryGrowthLabels({
        points, indexes, obstacleCurves: curves,
        bounds: { left: 88, right: 684, top: 40, bottom: 348 }, fontSize: 14,
      });
      assert.equal(labels.length, indexes.length);
      for (const label of labels) for (const curve of curves) {
        for (let segment = 1; segment < curve.length; segment += 1) {
          const first = curve[segment - 1];
          const last = curve[segment];
          for (let sample = 0; sample <= 100; sample += 1) {
            const x = first.x + (last.x - first.x) * sample / 100;
            const y = first.y + (last.y - first.y) * sample / 100;
            assert.ok(x < label.left - 8 || x > label.left + label.width + 8
              || y < label.top - 8 || y > label.top + label.height + 8);
          }
        }
      }
    }
  }
});

for (const [name, values] of Object.entries(scenarios)) {
  test(`beløp unngår kurven og hverandre: ${name}`, () => {
    for (const width of [280, 320, 390, 440, 720]) {
      const left = width < 440 ? 72 : 80;
      const right = width - (width < 440 ? 24 : 28);
      const bottom = width < 440 ? 332 : 362;
      const min = Math.floor(Math.min(...values) / 5000) * 5000;
      const max = Math.ceil(Math.max(...values) / 5000) * 5000;
      const points = values.map((value, index) => ({
        x: left + (index / (values.length - 1)) * (right - left),
        y: 32 + ((max - value) / Math.max(1, max - min)) * (bottom - 32),
        text: `${new Intl.NumberFormat("nb-NO").format(value)} kr`,
      }));

      let endpoint: { x: number; y: number } | undefined;
      for (let active = 0; active < values.length; active += 1) {
        const indexes = active === values.length - 1 ? [active] : [values.length - 1, active];
        const labels = placeSalaryGrowthLabels({
          points,
          indexes,
          bounds: { left: left + 8, right: right - 8, top: 40, bottom: bottom - 14 },
          fontSize: width < 440 ? 12 : 14,
        });
        assert.equal(labels.length, indexes.length, `${name}, ${width}px, punkt ${active}: alle beløp skal vises`);
        endpoint ??= { x: labels[0].x, y: labels[0].y };
        assert.deepEqual({ x: labels[0].x, y: labels[0].y }, endpoint, "Sluttverdien skal ligge stabilt");

        for (const label of labels) {
          assert.ok(label.left >= left + 8 && label.left + label.width <= right - 8);
          assert.ok(label.top >= 40 && label.top + label.height <= bottom - 14);
          // Uavhengig kontroll: prøv punkter langs hvert linjestykke.
          for (let segment = 1; segment < points.length; segment += 1) {
            const first = points[segment - 1];
            const last = points[segment];
            for (let sample = 0; sample <= 200; sample += 1) {
              const x = first.x + (last.x - first.x) * (sample / 200);
              const y = first.y + (last.y - first.y) * (sample / 200);
              assert.ok(
                x < label.left - 8 || x > label.left + label.width + 8
                  || y < label.top - 8 || y > label.top + label.height + 8,
                `${name}, ${width}px, punkt ${active}: kurven er for nær beløpet`,
              );
            }
          }
        }

        if (labels.length === 2) {
          const [first, last] = labels;
          assert.ok(
            first.left + first.width + 10 <= last.left || last.left + last.width + 10 <= first.left
              || first.top + first.height + 10 <= last.top || last.top + last.height + 10 <= first.top,
            "Beløpene skal ha luft mellom seg",
          );
        }
      }
    }
  });
}
