export const RENTESJEKK_TRACKING_URL = "https://on.rentesjekk.no/t/t?a=2069142437&as=2113271977&t=2&tk=1";
export const RENTESJEKK_VARIANT = "lavere-rente-v1";
export const RENTESJEKK_TERMS_URL = "https://rentesjekk.no/vilkar-kampanje-q4-26/";

// Deltakerfristen er 31. desember kl. 23.59 norsk tid, inklusive siste minutt.
export const RENTESJEKK_CAMPAIGN_START = Date.parse("2026-10-02T00:00:00+02:00");
export const RENTESJEKK_CAMPAIGN_END = Date.parse("2027-01-01T00:00:00+01:00");

export function getRentesjekkCampaign(now: number) {
  const active = now >= RENTESJEKK_CAMPAIGN_START && now < RENTESJEKK_CAMPAIGN_END;
  return {
    active,
    id: active ? "rentesjekk-q4-2026" : "rentesjekk-lavere-rente",
    daysRemaining: active ? Math.ceil((RENTESJEKK_CAMPAIGN_END - now) / 86_400_000) : 0,
  };
}

export type RentesjekkPlacement =
  | "blog-before-content" | "blog-mid-content" | "blog-after-content"
  | "blog-sidebar" | "blog-left-sidebar"
  | "occupation-mobile-before-content" | "occupation-after-salary-overview" | "occupation-between-real-salary-and-overtime"
  | "occupation-between-overtime-and-labor-market" | "occupation-before-faq"
  | "occupation-sidebar" | "occupation-left-sidebar" | "minimum-wage-mid-content" | "minimum-wage-before-faq"
  | "calculator-after-tool" | "overview-between-sections" | "statistics-after-content";

export type RentesjekkAdFormat = "300x250" | "980x120" | "160x600";

export function getRentesjekkTrackingUrl(pathname: string, placement: RentesjekkPlacement, format: RentesjekkAdFormat) {
  const url = new URL(RENTESJEKK_TRACKING_URL);
  const segments = pathname.split("/").filter(Boolean);
  url.searchParams.set("epi", segments[0] ?? "forside");
  url.searchParams.set("epi2", placement);
  url.searchParams.set("epi3", segments.join("/") || "forside");
  url.searchParams.set("epi4", format);
  url.searchParams.set("epi5", RENTESJEKK_VARIANT);
  return url.toString();
}
