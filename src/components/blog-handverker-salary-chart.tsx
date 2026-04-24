import Link from "next/link";
import handverkereLonn2025Snapshot from "@/content/blog/data/handverkere-lonn-2025.json";

type HandverkerSalaryRow = {
  code: string;
  label: string;
  href: string;
  value: number | null;
};

type HandverkerSalarySnapshot = {
  id: string;
  title: string;
  source: string;
  period: string;
  measure: string;
  note: string;
  rows: HandverkerSalaryRow[];
};

const allOccupationsMedian = 55800;

export function BlogHandverkerSalaryChart() {
  const snapshot = handverkereLonn2025Snapshot as HandverkerSalarySnapshot;
  const publishedRows = snapshot.rows.filter((row) => typeof row.value === "number");
  const maxSalary = Math.max(...publishedRows.map((row) => row.value ?? 0), 1);
  const axisMax = getNiceAxisMax(maxSalary);
  const ticks = buildTicks(0, axisMax, 4);

  return (
    <figure className="blog-chart" aria-labelledby="handverker-lonn-2025-title">
      <div className="blog-chart-header">
        <div>
          <p className="blog-chart-kicker">Grafikk</p>
          <h3 className="blog-chart-title" id="handverker-lonn-2025-title">
            Hva tjener håndverkere? Alle håndverksyrkene i 2025
          </h3>
          <p className="blog-chart-subtitle">
            Figuren viser median månedslønn for alle firesifrede håndverksyrker i SSBs 2025-tall. Yrker uten publisert verdi er
            markert som «Ikke publisert».
          </p>
        </div>
      </div>

      <div className="blog-chart-bars">
        <div className="blog-chart-axis blog-chart-axis-horizontal" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} style={{ left: `${(tick / axisMax) * 100}%` }}>
              {formatCompactTick(tick)}
            </span>
          ))}
        </div>

        {snapshot.rows.map((row) => {
          const ratio = row.value ? row.value / axisMax : 0;
          const isAboveAllOccupations = typeof row.value === "number" && row.value > allOccupationsMedian;
          const fillColor = isAboveAllOccupations ? "#14532d" : "#5f746d";

          return (
            <div
              key={row.code}
              className="blog-chart-bar-row"
              data-highlight={isAboveAllOccupations ? "true" : undefined}
              style={{ cursor: "default" }}
            >
              <span className="blog-chart-bar-label">
                <Link className="underline decoration-transparent transition hover:decoration-current" href={row.href}>
                  {row.label}
                </Link>
              </span>

              <span className="blog-chart-bar-track">
                {ticks.slice(1).map((tick) => (
                  <span
                    key={`${row.code}-${tick}`}
                    aria-hidden="true"
                    className="blog-chart-gridline"
                    style={{ left: `${(tick / axisMax) * 100}%` }}
                  />
                ))}
                {typeof row.value === "number" ? (
                  <span
                    className="blog-chart-bar-fill"
                    style={{
                      background: fillColor,
                      width: `${Math.max(ratio * 100, 1)}%`,
                    }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="blog-chart-bar-fill"
                    style={{
                      background:
                        "repeating-linear-gradient(90deg, rgba(95,116,109,0.32) 0 6px, rgba(95,116,109,0.12) 6px 12px)",
                      width: "18%",
                    }}
                  />
                )}
              </span>

              <span className="blog-chart-bar-value">{typeof row.value === "number" ? formatCurrency(row.value) : "Ikke publisert"}</span>
            </div>
          );
        })}

        <p className="blog-chart-axis-label">Kroner per måned. Mørk grønn betyr over medianen for alle yrker: 55 800 kr.</p>
      </div>

      <figcaption className="blog-chart-footer">
        <span>Kilde: {snapshot.source}</span>
        <span>{snapshot.note}</span>
      </figcaption>
    </figure>
  );
}

function buildTicks(minValue: number, maxValue: number, count: number) {
  const range = Math.max(maxValue - minValue, 1);
  return Array.from({ length: count + 1 }, (_, index) => Math.round(minValue + (range / count) * index));
}

function getNiceAxisMax(maxValue: number) {
  if (maxValue <= 0) {
    return 1;
  }

  const rawStep = maxValue / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const niceMultiplier = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const step = niceMultiplier * magnitude;

  return step * Math.ceil(maxValue / step);
}

function formatCompactTick(value: number) {
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 1000).toLocaleString("nb-NO")}k`;
  }

  return value.toLocaleString("nb-NO");
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO")} kr`;
}
