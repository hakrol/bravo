export type NorwegianHolidayType = "helligdag" | "høytidsdag";

export type NorwegianHoliday = {
  id: string;
  name: string;
  date: Date;
  type: NorwegianHolidayType;
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function getNorwegianPublicHolidays(year: number): NorwegianHoliday[] {
  const easterSunday = getEasterSunday(year);

  return [
    createHoliday("new-years-day", "Første nyttårsdag", year, 0, 1),
    createRelativeHoliday("maundy-thursday", "Skjærtorsdag", easterSunday, -3),
    createRelativeHoliday("good-friday", "Langfredag", easterSunday, -2),
    createRelativeHoliday("easter-sunday", "Første påskedag", easterSunday, 0),
    createRelativeHoliday("easter-monday", "Andre påskedag", easterSunday, 1),
    createHoliday("labour-day", "Arbeidernes dag (1. mai)", year, 4, 1, "høytidsdag"),
    createHoliday(
      "constitution-day",
      "Grunnlovsdagen (17. mai)",
      year,
      4,
      17,
      "høytidsdag",
    ),
    createRelativeHoliday("ascension-day", "Kristi himmelfartsdag", easterSunday, 39),
    createRelativeHoliday("whit-sunday", "Første pinsedag", easterSunday, 49),
    createRelativeHoliday("whit-monday", "Andre pinsedag", easterSunday, 50),
    createHoliday("christmas-day", "Første juledag", year, 11, 25),
    createHoliday("boxing-day", "Andre juledag", year, 11, 26),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getNorwegianPublicHolidaysForWorkYear(year: number) {
  return getNorwegianPublicHolidays(year).filter(
    (holiday) => holiday.id !== "easter-sunday" && holiday.id !== "whit-sunday",
  );
}

export function getNextNorwegianPublicHoliday(from = new Date()) {
  const osloDate = getDateInOslo(from);
  const startOfDay = new Date(Date.UTC(osloDate.year, osloDate.month - 1, osloDate.day));
  const holidays = [
    ...getNorwegianPublicHolidays(osloDate.year),
    ...getNorwegianPublicHolidays(osloDate.year + 1),
  ];
  const holiday = holidays.find((item) => item.date.getTime() >= startOfDay.getTime());

  if (!holiday) {
    return undefined;
  }

  return {
    ...holiday,
    daysUntil: Math.round((holiday.date.getTime() - startOfDay.getTime()) / millisecondsPerDay),
  };
}

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getISOWeekNumber(date: Date) {
  const thursday = new Date(date);
  const day = thursday.getUTCDay() || 7;
  thursday.setUTCDate(thursday.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));

  return Math.ceil(((thursday.getTime() - yearStart.getTime()) / millisecondsPerDay + 1) / 7);
}

function createHoliday(
  id: string,
  name: string,
  year: number,
  month: number,
  day: number,
  type: NorwegianHolidayType = "helligdag",
): NorwegianHoliday {
  return {
    id,
    name,
    date: new Date(Date.UTC(year, month, day)),
    type,
  };
}

function createRelativeHoliday(
  id: string,
  name: string,
  easterSunday: Date,
  days: number,
): NorwegianHoliday {
  return {
    id,
    name,
    date: addDays(easterSunday, days),
    type: "helligdag",
  };
}

function getEasterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(Date.UTC(year, month - 1, day));
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
