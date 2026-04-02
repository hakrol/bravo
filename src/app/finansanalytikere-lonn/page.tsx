import type { Metadata } from "next";
import { OccupationSalaryDetailPage } from "@/components/occupation-salary-detail-page";
import { getOccupationDetailPage } from "@/lib/occupation-detail-pages";

export const dynamic = "force-dynamic";

const occupationCode = "2413";
const detailPage = getOccupationDetailPage(occupationCode);
const label = detailPage?.label ?? "Finansanalytikere";

export const metadata: Metadata = {
  title: `${label} lønn`,
  description: `Se lønnsutvikling og gjennomsnittlig avtalt månedslønn for ${label.toLowerCase()} basert på SSB-data.`,
};

export default function FinancialAnalystSalaryPage() {
  return <OccupationSalaryDetailPage occupationCode={occupationCode} />;
}
