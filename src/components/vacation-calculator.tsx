"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateVacationPlan,
  type VacationOpportunity,
  type VacationPlan,
} from "@/lib/feriekalkulator";
import {
  getISOWeekNumber,
  getNorwegianPublicHolidays,
  toISODate,
  type NorwegianHoliday,
} from "@/lib/helligdager";

const supportedYears = Array.from({ length: 10 }, (_, index) => 2026 + index);
const vacationDayOptions = Array.from({ length: 25 }, (_, index) => index + 1);

export function VacationCalculator({ referenceDate }: { referenceDate: string }) {
  const currentYear = getOsloYear(new Date(referenceDate));
  const defaultYear = supportedYears.includes(currentYear) ? currentYear : supportedYears[0];
  const [year, setYear] = useState(defaultYear);
  const [vacationDays, setVacationDays] = useState(25);
  const [submitted, setSubmitted] = useState<{ year: number; vacationDays: number } | null>(null);

  const plan = useMemo(() => {
    if (!submitted) {
      return undefined;
    }

    return calculateVacationPlan({
      year: submitted.year,
      availableVacationDays: submitted.vacationDays,
      referenceDate: new Date(referenceDate),
    });
  }, [referenceDate, submitted]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted({ year, vacationDays });
  }

  return (
    <section className="grid gap-7">
      <header className="mx-auto grid max-w-3xl justify-items-center gap-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary-strong)]">
          Verktøy
        </p>
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
          Feriekalkulator
        </h1>
        <p className="max-w-3xl text-xl leading-8 text-slate-600 sm:text-2xl sm:leading-9">
          Finn inneklemte dager og se hvordan feriedagene kan fordeles for å gi mest mulig
          sammenhengende fri.
        </p>
        <Link
          className="text-sm font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
          href="/feriedager-norge"
        >
          Se alle feriedager og helligdager i Norge
        </Link>
      </header>

      <form
        className="mx-auto grid w-full max-w-3xl gap-5 rounded-[5px] border border-black/7 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-6"
        onSubmit={handleSubmit}
      >
        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          År
          <select
            className={inputClassName}
            onChange={(event) => setYear(Number(event.target.value))}
            value={year}
          >
            {supportedYears.map((optionYear) => (
              <option key={optionYear} value={optionYear}>
                {optionYear}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Feriedager til rådighet
          <select
            className={inputClassName}
            onChange={(event) => setVacationDays(Number(event.target.value))}
            value={vacationDays}
          >
            {vacationDayOptions.map((days) => (
              <option key={days} value={days}>
                {days} {days === 1 ? "dag" : "dager"}
              </option>
            ))}
          </select>
        </label>

        <button
          className="inline-flex h-11 items-center justify-center rounded-[5px] bg-[var(--primary-strong)] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(20,83,45,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
          type="submit"
        >
          Beregn
        </button>
      </form>

      {plan ? (
        <VacationPlanResult currentYear={currentYear} plan={plan} />
      ) : (
        <p className="mx-auto w-full max-w-3xl rounded-[5px] border border-dashed border-slate-300 bg-white/60 px-5 py-4 text-center text-sm text-slate-600">
          Velg år og antall feriedager for å se de beste inneklemte periodene.
        </p>
      )}
    </section>
  );
}

function VacationPlanResult({
  plan,
  currentYear,
}: {
  plan: VacationPlan;
  currentYear: number;
}) {
  if (plan.periods.length === 0) {
    return (
      <section
        aria-live="polite"
        className="mx-auto w-full max-w-3xl rounded-[5px] border border-amber-200 bg-amber-50 px-5 py-5 text-center"
      >
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-amber-950">
          Ingen inneklemte dager å optimalisere
        </h2>
        <p className="mt-2 text-sm leading-6 text-amber-900/80">
          {plan.year === currentYear
            ? `Det finnes ingen kommende inneklemte dager i ${plan.year} som kan utnyttes med feriedager.`
            : `Det finnes ingen inneklemte perioder i ${plan.year} innenfor denne beregningen.`}
        </p>
      </section>
    );
  }

  return (
    <section aria-live="polite" className="mx-auto grid w-full max-w-5xl gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Feriedager brukt" value={String(plan.usedVacationDays)} />
        <SummaryCard label="Sammenhengende fridager" value={String(plan.totalDaysOff)} />
        <SummaryCard label="Feriedager igjen" value={String(plan.remainingVacationDays)} />
      </div>

      {plan.remainingVacationDays > 0 ? (
        <p className="text-center text-lg font-medium leading-8 text-slate-950 sm:text-xl">
          Kalkulatoren har fordelt dagene som gir en reell inneklemt fordel. De resterende{" "}
          {plan.remainingVacationDays} feriedagene kan brukes som vanlig ferie.
        </p>
      ) : null}

      <div className="grid gap-4">
        {plan.periods.map((period, index) => (
          <article
            className="rounded-[5px] border border-black/7 bg-white p-5 shadow-[0_14px_38px_rgba(15,23,42,0.05)] sm:p-6"
            key={`${toISODate(period.startDate)}-${toISODate(period.endDate)}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
                  Mulighet {index + 1}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {formatDateRange(period.startDate, period.endDate)}
                </h2>
                <p className="mt-2 text-base font-medium leading-7 text-slate-950 sm:text-lg">
                  Ta fri {formatDateList(period.vacationDates)}.
                </p>
              </div>
              <span className="w-fit rounded-[5px] bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                {period.vacationDates.length} feriedager gir {period.totalDaysOff} dager fri
              </span>
            </div>
            <p className="mt-4 border-t border-black/7 pt-4 text-base leading-7 text-slate-950">
              Utnytter {period.holidayNames.join(", ")}.
            </p>
            <VacationPeriodCalendar period={period} />
          </article>
        ))}
      </div>
    </section>
  );
}

function VacationPeriodCalendar({ period }: { period: VacationOpportunity }) {
  const months = getMonthsInRange(period.startDate, period.endDate);
  const vacationDates = new Set(period.vacationDates.map(toISODate));
  const holidayYears = [...new Set(months.map(({ year }) => year))];
  const holidays = holidayYears.flatMap((year) => getNorwegianPublicHolidays(year));
  const holidaysByDate = new Map<string, NorwegianHoliday[]>();

  for (const holiday of holidays) {
    const key = toISODate(holiday.date);
    holidaysByDate.set(key, [...(holidaysByDate.get(key) ?? []), holiday]);
  }

  return (
    <div className="mt-5 border-t border-black/7 pt-5">
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
        <CalendarLegend className="bg-emerald-100 ring-emerald-200" label="Ta ferie" />
        <CalendarLegend className="bg-rose-100 ring-rose-200" label="Helligdag" />
        <CalendarLegend className="bg-sky-50 ring-sky-100" label="Helg og øvrig fri" />
      </div>
      <div className={`grid gap-4 ${months.length > 1 ? "md:grid-cols-2" : ""}`}>
        {months.map(({ year, month }) => (
          <VacationMonth
            endDate={period.endDate}
            holidaysByDate={holidaysByDate}
            key={`${year}-${month}`}
            month={month}
            startDate={period.startDate}
            vacationDates={vacationDates}
            year={year}
          />
        ))}
      </div>
    </div>
  );
}

function VacationMonth({
  year,
  month,
  startDate,
  endDate,
  vacationDates,
  holidaysByDate,
}: {
  year: number;
  month: number;
  startDate: Date;
  endDate: Date;
  vacationDates: Set<string>;
  holidaysByDate: Map<string, NorwegianHoliday[]>;
}) {
  const weeks = getCalendarWeeks(year, month);
  const monthName = new Intl.DateTimeFormat("nb-NO", {
    timeZone: "UTC",
    month: "long",
  }).format(new Date(Date.UTC(year, month, 1)));

  return (
    <div className="rounded-[5px] border border-black/7 bg-slate-50/60 p-4">
      <h3 className="text-center text-base font-semibold capitalize text-slate-950">
        {monthName} {year}
      </h3>
      <table className="mt-3 w-full table-fixed border-collapse text-center text-xs">
        <caption className="sr-only">
          Ferieforslag for {monthName} {year}
        </caption>
        <thead>
          <tr className="text-slate-500">
            <th className="w-8 py-1.5 font-medium text-slate-400" scope="col">
              Uke
            </th>
            {["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"].map((day) => (
              <th className="py-1.5 font-semibold" key={day} scope="col">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr className="border-t border-black/[0.045]" key={toISODate(week[0])}>
              <th className="py-1.5 font-medium italic text-slate-400" scope="row">
                {getISOWeekNumber(week[0])}
              </th>
              {week.map((date) => {
                const key = toISODate(date);
                const isCurrentMonth = date.getUTCMonth() === month;
                const isInPeriod =
                  date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime();
                const isVacation = vacationDates.has(key);
                const dateHolidays = holidaysByDate.get(key) ?? [];
                const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
                const title = isVacation
                  ? "Ta ferie"
                  : dateHolidays.map((holiday) => holiday.name).join(", ") ||
                    (isWeekend && isInPeriod ? "Helg" : undefined);

                return (
                  <td className="p-0.5" key={key}>
                    {isCurrentMonth ? (
                      <time
                        aria-label={title ? `${formatFullDate(date)}. ${title}` : formatFullDate(date)}
                        className={[
                          "flex aspect-square min-h-8 items-center justify-center rounded-[4px] tabular-nums",
                          isVacation
                            ? "bg-emerald-100 font-bold text-emerald-900 ring-1 ring-inset ring-emerald-200"
                            : dateHolidays.length > 0 && isInPeriod
                              ? "bg-rose-100 font-bold text-rose-800 ring-1 ring-inset ring-rose-200"
                              : isInPeriod
                                ? "bg-sky-50 font-semibold text-sky-900 ring-1 ring-inset ring-sky-100"
                                : "text-slate-400",
                        ].join(" ")}
                        dateTime={key}
                        title={title}
                      >
                        {date.getUTCDate()}
                      </time>
                    ) : (
                      <span aria-hidden="true" className="block aspect-square min-h-8" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalendarLegend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-[3px] ring-1 ring-inset ${className}`} />
      {label}
    </span>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[5px] bg-white p-5 text-center shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-slate-950">{value}</p>
    </article>
  );
}

function formatDateRange(startDate: Date, endDate: Date) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  return `${start}–${end}`;
}

function formatDateList(dates: Date[]) {
  const formatted = dates.map((date) => formatDate(date));

  if (formatted.length === 1) {
    return formatted[0];
  }

  return `${formatted.slice(0, -1).join(", ")} og ${formatted.at(-1)}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
  }).format(date);
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getMonthsInRange(startDate: Date, endDate: Date) {
  const months: Array<{ year: number; month: number }> = [];
  let year = startDate.getUTCFullYear();
  let month = startDate.getUTCMonth();
  const endYear = endDate.getUTCFullYear();
  const endMonth = endDate.getUTCMonth();

  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push({ year, month });
    month += 1;

    if (month === 12) {
      month = 0;
      year += 1;
    }
  }

  return months;
}

function getCalendarWeeks(year: number, month: number) {
  const firstDay = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  const firstMondayOffset = (firstDay.getUTCDay() + 6) % 7;
  const lastSundayOffset = (7 - lastDay.getUTCDay()) % 7;
  const startDate = addDays(firstDay, -firstMondayOffset);
  const endDate = addDays(lastDay, lastSundayOffset);
  const weeks: Date[][] = [];
  let cursor = startDate;

  while (cursor.getTime() <= endDate.getTime()) {
    weeks.push(Array.from({ length: 7 }, (_, index) => addDays(cursor, index)));
    cursor = addDays(cursor, 7);
  }

  return weeks;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function getOsloYear(date: Date) {
  return Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Oslo",
      year: "numeric",
    }).format(date),
  );
}

const inputClassName =
  "h-11 w-full rounded-[5px] border border-black/10 bg-white px-4 text-base text-slate-950 outline-none transition hover:border-black/20 focus:border-[rgba(20,83,45,0.35)] focus:ring-4 focus:ring-[rgba(20,83,45,0.1)]";
