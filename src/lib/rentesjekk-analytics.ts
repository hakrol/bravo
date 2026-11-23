"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { getRentesjekkCampaign, RENTESJEKK_VARIANT, type RentesjekkAdFormat, type RentesjekkPlacement } from "@/lib/rentesjekk";

type RentesjekkAdDetails = {
  page_path: string;
  ad_placement: RentesjekkPlacement;
  ad_format: RentesjekkAdFormat;
};

// Count each rendered banner once, after 50% is in view for one continuous second.
export function observeRentesjekkAd(element: HTMLAnchorElement, details: RentesjekkAdDetails) {
  if (!process.env.NEXT_PUBLIC_GA_ID) return () => {};

  function track(event: "rentesjekk_ad_view" | "rentesjekk_ad_click") {
    sendGAEvent("event", event, {
      ...details,
      ad_variant: RENTESJEKK_VARIANT,
      ad_campaign: getRentesjekkCampaign(Date.now()).id,
    });
  }

  function onClick(event: MouseEvent) {
    if (event.type === "click" || event.button === 1) track("rentesjekk_ad_click");
  }

  element.addEventListener("click", onClick);
  element.addEventListener("auxclick", onClick);

  let timer: ReturnType<typeof setTimeout> | undefined;
  let viewed = false;

  function clearTimer() {
    clearTimeout(timer);
    timer = undefined;
  }

  const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(
    ([entry]) => {
      clearTimer();
      if (viewed || !entry?.isIntersecting || entry.intersectionRatio < 0.5 || document.visibilityState !== "visible") return;

      timer = setTimeout(() => {
        if (document.visibilityState !== "visible") return;
        viewed = true;
        track("rentesjekk_ad_view");
        observer?.disconnect();
      }, 1000);
    },
    { threshold: [0, 0.5] },
  );

  function onVisibilityChange() {
    clearTimer();
    observer?.disconnect();
    if (!viewed && document.visibilityState === "visible") observer?.observe(element);
  }

  observer?.observe(element);
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    clearTimer();
    observer?.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    element.removeEventListener("click", onClick);
    element.removeEventListener("auxclick", onClick);
  };
}
