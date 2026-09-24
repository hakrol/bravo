import { AdsenseAd } from "@/components/adsense-ad";
import type { Metadata } from "next";
import Link from "next/link";
import { calculators, otherTools } from "@/lib/tool-catalog";
import { siteConfig } from "@/lib/site-config";

const description =
  "Finn alle kalkulatorer, sjekklister og praktiske verktøy for lønn, arbeidsliv og økonomiske vurderinger.";

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
  title: "Verktøy og kalkulatorer",
  description,
  alternates: { canonical: "/verktoy" },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/verktoy",
    siteName: siteConfig.name,
    title: `Verktøy og kalkulatorer | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Verktøy og kalkulatorer | ${siteConfig.name}`,
    description,
  },
};

type CardIcon = "calculator" | "tool" | "checklist";

type ToolCardProps = {
  badge?: "Populær" | "Ny";
  category: string;
  description: string;
  href: string;
  icon: CardIcon;
  title: string;
};

function CardIconGraphic({ icon }: { icon: CardIcon }) {
  const commonProps = {
    "aria-hidden": true,
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  if (icon === "calculator") {
    return (
      <svg {...commonProps}>
        <rect height="19" rx="2" width="14" x="5" y="2.5" />
        <path d="M8 6h8v4H8zM8.5 14h.01m3.49 0h.01m3.49 0h.01M8.5 18h.01m3.49 0h.01m3.49 0h.01" />
      </svg>
    );
  }

  if (icon === "checklist") {
    return (
      <svg {...commonProps}>
        <path d="M9 5h10v16H5V5h2" />
        <path d="M9 3h6v4H9zM8 12l1.5 1.5L12 11m-4 6 1.5 1.5L12 16m2-3h3m-3 5h3" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18a2.1 2.1 0 0 0 3 3l5.3-5.3a5 5 0 0 0 6.4-6.4l-3.4 3.4-3-3 3.4-3.4Z" />
    </svg>
  );
}

function ToolCard({ badge, category, description, href, icon, title }: ToolCardProps) {
  const actionLabel =
    icon === "calculator"
      ? "Åpne kalkulatoren"
      : icon === "checklist"
        ? "Åpne sjekklisten"
        : "Åpne verktøyet";

  return (
    <Link
      className="group relative flex min-h-72 flex-col rounded-[22px] border border-[#e1e8e4] bg-white p-6 shadow-[0_14px_34px_rgba(27,36,48,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(20,83,45,0.3)] hover:shadow-[0_20px_44px_rgba(27,36,48,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--primary-strong)] sm:p-7"
      href={href}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#eaf6f0] text-[var(--primary-strong)]">
          <CardIconGraphic icon={icon} />
        </span>
        {badge ? (
          <span className="rounded-full bg-[var(--primary-strong)] px-3 py-1 text-xs font-semibold text-white">
            {badge === "Ny" ? "✦ Ny" : badge}
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
          {category}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950">{title}</h3>
        <p className="mt-3 text-[15px] leading-6 text-[var(--muted)]">{description}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[var(--primary-strong)]">
          {actionLabel}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

function SectionHeading({ children, description }: { children: string; description: string }) {
  return (
    <div className="grid gap-2">
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">{children}</h2>
      <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">{description}</p>
    </div>
  );
}

export default function VerktoyPage() {
  return (
    <main className="min-h-screen bg-[#fbfcfa] px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 lg:gap-16">
        <section className="fade-up grid gap-4 text-center sm:mx-auto sm:max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
            Verktøy
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
            Verktøy for smartere lønnsvalg
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Bruk kalkulatorer, sammenlign lønn og gjør deg klar til lønnssamtalen med praktiske verktøy laget for norske forhold.
          </p>
        </section>

        <section className="fade-up-delay grid gap-7">
          <SectionHeading description="Sjekk markedsnivået, sammenlign yrker og få bedre oversikt over lønn og arbeidsliv.">
            Nyttige verktøy
          </SectionHeading>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {otherTools.map((tool) => (
              <ToolCard
                badge={tool.href === "/lonnsjekk" ? "Populær" : undefined}
                category="Verktøy"
                description={tool.description}
                href={tool.href}
                icon="tool"
                key={tool.href}
                title={tool.label}
              />
            ))}
          </div>
        </section>

        <AdsenseAd placement="overview-between-sections" />

        <section className="grid scroll-mt-24 gap-7" id="kalkulatorer">
          <SectionHeading description="Regn på lønn, arbeidstid, ferie, lån og andre økonomiske valg med raske og enkle kalkulatorer.">
            Kalkulatorer
          </SectionHeading>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {calculators.map((calculator, index) => (
              <ToolCard
                badge={index === calculators.length - 1 ? "Ny" : undefined}
                category="Kalkulator"
                description={calculator.description}
                href={calculator.href}
                icon="calculator"
                key={calculator.href}
                title={calculator.label}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-7">
          <SectionHeading description="Forbered deg steg for steg og få med det viktigste før du tar en beslutning eller går inn i en lønnssamtale.">
            Sjekklister
          </SectionHeading>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <ToolCard
                category="Sjekkliste"
                description={resource.description}
                href={resource.href}
                icon="checklist"
                key={resource.href}
                title={resource.title}
              />
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#d5e2db] bg-[#f0f5f1] px-6 py-8 sm:px-8 sm:py-9 lg:px-10">
          <ul className="grid gap-3 text-base leading-7 text-[var(--muted)] sm:grid-cols-2">
            {[
              "Helt gratis – du trenger verken konto eller registrering",
              "Tilpasset norske lønns-, arbeids- og økonomiforhold",
              "Tydelige svar som gjør tallene enklere å forstå",
              "Kalkulatorer, lønnsverktøy og sjekklister samlet på ett sted",
            ].map((benefit) => (
              <li className="flex items-start gap-3" key={benefit}>
                <span aria-hidden="true" className="mt-0.5 font-bold text-[var(--primary-strong)]">
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
