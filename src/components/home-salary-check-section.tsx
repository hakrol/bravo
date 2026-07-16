import Link from "next/link";

const benefits = [
  {
    description: "Vi lagrer eller deler ikke opplysningene dine.",
    icon: "shield",
    title: "100% anonymt",
  },
  {
    description: "Sammenligningen bruker ferske lønnstall fra SSB.",
    icon: "chart",
    title: "Oppdatert med SSB-data",
  },
  {
    description: "Legg inn lønn og yrke, og få rapporten på sekunder.",
    icon: "bolt",
    title: "Raskt og enkelt",
  },
] as const;

export function HomeSalaryCheckSection() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f8fbf8] px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,83,45,0.09),transparent_42%)]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
            Din personlige lønnsrapport
          </p>
          <h2 className="mt-5 text-5xl font-semibold leading-none tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
            Lønnsjekk
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-xl leading-9 text-slate-600 sm:text-2xl sm:leading-10">
            Finn ut hvordan lønnen din ligger an sammenlignet med andre i yrket ditt.
          </p>

          <Link
            className="mt-10 inline-flex items-center gap-3 rounded-[7px] bg-[var(--primary-strong)] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_38px_rgba(20,83,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[var(--primary)] hover:shadow-[0_20px_44px_rgba(20,83,45,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
            href="/lonnsjekk"
          >
            Sjekk lønnen din
            <span aria-hidden="true" className="text-xl leading-none">
              →
            </span>
          </Link>
        </div>

        <div className="mt-20 grid gap-12 border-t border-emerald-950/10 pt-16 md:grid-cols-3 md:gap-8 lg:mt-24 lg:pt-20">
          {benefits.map((benefit) => (
            <article className="text-center" key={benefit.title}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f3e9] text-[var(--primary-strong)]">
                <BenefitIcon icon={benefit.icon} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-950 sm:text-2xl">
                {benefit.title}
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-slate-600">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitIcon({ icon }: { icon: (typeof benefits)[number]["icon"] }) {
  if (icon === "chart") {
    return (
      <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
        <path d="M5 19v-6h3v6H5Zm5.5 0V9h3v10h-3Zm5.5 0V5h3v14h-3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (icon === "bolt") {
    return (
      <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
        <path d="m13.5 2-8 11h6l-1 9 8-12h-6l1-8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
      <path d="M12 3.5 18.5 6v5.3c0 4.1-2.6 7.7-6.5 9.2-3.9-1.5-6.5-5.1-6.5-9.2V6L12 3.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="m9 12 2 2 4-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
