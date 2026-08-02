export type OccupationHeroImages = {
  desktop: string;
  mobile: string;
};

const DEFAULT_OCCUPATION_HERO_IMAGES: OccupationHeroImages = {
  desktop: "/images/hero-occupations/yrkessider-felles-desktop-v8.png",
  mobile: "/images/hero-occupations/yrkessider-felles-mobile-v8.png",
};

const OCCUPATION_HERO_IMAGE_OVERRIDES: Record<string, OccupationHeroImages> = {
  "7411": {
    desktop: "/images/hero-occupations/elektrikere-desktop-v4.png",
    mobile: "/images/hero-occupations/elektrikere-mobile-v4.png",
  },
};

export function getOccupationHeroImages(occupationCode: string): OccupationHeroImages {
  return OCCUPATION_HERO_IMAGE_OVERRIDES[occupationCode] ?? DEFAULT_OCCUPATION_HERO_IMAGES;
}
