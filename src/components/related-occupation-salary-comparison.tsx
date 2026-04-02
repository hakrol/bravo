import Link from "next/link";

type RelatedOccupationSalaryComparisonItem = {
  occupationCode: string;
  occupationLabel: string;
  href: string;
  medianAll?: number;
  medianWomen?: number;
  medianMen?: number;
};

type RelatedOccupationSalaryComparisonProps = {
  currentOccupationLabel: string;
  currentMedian?: number;
  currentMedianWomen?: number;
  currentMedianMen?: number;
  periodLabel?: string;
  rows: RelatedOccupationSalaryComparisonItem[];
};

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export function RelatedOccupationSalaryComparison({
  currentOccupationLabel,
  currentMedian,
  currentMedianWomen,
  currentMedianMen,
  periodLabel,
  rows,
}: RelatedOccupationSalaryComparisonProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border bg-[var(--surface)] px-5 py-5 shadow-sm sm:px-6">
      <div className="flex flex-col gap-3 border-b border-black/10 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
            Medianlønn sammenlignet med relaterte yrker
          </h2>
          <div className="space-y-1 text-sm text-[var(--muted)]">
            <div>
              {currentOccupationLabel}:{" "}
              <span className="font-semibold text-slate-950">{formatSalary(currentMedian)}</span>
            </div>
            {periodLabel ? <div>Basert på median for {periodLabel.toLowerCase()}</div> : null}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-[#f8f3ea] text-slate-700">
            <tr>
              <th className="border-b px-4 py-2.5 font-semibold">Yrke</th>
              <th className="border-b px-4 py-2.5 text-right font-semibold">Median kvinner</th>
              <th className="border-b px-4 py-2.5 text-right font-semibold">Median menn</th>
              <th className="border-b px-4 py-3 text-right font-semibold">Forskjell kvinner</th>
              <th className="border-b px-4 py-3 text-right font-semibold">Forskjell menn</th>
              <th className="border-b px-4 py-2.5 font-semibold">Detaljer</th>
            </tr>
          </thead>
          <tbody className="bg-white/80">
            {rows.map((row) => {
              const differenceWomen = getDifference(row.medianWomen, currentMedianWomen);
              const differenceMen = getDifference(row.medianMen, currentMedianMen);
              const toneClassesWomen =
                differenceWomen === undefined
                  ? "text-slate-500"
                  : differenceWomen > 0
                    ? "text-emerald-700"
                    : differenceWomen < 0
                      ? "text-red-700"
                      : "text-slate-700";
              const toneClassesMen =
                differenceMen === undefined
                  ? "text-slate-500"
                  : differenceMen > 0
                    ? "text-emerald-700"
                    : differenceMen < 0
                      ? "text-red-700"
                      : "text-slate-700";

              return (
                <tr key={row.occupationCode} className="odd:bg-white even:bg-[#fcfaf6]">
                  <td className="border-b px-4 py-3 text-slate-950">{row.occupationLabel}</td>
                  <td className="border-b px-4 py-3 text-right font-semibold text-slate-950">
                    {formatSalary(row.medianWomen)}
                  </td>
                  <td className="border-b px-4 py-3 text-right font-semibold text-slate-950">
                    {formatSalary(row.medianMen)}
                  </td>
                  <td className={`border-b px-4 py-3 text-right font-semibold ${toneClassesWomen}`}>
                    {formatDifference(differenceWomen, currentMedianWomen)}
                  </td>
                  <td className={`border-b px-4 py-3 text-right font-semibold ${toneClassesMen}`}>
                    {formatDifference(differenceMen, currentMedianMen)}
                  </td>
                  <td className="border-b px-4 py-3">
                    <Link
                      className="font-medium text-[var(--primary-strong)] underline-offset-4 transition hover:underline"
                      href={row.href}
                    >
                      Se yrket
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatSalary(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${currencyFormatter.format(value)} kr`;
}

function getDifference(value?: number, baseValue?: number) {
  if (value === undefined || baseValue === undefined) {
    return undefined;
  }

  return value - baseValue;
}

function formatDifference(difference?: number, baseValue?: number) {
  if (difference === undefined || baseValue === undefined || baseValue === 0) {
    return ":";
  }

  const sign = difference > 0 ? "+" : "";
  const percentDifference = (difference / baseValue) * 100;

  return `${sign}${currencyFormatter.format(difference)} kr (${sign}${percentFormatter.format(percentDifference)} %)`;
}
