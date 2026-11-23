"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getRentesjekkTrackingUrl } from "@/lib/rentesjekk";
import { observeRentesjekkAd } from "@/lib/rentesjekk-analytics";
import { shouldShowRentesjekk } from "@/lib/rentesjekk-routes";
import styles from "./rentesjekk-bar.module.css";

const DISMISSED_KEY = "rentesjekk-bar-dismissed-v1";

export function RentesjekkBar() {
  const pathname = usePathname();
  const preview = pathname === "/dev/rentesjekk";
  const visible = shouldShowRentesjekk(pathname);
  const [dismissed, setDismissed] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const bar = barRef.current;
    if (!visible || dismissed || !bar) return;
    let previousHeight = -1;

    function updateHeight() {
      if (!bar) return;
      const height = Math.ceil(bar.getBoundingClientRect().height);
      if (height === previousHeight) return;
      previousHeight = height;
      root.style.setProperty("--site-ad-bar-height", height + "px");
      window.dispatchEvent(new Event("site-ad-bar-resize"));
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(bar);
    updateHeight();
    return () => {
      observer.disconnect();
      root.style.removeProperty("--site-ad-bar-height");
      window.dispatchEvent(new Event("site-ad-bar-resize"));
    };
  }, [visible, dismissed]);

  useEffect(() => {
    if (preview) return;
    const timer = setTimeout(() => {
      try {
        setDismissed(sessionStorage.getItem(DISMISSED_KEY) === "1");
      } catch {
        // Baren kan fortsatt lukkes når nettleseren blokkerer lokal lagring.
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [preview]);

  useEffect(() => {
    if (!visible || dismissed || preview || !linkRef.current) return;
    return observeRentesjekkAd(linkRef.current, {
      page_path: pathname,
      ad_placement: "site-top-bar",
      ad_format: "top-bar",
    });
  }, [pathname, visible, dismissed, preview]);

  function dismiss() {
    setDismissed(true);
    if (preview) return;
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // React-tilstanden husker lukkingen så lenge appen er åpen.
    }
  }

  if (!visible || dismissed) return null;

  return (
    <aside ref={barRef} className={styles.bar} aria-label="Annonse for Rentesjekk" data-ad-placement="site-top-bar">
      <div className={styles.inner}>
        <span className={styles.advertiser}>
          Annonse · Rentesjekk
        </span>
        <a
          ref={linkRef}
          href={getRentesjekkTrackingUrl(pathname, "site-top-bar", "top-bar")}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className={styles.offer}
          data-ad-format="top-bar"
        >
          <span className={styles.headline}>Sjekk om du kan få bedre rente hos opptil 15 banker.</span>
          <span className={styles.cta}>Sjekk renten <span aria-hidden="true">↗</span></span>
          <span className="sr-only"> (åpnes i en ny fane)</span>
        </a>
        <button type="button" onClick={dismiss} className={styles.close} aria-label="Lukk annonsebaren">
          <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
        <p className={styles.cost}>
          Låneeksempel: Eff. rente 14,13 %. 100 000 kr over 5 år.
          Kostnad 37 412 kr. Totalt 137 412 kr. Formidles av Zen Finans AS.
        </p>
      </div>
    </aside>
  );
}
