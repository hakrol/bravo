export const siteConfig = {
  name: "Lønnsinnsikt",
  description:
    "Finn lønnsnivå, lønnsvekst og lønnsinnsikt for norske yrker med oppdaterte tall fra SSB.",
  author: "Lønnsinnsikt",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://lonnsinnsikt.no",
} as const;

export function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.siteUrl).toString();
}
