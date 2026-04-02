import Link from "next/link";
import { DataInfoModal } from "@/components/data-info-modal";
import { getOccupationDetailHref } from "@/lib/occupation-detail-pages";

export type OccupationSalaryRow = {
  rowKey: string;
  occupationCode: string;
  occupationLabel: string;
  salaryAll?: number;
  salaryWomen?: number;
  salaryMen?: number;
};

type OccupationSalaryOverviewProps = {
  rows: OccupationSalaryRow[];
  lastUpdated?: string;
  showLastUpdated?: boolean;
  periodLabel?: string;
  title?: string;
  description?: string;
  emptyStateText?: string;
};

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

export function OccupationSalaryOverview({
  rows,
  lastUpdated,
  showLastUpdated = true,
  periodLabel,
  title = "Siste gjennomsnittlige avtalte månedslønn for alle yrker",
  description = "Tabellen viser samme lønnsmål fordelt på begge kjønn, kvinner og menn, sortert etter kolonnen for begge kjønn.",
  emptyStateText = "Ingen yrker matcher søket ditt.",
}: OccupationSalaryOverviewProps) {
  const formattedPeriodLabel = formatPeriodLabel(periodLabel);

  return (
    <section className="grid gap-6">
      <section className="overflow-hidden rounded-md border bg-[var(--surface)] shadow-sm">
        <div className="flex flex-col gap-2 border-b px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                {title}
              </h2>
              <DataInfoModal description={description} title={title} />
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {formattedPeriodLabel ? (
              <p className="inline-flex rounded-md border border-[#d6e2d7] bg-white/85 px-3 py-1.5 text-sm font-semibold text-[var(--primary-strong)] shadow-sm">
                Periode: {formattedPeriodLabel}
              </p>
            ) : null}
            {showLastUpdated ? (
              <p className="text-sm text-[var(--muted)]">Oppdatert: {lastUpdated ?? "Ukjent"}</p>
            ) : null}
          </div>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="sticky top-0 bg-[#f8f3ea] text-sm text-slate-700">
              <tr>
                <th className="border-b px-6 py-3 font-semibold">Yrke</th>
                <th className="border-b px-6 py-3 font-semibold">Se detaljer</th>
                <th className="border-b px-6 py-3 text-right font-semibold">Begge kjønn</th>
                <th className="border-b px-6 py-3 text-right font-semibold">Kvinner</th>
                <th className="border-b px-6 py-3 text-right font-semibold">Menn</th>
              </tr>
            </thead>
            <tbody className="bg-white/80 text-sm">
              {rows.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-[var(--muted)]" colSpan={5}>
                    {emptyStateText}
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const detailHref = getOccupationDetailHref(
                    row.occupationCode,
                    row.occupationLabel,
                  );

                  return (
                    <tr key={row.rowKey} className="odd:bg-white even:bg-[#fcfaf6]">
                      <td className="border-b px-6 py-4 text-slate-900">{row.occupationLabel}</td>
                      <td className="border-b px-6 py-4 text-sm">
                        {detailHref ? (
                          <Link
                            className="font-medium text-[var(--primary-strong)] underline-offset-4 transition hover:underline"
                            href={detailHref}
                          >
                            Se detaljer
                          </Link>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="border-b px-6 py-4 text-right font-semibold text-slate-950">
                        {formatSalary(row.salaryAll)}
                      </td>
                      <td className="border-b px-6 py-4 text-right font-semibold text-slate-950">
                        {formatSalary(row.salaryWomen)}
                      </td>
                      <td className="border-b px-6 py-4 text-right font-semibold text-slate-950">
                        {formatSalary(row.salaryMen)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function formatSalary(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${currencyFormatter.format(value)} kr`;
}

function formatPeriodLabel(label?: string) {
  if (!label) {
    return undefined;
  }

  const quarterMatch = label.match(/^(\d{4})K([1-4])$/);

  if (quarterMatch) {
    const [, year, quarter] = quarterMatch;
    return `${quarter}. kvartal ${year}`;
  }

  return label;
}
