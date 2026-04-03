import { NextResponse } from "next/server";
import {
  getOccupationSalaryDistribution,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
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

  const distribution = await getOccupationSalaryDistribution(
    occupationCode,
    OCCUPATION_MONTHLY_SALARY_FILTERS,
  );

  return NextResponse.json(distribution);
}
