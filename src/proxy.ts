import { NextResponse, type NextRequest } from "next/server";

const asciiSalaryGapPath = "/lonnsforskjell-mellom-kvinner-og-menn";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = asciiSalaryGapPath;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/lønnsforskjell-mellom-kvinner-og-menn",
    "/l%C3%B8nnsforskjell-mellom-kvinner-og-menn",
  ],
};
