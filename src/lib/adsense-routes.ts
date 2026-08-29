const ADSENSE_ALLOWED_EXACT_PATHS = new Set([
  "/arsverk-kalkulator",
  "/bruttolonn-kalkulator",
  "/feriedager-norge",
  "/feriekalkulator",
  "/kalkulatorer",
  "/kilometergodtgjorelse-kalkulator",
  "/lanekalkulator",
  "/lonnskalkulator",
  "/lonnsjekk",
  "/lønnsforskjell-mellom-kvinner-og-menn",
  "/lønnsforskjeller-mellom-offentlige-og-private-yrker",
  "/rente-og-avdrag-kalkulator",
  "/ressurser/sjekkliste-for-lonnssamtale",
  "/ressurser/sjekkliste-vurdere-mer-lonn",
  "/sammenlign-lonn",
  "/spesial/i-disse-yrkene-oker-kvinneandelen-raskest",
  "/spesial/topp-10-yrker",
  "/verktoy",
]);

const ADSENSE_ALLOWED_DYNAMIC_PATHS = [
  /^\/blogg\/[^/]+$/,
  /^\/forklarer\/[^/]+$/,
  /^\/yrke\/[^/]+$/,
] as const;

function normalizePathname(pathname: string) {
  let normalizedPathname = pathname;

  try {
    normalizedPathname = decodeURIComponent(pathname);
  } catch {
    // Behold den opprinnelige stien dersom den inneholder ugyldig URL-koding.
  }

  if (normalizedPathname !== "/") {
    normalizedPathname = normalizedPathname.replace(/\/+$/, "");
  }

  return normalizedPathname;
}

export function shouldLoadAdsense(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  if (ADSENSE_ALLOWED_EXACT_PATHS.has(normalizedPathname)) {
    return true;
  }

  return ADSENSE_ALLOWED_DYNAMIC_PATHS.some((pattern) => pattern.test(normalizedPathname));
}
