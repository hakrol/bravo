"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getISOWeekNumber,
  getNextNorwegianPublicHoliday,
  getNorwegianPublicHolidays,
  toISODate,
  type NorwegianHoliday,
} from "@/lib/helligdager";

const supportedYears = Array.from({ length: 10 }, (_, index) => 2026 + index);
const monthNames = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;
const weekdayNames = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"] as const;

export function HolidayCalendar({ referenceDate }: { referenceDate: string }) {
  const [selectedYear, setSelectedYear] = useState(2026);
  const holidays = useMemo(() => getNorwegianPublicHolidays(selectedYear), [selectedYear]);
  const nextHoliday = useMemo(
    () => getNextNorwegianPublicHoliday(new Date(referenceDate)),
    [referenceDate],
  );

  return (
    <section className="grid gap-7">
      <header className="mx-auto grid max-w-3xl justify-items-center gap-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary-strong)]">
          Norsk årskalender
        </p>
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
          Feriedager i Norge {selectedYear}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Se feriedager og offisielle helligdager i Norge for {selectedYear}, og få en enkel
          oversikt over røde dager og neste kommende helligdag.
        </p>
        <Link
          className="text-sm font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
          href="/feriekalkulator"
        >
          Finn de beste inneklemte dagene med feriekalkulatoren
        </Link>
        <label className="grid justify-items-center gap-2 text-sm font-semibold text-slate-700">
          Velg år
          <select
            className="h-11 min-w-36 rounded-[5px] border border-black/10 bg-white px-4 text-center text-base font-semibold text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.06)] outline-none transition hover:border-black/20 focus:border-[rgba(20,83,45,0.35)] focus:ring-4 focus:ring-[rgba(20,83,45,0.1)]"
            onChange={(event) => setSelectedYear(Number(event.target.value))}
            value={selectedYear}
          >
            {supportedYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </header>

      {nextHoliday ? <NextHolidayCard holiday={nextHoliday} /> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {monthNames.map((monthName, monthIndex) => (
          <MonthCalendar
            holidays={holidays.filter((holiday) => holiday.date.getUTCMonth() === monthIndex)}
            key={monthName}
            month={monthIndex}
            monthName={monthName}
            year={selectedYear}
          />
        ))}
      </div>
    </section>
  );
}

function NextHolidayCard({
  holiday,
}: {
  holiday: NorwegianHoliday & { daysUntil: number };
}) {
  const dayText =
    holiday.daysUntil === 0
      ? "I dag"
      : holiday.daysUntil === 1
        ? "I morgen"
        : `Om ${holiday.daysUntil} dager`;

  return (
    <aside className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-4 rounded-[5px] border border-rose-100 bg-[linear-gradient(145deg,rgba(255,241,242,0.82),white)] px-5 py-5 text-center shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:flex-row sm:px-6 sm:text-left">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          Neste helligdag
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
          {holiday.name}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {formatFullDate(holiday.date)}
        </p>
      </div>
      <span className="rounded-[5px] bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-800">
        {dayText}
      </span>
    </aside>
  );
}

function MonthCalendar({
  year,
  month,
  monthName,
  holidays,
}: {
  year: number;
  month: number;
  monthName: string;
  holidays: NorwegianHoliday[];
}) {
  const weeks = getCalendarWeeks(year, month);
  const holidaysByDate = new Map<string, NorwegianHoliday[]>();

  for (const holiday of holidays) {
    const key = toISODate(holiday.date);
    holidaysByDate.set(key, [...(holidaysByDate.get(key) ?? []), holiday]);
  }

  return (
    <article className="flex min-w-0 flex-col rounded-[5px] border border-black/7 bg-white p-4 shadow-[0_14px_38px_rgba(15,23,42,0.05)] sm:p-5">
      <h2 className="border-b border-black/7 pb-3 text-center text-xl font-semibold tracking-[-0.035em] text-slate-950">
        {monthName} {year}
      </h2>
      <table className="mt-3 w-full table-fixed border-collapse text-center text-sm">
        <caption className="sr-only">
          Kalender for {monthName.toLocaleLowerCase("nb-NO")} {year}
        </caption>
        <thead>
          <tr className="text-xs font-semibold text-slate-500">
            <th className="w-8 py-1.5 font-medium text-slate-400" scope="col">
              Uke
            </th>
            {weekdayNames.map((day, index) => (
              <th
                className={`py-1.5 ${index === 6 ? "text-rose-600" : ""}`}
                key={day}
                scope="col"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr className="border-t border-black/[0.045]" key={toISODate(week[0])}>
              <th className="py-1.5 text-xs font-medium italic text-slate-400" scope="row">
                {getISOWeekNumber(week[0])}
              </th>
              {week.map((date) => {
                const isCurrentMonth = date.getUTCMonth() === month;
                const dateHolidays = holidaysByDate.get(toISODate(date)) ?? [];
                const isSunday = date.getUTCDay() === 0;
                const label = getDateLabel(date, dateHolidays);

                return (
                  <td className="p-0.5" key={toISODate(date)}>
                    {isCurrentMonth ? (
                      <time
                        aria-label={label}
                        className={[
                          "flex aspect-square min-h-8 items-center justify-center rounded-[4px] tabular-nums",
                          dateHolidays.length > 0
                            ? "bg-rose-100 font-bold text-rose-800 ring-1 ring-inset ring-rose-200"
                            : isSunday
                              ? "font-semibold text-rose-600"
                              : "text-slate-800",
                        ].join(" ")}
                        dateTime={toISODate(date)}
                        title={dateHolidays.map((holiday) => holiday.name).join(", ") || undefined}
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

      <div className="mt-4 border-t border-black/7 pt-3">
        {holidays.length > 0 ? (
          <ul className="grid gap-1.5 text-xs leading-5 text-slate-600">
            {holidays.map((holiday) => (
              <li className="flex gap-2" key={holiday.id}>
                <span className="shrink-0 font-semibold tabular-nums text-rose-700">
                  {holiday.date.getUTCDate()}.{holiday.date.getUTCMonth() + 1}.
                </span>
                <span>{holiday.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs leading-5 text-slate-400">Ingen offisielle helligdager.</p>
        )}
      </div>
    </article>
  );
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

function getDateLabel(date: Date, holidays: NorwegianHoliday[]) {
  const base = formatFullDate(date);

  if (holidays.length === 0) {
    return base;
  }

  return `${base}. ${holidays.map((holiday) => holiday.name).join(", ")}`;
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
