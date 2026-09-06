"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { track } from "@vercel/analytics";

export type AdPlacement =
  | "home-after-occupations"
  | "home-before-about"
  | "occupation-after-salary-overview"
  | "occupation-mid-content"
  | "occupation-sidebar"
  | "blog-after-intro"
  | "blog-after-content"
  | "arsverk-after-tool"
  | "bruttolonn-after-tool"
  | "feriedager-after-tool"
  | "feriekalkulator-after-tool"
  | "kilometergodtgjorelse-after-tool"
  | "lanekalkulator-after-tool"
  | "lonnskalkulator-after-tool"
  | "lonnsjekk-after-tool"
  | "rente-og-avdrag-after-tool"
  | "sammenlign-lonn-after-tool"
  | "kalkulatorer-between-sections"
  | "verktoy-between-sections";

type AdSlotProps = Readonly<{
  placement: AdPlacement;
  format?: "horizontal" | "sidebar";
  className?: string;
}>;

type AdTrackingData = Readonly<{
  advertiser: "investorkurs" | "ordsnok";
  campaign: "investorkurs" | "ordsnok_mobile";
  format: "horizontal" | "sidebar";
  placement: AdPlacement;
}>;

const INVESTORKURS_URL = "https://investorkurs.no";
const ORDSNOK_URL =
  "https://ordsnok.app/?utm_source=lonnsinnsikt&utm_medium=display&utm_campaign=ordsnok_mobile&utm_content=website";
const ORDSNOK_APP_STORE_URL =
  "https://apps.apple.com/us/app/ordsnok-daily-word-puzzle/id6797599523?utm_source=lonnsinnsikt&utm_medium=display&utm_campaign=ordsnok_mobile&utm_content=app_store";
const ORDSNOK_GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=no.strangeutvikling.ordsnok&referrer=utm_source%3Dlonnsinnsikt%26utm_medium%3Ddisplay%26utm_campaign%3Dordsnok_mobile%26utm_content%3Dgoogle_play";
const VISIBILITY_THRESHOLD = 0.5;
const VISIBILITY_DURATION_MS = 1_000;

function useAdImpression(
  adRef: RefObject<HTMLElement | null>,
  eventName: string,
  eventData: AdTrackingData,
) {
  const hasTrackedImpressionRef = useRef(false);

  useEffect(() => {
    const ad = adRef.current;
    if (!ad || hasTrackedImpressionRef.current) return;

    let visibilityTimer: number | null = null;
    const clearVisibilityTimer = () => {
      if (visibilityTimer !== null) {
        window.clearTimeout(visibilityTimer);
        visibilityTimer = null;
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < VISIBILITY_THRESHOLD) {
          clearVisibilityTimer();
          return;
        }
        if (visibilityTimer !== null) return;

        visibilityTimer = window.setTimeout(() => {
          hasTrackedImpressionRef.current = true;
          track(eventName, eventData);
          sendGAEvent("event", "sponsor_ad_impression", eventData);
          observer.disconnect();
        }, VISIBILITY_DURATION_MS);
      },
      { threshold: VISIBILITY_THRESHOLD },
    );

    observer.observe(ad);
    return () => {
      clearVisibilityTimer();
      observer.disconnect();
    };
  }, [adRef, eventData, eventName]);
}

function trackAdClick(
  eventName: string,
  eventData: AdTrackingData,
  destination: string,
  destinationUrl: string,
) {
  const clickData = { ...eventData, destination, destination_url: destinationUrl };
  track(eventName, clickData);
  sendGAEvent("event", "sponsor_ad_click", clickData);
}

function OrdsnokLogo() {
  return (
    <span aria-label="Ordsnok" className="inline-grid grid-cols-4 gap-0.5">
      {[..."ORDSNOK"].map((letter, index) => (
        <span
          aria-hidden="true"
          className={`flex size-6 items-center justify-center rounded-[3px] text-sm font-black text-white ${index < 4 ? "bg-[#087d59]" : "bg-[#f45100]"}`}
          key={`${letter}-${index}`}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

function OrdsnokAd({ adRef, className, format, placement, trackingData }: Readonly<{
  adRef: RefObject<HTMLElement | null>;
  className: string;
  format: "horizontal" | "sidebar";
  placement: AdPlacement;
  trackingData: AdTrackingData;
}>) {
  const handleClick = (destination: string, destinationUrl: string) =>
    trackAdClick("Ordsnok Ad Click", trackingData, destination, destinationUrl);

  return (
    <aside
      ref={adRef}
      aria-label="Annonse fra Ordsnok"
      className={`w-full min-w-0 overflow-hidden rounded-[6px] border border-[#d8d2b4] bg-[#fffbe6] text-slate-950 shadow-[0_18px_50px_rgba(8,125,89,0.14)] md:hidden ${className}`}
      data-ad-advertiser="ordsnok"
      data-ad-campaign="ordsnok_mobile"
      data-ad-format={format}
      data-ad-placement={placement}
    >
      <div className="relative overflow-hidden px-5 py-5">
        <div aria-hidden="true" className="absolute -right-12 -top-12 size-36 rounded-full bg-[#087d59]/10" />
        <div aria-hidden="true" className="absolute -bottom-16 -left-12 size-32 rounded-full bg-[#f45100]/10" />
        <div className="relative flex items-start justify-between gap-4">
          <a href={ORDSNOK_URL} onClick={() => handleClick("website", ORDSNOK_URL)} rel="sponsored noopener noreferrer" target="_blank">
            <OrdsnokLogo />
          </a>
          <span className="rounded-full border border-[#087d59]/25 bg-white/80 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#076a4d]">
            Annonse · Gratis
          </span>
        </div>
        <div className="relative mt-4 grid grid-cols-[minmax(0,1fr)_7rem] items-center gap-3">
          <div>
            <a
              className="block rounded-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#087d59]"
              href={ORDSNOK_URL}
              onClick={() => handleClick("website", ORDSNOK_URL)}
              rel="sponsored noopener noreferrer"
              target="_blank"
            >
              <p className="text-[1.55rem] font-black leading-[1.02] tracking-[-0.045em]">
                Dagens ord. Klarer du det?
              </p>
              <p className="mt-2 text-sm font-medium leading-5 text-slate-700">
                Sett ordforrådet på prøve, bygg streaken og utfordre venner og familie.
              </p>
            </a>
            <div aria-hidden="true" className="mt-4 flex gap-1">
              {[
                ["S", "bg-[#607987]"],
                ["N", "bg-[#087d59]"],
                ["O", "bg-[#f45100]"],
                ["K", "bg-[#087d59]"],
              ].map(([letter, color]) => (
                <span className={`flex size-8 items-center justify-center rounded-[4px] border border-slate-900/70 text-sm font-black text-white shadow-sm ${color}`} key={letter}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
          <a
            aria-label="Se Ordsnok"
            className="block self-stretch overflow-hidden rounded-[5px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#087d59]"
            href={ORDSNOK_URL}
            onClick={() => handleClick("website", ORDSNOK_URL)}
            rel="sponsored noopener noreferrer"
            target="_blank"
          >
            <Image
              alt="Ordsnok-spillet på en mobiltelefon"
              className="h-full w-full object-contain"
              height={190}
              sizes="112px"
              src="/images/ordsnok-ad-phone.webp"
              width={135}
            />
          </a>
        </div>
        <div className="relative mt-5 grid grid-cols-2 gap-2">
          <a
            className="flex min-h-12 items-center justify-center rounded-[5px] bg-[#087d59] px-3 text-center text-xs font-extrabold leading-4 text-white shadow-sm transition hover:bg-[#066b4d] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#087d59]"
            href={ORDSNOK_APP_STORE_URL}
            onClick={() => handleClick("app_store", ORDSNOK_APP_STORE_URL)}
            rel="sponsored noopener noreferrer"
            target="_blank"
          >
            Last ned for iPhone
          </a>
          <a
            className="flex min-h-12 items-center justify-center rounded-[5px] border border-[#087d59] bg-white/80 px-3 text-center text-xs font-extrabold leading-4 text-[#076a4d] transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#087d59]"
            href={ORDSNOK_GOOGLE_PLAY_URL}
            onClick={() => handleClick("google_play", ORDSNOK_GOOGLE_PLAY_URL)}
            rel="sponsored noopener noreferrer"
            target="_blank"
          >
            Last ned for Android
          </a>
        </div>
      </div>
    </aside>
  );
}

function InvestorkursAd({ adRef, className, format, placement, trackingData }: Readonly<{
  adRef: RefObject<HTMLElement | null>;
  className: string;
  format: "horizontal" | "sidebar";
  placement: AdPlacement;
  trackingData: AdTrackingData;
}>) {
  const handleClick = () => trackAdClick("Investorkurs Ad Click", trackingData, "website", INVESTORKURS_URL);

  if (format === "sidebar") {
    return (
      <aside
        ref={adRef}
        aria-label="Annonse fra Investorkurs"
        className={`hidden w-full max-w-[300px] overflow-hidden rounded-[6px] bg-[#0758c7] text-white shadow-[0_18px_48px_rgba(7,88,199,0.2)] lg:block ${className}`}
        data-ad-advertiser="investorkurs"
        data-ad-campaign="investorkurs"
        data-ad-format={format}
        data-ad-placement={placement}
      >
        <a className="group block focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700" href={INVESTORKURS_URL} onClick={handleClick} rel="sponsored noopener noreferrer" target="_blank">
          <div className="relative h-32 overflow-hidden">
            <Image alt="Digitalt kursmiljø for investeringsanalyse" className="object-cover object-[62%_55%] transition duration-300 group-hover:scale-[1.025]" fill sizes="300px" src="/images/investorkurs-ad.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0758c7] via-transparent to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-blue-800">Annonse</span>
          </div>
          <div className="px-5 pb-5 pt-3">
            <p className="text-xl font-extrabold leading-tight tracking-[-0.035em]">Bygg kompetanse. Invester som proffene.</p>
            <p className="mt-3 text-sm leading-6 text-blue-50">Nettkurs og verktøy for smartere investeringsvalg.</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-[5px] bg-white px-4 py-2.5 text-sm font-bold text-blue-800 transition group-hover:bg-blue-50">Utforsk Investorkurs <span aria-hidden="true">→</span></span>
          </div>
        </a>
      </aside>
    );
  }

  return (
    <aside
      ref={adRef}
      aria-label="Annonse fra Investorkurs"
      className={`hidden w-full min-w-0 overflow-hidden rounded-[6px] bg-[#0758c7] text-white shadow-[0_20px_60px_rgba(7,88,199,0.18)] md:block ${className}`}
      data-ad-advertiser="investorkurs"
      data-ad-campaign="investorkurs"
      data-ad-format={format}
      data-ad-placement={placement}
    >
      <a className="group grid min-h-[250px] min-w-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)]" href={INVESTORKURS_URL} onClick={handleClick} rel="sponsored noopener noreferrer" target="_blank">
        <div className="flex min-w-0 flex-col items-start justify-center px-6 py-7 sm:px-8 md:py-8 lg:px-10">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-blue-800">Annonse</span>
          <p className="mt-4 max-w-xl text-2xl font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-3xl lg:text-4xl">Bygg kompetanse. Invester som proffene.</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50 sm:text-base">Nettkurs og verktøy som hjelper deg å ta smartere investeringsvalg.</p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-[5px] bg-white px-5 py-3 text-sm font-bold text-blue-800 shadow-sm transition group-hover:bg-blue-50 sm:text-base">Utforsk Investorkurs <span aria-hidden="true">→</span></span>
        </div>
        <div className="relative min-h-48 overflow-hidden md:min-h-full">
          <Image alt="Digitalt kursmiljø for investeringsanalyse" className="object-cover object-[64%_55%] transition duration-300 group-hover:scale-[1.02]" fill sizes="55vw" src="/images/investorkurs-ad.png" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0758c7] via-transparent to-transparent" />
        </div>
      </a>
    </aside>
  );
}

export function AdSlot({ placement, format = "horizontal", className = "" }: AdSlotProps) {
  const ordsnokRef = useRef<HTMLElement>(null);
  const investorkursRef = useRef<HTMLElement>(null);
  const ordsnokTrackingData = useMemo<AdTrackingData>(() => ({ advertiser: "ordsnok", campaign: "ordsnok_mobile", format, placement }), [format, placement]);
  const investorkursTrackingData = useMemo<AdTrackingData>(() => ({ advertiser: "investorkurs", campaign: "investorkurs", format, placement }), [format, placement]);

  useAdImpression(ordsnokRef, "Ordsnok Ad Impression", ordsnokTrackingData);
  useAdImpression(investorkursRef, "Investorkurs Ad Impression", investorkursTrackingData);

  return (
    <>
      <OrdsnokAd adRef={ordsnokRef} className={className} format={format} placement={placement} trackingData={ordsnokTrackingData} />
      <InvestorkursAd adRef={investorkursRef} className={className} format={format} placement={placement} trackingData={investorkursTrackingData} />
    </>
  );
}
