import { NextResponse, type NextRequest } from "next/server";

const canonicalSalaryGapPath = "/lønnsforskjell-mellom-kvinner-og-menn";
const asciiSalaryGapPath = "/lonnsforskjell-mellom-kvinner-og-menn";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === canonicalSalaryGapPath || pathname === encodeURI(canonicalSalaryGapPath)) {
    const url = request.nextUrl.clone();
    url.pathname = asciiSalaryGapPath;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
