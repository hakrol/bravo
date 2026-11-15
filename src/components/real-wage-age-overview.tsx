import { QuarterlyRealWageExplorer } from "@/components/quarterly-real-wage-explorer";
import type { RealWageComparison } from "@/lib/national-real-wage";
import { formatRealWageQuarter, type QuarterlyRealWageDataset, type QuarterlyRealWagePeriod } from "@/lib/quarterly-real-wage";
import { formatRealWagePercent, realWageColors } from "@/lib/real-wage-growth";

type RealWageAgeOverviewProps = {
  dataset: QuarterlyRealWageDataset;
  comparisons: RealWageComparison[];
  period: QuarterlyRealWagePeriod | null;
};

export function RealWageAgeOverview({ dataset, comparisons, period }: RealWageAgeOverviewProps) {
  return (
    <section className="flex flex-col gap-6 border-t border-slate-200 pt-9 sm:gap-7 sm:pt-12" aria-labelledby="reallonn-age-title">
      <header className="text-center">
        <h2 id="reallonn-age-title" className="text-balance text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">Reallønn i ulike aldersgrupper</h2>
        <p className="mx-auto mt-4 max-w-4xl text-lg font-medium leading-8 text-slate-700 sm:text-xl sm:leading-9">
          Se hvilke aldersgrupper som har hatt sterkest reallønnsutvikling i siste hele år.
          Velg deretter en aldersgruppe i diagrammet for å utforske endringen fra kvartal til kvartal.
          Alle tall gjelder median avtalt månedslønn, begge kjønn og hele Norge.
        </p>
      </header>
      <div className="overflow-hidden rounded-[6px] border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-medium text-slate-600 sm:px-5">
            Siste hele år{period ? `: ${formatRealWageQuarter(period.startPeriodCode)}–${formatRealWageQuarter(period.endPeriodCode)}` : " – mangler data"}
          </caption>
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-500">
              <th scope="col" className="px-4 py-3 font-semibold sm:px-5">Aldersgruppe</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-5">Reallønnsutvikling</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((item) => <tr key={item.code} className="border-b border-slate-100 last:border-0">
              <th scope="row" className="px-4 py-3 font-medium text-slate-800 sm:px-5">{item.label}</th>
              <td className="px-4 py-3 text-right font-bold tabular-nums sm:px-5" style={{ color: item.value === null || item.value === 0
                ? realWageColors.neutral : item.value > 0 ? realWageColors.positive : realWageColors.negative }}>
                {item.value === null ? "Mangler data" : formatRealWagePercent(item.value)}
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <QuarterlyRealWageExplorer dataset={dataset} variant="age" />
    </section>
  );
}
