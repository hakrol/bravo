import { getNorwegianPublicHolidays, toISODate } from "@/lib/helligdager";

export type VacationOpportunity = {
  startDate: Date;
  endDate: Date;
  vacationDates: Date[];
  holidayNames: string[];
  totalDaysOff: number;
};

export type VacationPlan = {
  year: number;
  availableVacationDays: number;
  usedVacationDays: number;
  remainingVacationDays: number;
  totalDaysOff: number;
  periods: VacationOpportunity[];
};

type DateBlock = {
  type: "free" | "work";
  dates: Date[];
  holidayNames: string[];
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function calculateVacationPlan({
  year,
  availableVacationDays,
  referenceDate,
}: {
  year: number;
  availableVacationDays: number;
  referenceDate: Date;
}): VacationPlan {
  const normalizedDays = Math.max(1, Math.min(25, Math.floor(availableVacationDays)));
  const opportunities = getVacationOpportunities(year, referenceDate);
  const selected = selectBestOpportunities(opportunities, normalizedDays);
  const periods = mergeSelectedOpportunities(selected);
  const usedVacationDays = periods.reduce(
    (total, period) => total + period.vacationDates.length,
    0,
  );

  return {
    year,
    availableVacationDays: normalizedDays,
    usedVacationDays,
    remainingVacationDays: normalizedDays - usedVacationDays,
    totalDaysOff: periods.reduce((total, period) => total + period.totalDaysOff, 0),
    periods,
  };
}

export function getVacationOpportunities(year: number, referenceDate: Date) {
  const holidays = [
    ...getNorwegianPublicHolidays(year - 1),
    ...getNorwegianPublicHolidays(year),
    ...getNorwegianPublicHolidays(year + 1),
  ];
  const holidaysByDate = new Map<string, string[]>();

  for (const holiday of holidays) {
    const key = toISODate(holiday.date);
    holidaysByDate.set(key, [...(holidaysByDate.get(key) ?? []), holiday.name]);
  }

  const rangeStart = new Date(Date.UTC(year - 1, 11, 20));
  const rangeEnd = new Date(Date.UTC(year + 1, 0, 10));
  const blocks = buildDateBlocks(rangeStart, rangeEnd, holidaysByDate);
  const referenceDay = getDateInOslo(referenceDate);
  const earliestVacationDate =
    referenceDay.year === year
      ? new Date(Date.UTC(referenceDay.year, referenceDay.month - 1, referenceDay.day))
      : new Date(Date.UTC(year, 0, 1));
  const opportunities: VacationOpportunity[] = [];

  for (let index = 1; index < blocks.length - 1; index += 1) {
    const block = blocks[index];
    const before = blocks[index - 1];
    const after = blocks[index + 1];

    if (
      block.type !== "work" ||
      before.type !== "free" ||
      after.type !== "free" ||
      block.dates.length < 1 ||
      block.dates.length > 4
    ) {
      continue;
    }

    const vacationDates = block.dates.filter((date) => date.getUTCFullYear() === year);
    const isFullyInsideYear = vacationDates.length === block.dates.length;
    const isStillPossible = vacationDates.every(
      (date) => date.getTime() >= earliestVacationDate.getTime(),
    );
    const holidayNames = [...new Set([...before.holidayNames, ...after.holidayNames])];

    if (!isFullyInsideYear || !isStillPossible || holidayNames.length === 0) {
      continue;
    }

    const startDate = before.dates[0];
    const endDate = after.dates[after.dates.length - 1];

    opportunities.push({
      startDate,
      endDate,
      vacationDates,
      holidayNames,
      totalDaysOff: differenceInDays(startDate, endDate) + 1,
    });
  }

  return opportunities;
}

function buildDateBlocks(
  startDate: Date,
  endDate: Date,
  holidaysByDate: Map<string, string[]>,
) {
  const blocks: DateBlock[] = [];
  let cursor = new Date(startDate);

  while (cursor.getTime() <= endDate.getTime()) {
    const holidayNames = holidaysByDate.get(toISODate(cursor)) ?? [];
    const isWeekend = cursor.getUTCDay() === 0 || cursor.getUTCDay() === 6;
    const type: DateBlock["type"] = isWeekend || holidayNames.length > 0 ? "free" : "work";
    const previous = blocks.at(-1);

    if (previous?.type === type) {
      previous.dates.push(new Date(cursor));
      previous.holidayNames.push(...holidayNames);
    } else {
      blocks.push({
        type,
        dates: [new Date(cursor)],
        holidayNames: [...holidayNames],
      });
    }

    cursor = addDays(cursor, 1);
  }

  return blocks;
}

function selectBestOpportunities(
  opportunities: VacationOpportunity[],
  availableVacationDays: number,
) {
  let bestSelection: VacationOpportunity[] = [];
  let bestScore = 0;
  let bestUsedDays = 0;

  function search(index: number, selected: VacationOpportunity[], usedDays: number) {
    const merged = mergeSelectedOpportunities(selected);
    const score = merged.reduce((total, period) => total + period.totalDaysOff, 0);

    if (
      score > bestScore ||
      (score === bestScore && score > 0 && usedDays < bestUsedDays)
    ) {
      bestSelection = [...selected];
      bestScore = score;
      bestUsedDays = usedDays;
    }

    for (let candidateIndex = index; candidateIndex < opportunities.length; candidateIndex += 1) {
      const candidate = opportunities[candidateIndex];
      const candidateDays = candidate.vacationDates.length;

      if (usedDays + candidateDays > availableVacationDays) {
        continue;
      }

      search(candidateIndex + 1, [...selected, candidate], usedDays + candidateDays);
    }
  }

  search(0, [], 0);

  return bestSelection;
}

function mergeSelectedOpportunities(opportunities: VacationOpportunity[]) {
  const sorted = [...opportunities].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );
  const merged: VacationOpportunity[] = [];

  for (const opportunity of sorted) {
    const previous = merged.at(-1);

    if (!previous || opportunity.startDate.getTime() > addDays(previous.endDate, 1).getTime()) {
      merged.push({
        ...opportunity,
        vacationDates: [...opportunity.vacationDates],
        holidayNames: [...opportunity.holidayNames],
      });
      continue;
    }

    previous.endDate =
      opportunity.endDate.getTime() > previous.endDate.getTime()
        ? opportunity.endDate
        : previous.endDate;
    previous.vacationDates = uniqueDates([
      ...previous.vacationDates,
      ...opportunity.vacationDates,
    ]);
    previous.holidayNames = [...new Set([...previous.holidayNames, ...opportunity.holidayNames])];
    previous.totalDaysOff = differenceInDays(previous.startDate, previous.endDate) + 1;
  }

  return merged;
}

function uniqueDates(dates: Date[]) {
  return [...new Map(dates.map((date) => [toISODate(date), date])).values()].sort(
    (a, b) => a.getTime() - b.getTime(),
  );
}

function differenceInDays(startDate: Date, endDate: Date) {
  return Math.round((endDate.getTime() - startDate.getTime()) / millisecondsPerDay);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function getDateInOslo(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
  };
}
