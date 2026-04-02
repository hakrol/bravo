import type { Metadata } from "next";
import { OccupationSalaryDetailPage } from "@/components/occupation-salary-detail-page";
import { getOccupationDetailPage } from "@/lib/occupation-detail-pages";

export const dynamic = "force-dynamic";

const occupationCode = "2412";
const detailPage = getOccupationDetailPage(occupationCode);
const label = detailPage?.label ?? "Finans- og investeringsrådgivere";

export const metadata: Metadata = {
  title: `${label} lønn`,
  description: `Se lønnsutvikling og gjennomsnittlig avtalt månedslønn for ${label.toLowerCase()} basert på SSB-data.`,
};

export default function FinancialAdvisorSalaryPage() {
  return <OccupationSalaryDetailPage occupationCode={occupationCode} />;
}
