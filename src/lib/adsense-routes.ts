const ADSENSE_ALLOWED_EXACT_PATHS = new Set([
  "/blogg",
  "/nyheter",
  "/forklarer",
  "/ordbok",
  "/yrker",
  "/yrkesgrupper",
  "/jobbtilbud",
  "/sykepleier-lonn-kalkulator",
  "/laerer-lonn-kalkulator",
  "/vernepleier-lonn-kalkulator",
  "/lonnsvekst",
  "/lonnsforskjell-mellom-kvinner-og-menn",
  "/lonnsforskjeller-mellom-offentlige-og-private-yrker",
  "/topp-50-arbeidstakere",
  "/topp-50-eldste-snittalder",
  "/topp-50-gjennomsnittlig-bonus",
  "/topp-50-lonnsniva",
  "/topp-50-lonnsvekst",
  "/topp-50-reallonnsvekst",
  "/topp-50-yngste-snittalder",
  "/arsverk-kalkulator",
  "/bruttolonn-kalkulator",
  "/feriedager-norge",
  "/feriekalkulator",
  "/kilometergodtgjorelse-kalkulator",
  "/lanekalkulator",
  "/lonnskalkulator",
  "/lonnsjekk",
  "/minstelonn",
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
  /^\/blogg\/kategori\/[^/]+$/,
  /^\/nyheter\/[^/]+$/,
  /^\/yrkesgrupper\/[^/]+$/,
  /^\/blogg\/[^/]+$/,
  /^\/forklarer\/[^/]+$/,
  /^\/minstelonn\/minstelonn-[^/]+$/,
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
