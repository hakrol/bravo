type Point = { x: number; y: number; text: string };
type Bounds = { left: number; right: number; top: number; bottom: number };
type Box = { left: number; top: number; width: number; height: number };

export type SalaryGrowthLabel = Box & {
  index: number;
  text: string;
  x: number;
  y: number;
  connector: { x1: number; y1: number; x2: number; y2: number } | null;
};

function overlaps(first: Box, second: Box, gap: number) {
  return first.left < second.left + second.width + gap
    && first.left + first.width + gap > second.left
    && first.top < second.top + second.height + gap
    && first.top + first.height + gap > second.top;
}

function touchesCurve(box: Box, points: Point[]) {
  const left = box.left - 10;
  const right = box.left + box.width + 10;
  const top = box.top - 10;
  const bottom = box.top + box.height + 10;

  if (points.some((point) => point.x >= left && point.x <= right && point.y >= top && point.y <= bottom)) {
    return true;
  }

  return points.slice(1).some((point, index) => {
    const previous = points[index];
    const start = Math.max(left, previous.x);
    const end = Math.min(right, point.x);
    if (start > end || point.x === previous.x) return false;

    const yAt = (x: number) => previous.y + ((x - previous.x) / (point.x - previous.x)) * (point.y - previous.y);
    const startY = yAt(start);
    const endY = yAt(end);
    return Math.min(startY, endY) <= bottom && Math.max(startY, endY) >= top;
  });
}

/** Plasserer beløp med avstand til kurven, punktmarkørene og andre etiketter. */
export function placeSalaryGrowthLabels({
  points,
  indexes,
  bounds,
  fontSize,
  obstacleCurves = [],
}: {
  points: Point[];
  indexes: number[];
  bounds: Bounds;
  fontSize: number;
  obstacleCurves?: Point[][];
}): SalaryGrowthLabel[] {
  const labels: SalaryGrowthLabel[] = [];

  for (const index of indexes) {
    const point = points[index];
    // Romslig tekstbredde tar høyde for siffer, mellomrom og fet skrift.
    const textWidth = Array.from(point.text).reduce((total, character) => {
      const proportion = /\d/.test(character) ? 0.7 : /\s/.test(character) ? 0.35 : 0.65;
      return total + fontSize * proportion;
    }, 8);
    const width = Math.min(bounds.right - bounds.left, textWidth);
    const height = fontSize + 4;
    const clampX = (center: number) => Math.max(bounds.left, Math.min(bounds.right - width, center - width / 2));
    const candidates: Box[] = [];

    for (const gap of [14, 28, 44, 64, 88, 116]) {
      for (const top of [point.y - gap - height, point.y + gap]) {
        for (const center of [point.x, point.x - width / 2 - 14, point.x + width / 2 + 14]) {
          candidates.push({ left: clampX(center), top, width, height });
        }
      }
    }

    const isAvailable = (box: Box) => box.top >= bounds.top
      && box.top + box.height <= bounds.bottom
      && !touchesCurve(box, points)
      && !obstacleCurves.some((curve) => touchesCurve(box, curve))
      && !labels.some((label) => overlaps(box, label, 12));

    let box = candidates.find(isAvailable);
    if (!box) {
      // Ved tettliggende punkter: finn nærmeste ledige plass i plottet.
      const freeBoxes: Box[] = [];
      for (let top = bounds.top; top + height <= bounds.bottom; top += height + 8) {
        for (let left = bounds.left; left <= bounds.right - width; left += 12) {
          const candidate = { left, top, width, height };
          if (isAvailable(candidate)) freeBoxes.push(candidate);
        }
        const rightAligned = { left: bounds.right - width, top, width, height };
        if (isAvailable(rightAligned)) freeBoxes.push(rightAligned);
      }
      const distance = (candidate: Box) => Math.hypot(
        candidate.left + width / 2 - point.x,
        candidate.top + height / 2 - point.y,
      );
      box = freeBoxes.sort((first, second) => distance(first) - distance(second))[0];
    }
    if (!box) continue;

    const edgeX = Math.max(box.left, Math.min(box.left + width, point.x));
    const edgeY = Math.max(box.top, Math.min(box.top + height, point.y));
    const distance = Math.hypot(edgeX - point.x, edgeY - point.y);
    const connector = distance > 30 ? {
      x1: point.x + ((edgeX - point.x) / distance) * 10,
      y1: point.y + ((edgeY - point.y) / distance) * 10,
      x2: edgeX - ((edgeX - point.x) / distance) * 4,
      y2: edgeY - ((edgeY - point.y) / distance) * 4,
    } : null;

    labels.push({ ...box, index, text: point.text, x: box.left + width / 2, y: box.top + fontSize, connector });
  }

  return labels;
}
