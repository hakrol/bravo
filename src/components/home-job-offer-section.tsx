import Link from "next/link";

const benefits = [
  {
    description: "Se tilbudet opp mot oppdatert medianlønn for yrket fra SSB.",
    icon: "chart",
    title: "Sammenlignet med markedet",
  },
  {
    description: "Få et veiledende lønnsintervall basert på erfaring og lederansvar.",
    icon: "adjust",
    title: "Tilpasset din situasjon",
  },
  {
    description: "Få forslag til formulering og punkter du bør avklare før du svarer.",
    icon: "message",
    title: "Bedre grunnlag for svaret",
  },
] as const;

export function HomeJobOfferSection() {
  return (
    <section
      aria-labelledby="home-job-offer-heading"
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-t border-emerald-950/10 bg-[#f3f7f3] px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,83,45,0.11),transparent_44%)]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
            Før du svarer på jobbtilbudet
          </p>
          <h2
            className="mt-5 text-5xl font-semibold leading-none tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl"
            id="home-job-offer-heading"
          >
            Vurder lønnstilbudet
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-xl leading-9 text-slate-600 sm:text-2xl sm:leading-10">
            Se hvordan tilbudet ligger an mot markedet, og få et forklart anslag basert på yrke,
            erfaring og ansvar.
          </p>

          <Link
            className="mt-10 inline-flex items-center gap-3 rounded-[7px] bg-[var(--primary-strong)] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_38px_rgba(20,83,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[var(--primary)] hover:shadow-[0_20px_44px_rgba(20,83,45,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
            href="/jobbtilbud"
          >
            Vurder tilbudet
            <span aria-hidden="true" className="text-xl leading-none">
              →
            </span>
          </Link>
        </div>

        <div className="mt-20 grid gap-12 border-t border-emerald-950/10 pt-16 md:grid-cols-3 md:gap-8 lg:mt-24 lg:pt-20">
          {benefits.map((benefit) => (
            <article className="text-center" key={benefit.title}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#dfefe3] text-[var(--primary-strong)]">
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
  const commonProps = {
    "aria-hidden": true,
    className: "h-8 w-8",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  if (icon === "adjust") {
    return (
      <svg {...commonProps}>
        <path d="M4 7h10m4 0h2M4 17h2m4 0h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </svg>
    );
  }

  if (icon === "message") {
    return (
      <svg {...commonProps}>
        <path d="M5 5.5h14v10H9l-4 3v-13Z" />
        <path d="M8.5 9.5h7M8.5 12.5h4.5" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M5 19v-5h3v5H5Zm5.5 0V9h3v10h-3Zm5.5 0V5h3v14h-3Z" />
    </svg>
  );
}
