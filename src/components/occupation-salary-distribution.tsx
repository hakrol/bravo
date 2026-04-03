'use client'

import { useState } from "react";
import { createPortal } from "react-dom";
import type {
  OccupationSalaryDistribution,
  OccupationSalaryDistributionMetrics,
} from "@/lib/types";

type OccupationSalaryDistributionProps = {
  distribution: OccupationSalaryDistribution;
  visibleRows?: DistributionRow["id"][];
  userMarkers?: Partial<Record<DistributionRow["id"], DistributionUserMarker>>;
  scaleMode?: "data" | "focusBand";
};

type DistributionRow = {
  id: "women" | "men";
  label: string;
  accentClassName: string;
  metrics: OccupationSalaryDistributionMetrics;
};

type DistributionUserMarker = {
  label: string;
  value: number;
};

type MarkerKey = "p25" | "median" | "p75";
type MarkerAnchor = "center" | "left" | "right";

type MarkerLayout = Record<
  MarkerKey,
  {
    labelOffsetY: number;
    valueOffsetY: number;
    labelAnchor: MarkerAnchor;
    valueAnchor: MarkerAnchor;
  }
>;

const distributionLabels: Record<DistributionRow["id"], string> = {
  women: "Kvinner",
  men: "Menn",
};

const distributionAccents: Record<DistributionRow["id"], string> = {
  women: "from-amber-200 via-amber-100 to-amber-200",
  men: "from-emerald-200 via-emerald-100 to-emerald-200",
};

export function OccupationSalaryDistributionSection({
  distribution,
  visibleRows,
  userMarkers,
  scaleMode = "data",
}: OccupationSalaryDistributionProps) {
  const allowedRows = visibleRows ? new Set(visibleRows) : null;
  const rows: DistributionRow[] = [
    buildDistributionRow("women", distribution.women),
    buildDistributionRow("men", distribution.men),
  ]
    .filter((row): row is DistributionRow => Boolean(row))
    .filter((row) => (allowedRows ? allowedRows.has(row.id) : true));

  if (rows.length === 0) {
    return null;
  }

  const values = rows.flatMap((row) =>
    [row.metrics.p25, row.metrics.median, row.metrics.p75].filter(
      (value): value is number => Number.isFinite(value),
    ),
  );

  if (values.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      {rows.map((row) => {
        const userMarker = userMarkers?.[row.id];
        const scale = buildDistributionScale(row.metrics, userMarker?.value, scaleMode);
        const p25Position =
          row.metrics.p25 !== undefined ? scale.getPosition(row.metrics.p25, false) : null;
        const medianPosition =
          row.metrics.median !== undefined ? scale.getPosition(row.metrics.median, false) : null;
        const p75Position =
          row.metrics.p75 !== undefined ? scale.getPosition(row.metrics.p75, false) : null;
        const userPosition =
          userMarker !== undefined ? scale.getPosition(userMarker.value, true) : null;
        const markerLayout = buildMarkerLayout({
          p25: p25Position,
          median: medianPosition,
          p75: p75Position,
        });
        const userOffsetPx =
          userPosition !== null
            ? getOverlapOffset(
                userPosition,
                [p25Position, medianPosition, p75Position],
                medianPosition,
              )
            : 0;

        return (
          <article key={row.id} className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {row.label}
            </p>
            <div className="relative px-1">
              <div className="relative h-20">
                <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-300" />
                {p25Position !== null && p75Position !== null ? (
                  <div
                    className={`absolute top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r ${row.accentClassName}`}
                    style={{
                      left: `${p25Position}%`,
                      width: `${Math.max(p75Position - p25Position, 1)}%`,
                    }}
                  />
                ) : null}
                {p25Position !== null && row.metrics.p25 !== undefined ? (
                  <Marker
                    label="25% tjener mindre"
                    labelAnchor={markerLayout.p25.labelAnchor}
                    labelOffsetY={markerLayout.p25.labelOffsetY}
                    position={p25Position}
                    tone="bg-slate-700"
                    value={row.metrics.p25}
                    valueAnchor={markerLayout.p25.valueAnchor}
                    valueOffsetY={markerLayout.p25.valueOffsetY}
                  />
                ) : null}
                {medianPosition !== null && row.metrics.median !== undefined ? (
                  <Marker
                    infoDescription="Median er lønnen som ligger i midten når alle lønningene sorteres fra lavest til høyest. Det er et godt mål fordi det viser det typiske lønnsnivået uten å bli dratt opp av noen få svært høye lønninger."
                    label="Median"
                    labelAnchor={markerLayout.median.labelAnchor}
                    labelOffsetY={markerLayout.median.labelOffsetY}
                    position={medianPosition}
                    tone="bg-[var(--primary)]"
                    toneClassName="text-[var(--primary-strong)]"
                    value={row.metrics.median}
                    valueAnchor={markerLayout.median.valueAnchor}
                    valueOffsetY={markerLayout.median.valueOffsetY}
                  />
                ) : null}
                {p75Position !== null && row.metrics.p75 !== undefined ? (
                  <Marker
                    label="25% tjener mer"
                    labelAnchor={markerLayout.p75.labelAnchor}
                    labelOffsetY={markerLayout.p75.labelOffsetY}
                    position={p75Position}
                    tone="bg-slate-700"
                    value={row.metrics.p75}
                    valueAnchor={markerLayout.p75.valueAnchor}
                    valueOffsetY={markerLayout.p75.valueOffsetY}
                  />
                ) : null}
                {userPosition !== null && userMarker ? (
                  <Marker
                    label=""
                    offsetPx={userOffsetPx}
                    position={userPosition}
                    tone="bg-[#1d4ed8]"
                    toneClassName="text-[#1d4ed8]"
                    value={userMarker.value}
                  />
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function buildDistributionRow(
  id: DistributionRow["id"],
  metrics?: OccupationSalaryDistributionMetrics,
) {
  if (!metrics || !hasAnyDistributionMetric(metrics)) {
    return null;
  }

  return {
    id,
    label: distributionLabels[id],
    accentClassName: distributionAccents[id],
    metrics,
  };
}

function hasAnyDistributionMetric(metrics: OccupationSalaryDistributionMetrics) {
  return [metrics.p25, metrics.median, metrics.p75].some((value) =>
    Number.isFinite(value),
  );
}

function Marker({
  label,
  labelAnchor = "center",
  labelOffsetY = 0,
  position,
  tone,
  toneClassName = "text-[var(--muted)]",
  infoDescription,
  offsetPx = 0,
  value,
  valueAnchor = "center",
  valueOffsetY = 0,
}: {
  label: string;
  labelAnchor?: MarkerAnchor;
  labelOffsetY?: number;
  position: number;
  tone: string;
  toneClassName?: string;
  infoDescription?: string;
  offsetPx?: number;
  value: number;
  valueAnchor?: MarkerAnchor;
  valueOffsetY?: number;
}) {
  const labelAnchorStyles = getMarkerTextAnchorStyles(labelAnchor, labelOffsetY);
  const valueAnchorStyles = getMarkerTextAnchorStyles(valueAnchor, valueOffsetY);

  return (
    <div
      className="absolute top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `calc(${position}% + ${offsetPx}px)` }}
    >
      {label ? (
        <div
          className={`absolute bottom-[14px] z-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em] ${toneClassName} ${labelAnchorStyles.className}`}
          style={labelAnchorStyles.style}
        >
          <span className="inline-flex items-center gap-1.5">
            <span>{label}</span>
            {infoDescription ? (
              <MarkerInfoButton description={infoDescription} label={label} />
            ) : null}
          </span>
        </div>
      ) : null}
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm ${tone}`}
      />
      <span
        className={`absolute top-[14px] whitespace-nowrap text-sm font-medium text-slate-950 ${valueAnchorStyles.className}`}
        style={valueAnchorStyles.style}
      >
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function toPercent(value: number, scaleMin: number, scaleRange: number) {
  return ((value - scaleMin) / scaleRange) * 100;
}

function buildDistributionScale(
  metrics: OccupationSalaryDistributionMetrics,
  userValue?: number,
  scaleMode: "data" | "focusBand" = "data",
) {
  if (
    scaleMode === "focusBand" &&
    metrics.p25 !== undefined &&
    metrics.p75 !== undefined &&
    metrics.p75 > metrics.p25
  ) {
    const p25 = metrics.p25;
    const p75 = metrics.p75;
    const bandStart = 10;
    const bandEnd = 88;
    const outerLeft = 4;
    const outerRight = 96;
    const bandRange = p75 - p25;

    return {
      getPosition(value: number, clampToEdge: boolean) {
        if (value <= p25) {
          return clampToEdge ? outerLeft : bandStart;
        }

        if (value >= p75) {
          return clampToEdge ? outerRight : bandEnd;
        }

        const ratio = (value - p25) / bandRange;
        return bandStart + ratio * (bandEnd - bandStart);
      },
    };
  }

  const rawValues = [metrics.p25, metrics.median, metrics.p75, userValue].filter(
    (value): value is number => Number.isFinite(value),
  );
  const minValue = Math.min(...rawValues);
  const maxValue = Math.max(...rawValues);
  const padding = Math.max(Math.round((maxValue - minValue) * 0.14), 2500);
  const scaleMin = Math.max(0, roundToNearestThousand(minValue - padding, "down"));
  const scaleMax = roundToNearestThousand(maxValue + padding, "up");
  const scaleRange = Math.max(scaleMax - scaleMin, 1);

  return {
    getPosition(value: number) {
      return toPercent(value, scaleMin, scaleRange);
    },
  };
}

function getOverlapOffset(
  position: number,
  comparisonPositions: Array<number | null>,
  medianPosition: number | null,
) {
  const overlaps = comparisonPositions.some(
    (comparisonPosition) =>
      comparisonPosition !== null && Math.abs(comparisonPosition - position) < 3.5,
  );

  if (!overlaps) {
    return 0;
  }

  if (medianPosition !== null) {
    return position >= medianPosition ? 42 : -42;
  }

  return 42;
}

function buildMarkerLayout(positions: Record<MarkerKey, number | null>): MarkerLayout {
  const layout: MarkerLayout = {
    p25: {
      labelOffsetY: 0,
      valueOffsetY: 0,
      labelAnchor: getEdgeAwareAnchor(positions.p25),
      valueAnchor: getEdgeAwareAnchor(positions.p25),
    },
    median: {
      labelOffsetY: 0,
      valueOffsetY: 0,
      labelAnchor: getEdgeAwareAnchor(positions.median),
      valueAnchor: getEdgeAwareAnchor(positions.median),
    },
    p75: {
      labelOffsetY: 0,
      valueOffsetY: 0,
      labelAnchor: getEdgeAwareAnchor(positions.p75),
      valueAnchor: getEdgeAwareAnchor(positions.p75),
    },
  };

  const labelCollisionThreshold = 12;
  const valueCollisionThreshold = 10;
  const p25MedianDistance = getMarkerDistance(positions.p25, positions.median);
  const medianP75Distance = getMarkerDistance(positions.median, positions.p75);

  const p25NearMedian =
    p25MedianDistance !== null && p25MedianDistance < labelCollisionThreshold;
  const p75NearMedian =
    medianP75Distance !== null && medianP75Distance < labelCollisionThreshold;

  if (p25NearMedian && p75NearMedian) {
    layout.median.labelOffsetY = -18;
  } else if (p25NearMedian || p75NearMedian) {
    layout.median.labelOffsetY = -14;
  }

  const p25MedianValueCollision =
    p25MedianDistance !== null && p25MedianDistance < valueCollisionThreshold;
  const medianP75ValueCollision =
    medianP75Distance !== null && medianP75Distance < valueCollisionThreshold;

  if (p25MedianValueCollision || medianP75ValueCollision) {
    layout.median.valueOffsetY = 16;
  }

  if (p25MedianValueCollision) {
    layout.p25.valueAnchor = "right";
    layout.median.valueAnchor = medianP75ValueCollision ? "center" : "left";
  }

  if (medianP75ValueCollision) {
    layout.p75.valueAnchor = "left";
    layout.median.valueAnchor = p25MedianValueCollision ? "center" : "right";
  }

  return layout;
}

function getMarkerDistance(left: number | null, right: number | null) {
  if (left === null || right === null) {
    return null;
  }

  return Math.abs(right - left);
}

function getEdgeAwareAnchor(position: number | null): MarkerAnchor {
  if (position === null) {
    return "center";
  }

  if (position <= 10) {
    return "left";
  }

  if (position >= 90) {
    return "right";
  }

  return "center";
}

function getMarkerTextAnchorStyles(anchor: MarkerAnchor, offsetY: number) {
  if (anchor === "left") {
    return {
      className: "left-1/2 text-left",
      style: {
        transform: `translate(8px, ${offsetY}px)`,
      },
    };
  }

  if (anchor === "right") {
    return {
      className: "left-1/2 text-right",
      style: {
        transform: `translate(calc(-100% - 8px), ${offsetY}px)`,
      },
    };
  }

  return {
    className: "left-1/2 text-center",
    style: {
      transform: `translate(-50%, ${offsetY}px)`,
    },
  };
}

function roundToNearestThousand(value: number, direction: "up" | "down") {
  const rounded =
    direction === "up" ? Math.ceil(value / 1000) * 1000 : Math.floor(value / 1000) * 1000;

  return Number.isFinite(rounded) ? rounded : value;
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

type MarkerInfoButtonProps = {
  label: string;
  description: string;
};

function MarkerInfoButton({ label, description }: MarkerInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        aria-label={`Vis forklaring for ${label.toLowerCase()}`}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6e2d7] bg-white text-[11px] font-semibold normal-case text-[var(--primary-strong)] shadow-sm transition hover:bg-[#f5f8f5]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        i
      </button>

      {false ? (
        <span className="absolute left-1/2 top-full z-20 mt-3 w-72 -translate-x-1/2 whitespace-normal rounded-md border border-black/10 bg-white p-4 text-left normal-case shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
            Forklaring
          </span>
          <span className="mt-2 block text-base font-semibold tracking-[-0.02em] text-slate-950">
            {label}
          </span>
          <span className="mt-2 block text-sm leading-6 text-slate-700">
            {description}
          </span>
          <button
            aria-label="Lukk forklaring"
            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-sm text-slate-600 transition hover:bg-slate-50"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            ×
          </button>
        </span>
      ) : null}
      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4"
              onClick={() => setIsOpen(false)}
            >
              <div
                aria-modal="true"
                className="w-full max-w-md rounded-md border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                      Forklaring
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                      {label}
                    </h3>
                  </div>
                  <button
                    aria-label="Lukk forklaring"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-lg text-slate-600 transition hover:bg-slate-50"
                    onClick={() => setIsOpen(false)}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-700">{description}</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
