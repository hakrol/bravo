import type { Metadata } from "next";
import Link from "next/link";
import { calculators, otherTools } from "@/lib/tool-catalog";
import { siteConfig } from "@/lib/site-config";

const description =
  "Finn kalkulatorer og andre praktiske verktøy for lønn, arbeidsliv og økonomiske vurderinger.";

export const metadata: Metadata = {
  title: "Verktøy",
  description,
  alternates: {
    canonical: "/verktoy",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/verktoy",
    siteName: siteConfig.name,
    title: `Verktøy | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Verktøy | ${siteConfig.name}`,
    description,
  },
};

export default function VerktoyPage() {
  return (
    <div className="min-h-screen px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <section className="fade-up grid gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
            Verktøy
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Praktiske verktøy for lønn og arbeidsliv
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Her finner du kalkulatorer og andre verktøy som gjør det enklere å forstå tall,
            sammenligne lønn og ta bedre valg.
          </p>
        </section>

        <section className="fade-up-delay grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Link
            className="grid content-start gap-5 rounded-[5px] border border-[rgba(20,83,45,0.18)] bg-[linear-gradient(145deg,rgba(236,253,245,0.9),white)] p-7 shadow-[0_18px_48px_rgba(27,36,48,0.07)] transition hover:-translate-y-0.5 hover:border-[rgba(20,83,45,0.35)] hover:shadow-[0_24px_64px_rgba(27,36,48,0.1)] sm:p-8"
            href="/kalkulatorer"
          >
            <span className="w-fit rounded-[5px] bg-[var(--primary-strong)] px-3 py-1 text-sm font-semibold text-white">
              {calculators.length} kalkulatorer
            </span>
            <div className="grid gap-3">
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                Kalkulatorer
              </h2>
              <p className="text-base leading-8 text-[var(--muted)]">
                Regn på lønn, årsverk, lån, renter og kilometergodtgjørelse.
              </p>
              <span className="font-semibold text-[var(--primary-strong)]">
                Se alle kalkulatorer →
              </span>
            </div>
          </Link>

          {otherTools.map((tool) => (
            <Link
              className="grid content-start gap-5 rounded-[5px] border border-[var(--border)] bg-white p-7 shadow-[0_18px_48px_rgba(27,36,48,0.07)] transition hover:-translate-y-0.5 hover:border-[rgba(20,83,45,0.28)] hover:shadow-[0_24px_64px_rgba(27,36,48,0.1)] sm:p-8"
              href={tool.href}
              key={tool.href}
            >
              <span className="w-fit rounded-[5px] bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                Verktøy
              </span>
              <div className="grid gap-3">
                <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                  {tool.label}
                </h2>
                <p className="text-base leading-8 text-[var(--muted)]">{tool.description}</p>
                <span className="w-fit rounded-[5px] bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  Åpne verktøyet →
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
