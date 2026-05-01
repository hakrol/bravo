import { NextResponse } from "next/server";
import { buildOccupationComparisonInsights } from "@/lib/occupation-comparison";
import {
  getOccupationDetailTrendData,
  getOccupationLaborMarketStats,
} from "@/lib/ssb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const occupationCodes = searchParams
    .get("occupationCodes")
    ?.split(",")
    .map((code) => code.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!occupationCodes || occupationCodes.length === 0) {
    return NextResponse.json(
      { error: "occupationCodes er påkrevd." },
      { status: 400 },
    );
  }

  const insights = await Promise.all(
    occupationCodes.map(async (occupationCode) => {
      const [detailData, laborMarketStats] = await Promise.all([
        getOccupationDetailTrendData(occupationCode),
        getOccupationLaborMarketStats(occupationCode),
      ]);

      return buildOccupationComparisonInsights({
        occupationCode,
        laborMarketStats,
        purchasingPowerSeries: detailData.purchasingPowerSeries,
      });
    }),
  );

  return NextResponse.json({ insights });
}
