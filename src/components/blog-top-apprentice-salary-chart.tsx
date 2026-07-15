import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import apprenticeSalarySnapshot from "@/content/blog/data/best-betalte-laerlingyrker-2025.json";

type ApprenticeSalaryRow = {
  rank: number;
  code: string;
  label: string;
  value: number;
  womenMonthlyMedian: number | null;
  menMonthlyMedian: number | null;
  genderNote: string | null;
};

type ApprenticeSalarySnapshot = {
  topRows: ApprenticeSalaryRow[];
};

function getSnapshot() {
  return apprenticeSalarySnapshot as ApprenticeSalarySnapshot;
}

export function TopApprenticeSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={getSnapshot().topRows.map((row) => ({
        label: `${row.rank}. ${row.label}`,
        value: row.value,
        highlight: row.rank === 1,
      }))}
      format="currency"
      kicker="Lærlinglønn"
      note="Tallene gjelder median avtalt månedslønn for lærlinger, begge kjønn og all arbeidstid samlet."
      source="SSB tabell 12851"
      subtitleLabel="Median avtalt månedslønn"
      subtitleText="i kroner for de ti høyest betalte lærlingyrkene i 2025"
      ticks={[0, 10000, 20000, 30000, 40000, 45000]}
      title="Lagermedarbeidere og materialforvaltere topper lærlinglisten"
    />
  );
}

export function TopApprenticeGenderSalaryCards({ code }: { code: string }) {
  const row = getSnapshot().topRows.find((item) => item.code === code);

  if (!row) {
    return null;
  }

  return (
    <div>
      <BlogGenderSalaryCards
        occupationLabel={`${row.label.toLowerCase()} som lærlinger`}
        period="2025"
        source="SSB tabell 12851"
        womenMonthlyMedian={row.womenMonthlyMedian ?? "Ikke tilgjengelig"}
        menMonthlyMedian={row.menMonthlyMedian ?? "Ikke tilgjengelig"}
      />
      {row.genderNote ? <p className="text-sm text-[var(--muted-foreground)]">{row.genderNote}</p> : null}
    </div>
  );
}
