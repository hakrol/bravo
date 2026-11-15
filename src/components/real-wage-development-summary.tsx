import { formatRealWageQuarter, type calculateQuarterlyRealWageSummary } from "@/lib/quarterly-real-wage";
import { formatRealWagePercent } from "@/lib/real-wage-growth";

type RealWageDevelopmentSummaryProps = {
  summary: ReturnType<typeof calculateQuarterlyRealWageSummary>;
};

export function RealWageDevelopmentSummary({ summary }: RealWageDevelopmentSummaryProps) {
  if (!summary) return <p className="text-center text-base leading-7 text-slate-600">Det mangler kvartalstall for å beskrive reallønnsutviklingen.</p>;
  const { fourQuarters, lastFullYear, lastQuarter } = summary;
  const value = fourQuarters.value;
  const absolutePercent = value === null ? "" : formatRealWagePercent(Math.abs(value)).replace(/^\+/, "");

  return <div className="mx-auto max-w-4xl space-y-3 text-center text-base leading-8 text-slate-700 sm:text-lg">
    <p>
      {value === null ? <>Reallønnsutviklingen i Norge de siste fire kvartalene kan ikke beregnes fordi nødvendige lønns- eller pristall mangler.</>
        : <>Reallønnen i Norge <strong className="font-semibold text-slate-950">{value === 0 ? "var uendret" : `${value > 0 ? "økte" : "falt"} med ${absolutePercent}`}</strong> de siste fire kvartalene,
          fra {formatRealWageQuarter(fourQuarters.startPeriodCode)} til {formatRealWageQuarter(fourQuarters.endPeriodCode)}.{" "}
          {value > 0 ? "Det betyr at median avtalt månedslønn utviklet seg sterkere enn prisene i perioden."
            : value < 0 ? "Det betyr at median avtalt månedslønn utviklet seg svakere enn prisene i perioden."
              : "Det betyr at median avtalt månedslønn holdt tritt med prisveksten."}</>}
    </p>
    <p>
      {lastFullYear.value === null ? <>Årsutviklingen for {lastFullYear.endPeriodCode.slice(0, 4)} kan ikke beregnes med tilgjengelige data.</>
        : <>I siste hele kalenderår, {lastFullYear.endPeriodCode.slice(0, 4)}, var reallønnsendringen <strong className="font-semibold text-slate-950">{formatRealWagePercent(lastFullYear.value)}</strong>, målt fra 4. kvartal til 4. kvartal.</>}{" "}
      {lastQuarter.value === null ? <>Utviklingen i {formatRealWageQuarter(lastQuarter.endPeriodCode)} kan ikke beregnes med tilgjengelige data.</>
        : <>I {formatRealWageQuarter(lastQuarter.endPeriodCode)} var endringen fra kvartalet før <strong className="font-semibold text-slate-950">{formatRealWagePercent(lastQuarter.value)}</strong>.</>}
    </p>
  </div>;
}
