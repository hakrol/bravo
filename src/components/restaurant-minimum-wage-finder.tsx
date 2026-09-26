"use client";

import { useState } from "react";

type Rates = { under17: number; age17: number; age18: number; adult: number };

export function RestaurantMinimumWageFinder({ rates }: { rates: Rates }) {
  const [age, setAge] = useState("20+");
  const [practice, setPractice] = useState("4+");
  const result = getResult(age, practice, rates);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#cfded6] bg-[#f7faf8] shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
      <div className="border-b border-[#dce7e1] bg-white px-5 py-5 sm:px-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)]">Veiledende satsvelger</p>
        <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-950">Finn den lovpålagte satsen din</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">Velg alder og praksis opptjent etter at du fylte 18 år.</p>
      </div>
      <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
        <label className="grid gap-2 text-sm font-semibold text-slate-800">Alder
          <select className="rounded-[8px] border border-slate-300 bg-white px-3 py-3 font-normal" onChange={(event) => setAge(event.target.value)} value={age}>
            <option value="under17">Under 17 år</option><option value="17">17 år</option><option value="18">18 år</option><option value="19">19 år</option><option value="20+">20 år eller eldre</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-800">Praksis etter fylte 18 år
          <select className="rounded-[8px] border border-slate-300 bg-white px-3 py-3 font-normal disabled:bg-slate-100 disabled:text-slate-400" disabled={age === "under17" || age === "17" || age === "20+"} onChange={(event) => setPractice(event.target.value)} value={practice}>
            <option value="under4">Under fire måneder</option><option value="4+">Minst fire måneder</option>
          </select>
        </label>
      </div>
      <div aria-live="polite" className="mx-5 mb-6 rounded-[10px] bg-[#15533d] px-5 py-5 text-white sm:mx-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">Lovpålagt minimum</p>
        <p className="mt-2 text-4xl font-bold tabular-nums">{formatRate(result.rate)}<span className="ml-2 text-base font-medium text-white/75">/ time</span></p>
        <p className="mt-2 text-sm leading-6 text-white/85">{result.explanation}</p>
      </div>
      <p className="px-5 pb-6 text-xs leading-5 text-slate-500 sm:px-7">Resultatet forutsetter at arbeidet omfattes av forskriften. For tilkallingsvakter må arbeidsmengden tilsvare fire måneders praksis; noen spredte vakter er ikke automatisk nok.</p>
    </div>
  );
}

function getResult(age: string, practice: string, rates: Rates) {
  if (age === "under17") return { rate: rates.under17, explanation: "Satsen gjelder arbeidstakere som ennå ikke har fylt 17 år." };
  if (age === "17") return { rate: rates.age17, explanation: "Satsen gjelder fra fylte 17 år og fram til 18-årsdagen." };
  if (age === "20+") return { rate: rates.adult, explanation: "Fra fylte 20 år gjelder voksensatsen, forutsatt at arbeidet omfattes av forskriften." };
  if (practice === "4+") return { rate: rates.adult, explanation: "Etter minst fire måneders praksis opptjent etter fylte 18 år gjelder voksensatsen." };
  return { rate: rates.age18, explanation: "For 18- og 19-åringer med mindre enn fire måneders praksis etter fylte 18 år gjelder 18-årssatsen." };
}

function formatRate(value: number) {
  return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
}
