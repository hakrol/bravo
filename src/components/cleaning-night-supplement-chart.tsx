type NightSupplementPoint = {
  effectiveFrom: string;
  nightSupplement: number;
};

type CleaningNightSupplementChartProps = {
  points: readonly NightSupplementPoint[];
  today: string;
};

const width = 760;
const height = 280;
const margin = { top: 30, right: 28, bottom: 50, left: 58 };
const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.top - margin.bottom;
const minValue = 24;
const maxValue = 30;
const yTicks = [24, 26, 28, 30];

export function CleaningNightSupplementChart({ points, today }: CleaningNightSupplementChartProps) {
  const changes = points.filter((point, index) => index === 0 || point.nightSupplement !== points[index - 1].nightSupplement);
  if (!changes.length) return null;

  const startDate = "2016-01-01";
  const startTime = Date.parse(`${startDate}T00:00:00Z`);
  const endTime = Date.parse(`${today}T00:00:00Z`);
  const visibleChanges = changes
    .filter((point) => point.effectiveFrom <= today)
    .map((point, index) => ({ ...point, effectiveFrom: index === 0 && point.effectiveFrom < startDate ? startDate : point.effectiveFrom }));

  const x = (date: string) => margin.left + ((Date.parse(`${date}T00:00:00Z`) - startTime) / (endTime - startTime)) * plotWidth;
  const y = (value: number) => margin.top + ((maxValue - value) / (maxValue - minValue)) * plotHeight;
  const stepPath = visibleChanges.reduce((path, point, index) => {
    const pointX = x(point.effectiveFrom);
    const pointY = y(point.nightSupplement);
    if (index === 0) return `M ${pointX} ${pointY}`;
    return `${path} H ${pointX} V ${pointY}`;
  }, "") + ` H ${x(today)}`;
  const yearTicks = [2016, 2018, 2020, 2022, 2024, new Date(`${today}T00:00:00Z`).getUTCFullYear()]
    .filter((year, index, years) => years.indexOf(year) === index);

  return (
    <figure className="overflow-hidden rounded-[11px] border border-cyan-900/15 bg-[linear-gradient(145deg,#f7fcfd,#eef8fb)] p-4 sm:p-6">
      <figcaption>
        <h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-2xl">Utvikling i minste nattillegg</h3>
        <p className="mt-2 text-[1.03rem] leading-[1.8] text-slate-600 sm:text-lg sm:leading-[1.95]">Kroner per time for arbeid mellom kl. 21:00 og 06:00.</p>
      </figcaption>
      <div className="mt-5 overflow-x-auto pb-1">
        <svg aria-label="Stegdiagram som viser utviklingen i minste nattillegg fra 2016 til i dag" className="h-auto min-w-[620px]" role="img" viewBox={`0 0 ${width} ${height}`}>
          <title>Utvikling i minste nattillegg for renholdere</title>
          {yTicks.map((tick) => (
            <g key={tick}>
              <line stroke="#d8e5e9" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
              <text fill="#64748b" fontSize="12" textAnchor="end" x={margin.left - 12} y={y(tick) + 4}>{tick} kr</text>
            </g>
          ))}
          {yearTicks.map((year) => {
            const date = `${year}-01-01` <= today ? `${year}-01-01` : today;
            return <text fill="#64748b" fontSize="12" key={year} textAnchor="middle" x={x(date)} y={height - 18}>{year}</text>;
          })}
          <path d={stepPath} fill="none" stroke="#0787a8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          {visibleChanges.map((point) => (
            <g key={point.effectiveFrom}>
              <circle cx={x(point.effectiveFrom)} cy={y(point.nightSupplement)} fill="#ffffff" r="6" stroke="#0787a8" strokeWidth="3" />
              <text fill="#07566d" fontSize="13" fontWeight="700" textAnchor="middle" x={x(point.effectiveFrom)} y={y(point.nightSupplement) - 14}>+{formatRate(point.nightSupplement)}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
        {visibleChanges.map((point) => <span key={point.effectiveFrom}><strong className="text-slate-900">{formatDate(point.effectiveFrom)}:</strong> +{formatRate(point.nightSupplement)}</span>)}
      </div>
    </figure>
  );
}

function formatRate(value: number) {
  return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
