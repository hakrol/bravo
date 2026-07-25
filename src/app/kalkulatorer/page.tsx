import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageHero } from "@/components/info-page-hero";
import { calculators } from "@/lib/tool-catalog";
import { siteConfig } from "@/lib/site-config";

const description =
  "Se alle kalkulatorene for lønn, årsverk, lån, renter og kilometergodtgjørelse på ett sted.";

export const metadata: Metadata = {
  title: "Kalkulatorer",
  description,
  alternates: {
    canonical: "/kalkulatorer",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/kalkulatorer",
    siteName: siteConfig.name,
    title: `Kalkulatorer | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Kalkulatorer | ${siteConfig.name}`,
    description,
  },
};

export default function KalkulatorerPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <InfoPageHero
        title="Kalkulatorer"
        description="Regn på lønn, lønnsvekst, årsverk, lån og godtgjørelser med kalkulatorer laget for norske forhold."
        imageSrc="/images/hero-kalkulatorer.png"
        imageAlt="Illustrasjon av en kalkulator med diagrammer for lønn, tid og økonomi"
      />

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <section className="fade-up-delay grid gap-5 md:grid-cols-2">
            {calculators.map((calculator) => (
              <ToolCard
                description={calculator.description}
                href={calculator.href}
                key={calculator.href}
                label={calculator.label}
                tag="Kalkulator"
              />
            ))}
          </section>

          <Link
            className="inline-flex w-fit items-center font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
            href="/verktoy"
          >
            Se alle verktøy
          </Link>
        </div>
      </section>
    </main>
  );
}

function ToolCard({
  href,
  label,
  description,
  tag,
}: {
  href: string;
  label: string;
  description: string;
  tag: string;
}) {
  return (
    <Link
      className="grid content-start gap-4 rounded-[5px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_48px_rgba(27,36,48,0.07)] transition hover:-translate-y-0.5 hover:border-[rgba(20,83,45,0.28)] hover:shadow-[0_24px_64px_rgba(27,36,48,0.1)] sm:p-7"
      href={href}
    >
      <span className="w-fit rounded-[5px] bg-[rgba(20,83,45,0.08)] px-3 py-1 text-sm font-semibold text-[var(--primary-strong)]">
        {tag}
      </span>
      <div className="grid gap-3">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{label}</h2>
        <p className="text-base leading-8 text-[var(--muted)]">{description}</p>
      </div>
    </Link>
  );
}
