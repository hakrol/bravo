import { MetricInfoButton } from "@/components/metric-info-button";

type OccupationSalaryEstimateProps = {
  occupationLabel: string;
  monthlySalary?: number;
  monthlySalaryWomen?: number;
  monthlySalaryMen?: number;
};

const HOURS_PER_WEEK = 37.5;
const HOURS_PER_YEAR = 1950;
const POSITION_PERCENTAGE = 100;
const ESTIMATED_TAX_RATE = 30;
const HOLIDAY_PAY_RATE = 12;
const VACATION_WEEKS = 5;
const WORK_DAYS_PER_YEAR = 260;
const VACATION_DAYS = VACATION_WEEKS * 5;

export function OccupationSalaryEstimate({
  occupationLabel,
  monthlySalary,
  monthlySalaryWomen,
  monthlySalaryMen,
}: OccupationSalaryEstimateProps) {
  if (monthlySalary === undefined && monthlySalaryWomen === undefined && monthlySalaryMen === undefined) {
    return null;
  }

  const womenEstimate =
    monthlySalaryWomen !== undefined ? buildEstimate(monthlySalaryWomen) : undefined;
  const menEstimate = monthlySalaryMen !== undefined ? buildEstimate(monthlySalaryMen) : undefined;

  return (
    <section className="rounded-3xl border border-black/10 bg-white/75 px-6 py-6 shadow-[0_12px_40px_rgba(27,36,48,0.06)] sm:px-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
            Lønnsutregning
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Hva tilsvarer lønnen for {occupationLabel.toLowerCase()} i praksis?
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-slate-700">
            Vi har gjort et forenklet estimat basert på vanlig heltidsstilling, standard
            feriepengesats og et fast skatteanslag.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs leading-6 text-slate-600">
            <span>{formatDecimal(HOURS_PER_WEEK)} t/uke i 100 % stilling</span>
            <span>{HOURS_PER_YEAR.toLocaleString("nb-NO")} t/år</span>
            <span>{POSITION_PERCENTAGE} % stilling</span>
            <span>{ESTIMATED_TAX_RATE} % estimert skatt</span>
            <span>{HOLIDAY_PAY_RATE} % feriepengesats</span>
            <span>{VACATION_WEEKS} uker ferie</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {womenEstimate ? (
            <SalarySummaryCard
              description=""
              estimate={womenEstimate}
              title="Kvinner"
            />
          ) : null}
          {menEstimate ? (
            <SalarySummaryCard
              description=""
              estimate={menEstimate}
              title="Menn"
            />
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {womenEstimate ? (
            <HolidayPayCard
              estimate={womenEstimate}
              title="Feriepenger for kvinner"
            />
          ) : null}
          {menEstimate ? (
            <HolidayPayCard
              estimate={menEstimate}
              title="Feriepenger for menn"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

type SalaryEstimate = ReturnType<typeof buildEstimate>;

type SalarySummaryCardProps = {
  title: string;
  description: string;
  estimate: SalaryEstimate;
};

function SalarySummaryCard({ title, description, estimate }: SalarySummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#f7fafc] px-5 py-5">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-strong)]">
            {title}
          </p>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="space-y-3">
          <SummaryRow label="Avtalt månedslønn" value={formatCurrency(estimate.monthlySalary)} strong />
          <SummaryRow label="Årslønn" value={formatCurrency(estimate.annualSalary)} />
          <SummaryRow label="Timelønn" value={formatCurrency(estimate.hourlySalary)} />
          <SummaryRow label="Daglønn (7,5 t)" value={formatCurrency(estimate.dailySalary)} />
          <SummaryRow label="Skatt per måned" value={formatCurrency(estimate.monthlyTax)} />
          <SummaryRow
            label="Netto per måned"
            value={formatCurrency(estimate.netMonthlySalary)}
            tone="positive"
            strong
          />
        </div>
      </div>
    </div>
  );
}

type HolidayPayCardProps = {
  title: string;
  estimate: SalaryEstimate;
};

function HolidayPayCard({ title, estimate }: HolidayPayCardProps) {
  return (
    <SummaryCard
      accent="warm"
      footnote="Forenklet estimat basert på årslønn i 100 % stilling minus ferietrekk. For nøyaktig beløp beregnes feriepengegrunnlaget av lønn som faktisk er opptjent året før."
      title={title}
      sections={[
        {
          eyebrow: `${HOLIDAY_PAY_RATE.toLocaleString("nb-NO")} % feriepengesats | ${VACATION_WEEKS.toLocaleString("nb-NO")} uker`,
          rows: [
            { label: "Årslønn (brutto)", value: formatCurrency(estimate.annualSalary) },
            {
              label: "Feriepengegrunnlag",
              value: formatCurrency(estimate.holidayPayBasis),
              strong: true,
            },
            {
              label: "Ferietrekk",
              value: formatCurrency(estimate.holidayDeduction),
              tone: "negative",
            },
          ],
        },
        {
          rows: [
            {
              label: "Estimerte feriepenger",
              value: formatCurrency(estimate.estimatedHolidayPay),
              tone: "positive",
              strong: true,
            },
            {
              label: "Til utbetaling i juni",
              value: formatCurrency(estimate.junePayout),
              strong: true,
              description:
                "Utbetalingen i juni er her beregnet som vanlig månedslønn pluss estimerte feriepenger minus ferietrekk.",
            },
          ],
        },
      ]}
    />
  );
}

type SummaryCardSection = {
  title?: string;
  eyebrow?: string;
  rows: Array<{
    label: string;
    value: string;
    tone?: "default" | "positive" | "negative";
    strong?: boolean;
    description?: string;
  }>;
};

type SummaryCardProps = {
  title: string;
  sections: SummaryCardSection[];
  accent?: "default" | "warm";
  footnote?: string;
};

function SummaryCard({
  title,
  sections,
  accent = "default",
  footnote,
}: SummaryCardProps) {
  const accentClasses =
    accent === "warm"
      ? "border-amber-300 bg-[#fff4cf]"
      : "border-slate-200 bg-[#f7fafc]";

  return (
    <div className={`rounded-2xl border px-5 py-5 ${accentClasses}`}>
      <div className="space-y-5">
        <p className="text-sm font-semibold text-slate-900">{title}</p>

        {sections.map((section, index) => (
          <div
            key={`${title}-${index}`}
            className="space-y-3 border-b border-black/10 pb-4 last:border-b-0 last:pb-0"
          >
            {section.title ? (
              <p className="text-base font-semibold text-slate-950">{section.title}</p>
            ) : null}
            {section.eyebrow ? (
              <p className="text-sm font-medium text-[#946200]">{section.eyebrow}</p>
            ) : null}

            <div className="space-y-3">
              {section.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-4 text-sm leading-6"
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="text-slate-700">{row.label}</span>
                    {row.description ? (
                      <MetricInfoButton description={row.description} label={row.label} />
                    ) : null}
                  </div>
                  <span
                    className={[
                      "shrink-0 text-right font-semibold",
                      row.strong ? "text-base" : "text-sm",
                      row.tone === "positive"
                        ? "text-emerald-700"
                        : row.tone === "negative"
                          ? "text-red-700"
                          : "text-slate-950",
                    ].join(" ")}
                  >
                    {row.tone === "negative" ? "- " : ""}
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {footnote ? <p className="text-xs leading-6 text-slate-700">{footnote}</p> : null}
      </div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
  strong?: boolean;
};

function SummaryRow({ label, value, tone = "default", strong = false }: SummaryRowProps) {
  const toneClasses =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-slate-950";

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-black/8 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-700">{label}</span>
      <span className={`${strong ? "text-base" : "text-sm"} font-semibold ${toneClasses}`}>
        {value}
      </span>
    </div>
  );
}

function buildEstimate(monthlySalary: number) {
  const annualSalary = monthlySalary * 12;
  const hourlySalary = annualSalary / HOURS_PER_YEAR;
  const dailySalary = annualSalary / WORK_DAYS_PER_YEAR;

  const annualTax = annualSalary * (ESTIMATED_TAX_RATE / 100);
  const monthlyTax = annualTax / 12;

  const netAnnualSalary = annualSalary - annualTax;
  const netMonthlySalary = monthlySalary - monthlyTax;
  const netDailySalary = netAnnualSalary / WORK_DAYS_PER_YEAR;
  const netHourlySalary = netAnnualSalary / HOURS_PER_YEAR;

  const holidayDeduction = dailySalary * VACATION_DAYS;
  const holidayPayBasis = annualSalary - holidayDeduction;
  const estimatedHolidayPay = holidayPayBasis * (HOLIDAY_PAY_RATE / 100);
  const junePayout = monthlySalary + estimatedHolidayPay - holidayDeduction;

  return {
    monthlySalary,
    annualSalary,
    hourlySalary,
    dailySalary,
    annualTax,
    monthlyTax,
    netAnnualSalary,
    netMonthlySalary,
    netDailySalary,
    netHourlySalary,
    holidayDeduction,
    holidayPayBasis,
    estimatedHolidayPay,
    junePayout,
  };
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatDecimal(value: number) {
  return value.toLocaleString("nb-NO", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  });
}
