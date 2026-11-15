"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { getUscoreTrackingUrl, type UscoreAdFormat, type UscorePlacement } from "@/lib/uscore";
import { observeUscoreAd } from "@/lib/uscore-analytics";
import { shouldShowUscore } from "@/lib/uscore-routes";
import styles from "./uscore-ad.module.css";

type UscoreAdProps = {
  placement?: UscorePlacement;
  className?: string;
};

export function UscoreAd({ placement = "blog-after-content", className = "" }: UscoreAdProps) {
  const pathname = usePathname();
  const sidebar = placement.endsWith("sidebar");
  const adRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const banners = adRef.current?.querySelectorAll<HTMLAnchorElement>("a[data-ad-format]");
    const cleanups = Array.from(banners ?? [], (element) => observeUscoreAd(element, {
      page_path: pathname,
      ad_placement: placement,
      ad_format: element.dataset.adFormat as UscoreAdFormat,
    }));

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pathname, placement]);

  if (!shouldShowUscore(pathname)) return null;

  function banner(format: UscoreAdFormat) {
    const variant = format === "160x600" ? styles.vertical : format === "980x120" ? styles.horizontal : styles.compact;

    return (
      <a
        href={getUscoreTrackingUrl(pathname, placement, format)}
        rel="sponsored noopener noreferrer"
        target="_blank"
        aria-label="Kredittsjekk deg selv gratis hos uScore (åpnes i en ny fane)"
        data-ad-format={format}
        className={`${styles.banner} ${variant}`}
      >
        <Image
          src="/annonser/uscore/uscore-logo.svg"
          alt="uScore"
          width={835}
          height={344}
          unoptimized
          className={styles.logo}
        />
        <span className={styles.copy}>
          <span className={styles.headline}>Kredittsjekk deg selv – helt gratis</span>
          <span className={styles.description}>Se kredittscoren din og få oversikt over registrert gjeld hos uScore.</span>
        </span>
        <Image
          src="/annonser/uscore/uscore-hovedillustrasjon.png"
          alt=""
          width={480}
          height={481}
          sizes={format === "160x600" ? "250px" : format === "980x120" ? "220px" : "160px"}
          className={styles.illustration}
        />
        <span className={styles.cta}>
          Sjekk gratis nå
        </span>
      </a>
    );
  }

  return (
    <aside
      ref={adRef}
      aria-label="Annonse for uScore"
      data-ad-placement={placement}
      className={`not-prose w-full min-w-0 print:hidden ${sidebar ? "hidden xl:block" : ""} ${className}`}
    >
      <p className={styles.label}>Annonse</p>
      {sidebar ? banner("160x600") : (
        <div className={styles.container}>
          {banner("300x250")}
          {banner("980x120")}
        </div>
      )}
    </aside>
  );
}
