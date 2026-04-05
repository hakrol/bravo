import type {
  OccupationMedianSalaryRow,
  OccupationSalaryRow,
} from "@/lib/occupation-salary-overview";
import { getOccupationDetailHref } from "@/lib/occupation-detail-pages";
import { getOccupationGroupByCode } from "@/lib/occupation-groups";

export type DinLonnKjonn = "kvinne" | "mann";

export type DinLonnOccupationOption = {
  occupationCode: string;
  occupationLabel: string;
  groupCode: string;
  groupLabel: string;
  href: string | null;
  averageSalaryAll?: number;
  averageSalaryWomen?: number;
  averageSalaryMen?: number;
  medianSalaryAll?: number;
  medianSalaryWomen?: number;
  medianSalaryMen?: number;
  medianRank: number;
  medianPercentile: number;
};

export type DinLonnPageData = {
  options: DinLonnOccupationOption[];
  totalOccupations: number;
  averageMonthlySalaryAll?: number;
  periodLabel?: string;
  updated?: string;
};

export type DinLonnReport = {
  salary: number;
  annualSalary: number;
  gender: DinLonnKjonn;
  genderLabel: string;
  occupation: DinLonnOccupationOption;
  periodLabel?: string;
  updated?: string;
  comparisonToMedian: {
    label: string;
    value?: number;
    difference?: number;
    differencePercent?: number;
  };
  comparisonToAverage: {
    label: string;
    value?: number;
    difference?: number;
    differencePercent?: number;
  };
  comparisonToNationalAverage: {
    label: string;
    value?: number;
    difference?: number;
    differencePercent?: number;
  };
  occupationPlacement: {
    rank: number;
    total: number;
    percentile: number;
    label: string;
  };
  genderGap?: {
    womenMedian?: number;
    menMedian?: number;
    difference?: number;
    differencePercent?: number;
    label: string;
  };
  headline: string;
  summary: string;
};

type BuildDinLonnPageDataInput = {
  averageRows: OccupationSalaryRow[];
  medianRows: OccupationMedianSalaryRow[];
  averageMonthlySalaryAll?: number;
  periodLabel?: string;
  updated?: string;
};

type BuildDinLonnReportInput = {
  salary: number;
  gender: DinLonnKjonn;
  occupationCode: string;
  data: DinLonnPageData;
};

export function buildDinLonnPageData({
  averageRows,
  medianRows,
  averageMonthlySalaryAll,
  periodLabel,
  updated,
}: BuildDinLonnPageDataInput): DinLonnPageData {
  const medianRowsByCode = new Map(
    medianRows.map((row) => [row.occupationCode, row] as const),
  );
  const rankedMedianRows = medianRows
    .filter((row) => row.medianAll !== undefined)
    .sort((left, right) => (right.medianAll ?? -1) - (left.medianAll ?? -1));
  const totalOccupations = rankedMedianRows.length;
  const rankByCode = new Map(
    rankedMedianRows.map((row, index) => [row.occupationCode, index + 1] as const),
  );

  const options = averageRows
    .map((row) => {
      const medianRow = medianRowsByCode.get(row.occupationCode);
      const groupCode = row.occupationCode.charAt(0);
      const groupLabel = getOccupationGroupByCode(groupCode)?.label ?? "Andre yrker";
      const medianRank = rankByCode.get(row.occupationCode) ?? totalOccupations;
      const medianPercentile = calculatePercentile(medianRank, totalOccupations);

      return {
        occupationCode: row.occupationCode,
        occupationLabel: row.occupationLabel,
        groupCode,
        groupLabel,
        href: getOccupationDetailHref(row.occupationCode, row.occupationLabel),
        averageSalaryAll: row.salaryAll,
        averageSalaryWomen: row.salaryWomen,
        averageSalaryMen: row.salaryMen,
        medianSalaryAll: medianRow?.medianAll,
        medianSalaryWomen: medianRow?.medianWomen,
        medianSalaryMen: medianRow?.medianMen,
        medianRank,
        medianPercentile,
      } satisfies DinLonnOccupationOption;
    })
    .sort((left, right) => {
      const groupCompare = left.groupLabel.localeCompare(right.groupLabel, "nb-NO");

      if (groupCompare !== 0) {
        return groupCompare;
      }

      return left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO");
    });

  return {
    options,
    totalOccupations,
    averageMonthlySalaryAll,
    periodLabel,
    updated,
  };
}

export function buildDinLonnReport({
  salary,
  gender,
  occupationCode,
  data,
}: BuildDinLonnReportInput): DinLonnReport | null {
  const occupation = data.options.find((option) => option.occupationCode === occupationCode);

  if (!occupation) {
    return null;
  }

  const genderLabel = gender === "kvinne" ? "kvinner" : "menn";
  const selectedMedian = pickGenderValue(occupation, gender, "median");
  const selectedAverage = pickGenderValue(occupation, gender, "average");
  const comparisonToMedian = buildComparison(
    salary,
    selectedMedian,
    `Median avtalt månedslønn (${genderLabel})`,
  );
  const comparisonToAverage = buildComparison(
    salary,
    selectedAverage,
    `Gjennomsnittlig månedslønn (${genderLabel})`,
  );
  const comparisonToNationalAverage = buildComparison(
    salary,
    data.averageMonthlySalaryAll,
    "Gjennomsnitt for alle yrker",
  );
  const occupationPlacement = {
    rank: occupation.medianRank,
    total: data.totalOccupations,
    percentile: occupation.medianPercentile,
    label: getPlacementLabel(occupation.medianPercentile),
  };
  const genderGap = buildGenderGap(occupation);
  const headline = buildHeadline(comparisonToMedian.differencePercent);
  const summary = buildSummary({
    salary,
    occupationLabel: occupation.occupationLabel,
    genderLabel,
    median: comparisonToMedian.value,
    medianDifference: comparisonToMedian.difference,
  });

  return {
    salary,
    annualSalary: salary * 12,
    gender,
    genderLabel,
    occupation,
    periodLabel: data.periodLabel,
    updated: data.updated,
    comparisonToMedian,
    comparisonToAverage,
    comparisonToNationalAverage,
    occupationPlacement,
    genderGap,
    headline,
    summary,
  };
}

function pickGenderValue(
  occupation: DinLonnOccupationOption,
  gender: DinLonnKjonn,
  metric: "median" | "average",
) {
  if (metric === "median") {
    return gender === "kvinne"
      ? occupation.medianSalaryWomen ?? occupation.medianSalaryAll
      : occupation.medianSalaryMen ?? occupation.medianSalaryAll;
  }

  return gender === "kvinne"
    ? occupation.averageSalaryWomen ?? occupation.averageSalaryAll
    : occupation.averageSalaryMen ?? occupation.averageSalaryAll;
}

function buildComparison(salary: number, reference: number | undefined, label: string) {
  const difference = reference !== undefined ? salary - reference : undefined;

  return {
    label,
    value: reference,
    difference,
    differencePercent:
      difference !== undefined && reference && reference !== 0
        ? (difference / reference) * 100
        : undefined,
  };
}

function buildGenderGap(occupation: DinLonnOccupationOption) {
  const womenMedian = occupation.medianSalaryWomen;
  const menMedian = occupation.medianSalaryMen;

  if (womenMedian === undefined || menMedian === undefined || womenMedian === 0) {
    return undefined;
  }

  const difference = menMedian - womenMedian;
  const differencePercent = (difference / womenMedian) * 100;

  return {
    womenMedian,
    menMedian,
    difference,
    differencePercent,
    label:
      difference > 0
        ? "Median avtalt månedslønn for menn er høyere enn for kvinner i dette yrket."
        : difference < 0
          ? "Median avtalt månedslønn for kvinner er høyere enn for menn i dette yrket."
          : "Median avtalt månedslønn er lik for kvinner og menn i dette yrket.",
  };
}

function buildHeadline(differencePercent?: number) {
  if (differencePercent === undefined) {
    return "Her er lønnsrapporten din";
  }

  if (differencePercent >= 10) {
    return "Du ligger klart over nivået i yrket";
  }

  if (differencePercent >= 3) {
    return "Du ligger litt over nivået i yrket";
  }

  if (differencePercent <= -10) {
    return "Du ligger klart under nivået i yrket";
  }

  if (differencePercent <= -3) {
    return "Du ligger litt under nivået i yrket";
  }

  return "Du ligger omtrent på nivå med yrket";
}

function buildSummary({
  salary,
  occupationLabel,
  genderLabel,
  median,
  medianDifference,
}: {
  salary: number;
  occupationLabel: string;
  genderLabel: string;
  median?: number;
  medianDifference?: number;
}) {
  return median !== undefined && medianDifference !== undefined
    ? `Med ${formatCurrency(salary)} i brutto månedslønn ligger du ${formatDifferenceText(medianDifference)} median avtalt månedslønn for ${genderLabel} som jobber som ${occupationLabel.toLowerCase()}.`
    : `Med ${formatCurrency(salary)} i brutto månedslønn har vi ikke nok kjønnsdelte tall for median avtalt månedslønn til å sammenligne deg presist med ${occupationLabel.toLowerCase()}.`;
}

function getPlacementLabel(percentile: number) {
  if (percentile >= 90) {
    return "Yrket er blant de best betalte i landet.";
  }

  if (percentile >= 70) {
    return "Yrket ligger godt over midten i lønn.";
  }

  if (percentile >= 40) {
    return "Yrket ligger rundt midtsjiktet i lønn.";
  }

  return "Yrket ligger i den lavere delen av lønnsskalaen.";
}

function calculatePercentile(rank: number, total: number) {
  if (total <= 1) {
    return 100;
  }

  return ((total - rank) / (total - 1)) * 100;
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatDifferenceText(value: number) {
  const absoluteValue = Math.abs(value).toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  });

  if (value > 0) {
    return `${absoluteValue} kr over`;
  }

  if (value < 0) {
    return `${absoluteValue} kr under`;
  }

  return "helt likt med";
}
