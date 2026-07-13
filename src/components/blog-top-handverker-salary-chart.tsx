import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import topHandverkerSnapshot from "@/content/blog/data/de-5-best-betalte-handverkeryrkene-2025.json";

type TopHandverkerSalaryRow = {
  rank: number;
  code: string;
  label: string;
  href: string;
  value: number;
  womenMonthlyMedian: number | null;
  menMonthlyMedian: number | null;
  genderNote: string | null;
};

type TopHandverkerSalarySnapshot = {
  rows: TopHandverkerSalaryRow[];
};

function getSnapshot() {
  return topHandverkerSnapshot as TopHandverkerSalarySnapshot;
}

export function TopHandverkerSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={getSnapshot().rows.map((row) => ({
        href: row.href,
        label: `${row.rank}. ${row.label}`,
        value: row.value,
        highlight: row.rank === 1,
      }))}
      format="currency"
      kicker="Håndverkerlønn"
      note="Tallene gjelder median månedslønn for alle sektorer, begge kjønn og heltid og deltid samlet."
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for de fem høyest betalte håndverkeryrkene i SSBs 2025-tall"
      ticks={[0, 20000, 40000, 60000, 70000]}
      title="Skytebaser og sprengningsarbeidere topper listen"
    />
  );
}

export function TopHandverkerGenderSalaryCards() {
  const rowsWithGender = getSnapshot().rows.filter(
    (row) => typeof row.womenMonthlyMedian === "number" && typeof row.menMonthlyMedian === "number",
  );
  const rowsWithoutWomen = getSnapshot().rows.filter((row) => row.genderNote);

  return (
    <section className="space-y-6">
      {rowsWithGender.map((row) => (
        <BlogGenderSalaryCards
          key={row.code}
          occupationLabel={row.label.toLowerCase()}
          period="2025"
          source="SSB tabell 11418"
          womenMonthlyMedian={row.womenMonthlyMedian ?? 0}
          menMonthlyMedian={row.menMonthlyMedian ?? 0}
        />
      ))}

      {rowsWithoutWomen.length > 0 ? (
        <p className="text-sm text-[var(--muted-foreground)]">
          SSB publiserer ikke egne kvinnetall for {rowsWithoutWomen.map((row) => row.label.toLowerCase()).join(" og ")} i
          2025. Derfor vises ikke kjønnskort for disse yrkene.
        </p>
      ) : null}
    </section>
  );
}
