"use client";

import { useId, useMemo, useState } from "react";
import { QuarterlyRealWageExplorer } from "@/components/quarterly-real-wage-explorer";
import { RealWageSummaryCard } from "@/components/real-wage-summary-card";
import { buildOccupationRealWageDataset, searchRealWageOccupations, type OccupationRealWageData } from "@/lib/occupation-real-wage";
import { calculateQuarterlyRealWageSummary } from "@/lib/quarterly-real-wage";

type RealWageOccupationOverviewProps = {
  data: OccupationRealWageData;
  initialOccupationCode?: string;
};

export function RealWageOccupationOverview({ data, initialOccupationCode }: RealWageOccupationOverviewProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [occupationCode, setOccupationCode] = useState(() => data.occupations.find((item) => item.code === initialOccupationCode)?.code
    ?? data.occupations[0]?.code ?? "");
  const matches = useMemo(() => searchRealWageOccupations(data.occupations, query), [data, query]);
  const dataset = useMemo(() => occupationCode ? buildOccupationRealWageDataset(data, occupationCode) : null, [data, occupationCode]);
  const summary = useMemo(() => calculateQuarterlyRealWageSummary(dataset?.series[0]?.points ?? []), [dataset]);
  const showSearchResults = query.trim().length > 0;
  const stats = [
    { label: "Siste fire kvartaler", period: summary?.fourQuarters },
    { label: "Siste hele år", period: summary?.lastFullYear },
    { label: "Siste kvartal", period: summary?.lastQuarter },
  ];

  function selectOccupation(code: string) {
    setOccupationCode(code);
    setQuery("");
  }

  return (
    <section className="flex flex-col gap-6 border-t border-slate-200 pt-9 sm:gap-7 sm:pt-12" aria-labelledby={`${id}-title`}>
      <header className="text-center">
        <h2 id={`${id}-title`} className="text-balance text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">Reallønnsutvikling etter yrke</h2>
        <p className="mx-auto mt-4 max-w-4xl text-lg font-medium leading-8 text-slate-700 sm:text-xl sm:leading-9">
          Velg et yrke og se hvordan reallønnen har utviklet seg fra kvartal til kvartal.
          Tallene viser median avtalt månedslønn justert for prisvekst, for begge kjønn og alle aldre.
        </p>
      </header>
      {data.occupations.length ? <>
        <div className="rounded-[6px] border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor={`${id}-search`} className="mb-2 block text-sm font-semibold text-slate-800">Søk etter yrke</label>
              <input id={`${id}-search`} type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && matches.length && showSearchResults) {
                    event.preventDefault();
                    selectOccupation(matches[0].code);
                  } else if (event.key === "Escape") setQuery("");
                }}
                placeholder="F.eks. elektriker eller sykepleier" autoComplete="off" aria-controls={showSearchResults ? `${id}-matches` : undefined}
                aria-describedby={`${id}-results`}
                className="min-h-12 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-base text-slate-950 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d]" />
              {showSearchResults ? <div id={`${id}-matches`} className="mt-2 max-h-64 overflow-y-auto rounded-md border border-slate-200 bg-white">
                {matches.length ? <ul aria-label="Søkeresultater for yrke" className="divide-y divide-slate-100">
                  {matches.map((item) => <li key={item.code}>
                    <button type="button" onClick={() => selectOccupation(item.code)}
                      aria-pressed={item.code === occupationCode}
                      className="flex min-h-12 w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0b376d]">
                      <span>{item.label}</span>
                      <span className="shrink-0 text-xs text-slate-500">{item.code === occupationCode ? "Valgt" : "Velg"}</span>
                    </button>
                  </li>)}
                </ul> : <p className="px-3 py-4 text-sm text-slate-600">Ingen yrker matcher søket. Prøv et annet søkeord.</p>}
              </div> : null}
            </div>
            <div className="min-w-0">
              <label htmlFor={`${id}-occupation`} className="mb-2 block text-sm font-semibold text-slate-800">Velg yrke</label>
              <select id={`${id}-occupation`} value={occupationCode} onChange={(event) => selectOccupation(event.target.value)}
                className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-3 text-base text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d]">
                {data.occupations.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
              </select>
            </div>
          </div>
          <p id={`${id}-results`} role="status" className="mt-3 text-xs leading-5 text-slate-500">
            {showSearchResults
              ? matches.length ? `${matches.length} treff. Velg et yrke i trefflisten, eller trykk Enter for første treff.` : "Ingen treff. Prøv et annet søkeord."
              : `${data.occupations.length} yrker. Søk eller velg fra listen.`}
          </p>
        </div>
        {dataset ? <>
          <dl aria-label="Nøkkeltall for valgt yrke" className="grid gap-3 sm:grid-cols-3" aria-live="polite">
            {stats.map(({ label, period }) => <RealWageSummaryCard key={label} label={label}
              value={period?.value ?? null} period={period} variant="minimal" />)}
          </dl>
          <QuarterlyRealWageExplorer key={occupationCode} dataset={dataset} variant="occupation" annotation={summary ? {
            startPeriodCode: summary.highlightStartPeriodCode,
            endPeriodCode: summary.fourQuarters.endPeriodCode,
            value: summary.fourQuarters.value,
          } : undefined} />
        </> : null}
      </> : <p className="text-center text-sm text-slate-600">Ingen yrker med tilgjengelige lønnstall.</p>}
    </section>
  );
}
