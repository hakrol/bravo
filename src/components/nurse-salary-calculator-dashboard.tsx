"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  calculateBaseSalary,
  compareTariffAreas,
  formatNok,
  formatNorwegianDate,
  getAvailablePositions,
} from "@/lib/nurse-salary-calculator";
import {
  tariffAgreements,
  tariffAreaIds,
  type NursingPosition,
  type NursingPositionId,
  type RateType,
  type TariffAreaId,
} from "@/lib/nurse-tariffs";
import type { NurseSsbBenchmark } from "@/lib/nurse-ssb-benchmarks";

export function NurseSalaryCalculator({ ssbBenchmarks }: {
  ssbBenchmarks: Partial<Record<NursingPositionId, NurseSsbBenchmark>>;
}) {
  const [tariffAreaId, setTariffAreaId] = useState<TariffAreaId>("ks");
  const [positionId, setPositionId] = useState<NursingPositionId>("nurse");
  const [seniorityYears, setSeniorityYears] = useState(6);

  const agreement = tariffAgreements[tariffAreaId];
  const positions = getAvailablePositions(tariffAreaId);
  const selectedPosition = positions.find((position) => position.id === positionId) ?? positions[0];
  const result = calculateBaseSalary(tariffAreaId, selectedPosition.id, seniorityYears);
  const comparisons = compareTariffAreas(selectedPosition, seniorityYears);
  const ssbBenchmark = ssbBenchmarks[selectedPosition.id];
  const appliedStepIndex = selectedPosition.steps.findIndex(
    (step) => step.seniorityYears === result?.appliedStepYears,
  );
  const nextStep = appliedStepIndex >= 0 ? selectedPosition.steps[appliedStepIndex + 1] : undefined;

  function selectTariffArea(nextAreaId: TariffAreaId) {
    const nextPositions = getAvailablePositions(nextAreaId);
    const nextPosition = nextPositions.find((position) => position.id === positionId) ?? nextPositions[0];
    const applicableStep = [...nextPosition.steps]
      .reverse()
      .find((step) => step.seniorityYears <= seniorityYears) ?? nextPosition.steps[0];

    setTariffAreaId(nextAreaId);
    setPositionId(nextPosition.id);
    setSeniorityYears(applicableStep.seniorityYears);
  }

  return (
    <section className="grid gap-5">
      <div className="grid overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)] lg:grid-cols-[1.08fr_1fr] lg:overflow-visible">
        <section aria-labelledby="calculator-options-title" className="p-5 sm:p-7 lg:row-span-2 lg:p-8">
          <h2 className="sr-only" id="calculator-options-title">Velg tariffområde, stilling og ansiennitet</h2>
          <div className="grid gap-6">
            <ChoiceGroup legend="1. Hvor jobber du?">
              <div className="grid gap-2.5 sm:grid-cols-3">
                {tariffAreaIds.map((areaId) => {
                  const selected = tariffAreaId === areaId;
                  return (
                    <OptionCard
                      icon={areaId}
                      key={areaId}
                      label={tariffAgreements[areaId].label}
                      name="tariff-area"
                      onChange={() => selectTariffArea(areaId)}
                      selected={selected}
                      value={areaId}
                    />
                  );
                })}
              </div>
            </ChoiceGroup>

            <ChoiceGroup legend="2. Stilling">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {positions.map((position) => (
                  <OptionCard
                    icon={position.id}
                    key={position.id}
                    label={position.label}
                    name="position"
                    onChange={() => setPositionId(position.id)}
                    selected={selectedPosition.id === position.id}
                    value={position.id}
                  />
                ))}
              </div>
            </ChoiceGroup>

            <ChoiceGroup legend="3. Ansiennitet">
              <div className={`grid gap-2 ${selectedPosition.steps.length > 8 ? "grid-cols-4 sm:grid-cols-6" : "grid-cols-3 sm:grid-cols-5"}`}>
                {selectedPosition.steps.map((step) => {
                  const selected = seniorityYears === step.seniorityYears;
                  return (
                    <label
                      className={`relative flex min-h-12 cursor-pointer items-center justify-center rounded-[7px] border px-2 py-2 text-sm font-semibold transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#14532d] ${
                        selected
                          ? "border-[#14532d] bg-[#14532d] text-white shadow-[0_8px_18px_rgba(20,83,45,0.18)]"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      key={step.seniorityYears}
                    >
                      <input
                        checked={selected}
                        className="sr-only"
                        name="seniority"
                        onChange={() => setSeniorityYears(step.seniorityYears)}
                        type="radio"
                        value={step.seniorityYears}
                      />
                      {step.seniorityYears} år
                      {selected ? <CheckBadge small /> : null}
                    </label>
                  );
                })}
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <LineIcon className="h-4 w-4" name="info" />
                Du tilhører {result?.appliedStepYears ?? 0}-årstrinnet.
              </p>
            </ChoiceGroup>
          </div>
        </section>

        {result ? (
          <ResultPanel agreement={agreement} result={result} />
        ) : null}

        {result ? (
          <NextStepPanel
            currentAnnualSalary={result.annualSalary}
            nextStep={nextStep}
          />
        ) : null}
      </div>

      {result ? (
        <SalaryProgressionChart
          appliedStepYears={result.appliedStepYears}
          position={selectedPosition}
          rateType={result.rateType}
          tariffAreaLabel={agreement.shortLabel}
        />
      ) : null}

      {result && comparisons.length > 1 ? (
        <TariffComparison
          comparisons={comparisons}
          selectedAnnualSalary={result.annualSalary}
          selectedTariffAreaId={tariffAreaId}
          specialistComparison={selectedPosition.comparisonGroup === "specialist"}
        />
      ) : null}

      {result && ssbBenchmark ? (
        <SsbMedianBenchmark
          benchmark={ssbBenchmark}
          selectedAnnualSalary={result.annualSalary}
        />
      ) : null}

      <MethodAndSources />
    </section>
  );
}

function ChoiceGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-slate-200 pb-6 last:border-0 last:pb-0">
      <legend className="mb-3 text-sm font-bold text-slate-950">{legend}</legend>
      {children}
    </fieldset>
  );
}

function OptionCard({ icon, label, name, value, selected, onChange }: {
  icon: IconName;
  label: string;
  name: string;
  value: string;
  selected: boolean;
  onChange: () => void;
}) {
  return (
    <label className={`relative flex min-h-14 cursor-pointer items-center gap-2.5 rounded-[7px] border px-3 py-2.5 pr-10 text-sm font-medium transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#14532d] ${selected ? "border-[#2f6c49] bg-[#f3f8f4] text-slate-950 shadow-[inset_0_0_0_1px_rgba(20,83,45,0.08)]" : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"}`}>
      <input checked={selected} className="sr-only" name={name} onChange={onChange} type="radio" value={value} />
      <LineIcon className={`h-6 w-6 shrink-0 ${selected ? "text-[#14532d]" : "text-slate-700"}`} name={icon} />
      <span className="leading-5">{label}</span>
      {selected ? <CheckBadge /> : null}
    </label>
  );
}

function CheckBadge({ small = false }: { small?: boolean }) {
  return (
    <span className={`absolute right-2 flex items-center justify-center rounded-full ${small ? "h-5 w-5 bg-white text-[#14532d]" : "h-5 w-5 bg-[#14532d] text-white"}`}>
      <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 12 12">
        <path d="m2.5 6 2.1 2.1 4.9-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    </span>
  );
}

function ResultPanel({ agreement, result }: {
  agreement: (typeof tariffAgreements)[TariffAreaId];
  result: NonNullable<ReturnType<typeof calculateBaseSalary>>;
}) {
  return (
    <section aria-live="polite" className="relative bg-[linear-gradient(145deg,#174f32_0%,#0e3f27_100%)] p-6 text-white sm:p-8 lg:rounded-tr-[13px]">
      <span className="absolute -left-5 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#e95d0f] shadow-[0_8px_24px_rgba(15,23,42,0.12)] lg:flex">
        <LineIcon className="h-6 w-6" name="arrow-right" />
      </span>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-emerald-100">{getResultHeading(result.rateType)}</p>
          <p className="mt-3 text-[clamp(2.8rem,6vw,4.4rem)] font-bold leading-none tracking-[-0.04em] tabular-nums">
            {formatNok(result.annualSalary)}
            <span className="ml-2 font-sans text-sm font-medium tracking-normal text-emerald-100">/ år</span>
          </p>
          <p className="mt-2 text-xl font-medium tabular-nums">{formatNok(result.monthlySalary)} <span className="text-sm text-emerald-100">/ måned</span></p>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#f97316]">
          <LineIcon className="h-7 w-7" name="wallet" />
        </span>
      </div>

      <div className="mt-5 border-t border-white/20 pt-4">
        <p className="font-semibold">{agreement.shortLabel} · {result.positionLabel} · {formatSeniority(result.seniorityYears)} ansiennitet</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-emerald-100">
          <LineIcon className="h-5 w-5" name="calendar" />
          {capitalize(result.rateType)} fra {formatNorwegianDate(agreement.validFrom)}
        </p>
      </div>

      <p className="mt-4 flex gap-3 rounded-[7px] bg-white/8 p-4 text-sm leading-6 text-emerald-50">
        <LineIcon className="mt-0.5 h-5 w-5 shrink-0" name="shield" />
        <span>{capitalize(getRateDescription(result.rateType))} – lokale og individuelle tillegg kan komme i tillegg.</span>
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-100">
        <a className="inline-flex items-center gap-1.5 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href={agreement.source.href}>
          Se lønnstabellen <LineIcon className="h-4 w-4" name="external" />
        </a>
        <span>Kilde: {agreement.source.label.replace("Norsk Sykepleierforbund – ", "NSF / ")}</span>
      </div>
    </section>
  );
}

function NextStepPanel({ currentAnnualSalary, nextStep }: {
  currentAnnualSalary: number;
  nextStep: NursingPosition["steps"][number] | undefined;
}) {
  return (
    <section className="flex min-h-24 items-center justify-between gap-5 border-t border-emerald-900/10 bg-[linear-gradient(90deg,#eff8f1,#e5f3e8)] px-6 py-4 sm:px-8 lg:rounded-br-[13px]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#184d31]">{nextStep ? "Neste lønnstrinn" : "Høyeste lønnstrinn"}</p>
        <p className="mt-1 text-xl font-semibold text-slate-950">
          {nextStep ? `${nextStep.seniorityYears} år → ${formatNok(nextStep.annualSalary)}` : "Du er på siste trinn i tabellen"}
        </p>
      </div>
      {nextStep ? (
        <div className="flex shrink-0 items-center gap-3">
          <p className="text-right text-sm text-slate-700">
            <strong className="block text-lg text-[#14532d]">+{formatNok(nextStep.annualSalary - currentAnnualSalary)}</strong>
            mer per år
          </p>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#e95d0f] shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
            <LineIcon className="h-6 w-6" name="trend-up" />
          </span>
        </div>
      ) : null}
    </section>
  );
}

function SalaryProgressionChart({ position, tariffAreaLabel, rateType, appliedStepYears }: {
  position: NursingPosition;
  tariffAreaLabel: string;
  rateType: RateType;
  appliedStepYears: number;
}) {
  return (
    <section className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)] sm:p-6">
      <h2 className="text-xl font-bold tracking-[-0.025em] text-slate-950">Lønnsutvikling etter ansiennitet</h2>
      <p className="mt-1 text-sm text-slate-500">{tariffAreaLabel} · {position.label} · {rateType} per år</p>
      <div className="mt-4 sm:hidden">
        <SalaryStepChartSvg appliedStepYears={appliedStepYears} compact position={position} />
      </div>
      <div className="mt-4 hidden sm:block">
        <SalaryStepChartSvg appliedStepYears={appliedStepYears} position={position} />
      </div>
    </section>
  );
}

function SalaryStepChartSvg({ position, appliedStepYears, compact = false }: {
  position: NursingPosition;
  appliedStepYears: number;
  compact?: boolean;
}) {
  const width = compact ? 350 : 1000;
  const height = compact ? 270 : 300;
  const margin = compact
    ? { top: 38, right: 12, bottom: 58, left: 48 }
    : { top: 42, right: 26, bottom: 58, left: 60 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maximumYear = position.steps.at(-1)?.seniorityYears ?? 1;
  const salaries = position.steps.map((step) => step.annualSalary);
  const minimumSalary = Math.floor((Math.min(...salaries) - 10_000) / 25_000) * 25_000;
  const maximumSalary = Math.ceil((Math.max(...salaries) + 10_000) / 25_000) * 25_000;
  const salaryRange = maximumSalary - minimumSalary || 1;
  const x = (year: number) => margin.left + (year / maximumYear) * plotWidth;
  const y = (salary: number) => margin.top + ((maximumSalary - salary) / salaryRange) * plotHeight;
  const yTicks = Array.from({ length: 5 }, (_, index) => minimumSalary + (salaryRange * index) / 4);
  const path = position.steps.reduce((currentPath, step, index) => {
    if (index === 0) return `M ${x(step.seniorityYears)} ${y(step.annualSalary)}`;
    return `${currentPath} H ${x(step.seniorityYears)} V ${y(step.annualSalary)}`;
  }, "");
  const shouldShowLabel = (step: NursingPosition["steps"][number], index: number) => {
    if (step.seniorityYears === appliedStepYears) return true;
    if (position.steps.length <= 6) return true;
    return index === 0 || index === position.steps.length - 1 || step.seniorityYears % (compact ? 4 : 2) === 0;
  };

  return (
    <svg className="h-auto w-full overflow-visible" role="img" viewBox={`0 0 ${width} ${height}`}>
      <title>Lønnsutvikling for {position.label}: {position.steps.map((step) => `${step.seniorityYears} år, ${formatNok(step.annualSalary)}`).join("; ")}</title>
      {yTicks.map((tick) => (
        <g key={tick}>
          <line stroke="#d7dde0" strokeDasharray="3 4" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
          <text fill="#64748b" fontSize={compact ? 9 : 12} textAnchor="end" x={margin.left - 9} y={y(tick) + 4}>{formatCompactNok(tick)}</text>
        </g>
      ))}
      <line stroke="#b8c0c5" x1={margin.left} x2={width - margin.right} y1={height - margin.bottom} y2={height - margin.bottom} />
      <line stroke="#9aa5aa" x1={x(appliedStepYears)} x2={x(appliedStepYears)} y1={y(position.steps.find((step) => step.seniorityYears === appliedStepYears)?.annualSalary ?? minimumSalary)} y2={height - margin.bottom} />
      <path d={path} fill="none" stroke="#14532d" strokeLinejoin="round" strokeWidth={compact ? 2.5 : 3} />

      {position.steps.map((step, index) => {
        const selected = step.seniorityYears === appliedStepYears;
        const showLabel = shouldShowLabel(step, index);
        return (
          <g key={step.seniorityYears}>
            {showLabel ? (
              <text fill={selected ? "#14532d" : "#111827"} fontSize={compact ? 9 : 13} fontWeight={selected ? 700 : 500} textAnchor="middle" x={x(step.seniorityYears)} y={y(step.annualSalary) - 14}>
                {formatNok(step.annualSalary)}
              </text>
            ) : null}
            <circle cx={x(step.seniorityYears)} cy={y(step.annualSalary)} fill={selected ? "#e95d0f" : "white"} r={selected ? (compact ? 5 : 7) : (compact ? 3.5 : 5)} stroke={selected ? "#e95d0f" : "#14532d"} strokeWidth="3" />
            {showLabel ? (
              <text fill="#374151" fontSize={compact ? 9 : 12} textAnchor="middle" x={x(step.seniorityYears)} y={height - margin.bottom + 23}>{step.seniorityYears} år</text>
            ) : null}
            {selected ? (
              <g transform={`translate(${x(step.seniorityYears) - (compact ? 17 : 21)} ${height - margin.bottom + 32})`}>
                <rect fill="#e95d0f" height={compact ? 17 : 20} rx="4" width={compact ? 34 : 42} />
                <text fill="white" fontSize={compact ? 8 : 10} fontWeight="700" textAnchor="middle" x={compact ? 17 : 21} y={compact ? 12 : 14}>VALGT</text>
              </g>
            ) : null}
          </g>
        );
      })}
      <text fill="#475569" fontSize={compact ? 9 : 12} textAnchor="middle" x={margin.left + plotWidth / 2} y={height - 2}>Ansiennitet</text>
    </svg>
  );
}

function TariffComparison({ comparisons, selectedTariffAreaId, selectedAnnualSalary, specialistComparison }: {
  comparisons: ReturnType<typeof compareTariffAreas>;
  selectedTariffAreaId: TariffAreaId;
  selectedAnnualSalary: number;
  specialistComparison: boolean;
}) {
  const sortedComparisons = [...comparisons].sort((a, b) => b.annualSalary - a.annualSalary);
  const salaries = sortedComparisons.map((comparison) => comparison.annualSalary);
  const minimumSalary = Math.min(...salaries);
  const maximumSalary = Math.max(...salaries);

  return (
    <section className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)] sm:p-6">
      <h2 className="text-xl font-bold tracking-[-0.025em] text-slate-950">
        {specialistComparison ? "Sammenlign KS og Spekter" : "Sammenlign KS, Spekter og Oslo kommune"}
      </h2>
      <div className="mt-4 grid gap-1.5">
        {sortedComparisons.map((comparison) => {
          const selected = comparison.tariffAreaId === selectedTariffAreaId;
          const delta = comparison.annualSalary - selectedAnnualSalary;
          const width = maximumSalary === minimumSalary
            ? 75
            : 38 + ((comparison.annualSalary - minimumSalary) / (maximumSalary - minimumSalary)) * 52;

          return (
            <div className={`grid items-center gap-3 rounded-[7px] px-3 py-3 text-sm sm:grid-cols-[minmax(9rem,0.9fr)_7.5rem_minmax(8rem,1.5fr)_7.5rem] ${selected ? "bg-[#edf7ef]" : ""}`} key={comparison.tariffAreaId}>
              <div className="flex items-center gap-3 font-medium text-slate-900">
                <LineIcon className="h-6 w-6 text-[#14532d]" name={comparison.tariffAreaId} />
                {comparison.tariffAreaLabel}
              </div>
              <strong className={`tabular-nums ${selected ? "text-[#14532d]" : "text-slate-950"}`}>{formatNok(comparison.annualSalary)}</strong>
              <div aria-hidden="true" className="hidden h-3 rounded-[2px] bg-slate-100 sm:block">
                <div className={`h-full rounded-[2px] ${selected ? "bg-[#14532d]" : comparison.annualSalary > selectedAnnualSalary ? "bg-[#dcecdf]" : "bg-slate-300"}`} style={{ width: `${width}%` }} />
              </div>
              <span className={`text-right font-semibold tabular-nums ${selected ? "text-[#14532d]" : delta > 0 ? "text-[#14532d]" : "text-[#df4b0a]"}`}>
                {selected ? "Valgt" : formatSignedNok(delta)}
              </span>
            </div>
          );
        })}
      </div>
      {specialistComparison ? <p className="mt-3 text-xs leading-5 text-slate-500">Oslo kommune er utelatt fordi datasettet ikke inneholder en tilsvarende spesialsykepleiersats.</p> : null}
    </section>
  );
}

function SsbMedianBenchmark({ benchmark, selectedAnnualSalary }: {
  benchmark: NurseSsbBenchmark;
  selectedAnnualSalary: number;
}) {
  const difference = selectedAnnualSalary - benchmark.annualMedianSalary;
  const percentageDifference = Math.abs(difference) / benchmark.annualMedianSalary * 100;
  const relation = difference === 0 ? "på nivå med" : difference > 0 ? "over" : "under";
  const occupationName = benchmark.positionId === "specialist" ? "spesialsykepleiere" : "sykepleiere";
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
          <Link
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#284f37] underline decoration-[#9ab5a0] underline-offset-4 hover:decoration-[#284f37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
            href={benchmark.occupationHref}
          >
            Se lønn for {occupationName} <LineIcon className="h-4 w-4" name="arrow-right" />
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[8px] border border-[#d8e7dc] bg-white px-4 py-4">
            <p className="text-xs font-semibold text-slate-500">SSB median avtalt årslønn · {benchmark.period}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-950">{formatNok(benchmark.annualMedianSalary)}</p>
            <p className="mt-1 text-xs text-slate-500">{formatNok(benchmark.monthlyMedianSalary)} avtalt per måned</p>
          </div>
          <div className={`rounded-[8px] border px-4 py-4 ${differenceTone}`}>
            <p className="text-xs font-semibold opacity-75">Forskjell fra SSB-medianen</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{formatSignedNok(difference)}</p>
            <p className="mt-1 text-sm font-bold">
              {difference === 0 ? "På samme nivå" : `${formatPercentage(percentageDifference)} ${relation}`}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-700">
          Din valgte tariffestede grunnlønn er <strong>{difference === 0 ? "på samme nivå som" : `${formatNok(Math.abs(difference))} ${relation}`}</strong> median avtalt årslønn for {occupationName}.
        </p>
      </div>
    </section>
  );
}

function MethodAndSources() {
  return (
    <section className="grid gap-6 rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)] sm:p-7 lg:grid-cols-[1fr_1.25fr]">
      <div className="flex gap-4 lg:border-r lg:border-slate-200 lg:pr-8">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#91a993] text-[#68816b]">
          <LineIcon className="h-6 w-6" name="info" />
        </span>
        <div>
          <h2 className="font-bold text-slate-950">Slik beregnes lønnen</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Kalkulatoren bruker tarifftrinn for valgt område, stilling og ansiennitet. Tallene viser tariffestet grunnlønn og oppdateres etter gjeldende tariffoppgjør.</p>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-slate-950">Kilder og grunnlag</h2>
        <ul className="mt-2 grid gap-2 text-sm">
          {tariffAreaIds.map((areaId) => {
            const agreement = tariffAgreements[areaId];
            return (
              <li className="flex items-center gap-2" key={agreement.source.id}>
                <LineIcon className="h-4 w-4 shrink-0 text-[#55765e]" name="document" />
                <a className="inline-flex items-center gap-1.5 font-medium text-[#284f37] underline decoration-[#9ab5a0] underline-offset-4 hover:decoration-[#284f37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]" href={agreement.source.href}>
                  {agreement.source.label} <LineIcon className="h-4 w-4" name="external" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

type IconName = TariffAreaId | NursingPositionId | "arrow-right" | "calendar" | "document" | "external" | "info" | "shield" | "trend-up" | "wallet";

function LineIcon({ name, className }: { name: IconName; className?: string }) {
  const commonProps = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.7 };
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
      {name === "ks" ? <><path {...commonProps} d="M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M9 21v-7h6v7" /></> : null}
      {name === "spekter" ? <><path {...commonProps} d="M5 21V7h5V3h4v4h5v14M3 21h18M9 11h6M12 8v6M8 17h2m4 0h2" /></> : null}
      {name === "oslo" ? <><path {...commonProps} d="M3 21h18M5 21V8h5v13M10 21V4h6v17M16 21v-9h3v9M7 11h1m-1 4h1m4-7h2m-2 4h2m-2 4h2" /></> : null}
      {name === "nurse" ? <><circle {...commonProps} cx="12" cy="8" r="4" /><path {...commonProps} d="M4 21c.8-5 3.5-7.5 8-7.5S19.2 16 20 21" /></> : null}
      {name === "specialist" ? <><path {...commonProps} d="M12 21S4 16.3 4 10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.3-8 11-8 11Z" /><path {...commonProps} d="M12 9v5m-2.5-2.5h5" /></> : null}
      {name === "arrow-right" ? <path {...commonProps} d="M5 12h14m-5-5 5 5-5 5" /> : null}
      {name === "calendar" ? <><rect {...commonProps} height="16" rx="2" width="18" x="3" y="5" /><path {...commonProps} d="M7 3v4m10-4v4M3 10h18m-14 4h2m3 0h2m3 0h1m-11 3h2m3 0h2" /></> : null}
      {name === "document" ? <><path {...commonProps} d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 3h6m-6 3h4" /></> : null}
      {name === "external" ? <><path {...commonProps} d="M14 4h6v6M20 4l-9 9M18 13v6H5V6h6" /></> : null}
      {name === "info" ? <><circle {...commonProps} cx="12" cy="12" r="9" /><path {...commonProps} d="M12 11v6m0-10v.5" /></> : null}
      {name === "shield" ? <><path {...commonProps} d="M12 3 4.5 6v5.5c0 4.5 3 7.5 7.5 9.5 4.5-2 7.5-5 7.5-9.5V6z" /><path {...commonProps} d="m9 12 2 2 4-4" /></> : null}
      {name === "trend-up" ? <><path {...commonProps} d="m4 17 5-5 4 3 7-9" /><path {...commonProps} d="M15 6h5v5" /></> : null}
      {name === "wallet" ? <><path {...commonProps} d="M4 6.5h14a2 2 0 0 1 2 2V20H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12" /><path {...commonProps} d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5Z" /></> : null}
    </svg>
  );
}

function formatSeniority(years: number) {
  return `${years} ${years === 1 ? "år" : "års"}`;
}

function formatCompactNok(amount: number) {
  return `${Math.round(amount / 1_000).toLocaleString("nb-NO")}k`;
}

function formatSignedNok(amount: number) {
  return `${amount > 0 ? "+" : "−"}${formatNok(Math.abs(amount))}`;
}

function formatPercentage(value: number) {
  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} %`;
}

function getResultHeading(rateType: RateType) {
  return rateType === "tariffestet grunnlønn" ? "Din tariffestede grunnlønn" : `Din tariffestede ${rateType}`;
}

function getRateDescription(rateType: RateType) {
  return rateType === "tariffestet grunnlønn" ? rateType : `tariffestet ${rateType}`;
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
