"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getRentesjekkCampaign,
  getRentesjekkTrackingUrl,
  RENTESJEKK_CAMPAIGN_END,
  RENTESJEKK_TERMS_URL,
  type RentesjekkAdFormat,
  type RentesjekkPlacement,
} from "@/lib/rentesjekk";
import { observeRentesjekkAd } from "@/lib/rentesjekk-analytics";
import { shouldShowRentesjekk } from "@/lib/rentesjekk-routes";
import styles from "./rentesjekk-ad.module.css";

type RentesjekkAdProps = {
  placement?: RentesjekkPlacement;
  className?: string;
};

export function RentesjekkAd({ placement = "blog-after-content", className = "" }: RentesjekkAdProps) {
  const pathname = usePathname();
  const sidebar = placement.endsWith("sidebar");
  const visible = shouldShowRentesjekk(pathname);
  const adRef = useRef<HTMLElement>(null);
  // Server og første klientrender er like. Utløpt konkurranse vises aldri i bufret HTML.
  const [now, setNow] = useState<number | null>(null);
  const campaign = now === null ? null : getRentesjekkCampaign(now);

  useEffect(() => {
    if (!visible || sidebar) return;
    let timer: ReturnType<typeof setTimeout>;

    function refresh() {
      clearTimeout(timer);
      const currentTime = Date.now();
      setNow(currentTime);
      if (currentTime < RENTESJEKK_CAMPAIGN_END) {
        timer = setTimeout(refresh, Math.min(60_000, RENTESJEKK_CAMPAIGN_END - currentTime));
      }
    }

    timer = setTimeout(refresh, 0);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [visible, sidebar]);

  useEffect(() => {
    if (pathname.startsWith("/dev/")) return;
    const banners = adRef.current?.querySelectorAll<HTMLAnchorElement>("a[data-ad-format]");
    const cleanups = Array.from(banners ?? [], (element) => observeRentesjekkAd(element, {
      page_path: pathname,
      ad_placement: placement,
      ad_format: element.dataset.adFormat as RentesjekkAdFormat,
    }));
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pathname, placement]);

  if (!visible) return null;

  function banner(format: RentesjekkAdFormat) {
    const variant = format === "160x600" ? styles.vertical : format === "980x120" ? styles.horizontal : styles.compact;
    return (
      <div className={[styles.banner, variant].join(" ")}>
        <a
          href={getRentesjekkTrackingUrl(pathname, placement, format)}
          rel="sponsored noopener noreferrer"
          target="_blank"
          aria-label="Sjekk om du kan få bedre rente og lavere kostnader hos Rentesjekk (åpnes i en ny fane)"
          data-ad-format={format}
          className={styles.mainLink}
        >
          <Image
            src="/annonser/rentesjekk/rentesjekk-logo.png"
            alt="Rentesjekk – en del av Zen Finans"
            width={1297}
            height={334}
            sizes={sidebar ? "132px" : "170px"}
            className={styles.logo}
          />
          <span className={styles.copy}>
            <span className={styles.headline}>
              {sidebar ? "Bedre rente starter med en rentesjekk" : "Ta en rentesjekk – se hva du kan spare"}
            </span>
            <span className={styles.description}>
              {sidebar
                ? "Sjekk om gjelden din kan koste mindre."
                : "En bedre rente kan gi lavere kostnader på gjelden du allerede har. Sjekk om du kan spare."}
            </span>
          </span>
          <Image
            src="/annonser/rentesjekk/rentesjekk-mynter-og-plante.png"
            alt=""
            width={1920}
            height={1080}
            sizes={sidebar ? "132px" : "240px"}
            className={styles.illustration}
          />
          <span className={styles.cta}>
            Sjekk renten din
            <span aria-hidden="true">↗</span>
          </span>
        </a>
        <div className={styles.details}>
          {sidebar ? (
            <p className={styles.costExample}>
              <strong>Eksempel:</strong> Eff. rente 14,13 %. 100 000 kr over 5 år.
              Kostnad 37 412 kr. Totalt 137 412 kr. Formidles av Zen Finans AS.
            </p>
          ) : (
            <p className={styles.costExample}>
              <strong>Eksempel på lånekostnad:</strong> Eff. rente 14,13 %, 100 000 kr over 5 år.
              Nom. rente 11,70 %, etablering 990 kr. Kostnad 37 412 kr. Totalt 137 412 kr.
              Renten settes individuelt. Formidles av Zen Finans AS.
            </p>
          )}
          {!sidebar && campaign?.active ? (
            <div className={styles.competition}>
              <p>
                Ved søknad kan du delta i trekningen om å få nedbetalt inntil 1 million kr
                i rentebærende forbruks- og kredittkortgjeld.
              </p>
              <p className={styles.deadline}>
                <span className={styles.countdown}>
                  {campaign.daysRemaining === 1 ? "Under ett døgn igjen" : campaign.daysRemaining + " dager igjen"}
                </span>
                <span>til konkurransefristen</span>
              </p>
              <p>
                Frist 31.12.2026 kl. 23.59. Trekning 05.01.2027.
                For personer over 18 år bosatt i Norge, med over 1 000 kr i slik gjeld.
                Én vinner. Premien krever deltakelse i intervju og bilder. <a
                  href={RENTESJEKK_TERMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >Les konkurransevilkårene<span className="sr-only"> (åpnes i en ny fane)</span></a>.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <aside
      ref={adRef}
      aria-label="Annonse for Rentesjekk"
      data-ad-placement={placement}
      className={["not-prose w-full min-w-0 print:hidden", sidebar ? "hidden xl:block" : "", className].join(" ")}
    >
      <p className={styles.label}>Annonse · Rentesjekk</p>
      {sidebar ? banner("160x600") : (
        <div className={styles.container}>
          {banner("300x250")}
          {banner("980x120")}
        </div>
      )}
    </aside>
  );
}
