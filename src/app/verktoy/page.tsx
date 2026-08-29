import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { calculators, otherTools } from "@/lib/tool-catalog";
import { siteConfig } from "@/lib/site-config";

const description =
  "Finn kalkulatorer, sjekklister og andre praktiske verktøy for lønn, arbeidsliv og økonomiske vurderinger.";

const resources = [
  {
    href: "/ressurser/sjekkliste-for-lonnssamtale",
    title: "Sjekkliste før lønnssamtale",
    description:
      "Samle lønnstall, resultater, argumenter og ønsket nivå før du går inn i samtalen.",
  },
  {
    href: "/ressurser/sjekkliste-vurdere-mer-lonn",
    title: "Kan jeg be om mer lønn?",
    description:
      "Vurder marked, ansvar, resultater og timing før du bestemmer deg for om du bør be om høyere lønn.",
  },
] as const;

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
            Her finner du kalkulatorer, sjekklister og andre verktøy som gjør det enklere å
            forstå tall, sammenligne lønn og ta bedre valg.
          </p>
        </section>

        <section className="fade-up-delay grid gap-6">
          <div className="grid gap-3">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Verktøy
            </h2>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
              Sammenlign lønn, sjekk markedsnivået og få oversikt over norske fridager.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                  <h3 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                    {tool.label}
                  </h3>
                  <p className="text-base leading-8 text-[var(--muted)]">{tool.description}</p>
                  <span className="w-fit rounded-[5px] bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    Åpne verktøyet →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot placement="verktoy-between-sections" />

        <section className="grid gap-6">
          <div className="grid gap-3">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Kalkulatorer
            </h2>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
              Regn på lønn og kjøpekraft med kalkulatorer laget for raske, praktiske svar.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {calculators.slice(0, 3).map((calculator) => (
              <Link
                className="grid content-start gap-5 rounded-[5px] border border-[rgba(20,83,45,0.18)] bg-[linear-gradient(145deg,rgba(236,253,245,0.9),white)] p-7 shadow-[0_18px_48px_rgba(27,36,48,0.07)] transition hover:-translate-y-0.5 hover:border-[rgba(20,83,45,0.35)] hover:shadow-[0_24px_64px_rgba(27,36,48,0.1)] sm:p-8"
                href={calculator.href}
                key={calculator.href}
              >
                <span className="w-fit rounded-[5px] bg-[var(--primary-strong)] px-3 py-1 text-sm font-semibold text-white">
                  Kalkulator
                </span>
                <div className="grid gap-3">
                  <h3 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                    {calculator.label}
                  </h3>
                  <p className="text-base leading-8 text-[var(--muted)]">
                    {calculator.description}
                  </p>
                  <span className="font-semibold text-[var(--primary-strong)]">
                    Åpne kalkulatoren →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link
            className="inline-flex w-fit items-center gap-3 font-semibold text-[var(--primary-strong)] transition hover:text-[var(--primary)]"
            href="/kalkulatorer"
          >
            Se alle {calculators.length} kalkulatorer
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className="grid gap-6">
          <div className="grid gap-3">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Sjekklister og ressurser
            </h2>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
              Praktiske hjelpemidler du kan bruke når du vurderer lønnen din eller forbereder
              en lønnssamtale.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {resources.map((resource) => (
              <Link
                className="grid content-start gap-4 rounded-[5px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_48px_rgba(27,36,48,0.07)] transition hover:-translate-y-0.5 hover:border-[rgba(20,83,45,0.28)] hover:shadow-[0_24px_64px_rgba(27,36,48,0.1)] sm:p-7"
                href={resource.href}
                key={resource.href}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-[5px] bg-[rgba(20,83,45,0.08)] px-3 py-1 text-sm font-semibold text-[var(--primary-strong)]">
                    Sjekkliste
                  </span>
                  <span className="text-sm font-semibold text-[var(--muted)]">
                    Kan skrives ut
                  </span>
                </div>
                <div className="grid gap-3">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    {resource.title}
                  </h3>
                  <p className="text-base leading-8 text-[var(--muted)]">
                    {resource.description}
                  </p>
                  <span className="font-semibold text-[var(--primary-strong)]">
                    Åpne sjekklisten →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
