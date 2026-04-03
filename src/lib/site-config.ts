export const siteConfig = {
  name: "Lønnsdata Norge",
  description: "Finn lønnsnivå, lønnsvekst og lønnsinnsikt for norske yrker.",
  author: "Lønnsdata Norge",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "http://localhost:3000",
} as const;

export function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.siteUrl).toString();
}
