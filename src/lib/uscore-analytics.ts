"use client";

import { sendGAEvent } from "@next/third-parties/google";
import type { UscoreAdFormat, UscorePlacement } from "@/lib/uscore";

type UscoreAdDetails = {
  page_path: string;
  ad_placement: UscorePlacement;
  ad_format: UscoreAdFormat;
};

// Count each rendered banner once, after 50% is in view for one continuous second.
export function observeUscoreAd(element: HTMLAnchorElement, details: UscoreAdDetails) {
  if (!process.env.NEXT_PUBLIC_GA_ID) return () => {};

  function track(event: "uscore_ad_view" | "uscore_ad_click") {
    sendGAEvent("event", event, {
      ...details,
      ad_variant: "credit-check-free-v2",
    });
  }

  function onClick(event: MouseEvent) {
    if (event.type === "click" || event.button === 1) track("uscore_ad_click");
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
        track("uscore_ad_view");
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
