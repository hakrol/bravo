export type SalaryGrowthSeriesKey = "all" | "women" | "men";

// Kjønnsfargene samsvarer med occupation-salary-time-series.tsx.
export const salaryGrowthSeriesDefinitions = [
  { key: "all", field: "points", label: "Begge kjønn", color: "#0b376d" },
  { key: "women", field: "womenPoints", label: "Kvinner", color: "#ec1f74" },
  { key: "men", field: "menPoints", label: "Menn", color: "#2563eb" },
] as const;

type ScreenPoint = { x: number; y: number };
type ScreenSeries = { key: SalaryGrowthSeriesKey; points: ScreenPoint[] };

/** Finner nærmeste kurve, også når pekeren ligger mellom årspunktene. */
export function findClosestSalaryGrowthSeries(
  series: ScreenSeries[],
  pointer: ScreenPoint,
  preferredKey: SalaryGrowthSeriesKey,
) {
  const hits = series.map((item) => {
    let distance = Infinity;
    let index = 0;
    for (let pointIndex = 0; pointIndex < item.points.length; pointIndex += 1) {
      const first = item.points[pointIndex];
      const last = item.points[pointIndex + 1] ?? first;
      const dx = last.x - first.x;
      const dy = last.y - first.y;
      const lengthSquared = dx * dx + dy * dy;
      const fraction = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1,
        ((pointer.x - first.x) * dx + (pointer.y - first.y) * dy) / lengthSquared,
      ));
      const segmentDistance = Math.hypot(pointer.x - first.x - fraction * dx, pointer.y - first.y - fraction * dy);
      if (segmentDistance < distance) {
        distance = segmentDistance;
        index = pointIndex + (fraction > 0.5 ? 1 : 0);
      }
    }
    return { key: item.key, index, distance };
  }).sort((first, second) => first.distance - second.distance);

  const closest = hits[0];
  if (!closest) return null;
  // Behold fokus ved kryssende kurver for å unngå flimring.
  return hits.find((hit) => hit.key === preferredKey && hit.distance <= closest.distance + 1.5) ?? closest;
}
