import Link from "next/link";
import { formatNok } from "@/lib/tariff-calculator";
import type { SalaryCalculatorSsbBenchmark } from "@/lib/salary-calculator-ssb";

type BenchmarkChoice = Readonly<{ id: string; label: string }>;

export function SalaryCalculatorSsbBenchmark({
  benchmark,
  selectedAnnualSalary,
  choices,
  selectedChoiceId,
  onChoiceChange,
}: {
  benchmark: SalaryCalculatorSsbBenchmark;
  selectedAnnualSalary: number;
  choices?: readonly BenchmarkChoice[];
  selectedChoiceId?: string;
  onChoiceChange?: (id: string) => void;
}) {
  const difference = selectedAnnualSalary - benchmark.annualMedianSalary;
  const percentageDifference = Math.abs(difference) / benchmark.annualMedianSalary * 100;
  const relation = difference === 0 ? "på nivå med" : difference > 0 ? "over" : "under";
  const occupationName = benchmark.occupationLabel.toLocaleLowerCase("nb-NO");
  const differenceTone = difference < 0
    ? "border-[#f4d4c3] bg-[#fff7f2] text-[#b83b0a]"
    : "border-[#cce2d2] bg-[#eef8f1] text-[#14532d]";

  return (
    <section className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="rounded-[10px] bg-[#f5f8f5] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.025em] text-slate-950">Sammenlignet med SSB</h2>
            <p className="mt-1 text-sm text-slate-600">Slik ligger den valgte tariffgrunnlønnen an.</p>
          </div>
          <Link className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#284f37] underline decoration-[#9ab5a0] underline-offset-4 hover:decoration-[#284f37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]" href={benchmark.occupationHref}>
            Se lønn for {occupationName} <ArrowIcon />
          </Link>
        </div>

        {choices && choices.length > 1 && onChoiceChange ? (
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Velg SSB-yrke for sammenligning">
            {choices.map((choice) => {
              const selected = choice.id === selectedChoiceId;
              return (
                <button
                  aria-pressed={selected}
                  className={`rounded-[6px] border px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d] ${selected ? "border-[#2f6c49] bg-[#e5f3e8] text-[#184d31]" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                  key={choice.id}
                  onClick={() => onChoiceChange(choice.id)}
                  type="button"
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[8px] border border-[#d8e7dc] bg-white px-4 py-4">
            <p className="text-xs font-semibold text-slate-500">SSB median avtalt årslønn · {benchmark.period}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-950">{formatNok(benchmark.annualMedianSalary)}</p>
            <p className="mt-1 text-xs text-slate-500">{formatNok(benchmark.monthlyMedianSalary)} avtalt per måned</p>
          </div>
          <div className={`rounded-[8px] border px-4 py-4 ${differenceTone}`}>
            <p className="text-xs font-semibold opacity-75">Forskjell fra SSB-medianen</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{formatSignedNok(difference)}</p>
            <p className="mt-1 text-sm font-bold">{difference === 0 ? "På samme nivå" : `${formatPercentage(percentageDifference)} ${relation}`}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-700">
          Din valgte tariffestede grunnlønn er <strong>{difference === 0 ? "på samme nivå som" : `${formatNok(Math.abs(difference))} ${relation}`}</strong> median avtalt årslønn for {occupationName}.
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          SSB-tallet gjelder yrkesgruppen i alle sektorer og arbeidstider. Det er et sammenligningsgrunnlag, ikke en tariffsats.
        </p>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>;
}

function formatSignedNok(amount: number) {
  return `${amount > 0 ? "+" : amount < 0 ? "−" : ""}${formatNok(Math.abs(amount))}`;
}

function formatPercentage(value: number) {
  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} %`;
}
