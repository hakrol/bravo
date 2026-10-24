"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { getUscoreTrackingUrl, type UscoreAdFormat, type UscorePlacement } from "@/lib/uscore";
import { shouldShowUscore } from "@/lib/uscore-routes";
import styles from "./uscore-ad.module.css";

type UscoreAdProps = {
  placement?: UscorePlacement;
  className?: string;
};

export function UscoreAd({ placement = "blog-after-content", className = "" }: UscoreAdProps) {
  const pathname = usePathname();
  const sidebar = placement.endsWith("sidebar");

  if (!shouldShowUscore(pathname)) return null;

  function banner(format: UscoreAdFormat) {
    const variant = format === "160x600" ? styles.vertical : format === "980x120" ? styles.horizontal : styles.compact;

    return (
      <a
        href={getUscoreTrackingUrl(pathname, placement, format)}
        rel="sponsored noopener noreferrer"
        target="_blank"
        aria-label="Sjekk kredittscoren din gratis hos uScore (åpnes i en ny fane)"
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
          <span className={styles.headline}>Hva er kredittscoren din?</span>
          <span className={styles.description}>Sjekk kredittscoren din gratis hos uScore.</span>
        </span>
        <Image
          src="/annonser/uscore/uscore-hovedillustrasjon.png"
          alt=""
          width={480}
          height={481}
          sizes="160px"
          className={styles.illustration}
        />
        <span className={styles.cta}>
          Sjekk gratis <span aria-hidden="true">↗</span>
        </span>
      </a>
    );
  }

  return (
    <aside
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
