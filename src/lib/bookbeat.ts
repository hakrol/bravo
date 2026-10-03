export const BOOKBEAT_TRACKING_URL = "https://ion.bookbeat.com/t/t?a=1676153482&as=2113271977&t=2&tk=1";

export type BookbeatPlacement =
  | "blog-before-content" | "blog-mid-content" | "blog-after-content"
  | "blog-sidebar" | "blog-left-sidebar"
  | "occupation-mobile-before-content" | "occupation-after-salary-overview" | "occupation-between-real-salary-and-overtime"
  | "occupation-between-overtime-and-labor-market" | "occupation-before-faq"
  | "occupation-sidebar" | "occupation-left-sidebar" | "minimum-wage-mid-content" | "minimum-wage-before-faq"
  | "calculator-after-tool" | "overview-between-sections" | "statistics-after-content";

export function getBookbeatTrackingUrl(pathname: string, placement: BookbeatPlacement, format: string) {
  const url = new URL(BOOKBEAT_TRACKING_URL);
  const segments = pathname.split("/").filter(Boolean);
  url.searchParams.set("epi", segments[0] ?? "forside");
  url.searchParams.set("epi2", placement);
  url.searchParams.set("epi3", segments.join("/") || "forside");
  url.searchParams.set("epi4", format);
  url.searchParams.set("epi5", "bookbeat-2026-10");
  return url.toString();
}
