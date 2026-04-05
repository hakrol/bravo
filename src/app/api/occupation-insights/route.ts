import { NextResponse } from "next/server";
import {
  getOccupationDetailTrendData,
  getOccupationLaborMarketStats,
  OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
} from "@/lib/ssb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const occupationCode = searchParams.get("occupationCode")?.trim();

  if (!occupationCode) {
    return NextResponse.json(
      { error: "occupationCode er påkrevd." },
      { status: 400 },
    );
  }

  const [detailData, laborMarketStats] = await Promise.all([
    getOccupationDetailTrendData(
      occupationCode,
      OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
    ),
    getOccupationLaborMarketStats(occupationCode),
  ]);

  return NextResponse.json({
    purchasingPowerSeries: detailData.purchasingPowerSeries,
    salarySeries: detailData.series,
    age: laborMarketStats?.age ?? null,
  });
}
