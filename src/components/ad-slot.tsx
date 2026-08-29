"use client";

import Image from "next/image";
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

const INVESTORKURS_URL = "https://investorkurs.no";

export function AdSlot({ placement, format = "horizontal", className = "" }: AdSlotProps) {
  const handleClick = () => {
    track("Investorkurs Ad Click", {
      destination: INVESTORKURS_URL,
      format,
      placement,
    });
  };

  if (format === "sidebar") {
    return (
      <aside
        aria-label="Annonse fra Investorkurs"
        className={`hidden w-full max-w-[300px] overflow-hidden rounded-[6px] bg-[#0758c7] text-white shadow-[0_18px_48px_rgba(7,88,199,0.2)] lg:block ${className}`}
        data-ad-format={format}
        data-ad-placement={placement}
      >
        <a
          className="group block focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          href={INVESTORKURS_URL}
          onClick={handleClick}
          rel="sponsored noopener noreferrer"
          target="_blank"
        >
          <div className="relative h-32 overflow-hidden">
            <Image
              alt="Digitalt kursmiljø for investeringsanalyse"
              className="object-cover object-[62%_55%] transition duration-300 group-hover:scale-[1.025]"
              fill
              sizes="300px"
              src="/images/investorkurs-ad.png"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0758c7] via-transparent to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-blue-800">
              Annonse
            </span>
          </div>
          <div className="px-5 pb-5 pt-3">
            <p className="text-xl font-extrabold leading-tight tracking-[-0.035em]">
              Bygg kompetanse. Invester som proffene.
            </p>
            <p className="mt-3 text-sm leading-6 text-blue-50">
              Nettkurs og verktøy for smartere investeringsvalg.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-[5px] bg-white px-4 py-2.5 text-sm font-bold text-blue-800 transition group-hover:bg-blue-50">
              Utforsk Investorkurs
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </a>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Annonse fra Investorkurs"
      className={`w-full min-w-0 overflow-hidden rounded-[6px] bg-[#0758c7] text-white shadow-[0_20px_60px_rgba(7,88,199,0.18)] ${className}`}
      data-ad-format={format}
      data-ad-placement={placement}
    >
      <a
        className="group grid min-h-[250px] min-w-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)]"
        href={INVESTORKURS_URL}
        onClick={handleClick}
        rel="sponsored noopener noreferrer"
        target="_blank"
      >
        <div className="flex min-w-0 flex-col items-start justify-center px-6 py-7 sm:px-8 md:py-8 lg:px-10">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-blue-800">
            Annonse
          </span>
          <p className="mt-4 max-w-xl text-2xl font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-3xl lg:text-4xl">
            Bygg kompetanse. Invester som proffene.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50 sm:text-base">
            Nettkurs og verktøy som hjelper deg å ta smartere investeringsvalg.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-[5px] bg-white px-5 py-3 text-sm font-bold text-blue-800 shadow-sm transition group-hover:bg-blue-50 sm:text-base">
            Utforsk Investorkurs
            <span aria-hidden="true">→</span>
          </span>
        </div>
        <div className="relative min-h-48 overflow-hidden md:min-h-full">
          <Image
            alt="Digitalt kursmiljø for investeringsanalyse"
            className="object-cover object-[64%_55%] transition duration-300 group-hover:scale-[1.02]"
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
            src="/images/investorkurs-ad.png"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0758c7] via-transparent to-transparent md:bg-gradient-to-r" />
        </div>
      </a>
    </aside>
  );
}
