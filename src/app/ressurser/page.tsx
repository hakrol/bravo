import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const description =
  "Praktiske sjekklister og ressurser som hjelper deg med å bruke lønnsdata før lønnssamtale, jobbskifte og vurdering av egen lønn.";

export const metadata: Metadata = {
  title: "Ressurser for lønn og lønnssamtale",
  description,
  alternates: {
    canonical: "/ressurser",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/ressurser",
    siteName: siteConfig.name,
    title: `Ressurser for lønn og lønnssamtale | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Ressurser for lønn og lønnssamtale | ${siteConfig.name}`,
    description,
  },
};

export default function RessurserPage() {
  return (
    <div className="min-h-screen px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <section className="fade-up grid gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
            Ressurser
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Praktiske verktøy før du tar neste lønnsvalg
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Her samler vi sjekklister og korte hjelpemidler som gjør det enklere å forberede
            lønnssamtaler, vurdere egen lønn og bruke lønnsdata på en ryddig måte.
          </p>
        </section>

        <section className="fade-up-delay grid gap-5">
          <Link
            className="grid gap-4 rounded-[5px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_48px_rgba(27,36,48,0.07)] transition hover:-translate-y-0.5 hover:border-[rgba(20,83,45,0.28)] hover:shadow-[0_24px_64px_rgba(27,36,48,0.1)] sm:p-7"
            href="/ressurser/sjekkliste-for-lonnssamtale"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-[5px] bg-[rgba(20,83,45,0.08)] px-3 py-1 text-sm font-semibold text-[var(--primary-strong)]">
                Sjekkliste
              </span>
              <span className="text-sm font-semibold text-[var(--muted)]">Kan skrives ut</span>
            </div>
            <div className="grid gap-3">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Sjekkliste før lønnssamtale
              </h2>
              <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
                En praktisk liste for å samle tall, resultater, argumenter og ønsket nivå før du
                går inn i samtalen.
              </p>
            </div>
          </Link>

          <Link
            className="grid gap-4 rounded-[5px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_48px_rgba(27,36,48,0.07)] transition hover:-translate-y-0.5 hover:border-[rgba(20,83,45,0.28)] hover:shadow-[0_24px_64px_rgba(27,36,48,0.1)] sm:p-7"
            href="/ressurser/sjekkliste-vurdere-mer-lonn"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-[5px] bg-[rgba(20,83,45,0.08)] px-3 py-1 text-sm font-semibold text-[var(--primary-strong)]">
                Sjekkliste
              </span>
              <span className="text-sm font-semibold text-[var(--muted)]">Kan skrives ut</span>
            </div>
            <div className="grid gap-3">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Kan jeg be om mer lønn?
              </h2>
              <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
                En ryddig vurdering av marked, ansvar, resultater, timing og argumenter før du
                bestemmer deg for om du bør be om høyere lønn.
              </p>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
