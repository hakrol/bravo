"use client";

import { useState } from "react";
import { calculateOvertimePay, calculateRealWage } from "@/lib/forklarer-calculators";

function readNumber(value: string) {
  return value.trim() === "" ? NaN : Number(value);
}

function money(value: number, maximumFractionDigits = 2) {
  return `${value.toLocaleString("nb-NO", { maximumFractionDigits })} kr`;
}

function NumberField({ label, value, onChange, min, exclusiveMin = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  exclusiveMin?: boolean;
}) {
  const number = readNumber(value);

  return (
    <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        aria-invalid={!Number.isFinite(number) || number < min || (exclusiveMin && number === min)}
        className="h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-base tabular-nums text-slate-950 outline-none focus:border-[#087f8c] focus:ring-4 focus:ring-cyan-800/10"
        inputMode="decimal"
        min={min}
        onChange={(event) => onChange(event.target.value)}
        required
        step="any"
        type="number"
        value={value}
      />
    </label>
  );
}

export function RealWageCalculator() {
  const [previousSalary, setPreviousSalary] = useState("50000");
  const [newSalary, setNewSalary] = useState("52500");
  const [inflation, setInflation] = useState("3");
  const result = calculateRealWage(readNumber(previousSalary), readNumber(newSalary), readNumber(inflation));
  const growth = result?.growthPercent.toLocaleString("nb-NO", {
    maximumFractionDigits: result.growthPercent !== 0 && Math.abs(result.growthPercent) < 0.05 ? 2 : 1,
    signDisplay: "exceptZero",
  });

  return (
    <fieldset className="not-prose my-7 min-w-0 rounded-2xl border border-[#cbded9] bg-white p-5 sm:p-6">
      <legend className="px-2 text-base font-semibold text-slate-950">Prøv med egne tall</legend>
      <p className="mb-5 text-sm leading-6 text-slate-600">Bruk månedslønn før skatt og prisvekst for samme periode.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField exclusiveMin label="Lønn før (kr/mnd.)" min={0} onChange={setPreviousSalary} value={previousSalary} />
        <NumberField label="Lønn etter (kr/mnd.)" min={0} onChange={setNewSalary} value={newSalary} />
        <NumberField exclusiveMin label="Prisvekst (%)" min={-100} onChange={setInflation} value={inflation} />
      </div>
      <div aria-atomic="true" aria-live="polite" className="mt-5 rounded-xl bg-[#f4f8f7] p-4">
        {result ? (
          <>
            <p className="text-sm font-medium text-slate-700">Endring i kjøpekraft</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-950">{growth} %</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ny månedslønn tilsvarer ca. {money(result.adjustedSalary, 0)} i den gamle periodens kroner.
            </p>
          </>
        ) : (
          <p className="text-sm leading-6 text-slate-700">Fyll inn gyldige tall. Lønn før må være over 0 kr, lønn etter minst 0 kr og prisvekst over −100 %.</p>
        )}
      </div>
    </fieldset>
  );
}

export function OvertimePayCalculator() {
  const [hourlyRate, setHourlyRate] = useState("250");
  const [hours, setHours] = useState("2");
  const [supplement, setSupplement] = useState("40");
  const result = calculateOvertimePay(readNumber(hourlyRate), readNumber(hours), readNumber(supplement));

  return (
    <fieldset className="not-prose my-7 min-w-0 rounded-2xl border border-[#cbded9] bg-white p-5 sm:p-6">
      <legend className="px-2 text-base font-semibold text-slate-950">Regn ut overtidsbetalingen</legend>
      <p className="mb-5 text-sm leading-6 text-slate-600">Bruk timer som gir rett til overtidstillegg, og satsen som gjelder for deg.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Timelønn (kr)" min={0} onChange={setHourlyRate} value={hourlyRate} />
        <NumberField label="Overtidstimer" min={0} onChange={setHours} value={hours} />
        <NumberField label="Overtidstillegg (%)" min={40} onChange={setSupplement} value={supplement} />
      </div>
      <div aria-atomic="true" aria-live="polite" className="mt-5 rounded-xl bg-[#f4f8f7] p-4">
        {result ? (
          <>
            <p className="text-sm font-medium text-slate-700">Samlet betaling før skatt</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-950">{money(result.total)}</p>
            <dl className="mt-3 space-y-1 text-sm text-slate-600">
              <div className="flex flex-wrap justify-between gap-x-4"><dt>Lønn for timene</dt><dd className="tabular-nums">{money(result.basePay)}</dd></div>
              <div className="flex flex-wrap justify-between gap-x-4"><dt>Overtidstillegg</dt><dd className="tabular-nums">{money(result.supplement)}</dd></div>
            </dl>
          </>
        ) : (
          <p className="text-sm leading-6 text-slate-700">Fyll inn gyldige tall. Timelønn og timer må være minst 0, og overtidstillegget minst 40 %.</p>
        )}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">Beregningen gjelder én sats og avgjør ikke hvilke timer som gir rett til tillegg.</p>
    </fieldset>
  );
}
