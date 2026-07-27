const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

type SalaryRowProps = {
  salaries: number[];
  median: number;
};

function SalaryRow({ salaries, median }: SalaryRowProps) {
  return (
    <div
      className="grid grid-cols-5 gap-1.5 sm:gap-2"
      aria-label={`Sorterte lønninger: ${salaries.map((salary) => formatThousands(salary)).join(", ")} kroner`}
    >
      {salaries.map((salary, index) => {
        const isMedian = salary === median && index === Math.floor(salaries.length / 2);

        return (
          <div
            key={`${salary}-${index}`}
            className={`rounded-lg border px-1 py-3 text-center text-xs font-semibold sm:text-sm ${
              isMedian
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            {formatThousands(salary)}
            {isMedian ? <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide">Median</span> : null}
          </div>
        );
      })}
    </div>
  );
}

function Summary({ average, median }: { average: string; median: string }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
      <div className="rounded-lg bg-white px-3 py-2 text-slate-700 ring-1 ring-slate-200">
        <span className="block text-xs text-slate-500">Median</span>
        <strong>{median}</strong>
      </div>
      <div className="rounded-lg bg-blue-50 px-3 py-2 text-blue-950 ring-1 ring-blue-200">
        <span className="block text-xs text-blue-700">Gjennomsnitt</span>
        <strong>{average}</strong>
      </div>
    </div>
  );
}

export function SimpleSalarySequenceGraphic() {
  return (
    <figure className="my-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <figcaption className="mb-4">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Forenklet eksempel</span>
        <strong className="mt-1 block text-lg text-slate-950">Fem lønninger som ligger nær hverandre</strong>
        <span className="mt-1 block text-sm text-slate-600">Beløpene er sortert og oppgitt i kroner per måned.</span>
      </figcaption>
      <SalaryRow median={45} salaries={[42, 44, 45, 46, 48]} />
      <Summary average="45 000 kr" median="45 000 kr" />
    </figure>
  );
}

export function HighSalaryComparisonGraphic() {
  return (
    <figure className="my-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <figcaption className="mb-5">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Forenklet eksempel</span>
        <strong className="mt-1 block text-lg text-slate-950">Én høy lønn flytter gjennomsnittet</strong>
      </figcaption>
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Før</p>
          <SalaryRow median={45} salaries={[42, 44, 45, 46, 48]} />
          <Summary average="45 000 kr" median="45 000 kr" />
        </div>
        <div className="border-t border-slate-200 pt-5">
          <p className="mb-2 text-sm font-semibold text-slate-700">Etter: 48 000 kr er erstattet med 90 000 kr</p>
          <SalaryRow median={45} salaries={[42, 44, 45, 46, 90]} />
          <Summary average="53 400 kr" median="45 000 kr" />
        </div>
      </div>
    </figure>
  );
}

export function LowSalarySkewGraphic() {
  const salaries = [10, 44, 45, 46, 48];

  return (
    <figure className="my-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <figcaption className="mb-5">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Forenklet eksempel</span>
        <strong className="mt-1 block text-lg text-slate-950">En svært lav lønn trekker snittet ned</strong>
        <span className="mt-1 block text-sm text-slate-600">Månedslønn i kroner.</span>
      </figcaption>
      <div className="flex h-44 items-end gap-2 border-b border-slate-300 px-1 sm:gap-4" aria-label="Stolpediagram med lønningene 10, 44, 45, 46 og 48 tusen kroner">
        {salaries.map((salary, index) => (
          <div className="flex h-full flex-1 flex-col justify-end" key={`${salary}-${index}`}>
            <span className="mb-1 text-center text-xs font-semibold text-slate-700">{formatThousands(salary)}</span>
            <div
              className={`${index === 0 ? "bg-rose-400" : index === 2 ? "bg-emerald-700" : "bg-slate-400"} rounded-t-md`}
              style={{ height: `${(salary / 50) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <Summary average="38 600 kr" median="45 000 kr" />
    </figure>
  );
}

const occupationRows = [
  { occupation: "Handels- og skipsmeglere", median: 105000, average: 172630 },
  { occupation: "Finansmeglere", median: 88680, average: 117130 },
  { occupation: "Energimontører", median: 58140, average: 54510 },
  { occupation: "Elektrikere", median: 54930, average: 54460 },
];

export function OccupationMedianAverageComparison() {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <figcaption className="bg-slate-50 px-4 py-4 sm:px-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">SSB, 2025</span>
        <strong className="mt-1 block text-lg text-slate-950">Median og gjennomsnitt i fire yrker</strong>
        <span className="mt-1 block text-sm text-slate-600">Månedslønn, begge kjønn, alle sektorer og arbeidstid i alt.</span>
      </figcaption>
      <div className="divide-y divide-slate-200">
        {occupationRows.map((row) => {
          const averageIsHigher = row.average > row.median;

          return (
            <div className="px-4 py-4 sm:px-6" key={row.occupation}>
              <strong className="block text-sm text-slate-950 sm:text-base">{row.occupation}</strong>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <span className="block text-xs text-slate-500">Median</span>
                  <span className="font-semibold text-slate-900">{formatSalary(row.median)}</span>
                </div>
                <div className={`rounded-lg px-3 py-2 ${averageIsHigher ? "bg-blue-50" : "bg-amber-50"}`}>
                  <span className={`block text-xs ${averageIsHigher ? "text-blue-700" : "text-amber-800"}`}>Gjennomsnitt</span>
                  <span className="font-semibold text-slate-900">{formatSalary(row.average)}</span>
                </div>
              </div>
              <p className="mb-0 mt-2 text-xs text-slate-600">
                Gjennomsnittet er {Math.abs(row.average - row.median).toLocaleString("nb-NO")} kr {averageIsHigher ? "høyere" : "lavere"}.
              </p>
            </div>
          );
        })}
      </div>
      <div className="bg-slate-50 px-4 py-3 text-xs text-slate-600 sm:px-6">
        Kilde: Statistisk sentralbyrå, tabell 11418. Tall for 2025, publisert 5. februar 2026.
      </div>
    </figure>
  );
}

function formatSalary(value: number) {
  return `${currencyFormatter.format(value)} kr`;
}

function formatThousands(value: number) {
  return currencyFormatter.format(value * 1000);
}
