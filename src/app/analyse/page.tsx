import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const description = "Oversikt over analyser og sammenligninger basert på lønnsdata.";

export const metadata: Metadata = {
  title: "Analyse",
  description,
  alternates: {
    canonical: "/analyse",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/analyse",
    siteName: siteConfig.name,
    title: `Analyse | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Analyse | ${siteConfig.name}`,
    description,
  },
};

const analysisLinks = [
  {
    href: "/kvinner-vs-menn",
    title: "Kvinner vs menn",
    description: "Sammenlign lønnsforskjeller mellom kvinner og menn på tvers av yrker.",
  },
  {
    href: "/topp-jobber",
    title: "Topp jobber",
    description: "Utforsk yrker med høy lønn og tydelig lønnsvekst.",
  },
] as const;

export default function AnalysePage() {
  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="fade-up rounded-md border bg-[var(--surface)] px-6 py-8 shadow-sm sm:px-8 sm:py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
            Analyse
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
            Utforsk analyser av lønnsdata
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Her samler vi analyser som gjør det lettere å forstå forskjeller, trender og
            utvikling i lønnstallene.
          </p>
        </section>

        <section className="fade-up-delay grid gap-4 sm:grid-cols-2">
          {analysisLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border bg-white/85 px-6 py-6 shadow-sm transition duration-200 hover:border-[var(--primary)] hover:shadow-md"
            >
              <h2 className="text-2xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted)]">{item.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
