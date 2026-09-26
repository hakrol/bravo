"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  calculateRetailShift,
  estimateRetailStep,
  retailRateKeys,
  retailRateLabels,
  type RetailRateKey,
  type RetailRateSet,
} from "@/lib/retail-tariff";

export function RetailRateFinder({ rateSet }: { rateSet: RetailRateSet }) {
  const [age, setAge] = useState(20);
  const [years, setYears] = useState(0);
  const [hours, setHours] = useState(37.5);
  const [education, setEducation] = useState(0);
  const [shortStudentJob, setShortStudentJob] = useState(false);
  const result = estimateRetailStep({ age, relevantYears: years, averageWeeklyHours: hours, relevantEducationYears: education, shortStudentJob });
  const rate = rateSet.rates[result.key];

  return <ToolCard>
    <div className="grid gap-4 sm:grid-cols-2">
      <NumberField label="Alder" value={age} min={13} max={80} onChange={setAge} />
      <NumberField label="Dokumenterte år fra butikk, kontor eller lager" value={years} min={0} max={30} onChange={setYears} />
      <NumberField label="Gjennomsnittlige timer per uke i praksisperioden" value={hours} min={0} max={60} step={0.5} onChange={setHours} />
      <NumberField label="År med relevant yrkesutdanning etter videregående" value={education} min={0} max={5} onChange={setEducation} />
    </div>
    {age >= 25 && <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-700"><input checked={shortStudentJob} className="mt-1" onChange={(event) => setShortStudentJob(event.target.checked)} type="checkbox" />Dette er en kortvarig jobb som skoleelev/student i ferie eller lignende.</label>}
    <div className="mt-6 rounded-[11px] bg-[linear-gradient(135deg,#1d634c,#104733)] p-5 text-white">
      <p className="text-sm text-green-100">Veiledende minsteplassering</p>
      <p className="mt-1 text-3xl font-bold">{retailRateLabels[result.key]}</p>
      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-lg"><strong>{money(rate.hourly)} / time</strong><strong>{wholeMoney(rate.monthly)} / måned</strong></div>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-green-50">{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-600">Veiledningen dekker hovedreglene, men kan ikke avgjøre innplasseringen juridisk. Dokumentasjon, typen utdanning, annet relevant arbeid, lokale lønnssystemer og særregler kan endre resultatet. Be arbeidsgiver eller tillitsvalgt kontrollere plasseringen.</p>
  </ToolCard>;
}

export function RetailShiftCalculator({ rateSet }: { rateSet: RetailRateSet }) {
  const [key, setKey] = useState<RetailRateKey>("step1");
  const [day, setDay] = useState<"weekday" | "saturday" | "sunday">("saturday");
  const [start, setStart] = useState("14:00");
  const [end, setEnd] = useState("20:00");
  const result = useMemo(() => {
    try { return calculateRetailShift({ key, day, startMinutes: toMinutes(start), endMinutes: toMinutes(end) }, rateSet); }
    catch { return null; }
  }, [day, end, key, rateSet, start]);

  return <ToolCard>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SelectField label="Lønnstrinn" value={key} onChange={(value) => setKey(value as RetailRateKey)} options={retailRateKeys.map((value) => ({ value, label: retailRateLabels[value] }))} />
      <SelectField label="Dag" value={day} onChange={(value) => setDay(value as typeof day)} options={[{ value: "weekday", label: "Mandag–fredag" }, { value: "saturday", label: "Lørdag" }, { value: "sunday", label: "Søndag" }]} />
      <TimeField label="Fra" value={start} onChange={setStart} />
      <TimeField label="Til" value={end} onChange={setEnd} />
    </div>
    {result ? <dl className="mt-6 grid gap-px overflow-hidden rounded-[5px] border border-slate-200 bg-slate-200 sm:grid-cols-3">
      {[{ label: `Grunnlønn (${number(result.hours)} t)`, value: result.base }, { label: "UB-tillegg", value: result.ub }, { label: "Totalt før skatt", value: result.total }].map((item) => <div className="bg-[#fbfbf8] p-4" key={item.label}><dt className="text-xs font-semibold uppercase tracking-[.08em] text-slate-500">{item.label}</dt><dd className="mt-2 text-2xl font-bold tabular-nums text-slate-950">{money(item.value)}</dd></div>)}
    </dl> : <p className="mt-5 rounded-[5px] bg-red-50 p-4 text-sm text-red-900">Sluttiden må være senere enn starttiden. Kalkulatoren støtter foreløpig ikke vakter over midnatt.</p>}
    <p className="mt-4 text-xs leading-5 text-slate-600">Beregningen gjelder ordinær vakt etter Virke–HK-satsene og deler tiden i riktige UB-soner. Overtid, pauser, helligdager og vakter over midnatt er ikke med. Tariffavtalen gir ikke UB-tillegg for timer som får overtids- eller skifttillegg.</p>
  </ToolCard>;
}

export function RetailTariffHistory({ rateSets }: { rateSets: RetailRateSet[] }) {
  const [key, setKey] = useState<RetailRateKey>("step1");
  const [unit, setUnit] = useState<"monthly" | "hourly">("monthly");
  const first = rateSets[0].rates[key];
  const last = rateSets.at(-1)!.rates[key];
  const points = rateSets.map((set) => ({ label: shortDate(set.effectiveFrom), value: set.rates[key][unit] }));
  const min = Math.min(...points.map((point) => point.value));
  const max = Math.max(...points.map((point) => point.value));
  const range = Math.max(max - min, 1);
  const path = points.map((point, index) => `${index ? "L" : "M"} ${40 + index * (840 / Math.max(points.length - 1, 1))} ${250 - ((point.value - min) / range) * 190}`).join(" ");
  const amount = last[unit] - first[unit];
  const percent = amount / first[unit] * 100;

  return <>
    <ToolCard>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-3"><SelectField label="Vis lønnstrinn" value={key} onChange={(value) => setKey(value as RetailRateKey)} options={retailRateKeys.slice(2).map((value) => ({ value, label: retailRateLabels[value] }))} /><SelectField label="Vis enhet" value={unit} onChange={(value) => setUnit(value as typeof unit)} options={[{ value: "monthly", label: "Månedslønn" }, { value: "hourly", label: "Timelønn" }]} /></div>
        <div className="text-right"><p className="text-xs uppercase tracking-[.1em] text-slate-500">Økning siden april 2016</p><p className="mt-1 text-xl font-bold text-slate-950">+{unit === "monthly" ? wholeMoney(amount) : money(amount)} · +{number(percent)} %</p></div>
      </div>
      <div className="mt-6 overflow-x-auto"><svg aria-label={`Utvikling for ${retailRateLabels[key]}`} className="min-w-[720px]" role="img" viewBox="0 0 920 300"><title>Tariffsatsens utvikling fra 2016 til 2026</title><line x1="40" x2="880" y1="250" y2="250" stroke="#cbd5e1"/><path d={path} fill="none" stroke="#14532d" strokeWidth="5" strokeLinejoin="round"/>{points.map((point, index) => <g key={`${point.label}-${index}`}><title>{point.label}: {unit === "monthly" ? wholeMoney(point.value) : money(point.value)}</title><circle cx={40 + index * (840 / Math.max(points.length - 1, 1))} cy={250 - ((point.value - min) / range) * 190} fill="#fff" r="5" stroke="#14532d" strokeWidth="3"/></g>)}<text x="40" y="282" fontSize="13" fill="#64748b">2016</text><text x="880" y="282" textAnchor="end" fontSize="13" fill="#64748b">2026</text></svg></div>
      <p className="mt-2 text-xs text-slate-500">Punktene følger faktiske ikrafttredelsesdatoer. Historisk timelønn er beregnet som månedslønn ÷ 162,5; 2026-timelønnen er publisert av Virke.</p>
    </ToolCard>
    <div className="mt-6 overflow-x-auto rounded-[5px] border border-black/10 bg-white"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-[#f3f5ed] text-slate-700"><tr>{["Gjelder fra", "Gjelder til", "Lønnstrinn", "Månedslønn", "Timelønn", "Endring", "Kilde"].map((heading) => <th className="px-4 py-3 font-semibold" key={heading}>{heading}</th>)}</tr></thead><tbody>{rateSets.map((set, index) => { const rate = set.rates[key]; const previous = rateSets[index - 1]?.rates[key]; return <tr className="border-t border-slate-200" key={set.effectiveFrom}><td className="px-4 py-3 tabular-nums">{date(set.effectiveFrom)}</td><td className="px-4 py-3 tabular-nums">{set.effectiveTo ? date(set.effectiveTo) : "Gjeldende"}</td><td className="px-4 py-3 font-medium">{retailRateLabels[key]}</td><td className="px-4 py-3 tabular-nums">{wholeMoney(rate.monthly)}</td><td className="px-4 py-3 tabular-nums">{money(rate.hourly)} <span className="text-xs text-slate-500">({rate.hourlyRateSource === "official" ? "offisiell" : "beregnet"})</span></td><td className="px-4 py-3 tabular-nums">{previous ? `${rate.monthly - previous.monthly >= 0 ? "+" : ""}${wholeMoney(rate.monthly - previous.monthly)}` : "–"}</td><td className="px-4 py-3"><a className="font-semibold text-[var(--primary)] hover:underline" href={set.sourceUrl}>Virke ↗</a></td></tr>; })}</tbody></table></div>
  </>;
}

function ToolCard({ children }: { children: ReactNode }) { return <div className="rounded-[11px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,.06)] sm:p-7">{children}</div>; }
function NumberField({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) { return <label className="grid gap-2 text-sm font-semibold text-slate-800">{label}<input className="h-11 rounded-[5px] border border-slate-300 px-3 font-normal" type="number" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))}/></label>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) { return <label className="grid min-w-44 gap-2 text-sm font-semibold text-slate-800">{label}<select className="h-11 rounded-[5px] border border-slate-300 bg-white px-3 font-normal" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>; }
function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="grid gap-2 text-sm font-semibold text-slate-800">{label}<input className="h-11 rounded-[5px] border border-slate-300 px-3 font-normal" type="time" value={value} onChange={(event) => onChange(event.target.value)}/></label>; }
function toMinutes(value: string) { const [hour, minute] = value.split(":").map(Number); return hour * 60 + minute; }
function money(value: number) { return `${formatNumber(value, 2)} kr`; }
function wholeMoney(value: number) { return `${formatNumber(Math.round(value), 0)} kr`; }
function number(value: number) { return formatNumber(value, 1); }

function formatNumber(value: number, fractionDigits: number) {
  const [integer, fraction] = value.toFixed(fractionDigits).split(".");
  const groupedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");

  return fraction === undefined ? groupedInteger : `${groupedInteger},${fraction}`;
}

export function RetailTariffHistoryTable({ rateSets }: { rateSets: RetailRateSet[] }) {
  const [key, setKey] = useState<RetailRateKey>("step1");

  return <ToolCard>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <SelectField label="Vis lønnstrinn" value={key} onChange={(value) => setKey(value as RetailRateKey)} options={retailRateKeys.map((value) => ({ value, label: retailRateLabels[value] }))} />
      <p className="max-w-md text-xs leading-5 text-slate-500">Velg sats for å se alle faktiske virkningsperioder. Historisk timelønn merket «beregnet» er månedslønn ÷ 162,5.</p>
    </div>
    <div className="mt-6 overflow-x-auto rounded-[5px] border border-black/10 bg-white">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-[#f3f5ed] text-slate-700"><tr>{["Gjelder fra", "Gjelder til", "Lønnstrinn", "Månedslønn", "Timelønn", "Endring", "Kilde"].map((heading) => <th className="px-4 py-3 font-semibold" key={heading}>{heading}</th>)}</tr></thead>
        <tbody>{rateSets.map((set, index) => { const rate = set.rates[key]; const previous = rateSets[index - 1]?.rates[key]; return <tr className="border-t border-slate-200" key={set.effectiveFrom}><td className="px-4 py-3 tabular-nums">{date(set.effectiveFrom)}</td><td className="px-4 py-3 tabular-nums">{set.effectiveTo ? date(set.effectiveTo) : "Gjeldende"}</td><td className="px-4 py-3 font-medium">{retailRateLabels[key]}</td><td className="px-4 py-3 tabular-nums">{wholeMoney(rate.monthly)}</td><td className="px-4 py-3 tabular-nums">{money(rate.hourly)} <span className="text-xs text-slate-500">({rate.hourlyRateSource === "official" ? "offisiell" : "beregnet"})</span></td><td className="px-4 py-3 tabular-nums">{previous ? `${rate.monthly - previous.monthly >= 0 ? "+" : ""}${wholeMoney(rate.monthly - previous.monthly)}` : "–"}</td><td className="px-4 py-3"><a className="font-semibold text-[var(--primary)] hover:underline" href={set.sourceUrl}>Virke ↗</a></td></tr>; })}</tbody>
      </table>
    </div>
  </ToolCard>;
}
function date(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

function shortDate(value: string) {
  const [year, month] = value.split("-");
  const monthNames = [
    "jan.", "feb.", "mars", "apr.", "mai", "juni",
    "juli", "aug.", "sep.", "okt.", "nov.", "des.",
  ] as const;

  return `${monthNames[Number(month) - 1]} ${year}`;
}
