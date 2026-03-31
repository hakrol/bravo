import type { Metadata } from "next";
import { OccupationSalaryDetailPage } from "@/components/occupation-salary-detail-page";
import {
  getOccupationDetailPage,
} from "@/lib/occupation-detail-pages";
const occupationCode = "3313";
const detailPage = getOccupationDetailPage(occupationCode);
const label = detailPage?.label ?? "Regnskapsforer";

export const metadata: Metadata = {
  title: `${label} lønn`,
  description: `Se lønnsutvikling og gjennomsnittlig avtalt månedslønn for ${label.toLowerCase()} basert på SSB-data.`,
};

export default function AccountantSalaryPage() {
  return <OccupationSalaryDetailPage occupationCode={occupationCode} />;
}
