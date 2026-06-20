export const workYearProfiles = [
  {
    value: "standard",
    label: "37,5 timer (standard)",
    shortDescription: "Vanlig avtalt arbeidsuke i mange norske virksomheter.",
    description:
      "37,5 timer er en vanlig avtalt arbeidsuke, selv om arbeidsmiljølovens ordinære grense er 40 timer. Brutto årsverk blir 1 950 timer før ferie og helligdager trekkes fra.",
    sourceLabel: "Arbeidstilsynet om arbeidstid",
    sourceUrl: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/",
    calculationMode: "weekly",
    weeklyHours: 37.5,
    annualHours: null,
  },
  {
    value: "forty",
    label: "40 timer",
    shortDescription: "Arbeidsmiljølovens ordinære grense for en normal arbeidsuke.",
    description:
      "40 timer er grensen for alminnelig arbeidstid i løpet av sju dager etter arbeidsmiljøloven. Brutto årsverk blir 2 080 timer før fratrekk.",
    sourceLabel: "Arbeidstilsynet om arbeidstid",
    sourceUrl: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/",
    calculationMode: "weekly",
    weeklyHours: 40,
    annualHours: null,
  },
  {
    value: "shift",
    label: "38 timer (skift/turnus)",
    shortDescription: "For arbeid som drives døgnet rundt på hverdager.",
    description:
      "38 timer brukes for arbeid som drives døgnet rundt på hverdager. Den konkrete arbeidstiden kan være regulert av arbeidsplan eller tariffavtale.",
    sourceLabel: "Arbeidstilsynet om arbeidstid",
    sourceUrl: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/",
    calculationMode: "weekly",
    weeklyHours: 38,
    annualHours: null,
  },
  {
    value: "continuous",
    label: "36 timer (helkontinuerlig)",
    shortDescription: "For arbeid som drives døgnet rundt hele uken.",
    description:
      "36 timer brukes for arbeid som drives døgnet rundt hele uken. Dette gjelder særlig belastende arbeidstidsordninger med arbeid på ulike tider av døgnet.",
    sourceLabel: "Arbeidstilsynet om arbeidstid",
    sourceUrl: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/",
    calculationMode: "weekly",
    weeklyHours: 36,
    annualHours: null,
  },
  {
    value: "teacher-ks",
    label: "Lærer i KS-området (1 687,5 timer)",
    shortDescription: "Fast årsramme for lærer i full stilling i KS-området.",
    description:
      "SFS 2213 gjelder undervisningsstillinger i grunnskolen, videregående opplæring og voksenopplæring i KS-området. Årsverket er 1 687,5 timer, og arbeidsåret er elevenes skoleår pluss seks dager til blant annet planlegging og kompetanseutvikling.",
    sourceLabel: "Utdanningsforbundet: SFS 2213 Arbeidstid skole",
    sourceUrl:
      "https://www.utdanningsforbundet.no/lonn-og-arbeidsvilkar/tariffavtaler/ks/ks-tariffavtaler/sfs-2213/",
    calculationMode: "fixed-annual",
    weeklyHours: null,
    annualHours: 1687.5,
  },
  {
    value: "teacher-ks-senior",
    label: "Lærer over 60 år i KS-området (1 650 timer)",
    shortDescription: "Redusert årsramme for lærer over 60 år i KS-området.",
    description:
      "SFS 2213 fastsetter et årsverk på 1 650 timer for lærere som er 60 år eller eldre. Avtalen regulerer også planfestet arbeidstid, individuelt disponert tid og livsfasetiltak.",
    sourceLabel: "Utdanningsforbundet: SFS 2213 Arbeidstid skole",
    sourceUrl:
      "https://www.utdanningsforbundet.no/lonn-og-arbeidsvilkar/tariffavtaler/ks/ks-tariffavtaler/sfs-2213/",
    calculationMode: "fixed-annual",
    weeklyHours: null,
    annualHours: 1650,
  },
  {
    value: "custom",
    label: "Egendefinert uketid",
    shortDescription: "Bruk uketiden som følger av din arbeidsavtale eller tariffavtale.",
    description:
      "Velg egendefinert dersom arbeidstiden din ikke passer med standardvalgene. Skriv inn avtalt uketid fra arbeidsavtalen, tariffavtalen eller arbeidsplanen din.",
    sourceLabel: "Arbeidstilsynet om arbeidstid",
    sourceUrl: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/",
    calculationMode: "weekly",
    weeklyHours: null,
    annualHours: null,
  },
] as const;

export type WorkYearProfile = (typeof workYearProfiles)[number]["value"];

export const supportedWorkYears = Array.from({ length: 16 }, (_, index) => 2020 + index);

export type WorkYearCalculationInput = {
  year: number;
  weeklyHours: number;
  fixedAnnualHours?: number;
  positionPercent: number;
  vacationDays: number;
  extraDaysOff: number;
};

export type WorkYearCalculation = {
  year: number;
  calendarDays: number;
  weekdays: number;
  publicHolidaysOnWeekdays: number;
  workdaysBeforeLeave: number;
  availableWorkdays: number;
  weeklyHours: number;
  dailyHours: number;
  calculationMode: "weekly" | "fixed-annual";
  fullTimeAnnualHours: number;
  grossAnnualHours: number;
  hoursExcludingPublicHolidays: number;
  availableAnnualHours: number;
  positionPercent: number;
  fullTimeEquivalent: number;
  vacationDays: number;
  extraDaysOff: number;
};

export function calculateWorkYear({
  year,
  weeklyHours,
  fixedAnnualHours,
  positionPercent,
  vacationDays,
  extraDaysOff,
}: WorkYearCalculationInput): WorkYearCalculation {
  const normalizedWeeklyHours = Math.max(0, weeklyHours);
  const normalizedPositionPercent = Math.min(100, Math.max(0, positionPercent));
  const normalizedVacationDays = Math.max(0, Math.floor(vacationDays));
  const normalizedExtraDaysOff = Math.max(0, Math.floor(extraDaysOff));
  const positionFactor = normalizedPositionPercent / 100;
  const adjustedWeeklyHours = normalizedWeeklyHours * positionFactor;
  const dailyHours = adjustedWeeklyHours / 5;
  const calculationMode = fixedAnnualHours === undefined ? "weekly" : "fixed-annual";
  const fullTimeAnnualHours = fixedAnnualHours ?? normalizedWeeklyHours * 52;
  const adjustedAnnualHours = fullTimeAnnualHours * positionFactor;
  const calendarDays = isLeapYear(year) ? 366 : 365;
  const weekdays = countWeekdays(year);
  const publicHolidaysOnWeekdays = countNorwegianPublicHolidaysOnWeekdays(year);
  const workdaysBeforeLeave = Math.max(0, weekdays - publicHolidaysOnWeekdays);
  const availableWorkdays = Math.max(
    0,
    workdaysBeforeLeave - normalizedVacationDays - normalizedExtraDaysOff,
  );

  return {
    year,
    calendarDays,
    weekdays,
    publicHolidaysOnWeekdays,
    workdaysBeforeLeave,
    availableWorkdays,
    weeklyHours: adjustedWeeklyHours,
    dailyHours,
    calculationMode,
    fullTimeAnnualHours,
    grossAnnualHours: adjustedAnnualHours,
    hoursExcludingPublicHolidays:
      calculationMode === "fixed-annual" ? adjustedAnnualHours : workdaysBeforeLeave * dailyHours,
    availableAnnualHours:
      calculationMode === "fixed-annual" ? adjustedAnnualHours : availableWorkdays * dailyHours,
    positionPercent: normalizedPositionPercent,
    fullTimeEquivalent: normalizedPositionPercent / 100,
    vacationDays: normalizedVacationDays,
    extraDaysOff: normalizedExtraDaysOff,
  };
}

export function getWorkYearProfile(profile: WorkYearProfile) {
  return workYearProfiles.find((item) => item.value === profile) ?? workYearProfiles[0];
}

export function getPublicHolidaySummary(year: number) {
  const publicHolidayDates = getUniqueNorwegianPublicHolidayDates(year);
  const publicHolidaysOnWeekdays = publicHolidayDates.filter((date) => {
    const day = date.getUTCDay();
    return day !== 0 && day !== 6;
  }).length;

  return {
    year,
    publicHolidaysOnWeekdays,
    publicHolidaysOnWeekends: publicHolidayDates.length - publicHolidaysOnWeekdays,
  };
}

function countWeekdays(year: number) {
  let weekdays = 0;
  const date = new Date(Date.UTC(year, 0, 1));

  while (date.getUTCFullYear() === year) {
    const day = date.getUTCDay();

    if (day !== 0 && day !== 6) {
      weekdays += 1;
    }

    date.setUTCDate(date.getUTCDate() + 1);
  }

  return weekdays;
}

function countNorwegianPublicHolidaysOnWeekdays(year: number) {
  return getUniqueNorwegianPublicHolidayDates(year).filter((date) => {
    const day = date.getUTCDay();
    return day !== 0 && day !== 6;
  }).length;
}

function getUniqueNorwegianPublicHolidayDates(year: number) {
  const datesByDay = new Map(
    getNorwegianPublicHolidays(year).map((date) => [date.toISOString().slice(0, 10), date]),
  );

  return Array.from(datesByDay.values());
}

function getNorwegianPublicHolidays(year: number) {
  const easterSunday = getEasterSunday(year);

  return [
    new Date(Date.UTC(year, 0, 1)),
    addDays(easterSunday, -3),
    addDays(easterSunday, -2),
    addDays(easterSunday, 1),
    new Date(Date.UTC(year, 4, 1)),
    new Date(Date.UTC(year, 4, 17)),
    addDays(easterSunday, 39),
    addDays(easterSunday, 50),
    new Date(Date.UTC(year, 11, 25)),
    new Date(Date.UTC(year, 11, 26)),
  ];
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

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
