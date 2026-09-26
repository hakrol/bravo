export const ADSENSE_CLIENT_ID = "ca-pub-3073306475357950";

export const ADSENSE_SLOTS = {
  "blog-before-content": "3791403284",
  "blog-mid-content": "3791403284",
  "blog-after-content": "2721562873",
  "blog-sidebar": "2607233991",
  "blog-left-sidebar": "3924673761",
  "occupation-after-salary-overview": "1294152328",
  "occupation-between-real-salary-and-overtime": "1294152328",
  "occupation-between-overtime-and-labor-market": "1294152328",
  "occupation-before-faq": "1294152328",
  "occupation-sidebar": "9387043575",
  "calculator-after-tool": "2663074318",
  "overview-between-sections": "5886782261",
  "statistics-after-content": "7723829309",
} as const;

export type AdsensePlacement = keyof typeof ADSENSE_SLOTS;
