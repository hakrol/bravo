"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import { CalculatorPageVisual } from "@/components/calculator-page-visual";
import {
  calculateWorkYear,
  getWorkYearProfile,
  supportedWorkYears,
  workYearProfiles,
  type WorkYearProfile,
} from "@/lib/arsverk";

const inputClassName =
  "h-11 w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]";

export function WorkYearCalculatorDashboard() {
  const [profile, setProfile] = useState<WorkYearProfile>("standard");
  const [customWeeklyHours, setCustomWeeklyHours] = useState("37,5");
  const [positionPercent, setPositionPercent] = useState("100");
  const [vacationDays, setVacationDays] = useState("25");
  const [extraDaysOff, setExtraDaysOff] = useState("0");
  const [year, setYear] = useState("2026");
  const [hasCalculated, setHasCalculated] = useState(false);

  const selectedProfile = getWorkYearProfile(profile);
  const weeklyHours = selectedProfile.weeklyHours ?? parseNumber(customWeeklyHours);
  const fixedAnnualHours = selectedProfile.annualHours ?? undefined;
  const calculation = useMemo(
    () =>
      calculateWorkYear({
        year: parseInteger(year),
        weeklyHours,
        fixedAnnualHours,
        positionPercent: parseNumber(positionPercent),
        vacationDays: parseInteger(vacationDays),
        extraDaysOff: parseInteger(extraDaysOff),
      }),
    [extraDaysOff, fixedAnnualHours, positionPercent, vacationDays, weeklyHours, year],
  );

  const usesCustomHours = profile === "custom";
  const usesFixedAnnualHours = calculation.calculationMode === "fixed-annual";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasCalculated(true);
  }

  return (
    <section className="fade-up grid gap-6 lg:gap-8">
      <div className="relative overflow-visible rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(13,148,136,0.26),transparent)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <CalculatorPageVisual variant="work-year" />
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                Verktøy
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
                Årsverkkalkulator
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Bruk vår årsverkkalkulator for å beregne hvor mange arbeidstimer og arbeidsdager
                ett årsverk inneholder. Kalkulatoren viser brutto årsverk, trekker fra offentlige
                helligdager og beregner disponibel arbeidstid etter ferie og andre avtalte
                fridager. Du kan tilpasse arbeidstid, stillingsprosent og år, eller velge en egen
                årsramme for lærere.
              </p>
            </div>
          </div>

          <form
            className="grid gap-4 rounded-[5px] bg-white/75 p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] ring-1 ring-black/6 sm:p-6"
            onSubmit={handleSubmit}
          >
            <FieldRow
              htmlFor="work-year-profile"
              info={<WorkYearProfileInfo />}
              label="Timer per uke"
            >
              <select
                aria-label="Velg arbeidstidsordning"
                className={inputClassName}
                id="work-year-profile"
                onChange={(event) => setProfile(event.target.value as WorkYearProfile)}
                value={profile}
              >
                {workYearProfiles.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </FieldRow>

            {usesCustomHours ? (
              <FieldRow htmlFor="custom-weekly-hours" label="Egendefinerte timer per uke">
                <NumericInput
                  id="custom-weekly-hours"
                  onChange={setCustomWeeklyHours}
                  value={customWeeklyHours}
                />
              </FieldRow>
            ) : null}

            {usesFixedAnnualHours ? (
              <FieldRow label="Årsramme i full stilling">
                <div className={`${inputClassName} flex items-center bg-slate-50 font-semibold`}>
                  {formatNumber(calculation.fullTimeAnnualHours, 1)} timer
                </div>
              </FieldRow>
            ) : null}

            <FieldRow htmlFor="position-percent" label="Stillingsprosent">
              <InputWithSuffix
                id="position-percent"
                max="100"
                onChange={setPositionPercent}
                suffix="%"
                value={positionPercent}
              />
            </FieldRow>

            {!usesFixedAnnualHours ? (
              <FieldRow htmlFor="vacation-days" label="Antall feriedager">
                <NumericInput
                  id="vacation-days"
                  max="366"
                  onChange={setVacationDays}
                  value={vacationDays}
                />
              </FieldRow>
            ) : null}

            <FieldRow htmlFor="work-year" label="År">
              <select
                className={inputClassName}
                id="work-year"
                onChange={(event) => setYear(event.target.value)}
                value={year}
              >
                {supportedWorkYears.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </FieldRow>

            {!usesFixedAnnualHours ? (
              <FieldRow
                htmlFor="extra-days-off"
                info={
                  <FieldInfo text="Legg inn arbeidsdager du har fri utover ferie og offentlige helligdager, for eksempel avtalefestede fridager, romjul, inneklemte dager eller faste fridager i arbeidsplanen. Ikke ta med sykefravær eller andre fraværsdager du ikke kjenner på forhånd." />
                }
                label="Andre fridager"
              >
                <NumericInput
                  id="extra-days-off"
                  max="366"
                  onChange={setExtraDaysOff}
                  value={extraDaysOff}
                />
              </FieldRow>
            ) : null}

            <button
              className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-[5px] bg-[var(--primary-strong)] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(20,83,45,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
              type="submit"
            >
              Beregn årsverk
            </button>
          </form>
        </div>
      </div>

      {hasCalculated ? (
        <section
          aria-live="polite"
          className="rounded-[5px] border border-teal-200 bg-teal-50/70 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.04)] sm:p-6 lg:p-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-800">
                Ditt årsverk i {calculation.year}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                {formatNumber(calculation.availableAnnualHours, usesFixedAnnualHours ? 1 : 0)}{" "}
                {usesFixedAnnualHours ? "timer i årsverket" : "tilgjengelige timer"}
              </h2>
            </div>
            <p className="text-sm font-semibold text-teal-900">
              {formatNumber(calculation.fullTimeEquivalent, 2)} årsverk
            </p>
          </div>

          {usesFixedAnnualHours ? (
            <TeacherResults calculation={calculation} profile={profile} />
          ) : (
            <WeeklyResults calculation={calculation} />
          )}
        </section>
      ) : null}
    </section>
  );
}

function TeacherResults({
  calculation,
  profile,
}: {
  calculation: ReturnType<typeof calculateWorkYear>;
  profile: WorkYearProfile;
}) {
  const isSeniorProfile = profile === "teacher-ks-senior";

  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ResultCard
          detail="Samlet arbeidstid i full stilling, justert for valgt stillingsprosent"
          label="Lærerårsverk"
          value={`${formatNumber(calculation.grossAnnualHours, 1)} timer`}
        />
        <ResultCard
          detail="SFS 2213 legger seks arbeidsdager utenfor elevenes skoleår"
          label="Arbeidsåret"
          value="Skoleår + 6 dager"
        />
        <ResultCard
          detail="Årsverket omfatter både arbeidsplanfestet og individuelt disponert tid"
          label="Stillingsandel"
          value={`${formatNumber(calculation.positionPercent, 1)} %`}
        />
      </div>

      <p className="mt-5 border-t border-teal-900/10 pt-5 text-sm leading-6 text-slate-600">
        Lærerårsverket er en fast årsramme og reduseres derfor ikke på nytt med vanlige ferie- og
        helligdagsfratrekk i kalkulatoren.
        {isSeniorProfile
          ? " Årsrammen på 1 650 timer gjelder lærere over 60 år med en ekstra ferieuke."
          : ""}
      </p>
    </>
  );
}

function WeeklyResults({
  calculation,
}: {
  calculation: ReturnType<typeof calculateWorkYear>;
}) {
  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ResultCard
          detail="Timer per uke × 52 uker"
          info={
            <ResultInfo>
              Brutto årsverk er uketimer ganget med 52, før ferie og helligdager trekkes fra.{" "}
              <Link
                className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
                href="/forklarer/brutto-arsverk"
              >
                Les hva brutto årsverk betyr
              </Link>
              .
            </ResultInfo>
          }
          label="Brutto årsverk"
          value={`${formatNumber(calculation.grossAnnualHours, 0)} timer`}
        />
        <ResultCard
          detail={`${calculation.publicHolidaysOnWeekdays} helligdager på hverdager er trukket fra`}
          label="Uten helligdager"
          value={`${formatNumber(calculation.hoursExcludingPublicHolidays, 0)} timer`}
        />
        <ResultCard
          detail={`${calculation.vacationDays + calculation.extraDaysOff} ferie- og fridager er trukket fra`}
          label="Disponibel arbeidstid"
          value={`${formatNumber(calculation.availableAnnualHours, 0)} timer`}
        />
      </div>

      <div className="mt-6 grid gap-3 border-t border-teal-900/10 pt-5 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryValue label="Hverdager" value={String(calculation.weekdays)} />
        <SummaryValue
          label="Arbeidsdager før ferie"
          value={String(calculation.workdaysBeforeLeave)}
        />
        <SummaryValue
          label="Arbeidsdager etter fratrekk"
          value={String(calculation.availableWorkdays)}
        />
        <SummaryValue
          label="Timer per arbeidsdag"
          value={formatNumber(calculation.dailyHours, 2)}
        />
      </div>
    </>
  );
}

function WorkYearProfileInfo() {
  return (
    <details className="group relative">
      <summary
        aria-label="Vis forklaring av arbeidstidsvalgene"
        className="flex h-5 w-5 cursor-pointer list-none items-center justify-center rounded-full border border-slate-300 bg-white text-[11px] font-semibold text-slate-600 transition hover:border-teal-600 hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden"
      >
        i
      </summary>
      <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-[min(22rem,calc(100vw-3rem))] rounded-[5px] bg-slate-950 p-4 text-white shadow-[0_20px_50px_rgba(15,23,42,0.24)]">
        <p className="text-sm font-semibold">Hva betyr valgene?</p>
        <ul className="mt-3 grid gap-3">
          {workYearProfiles.map((item) => (
            <li className="grid gap-0.5 text-xs leading-5" key={item.value}>
              <strong className="text-white">{item.label}</strong>
              <span className="text-slate-300">{item.shortDescription}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

function FieldInfo({ text }: { text: string }) {
  return (
    <details className="group relative">
      <summary
        aria-label="Vis mer informasjon"
        className="flex h-5 w-5 cursor-pointer list-none items-center justify-center rounded-full border border-slate-300 bg-white text-[11px] font-semibold text-slate-600 transition hover:border-teal-600 hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden"
      >
        i
      </summary>
      <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-[min(20rem,calc(100vw-3rem))] rounded-[5px] bg-slate-950 px-4 py-3 text-xs leading-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.24)]">
        {text}
      </div>
    </details>
  );
}

function FieldRow({
  label,
  htmlFor,
  info,
  children,
}: {
  label: string;
  htmlFor?: string;
  info?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        {htmlFor ? (
          <label className="text-sm font-semibold text-slate-950" htmlFor={htmlFor}>
            {label}
          </label>
        ) : (
          <span className="text-sm font-semibold text-slate-950">{label}</span>
        )}
        {info}
      </div>
      {children}
    </div>
  );
}

function NumericInput({
  value,
  id,
  onChange,
  max,
}: {
  value: string;
  id?: string;
  onChange: (value: string) => void;
  max?: string;
}) {
  return (
    <input
      className={inputClassName}
      id={id}
      inputMode="decimal"
      max={max}
      min="0"
      onChange={(event) => onChange(sanitizeNumericInput(event.target.value))}
      type="text"
      value={value}
    />
  );
}

function InputWithSuffix({
  value,
  id,
  onChange,
  suffix,
  max,
}: {
  value: string;
  id?: string;
  onChange: (value: string) => void;
  suffix: string;
  max?: string;
}) {
  return (
    <div className="relative">
      <NumericInput id={id} max={max} onChange={onChange} value={value} />
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-500">
        {suffix}
      </span>
    </div>
  );
}

function ResultCard({
  label,
  value,
  detail,
  info,
}: {
  label: string;
  value: string;
  detail: string;
  info?: ReactNode;
}) {
  return (
    <article className="rounded-[5px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        {info}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-teal-800 tabular-nums">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
    </article>
  );
}

function ResultInfo({ children }: { children: ReactNode }) {
  return (
    <details className="group relative">
      <summary
        aria-label="Vis forklaring"
        className="flex h-5 w-5 cursor-pointer list-none items-center justify-center rounded-full border border-slate-300 bg-white text-[11px] font-semibold text-slate-600 transition hover:border-teal-600 hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden"
      >
        i
      </summary>
      <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-[min(20rem,calc(100vw-3rem))] rounded-[5px] bg-slate-950 px-4 py-3 text-xs leading-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.24)]">
        {children}
      </div>
    </details>
  );
}

function SummaryValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[5px] bg-white/70 px-4 py-3">
      <span>{label}</span>
      <strong className="tabular-nums text-slate-950">{value}</strong>
    </div>
  );
}

function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9,.]/g, "").replace(/\./g, ",");
}

function parseNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseInteger(value: string) {
  return Math.floor(parseNumber(value));
}

function formatNumber(value: number, maximumFractionDigits: number) {
  return value.toLocaleString("nb-NO", {
    minimumFractionDigits: maximumFractionDigits > 0 ? 1 : 0,
    maximumFractionDigits,
  });
}
