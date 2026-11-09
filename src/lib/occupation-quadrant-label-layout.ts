export type QuadrantLabelPoint = { code: string; name: string; x: number; y: number };
export type QuadrantLabelBox = { left: number; top: number; width: number; height: number };
type Bounds = { left: number; right: number; top: number; bottom: number };

export type OccupationQuadrantLabel = QuadrantLabelBox & {
  code: string;
  lines: string[];
  connector: { x1: number; y1: number; x2: number; y2: number };
};

function textWidth(text: string, fontSize: number) {
  return Array.from(text).reduce((sum, letter) => sum + fontSize * (
    /\s/.test(letter) ? 0.35 : /[ilIjtfr.,:;'|!]/.test(letter) ? 0.35
      : /[mwMWÆØÅæøå]/.test(letter) ? 0.85 : /[A-Z]/.test(letter) ? 0.72 : 0.62
  ), 0);
}

function wrapName(name: string, maxWidth: number, fontSize: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of name.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (textWidth(candidate, fontSize) <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) {
      lines.push(line);
      line = "";
    }
    for (const character of Array.from(word)) {
      if (textWidth(line + character, fontSize) > maxWidth) {
        lines.push(line);
        line = "";
      }
      line += character;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function overlaps(a: QuadrantLabelBox, b: QuadrantLabelBox, gap = 5) {
  return a.left < b.left + b.width + gap && a.left + a.width + gap > b.left
    && a.top < b.top + b.height + gap && a.top + a.height + gap > b.top;
}

/** Flytter bare etikettene. Ved plassmangel kan diagrammet øke høyden og prøve igjen. */
export function placeOccupationQuadrantLabels({ points, bounds, fontSize, obstacles = [] }: {
  points: QuadrantLabelPoint[];
  bounds: Bounds;
  fontSize: number;
  obstacles?: QuadrantLabelBox[];
}): OccupationQuadrantLabel[] {
  const labels: OccupationQuadrantLabel[] = [];
  const maxWidth = Math.min(190, bounds.right - bounds.left);
  const lineHeight = fontSize + 4;
  const markers = points.map((point) => ({ left: point.x - 12, top: point.y - 12, width: 24, height: 24 }));
  const prepared = points.map((point) => {
    const lines = wrapName(point.name, maxWidth - 12, fontSize);
    const width = Math.min(maxWidth, Math.max(...lines.map((line) => textWidth(line, fontSize)), 1) + 12);
    return { point, lines, width, height: lines.length * lineHeight + 8 };
  }).sort((a, b) => a.point.y - b.point.y || a.point.x - b.point.x || a.point.code.localeCompare(b.point.code));

  for (const { point, lines, width, height } of prepared) {
    const overlappingCount = points.filter((other) => Math.hypot(other.x - point.x, other.y - point.y) <= 6).length;
    const maxConnectorLength = 90 + (overlappingCount - 1) * (height + 12);
    const clamp = (left: number, top: number): QuadrantLabelBox => ({
      left: Math.max(bounds.left, Math.min(bounds.right - width, left)),
      top: Math.max(bounds.top, Math.min(bounds.bottom - height, top)), width, height,
    });
    const available = (box: QuadrantLabelBox) => box.width <= bounds.right - bounds.left
      && box.top >= bounds.top && box.top + box.height <= bounds.bottom
      && Math.hypot(point.x - Math.max(box.left, Math.min(box.left + box.width, point.x)),
        point.y - Math.max(box.top, Math.min(box.top + box.height, point.y))) <= maxConnectorLength
      && !markers.some((marker) => overlaps(box, marker))
      && !obstacles.some((obstacle) => overlaps(box, obstacle))
      && !labels.some((label) => overlaps(box, label, 7));
    let box: QuadrantLabelBox | undefined;
    for (const gap of [18, 32, 52, 80, 116]) {
      const candidates = [
        clamp(point.x - width / 2, point.y - gap - height),
        clamp(point.x + gap, point.y - height / 2),
        clamp(point.x - gap - width, point.y - height / 2),
        clamp(point.x - width / 2, point.y + gap),
        clamp(point.x + gap, point.y - gap - height),
        clamp(point.x - gap - width, point.y + gap),
      ];
      box = candidates.find(available);
      if (box) break;
    }
    if (!box) {
      const rows = Array.from({ length: Math.max(0, Math.floor((bounds.bottom - bounds.top - height) / 12) + 1) }, (_, i) => bounds.top + i * 12)
        .sort((a, b) => Math.abs(a + height / 2 - point.y) - Math.abs(b + height / 2 - point.y));
      const columns = [bounds.right - width, ...Array.from({ length: Math.max(1, Math.floor((bounds.right - bounds.left - width) / 16) + 1) }, (_, i) => bounds.left + i * 16)]
        .sort((a, b) => Math.abs(a + width / 2 - point.x) - Math.abs(b + width / 2 - point.x));
      for (const top of rows) {
        box = columns.map((left) => ({ left, top, width, height })).find(available);
        if (box) break;
      }
    }
    if (!box) continue;
    const edgeX = Math.max(box.left, Math.min(box.left + width, point.x));
    const edgeY = Math.max(box.top, Math.min(box.top + height, point.y));
    const distance = Math.hypot(edgeX - point.x, edgeY - point.y);
    labels.push({ ...box, code: point.code, lines, connector: {
      x1: point.x + (edgeX - point.x) / distance * 9,
      y1: point.y + (edgeY - point.y) / distance * 9, x2: edgeX, y2: edgeY,
    } });
  }
  return labels;
}

/** Punkter innen seks skjermpiksler får en felles antallsmarkør. */
export function groupOverlappingQuadrantPoints(points: QuadrantLabelPoint[]) {
  const groups: { x: number; y: number; codes: string[] }[] = [];
  for (const point of points) {
    const group = groups.find((entry) => Math.hypot(entry.x - point.x, entry.y - point.y) <= 6);
    if (group) group.codes.push(point.code);
    else groups.push({ x: point.x, y: point.y, codes: [point.code] });
  }
  return groups.filter((group) => group.codes.length > 1);
}
