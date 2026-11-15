import { formatRealWageQuarter, type QuarterlyRealWagePeriod } from "@/lib/quarterly-real-wage";
import { formatRealWagePercent } from "@/lib/real-wage-growth";

type RealWageSummaryCardProps = {
  label: string;
  value: number | null;
  period?: QuarterlyRealWagePeriod | null;
  subject?: string;
  detail?: string;
  variant?: "default" | "minimal";
};

export function RealWageSummaryCard({ label, value, period, subject, detail, variant = "default" }: RealWageSummaryCardProps) {
  const minimal = variant === "minimal";
  const tone = value === null || value === 0
    ? "border-slate-200 bg-slate-50 text-slate-600"
    : value > 0 ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700";
  return (
    <div className={`min-w-0 rounded-[6px] border py-3 ${minimal ? "border-slate-200 bg-white px-3" : `px-4 ${tone}`}`}>
      <dt className={minimal ? "text-xs font-medium leading-5 text-slate-600" : "text-base font-bold leading-6 text-slate-950"}>{label}</dt>
      {subject ? <dd className="mt-2 text-lg font-semibold leading-6 text-slate-950">{subject}</dd> : null}
      <dd className={minimal ? `mt-1 text-2xl font-semibold tracking-tight tabular-nums ${value === null || value === 0 ? "text-slate-600" : value > 0 ? "text-green-700" : "text-red-700"}` : "mt-2 text-3xl font-bold tracking-[-0.035em] tabular-nums"}>
        {value === null ? <span className="text-lg">Mangler data</span> : formatRealWagePercent(value)}
      </dd>
      <dd className="mt-2 text-[0.7rem] leading-4 text-slate-500">
        {period ? <span className="block text-slate-600">{formatRealWageQuarter(period.startPeriodCode)}–{formatRealWageQuarter(period.endPeriodCode)}</span> : null}
        {detail ? <span className="block">{detail}</span> : null}
      </dd>
    </div>
  );
}
