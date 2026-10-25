import "server-only";

import {
  getOccupationDetailViewModelBySlug,
  getOccupationDetailViewModelIndex,
} from "@/lib/occupation-detail-view-models";
import { buildWorkforceGrowthDataset } from "@/lib/workforce-growth";

/** Gjenbruk genererte yrkesdata. Ingen nettverkskall eller kopierte statistikksnapshots. */
export async function getWorkforceGrowthWorkshopDatasets() {
  const index = await getOccupationDetailViewModelIndex();
  const models = await Promise.all(["2512", "7411", "2221", "5223"].map(async (code) => {
    const page = index.pages.find((entry) => entry.occupationCode === code);
    return page ? getOccupationDetailViewModelBySlug(page.slug) : null;
  }));
  return models.flatMap((model) => {
    const workforce = model?.data.laborMarketStats;
    return workforce ? [buildWorkforceGrowthDataset(workforce.workforcePoints, {
      occupationCode: workforce.occupationCode,
      occupationLabel: model!.detailPage.label,
      updated: workforce.updated,
    })] : [];
  });
}
