import { useEffect, useState } from "react";

export function useOccupationChartMobileLayout(enabled = true) {
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, [enabled]);

  return enabled && isMobileViewport;
}

export function formatCompactChartYear(value: string) {
  return /^\d{4}$/.test(value) ? value.slice(-2) : value;
}
