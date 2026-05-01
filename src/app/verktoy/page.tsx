import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const description =
  "Praktiske verktøy som hjelper deg å beregne lønn, sammenligne lønnen din med markedet og forstå hva tallene betyr.";

const tools = [
  {
    href: "/lonnsjekk",
    label: "Lønnssjekk",
    description:
      "Sammenlign lønnen din med markedet basert på yrke, kjønn og oppdaterte lønnstall.",
  },
  {
    href: "/lonnskalkulator",
    label: "Lønnskalkulator",
    description:
      "Regn om lønn mellom måned, år og time, og få en enklere oversikt over hva lønnen betyr.",
  },
  {
    href: "/lanekalkulator",
    label: "Lånekalkulator",
    description:
      "Beregn hvor mye du kan låne til bolig, og se om inntekt, betjeningsevne eller egenkapital begrenser deg.",
  },
  {
    href: "/sammenlign-lonn",
    label: "Sammenlign lønn",
    description:
      "Sammenlign to yrker side om side med lønn, alder, antall i jobb og reallønnsvekst.",
  },
] as const;

export const metadata: Metadata = {
  title: "Verktøy for lønn og lønnssammenligning",
  description,
  alternates: {
    canonical: "/verktoy",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/verktoy",
    siteName: siteConfig.name,
    title: `Verktøy for lønn og lønnssammenligning | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Verktøy for lønn og lønnssammenligning | ${siteConfig.name}`,
    description,
  },
};

export default function VerktoyPage() {
  return (
    <div className="min-h-screen px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <section className="fade-up grid gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
            Verktøy
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Verktøy som gjør lønn lettere å vurdere
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Bruk verktøyene til å sammenligne lønnen din, regne om lønnstall og få et tydeligere
            grunnlag før lønnssamtale, jobbskifte eller vurdering av tilbud.
          </p>
        </section>

        <section className="fade-up-delay grid gap-5">
          {tools.map((tool) => (
            <Link
              className="grid gap-4 rounded-[5px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_48px_rgba(27,36,48,0.07)] transition hover:-translate-y-0.5 hover:border-[rgba(20,83,45,0.28)] hover:shadow-[0_24px_64px_rgba(27,36,48,0.1)] sm:p-7"
              href={tool.href}
              key={tool.href}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-[5px] bg-[rgba(20,83,45,0.08)] px-3 py-1 text-sm font-semibold text-[var(--primary-strong)]">
                  Verktøy
                </span>
              </div>
              <div className="grid gap-3">
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {tool.label}
                </h2>
                <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
