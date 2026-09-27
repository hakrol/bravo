"use client";

import { useState } from "react";

type Rates = { seasonalUnder18: number; seasonalUpTo12: number; seasonalOver12: number; permanentUnder18: number; permanentAdult: number; skilledSupplement: number };

export function AgricultureMinimumWageFinder({ rates }: { rates: Rates }) {
  const [age, setAge] = useState("adult"); const [employment, setEmployment] = useState("seasonal"); const [seniority, setSeniority] = useState("upTo12"); const [skilled, setSkilled] = useState(false); const [rotation, setRotation] = useState(false);
  const excluded = age === "under16" || age === "over70";
  let base = employment === "permanent" ? (age === "under18" ? rates.permanentUnder18 : rates.permanentAdult) : (age === "under18" ? rates.seasonalUnder18 : seniority === "upTo12" ? rates.seasonalUpTo12 : seniority === "over12" ? rates.seasonalOver12 : rates.permanentAdult);
  if (skilled && !excluded) base += rates.skilledSupplement;
  const weekend = rotation && !excluded ? base * 1.25 : null;
  return <section className="rounded-[12px] border border-[#cfe1d7] bg-[#f4faf6] p-5 sm:p-7" aria-labelledby="satsveiviser-title">
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#15533d]">Interaktiv satsveiviser</p><h3 className="mt-2 text-2xl font-bold text-slate-950" id="satsveiviser-title">Finn satsen som passer situasjonen din</h3>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <Field label="Alder"><select className={control} onChange={(event) => setAge(event.target.value)} value={age}><option value="under16">Under 16 år</option><option value="under18">16–17 år</option><option value="adult">18–70 år</option><option value="over70">Over 70 år</option></select></Field>
      <Field label="Arbeidsforhold"><select className={control} onChange={(event) => setEmployment(event.target.value)} value={employment}><option value="seasonal">Ferie- og innhøstingshjelp</option><option value="permanent">Fast ansatt</option></select></Field>
      {employment === "seasonal" && age === "adult" ? <Field label="Relevant praksis"><select className={control} onChange={(event) => setSeniority(event.target.value)} value={seniority}><option value="upTo12">Inntil 12 uker</option><option value="over12">Mer enn 12 uker, inntil 6 måneder</option><option value="over6">Mer enn 6 måneder</option></select></Field> : null}
      <div className="grid content-end gap-3"><Check checked={skilled} label="Jeg har relevant fagarbeiderstatus" onChange={setSkilled} /><Check checked={rotation} label="Jeg er røkter/avløser i fast turnus og jobber helg/helligdag" onChange={setRotation} /></div>
    </div>
    <div className="mt-6 rounded-[10px] bg-[#15533d] p-5 text-white">{excluded ? <><p className="text-sm font-semibold">Ingen allmenngjort sats</p><p className="mt-2 text-sm leading-6 text-white/80">Arbeidstakere under 16 år og over 70 år er ikke omfattet av disse minstesatsene. Lønn må avtales særskilt.</p></> : <><p className="text-sm text-white/75">Veiledende lovpålagt minstesats</p><p className="mt-1 text-4xl font-bold tabular-nums">{formatRate(base)}<span className="ml-2 text-base font-medium">/ time</span></p>{weekend ? <p className="mt-3 text-sm text-white/85">Med lovpålagt 25 % tillegg i den valgte turnusen: <strong>{formatRate(weekend)} per time</strong>.</p> : null}</>}</div>
    <p className="mt-3 text-xs leading-5 text-slate-600">Veiviseren er en forenkling. Virkeområde, dokumentert praksis og om fagarbeidertillegget gjelder må kunne dokumenteres.</p>
  </section>;
}

const control = "h-11 w-full rounded-[7px] border border-slate-300 bg-white px-3 text-slate-950 outline-none focus:border-[#15533d] focus:ring-4 focus:ring-[#15533d]/10";
function Field({ children, label }: { children: React.ReactNode; label: string }) { return <label className="grid gap-2 text-sm font-semibold text-slate-800"><span>{label}</span>{children}</label>; }
function Check({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) { return <label className="flex items-start gap-3 text-sm leading-5 text-slate-800"><input checked={checked} className="mt-0.5 size-4 accent-[#15533d]" onChange={(event) => onChange(event.target.checked)} type="checkbox" /><span>{label}</span></label>; }
function formatRate(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`; }
