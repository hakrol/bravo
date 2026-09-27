import {
  formatCompactChartYear,
  useOccupationChartMobileLayout,
} from "@/components/occupation-chart-mobile";

export type MinimumWageChartLayout = {
  height: number;
  isMobile: boolean;
  plot: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  width: number;
};

export function useMinimumWageChartLayout(desktopHeight: number): MinimumWageChartLayout {
  const isMobile = useOccupationChartMobileLayout();

  return isMobile
    ? {
        height: 340,
        isMobile,
        plot: { left: 58, right: 82, top: 20, bottom: 52 },
        width: 390,
      }
    : {
        height: desktopHeight,
        isMobile,
        plot: { left: 88, right: 132, top: 15, bottom: 48 },
        width: 920,
      };
}

export function getMinimumWageChartYearTicks(years: number[], isMobile: boolean) {
  if (!isMobile || years.length <= 5) return years;

  const stride = Math.ceil((years.length - 1) / 4);
  const visibleYears = years.filter((_, index) => index % stride === 0);
  const lastYear = years.at(-1);

  if (lastYear !== undefined && visibleYears.at(-1) !== lastYear) {
    visibleYears.push(lastYear);
  }

  return visibleYears;
}

export function formatMinimumWageChartYear(year: number, isMobile: boolean) {
  const value = String(year);
  return isMobile ? formatCompactChartYear(value) : value;
}
