import type { Metadata } from "next";
import { OccupationSalaryDetailPage } from "@/components/occupation-salary-detail-page";
import { getOccupationDetailPage } from "@/lib/occupation-detail-pages";

const occupationCode = "2411";
const detailPage = getOccupationDetailPage(occupationCode);
const label = detailPage?.label ?? "Revisorer, regnskapsradgivere";

export const metadata: Metadata = {
  title: `${label} lønn`,
  description: `Se lønnsutvikling og gjennomsnittlig avtalt månedslønn for ${label.toLowerCase()} basert på SSB-data.`,
};

export default function AuditorSalaryPage() {
  return <OccupationSalaryDetailPage occupationCode={occupationCode} />;
}
