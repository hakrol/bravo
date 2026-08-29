import type { LonnsjekkOccupationOption } from "@/lib/lonnsjekk";
import type {
  OccupationSalaryDistribution,
  OccupationSalaryDistributionMetrics,
} from "@/lib/types";

export type JobOfferLeadershipLevel =
  | "none"
  | "professional"
  | "small-team"
  | "medium-team"
  | "large-team";

export type JobOfferOccupationOption = Pick<
  LonnsjekkOccupationOption,
  | "occupationCode"
  | "occupationLabel"
  | "groupCode"
  | "groupLabel"
  | "medianSalaryAll"
>;

export type JobOfferPageData = {
  options: JobOfferOccupationOption[];
  periodLabel?: string;
  updated?: string;
};

export type JobOfferInput = {
  annualSalary: number;
  currentAnnualSalary?: number;
  occupationCode: string;
  relevantExperienceYears: number;
  leadershipLevel: JobOfferLeadershipLevel;
  hasBudgetResponsibility: boolean;
};

export type JobOfferAssessment =
  | "clearly-below"
  | "below"
  | "within"
  | "upper"
  | "above";

export type JobOfferReport = {
  input: JobOfferInput;
  occupation: JobOfferOccupationOption;
  assessment: JobOfferAssessment;
  assessmentLabel: string;
  headline: string;
  summary: string;
  official: {
    p25?: number;
    median?: number;
    p75?: number;
    periodLabel?: string;
  };
  estimate: {
    lowerPercentile: number;
    upperPercentile: number;
    lowerSalary: number;
    upperSalary: number;
    midpointSalary: number;
    differenceFromLower: number;
    differenceFromUpper: number;
  };
  experience: {
    label: string;
    explanation: string;
    baseLowerPercentile: number;
    baseUpperPercentile: number;
  };
  leadership: {
    label: string;
    explanation: string;
    percentileShift: number;
    isAlreadyLeadershipOccupation: boolean;
  };
  currentSalaryComparison?: {
    difference: number;
    differencePercent: number;
  };
  confidence: {
    level: "medium" | "low";
    label: string;
    explanation: string;
  };
  negotiationAnchor: number;
  negotiationText: string;
  checklist: string[];
};

type BuildJobOfferPageDataInput = {
  options: LonnsjekkOccupationOption[];
  periodLabel?: string;
  updated?: string;
};

type BuildJobOfferReportInput = {
  input: JobOfferInput;
  data: JobOfferPageData;
  distribution?: OccupationSalaryDistribution | null;
};

const leadershipLabels: Record<JobOfferLeadershipLevel, string> = {
  none: "Ingen lederansvar",
  professional: "Fagansvar eller teamleder",
  "small-team": "Personalansvar for 1–5 personer",
  "medium-team": "Personalansvar for 6–20 personer",
  "large-team": "Personalansvar for mer enn 20 personer",
};

const leadershipPercentileShift: Record<JobOfferLeadershipLevel, number> = {
  none: 0,
  professional: 5,
  "small-team": 10,
  "medium-team": 15,
  "large-team": 20,
};

export function buildJobOfferPageData({
  options,
  periodLabel,
  updated,
}: BuildJobOfferPageDataInput): JobOfferPageData {
  return {
    options: options.map((option) => ({
      occupationCode: option.occupationCode,
      occupationLabel: option.occupationLabel,
      groupCode: option.groupCode,
      groupLabel: option.groupLabel,
      medianSalaryAll: option.medianSalaryAll,
    })),
    periodLabel,
    updated,
  };
}

export function buildJobOfferReport({
  input,
  data,
  distribution,
}: BuildJobOfferReportInput): JobOfferReport | null {
  const occupation = data.options.find(
    (option) => option.occupationCode === input.occupationCode,
  );

  if (!occupation) {
    return null;
  }

  const official = buildOfficialBenchmark(occupation, distribution, data.periodLabel);
  const experience = getExperienceBand(input.relevantExperienceYears);
  const isAlreadyLeadershipOccupation = occupation.occupationCode.startsWith("1");
  const responsibilityShift = isAlreadyLeadershipOccupation
    ? 0
    : leadershipPercentileShift[input.leadershipLevel] +
      (input.hasBudgetResponsibility ? 5 : 0);
  const lowerPercentile = Math.min(70, experience.lower + responsibilityShift);
  const upperPercentile = Math.max(
    lowerPercentile + 5,
    Math.min(75, experience.upper + responsibilityShift),
  );
  const lowerSalary = estimateSalaryAtPercentile({
    percentile: lowerPercentile,
    metrics: official,
  });
  const upperSalary = estimateSalaryAtPercentile({
    percentile: upperPercentile,
    metrics: official,
  });
  const midpointSalary = roundSalary((lowerSalary + upperSalary) / 2);
  const assessment = assessOffer(input.annualSalary, lowerSalary, upperSalary);
  const leadership = buildLeadershipExplanation({
    level: input.leadershipLevel,
    hasBudgetResponsibility: input.hasBudgetResponsibility,
    percentileShift: responsibilityShift,
    isAlreadyLeadershipOccupation,
  });
  const confidence = buildConfidence({
    hasFullDistribution:
      official.p25 !== undefined &&
      official.median !== undefined &&
      official.p75 !== undefined,
    leadershipLevel: input.leadershipLevel,
    hasBudgetResponsibility: input.hasBudgetResponsibility,
    isAlreadyLeadershipOccupation,
  });
  const negotiationAnchor = chooseNegotiationAnchor({
    assessment,
    annualSalary: input.annualSalary,
    lowerSalary,
    midpointSalary,
    upperSalary,
  });

  return {
    input,
    occupation,
    assessment,
    assessmentLabel: getAssessmentLabel(assessment),
    headline: getAssessmentHeadline(assessment),
    summary: buildSummary({
      assessment,
      annualSalary: input.annualSalary,
      occupationLabel: occupation.occupationLabel,
      lowerSalary,
      upperSalary,
    }),
    official,
    estimate: {
      lowerPercentile,
      upperPercentile,
      lowerSalary,
      upperSalary,
      midpointSalary,
      differenceFromLower: input.annualSalary - lowerSalary,
      differenceFromUpper: input.annualSalary - upperSalary,
    },
    experience: {
      label: experience.label,
      explanation: experience.explanation,
      baseLowerPercentile: experience.lower,
      baseUpperPercentile: experience.upper,
    },
    leadership,
    currentSalaryComparison:
      input.currentAnnualSalary && input.currentAnnualSalary > 0
        ? {
            difference: input.annualSalary - input.currentAnnualSalary,
            differencePercent:
              ((input.annualSalary - input.currentAnnualSalary) /
                input.currentAnnualSalary) *
              100,
          }
        : undefined,
    confidence,
    negotiationAnchor,
    negotiationText: buildNegotiationText({
      occupationLabel: occupation.occupationLabel,
      negotiationAnchor,
      relevantExperienceYears: input.relevantExperienceYears,
      leadershipLabel: leadership.label,
    }),
    checklist: buildChecklist(input),
  };
}

function buildOfficialBenchmark(
  occupation: JobOfferOccupationOption,
  distribution: OccupationSalaryDistribution | null | undefined,
  fallbackPeriodLabel?: string,
) {
  return {
    p25: annualize(distribution?.total?.p25),
    median: annualize(distribution?.total?.median ?? occupation.medianSalaryAll),
    p75: annualize(distribution?.total?.p75),
    periodLabel: distribution?.periodLabel ?? fallbackPeriodLabel,
  };
}

function getExperienceBand(years: number) {
  if (years <= 1) {
    return {
      lower: 25,
      upper: 35,
      label: "Tidlig i karrieren",
      explanation: "0–1 år relevant erfaring plasseres forsiktig rundt nedre kvartil.",
    };
  }

  if (years <= 4) {
    return {
      lower: 35,
      upper: 50,
      label: "Noe relevant erfaring",
      explanation: "2–4 år relevant erfaring anslås mellom nedre kvartil og medianen.",
    };
  }

  if (years <= 9) {
    return {
      lower: 45,
      upper: 60,
      label: "God relevant erfaring",
      explanation: "5–9 år relevant erfaring anslås rundt medianen og noe over.",
    };
  }

  if (years <= 14) {
    return {
      lower: 55,
      upper: 70,
      label: "Lang relevant erfaring",
      explanation: "10–14 år relevant erfaring anslås i den midtre til øvre delen.",
    };
  }

  return {
    lower: 60,
    upper: 75,
    label: "Svært lang relevant erfaring",
    explanation: "15 år eller mer anslås i den øvre delen av den observerte fordelingen.",
  };
}

function buildLeadershipExplanation({
  level,
  hasBudgetResponsibility,
  percentileShift,
  isAlreadyLeadershipOccupation,
}: {
  level: JobOfferLeadershipLevel;
  hasBudgetResponsibility: boolean;
  percentileShift: number;
  isAlreadyLeadershipOccupation: boolean;
}) {
  const label = leadershipLabels[level];

  if (isAlreadyLeadershipOccupation) {
    return {
      label,
      percentileShift: 0,
      isAlreadyLeadershipOccupation,
      explanation:
        "Yrket er allerede klassifisert som et lederyrke. Vi legger derfor ikke på et ekstra lederanslag.",
    };
  }

  if (percentileShift === 0) {
    return {
      label,
      percentileShift,
      isAlreadyLeadershipOccupation,
      explanation: "Det er ikke lagt inn noen justering for leder- eller budsjettansvar.",
    };
  }

  return {
    label,
    percentileShift,
    isAlreadyLeadershipOccupation,
    explanation: `${label}${hasBudgetResponsibility ? " og budsjett- eller resultatansvar" : ""} flytter det estimerte sammenligningsområdet omtrent ${percentileShift} prosentilpoeng opp.`,
  };
}

function estimateSalaryAtPercentile({
  percentile,
  metrics,
}: {
  percentile: number;
  metrics: Pick<OccupationSalaryDistributionMetrics, "p25" | "median" | "p75">;
}) {
  const p25 = metrics.p25;
  const median = metrics.median;
  const p75 = metrics.p75;

  if (p25 !== undefined && median !== undefined && p75 !== undefined) {
    if (percentile <= 50) {
      return roundSalary(p25 + (median - p25) * ((percentile - 25) / 25));
    }

    return roundSalary(median + (p75 - median) * ((percentile - 50) / 25));
  }

  const fallbackMedian = median ?? p25 ?? p75;

  if (fallbackMedian === undefined) {
    throw new Error("Mangler lønnsdata for valgt yrke.");
  }

  return roundSalary(fallbackMedian * (1 + (percentile - 50) * 0.006));
}

function assessOffer(
  annualSalary: number,
  lowerSalary: number,
  upperSalary: number,
): JobOfferAssessment {
  if (annualSalary < lowerSalary * 0.95) {
    return "clearly-below";
  }

  if (annualSalary < lowerSalary) {
    return "below";
  }

  if (annualSalary <= upperSalary) {
    return "within";
  }

  if (annualSalary <= upperSalary * 1.05) {
    return "upper";
  }

  return "above";
}

function getAssessmentLabel(assessment: JobOfferAssessment) {
  const labels: Record<JobOfferAssessment, string> = {
    "clearly-below": "Klart under anslaget",
    below: "Litt under anslaget",
    within: "Innenfor anslaget",
    upper: "I øvre del",
    above: "Over anslaget",
  };

  return labels[assessment];
}

function getAssessmentHeadline(assessment: JobOfferAssessment) {
  const headlines: Record<JobOfferAssessment, string> = {
    "clearly-below": "Tilbudet ligger klart under vårt estimerte sammenligningsområde",
    below: "Tilbudet ligger litt under vårt estimerte sammenligningsområde",
    within: "Tilbudet ligger innenfor vårt estimerte sammenligningsområde",
    upper: "Tilbudet ligger i den øvre delen av vårt estimerte nivå",
    above: "Tilbudet ligger over vårt estimerte sammenligningsområde",
  };

  return headlines[assessment];
}

function buildSummary({
  assessment,
  annualSalary,
  occupationLabel,
  lowerSalary,
  upperSalary,
}: {
  assessment: JobOfferAssessment;
  annualSalary: number;
  occupationLabel: string;
  lowerSalary: number;
  upperSalary: number;
}) {
  const offer = formatCurrency(annualSalary);
  const interval = `${formatCurrency(lowerSalary)}–${formatCurrency(upperSalary)}`;

  if (assessment === "clearly-below" || assessment === "below") {
    return `Tilbudet på ${offer} er lavere enn vårt anslag på ${interval} for en sammenlignbar ${occupationLabel.toLowerCase()}. Det kan være grunnlag for å be arbeidsgiver forklare lønnsnivået eller diskutere en justering.`;
  }

  if (assessment === "within") {
    return `Tilbudet på ${offer} ligger innenfor vårt anslag på ${interval} for en sammenlignbar ${occupationLabel.toLowerCase()}. Se også på pensjon, arbeidstid, bonus og tidspunktet for neste lønnsvurdering.`;
  }

  return `Tilbudet på ${offer} ligger høyt sammenlignet med vårt anslag på ${interval} for en sammenlignbar ${occupationLabel.toLowerCase()}. Vurder fortsatt hele pakken og hvilke forventninger som følger med rollen.`;
}

function buildConfidence({
  hasFullDistribution,
  leadershipLevel,
  hasBudgetResponsibility,
  isAlreadyLeadershipOccupation,
}: {
  hasFullDistribution: boolean;
  leadershipLevel: JobOfferLeadershipLevel;
  hasBudgetResponsibility: boolean;
  isAlreadyLeadershipOccupation: boolean;
}) {
  const hasLargeResponsibilityEstimate =
    !isAlreadyLeadershipOccupation &&
    (leadershipLevel === "large-team" || hasBudgetResponsibility);

  if (!hasFullDistribution || hasLargeResponsibilityEstimate) {
    return {
      level: "low" as const,
      label: "Lavere sikkerhet",
      explanation: !hasFullDistribution
        ? "SSB har ikke en komplett kvartilfordeling for yrket. Deler av intervallet er derfor beregnet rundt medianen."
        : "Stort leder-, budsjett- eller resultatansvar gjør anslaget mer usikkert. En egen lederkode kan være mer relevant.",
    };
  }

  return {
    level: "medium" as const,
    label: "Middels sikkerhet",
    explanation:
      "Markedsintervallet bygger på SSB. Plasseringen etter erfaring og ansvar er et åpent beregningsanslag fra Lønnsinnsikt.",
  };
}

function chooseNegotiationAnchor({
  assessment,
  annualSalary,
  lowerSalary,
  midpointSalary,
  upperSalary,
}: {
  assessment: JobOfferAssessment;
  annualSalary: number;
  lowerSalary: number;
  midpointSalary: number;
  upperSalary: number;
}) {
  if (assessment === "clearly-below") {
    return roundToNearestFiveThousand(Math.max(lowerSalary, midpointSalary));
  }

  if (assessment === "below") {
    return roundToNearestFiveThousand(midpointSalary);
  }

  if (assessment === "within") {
    return roundToNearestFiveThousand(Math.min(upperSalary, annualSalary * 1.05));
  }

  return roundToNearestFiveThousand(annualSalary);
}

function buildNegotiationText({
  occupationLabel,
  negotiationAnchor,
  relevantExperienceYears,
  leadershipLabel,
}: {
  occupationLabel: string;
  negotiationAnchor: number;
  relevantExperienceYears: number;
  leadershipLabel: string;
}) {
  const experienceText = `${relevantExperienceYears} ${relevantExperienceYears === 1 ? "års" : "års"} relevant erfaring`;
  const responsibilityText =
    leadershipLabel === leadershipLabels.none
      ? "ansvaret som følger med rollen"
      : leadershipLabel.toLowerCase();

  return `Takk for tilbudet. Basert på lønnsnivået for ${occupationLabel.toLowerCase()}, ${experienceText} og ${responsibilityText}, ønsker jeg å diskutere en fast årslønn nærmere ${formatCurrency(negotiationAnchor)}. Kan vi se på muligheten for å justere tilbudet?`;
}

function buildChecklist(input: JobOfferInput) {
  const checklist = [
    "Når skjer den første lønnsvurderingen etter oppstart?",
    "Er overtid betalt, avspasert eller inkludert i fastlønnen?",
    "Hvilken pensjonssats og hvilke forsikringer følger med?",
    "Er eventuell bonus garantert eller avhengig av måloppnåelse?",
  ];

  if (input.leadershipLevel !== "none") {
    checklist.unshift(
      "Hvilke konkrete oppgaver, fullmakter og forventninger følger med lederansvaret?",
    );
  }

  if (input.hasBudgetResponsibility) {
    checklist.unshift(
      "Hvor stort budsjett- eller resultatansvar får du, og hvordan måles resultatene?",
    );
  }

  return checklist;
}

function annualize(monthlySalary?: number) {
  return monthlySalary !== undefined ? monthlySalary * 12 : undefined;
}

function roundSalary(value: number) {
  return Math.round(value / 1000) * 1000;
}

function roundToNearestFiveThousand(value: number) {
  return Math.round(value / 5000) * 5000;
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}
