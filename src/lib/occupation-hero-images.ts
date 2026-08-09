export type OccupationHeroImages = {
  desktop: string;
  mobile: string;
};

const DEFAULT_OCCUPATION_HERO_IMAGES: OccupationHeroImages = {
  desktop: "/images/hero-occupations/yrkessider-felles-desktop-v8.webp",
  mobile: "/images/hero-occupations/yrkessider-felles-mobile-v8.webp",
};

const OCCUPATION_HERO_IMAGE_OVERRIDES: Record<string, OccupationHeroImages> = {
  "1111": {
    desktop: "/images/hero-occupations/politikere-desktop-v1.webp",
    mobile: "/images/hero-occupations/politikere-mobile-v1.webp",
  },
  "7411": {
    desktop: "/images/hero-occupations/elektrikere-desktop-v4.webp",
    mobile: "/images/hero-occupations/elektrikere-mobile-v4.webp",
  },
};

export function getOccupationHeroImages(occupationCode: string): OccupationHeroImages {
  return OCCUPATION_HERO_IMAGE_OVERRIDES[occupationCode] ?? DEFAULT_OCCUPATION_HERO_IMAGES;
}
