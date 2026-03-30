import { NextResponse } from "next/server";
import { getSalaryData } from "@/lib/ssb";

export async function GET() {
  const data = await getSalaryData();
  return NextResponse.json(data);
}
