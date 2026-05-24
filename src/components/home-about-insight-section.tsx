import Link from "next/link";

export function HomeAboutInsightSection() {
  return (
    <section className="relative left-1/2 flex w-screen min-h-screen -translate-x-1/2 items-center bg-[#fbfbf8] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-14 md:grid-cols-[minmax(0,0.95fr)_minmax(24rem,1fr)] md:items-center lg:gap-20">
          <div>
            <h2 className="max-w-3xl text-6xl font-semibold leading-[0.96] text-slate-950 sm:text-7xl lg:text-8xl">
              Lønnstall du
              <span className="block">
                kan bruke<span className="text-[var(--primary)]">.</span>
              </span>
            </h2>
            <p className="mt-9 max-w-2xl text-2xl leading-10 text-slate-600">
              Pålitelige lønnsdata fra SSB, gjort lettere å forstå når du vurderer
              jobbtilbud, lønnssamtaler og karrierevalg.
            </p>

            <Link
              className="mt-12 inline-flex items-center gap-5 text-xl font-semibold text-[var(--primary-strong)] transition hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
              href="/yrker"
            >
              Utforsk yrker
              <span aria-hidden="true" className="text-5xl font-light leading-none">
                →
              </span>
            </Link>
          </div>

          <div className="grid gap-12">
            <FeatureRow
              description="Offisiell statistikk fra Statistisk sentralbyrå."
              icon="shield"
              title="Pålitelige data"
            />
            <FeatureRow
              description="Søk på yrke, sammenlign nivåer og finn relevante tall raskt."
              icon="search"
              title="Finn det du trenger"
            />
            <FeatureRow
              description="Få innsikt som gjør lønnsnivå, utvikling og forskjeller enklere å tolke."
              icon="chart"
              title="Mer enn bare et tall"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

function FeatureRow({
  description,
  icon,
  title,
}: {
  description: string;
  icon: "chart" | "search" | "shield";
  title: string;
}) {
  return (
    <article className="grid grid-cols-[6.75rem_minmax(0,1fr)] items-center gap-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#eef6ef] text-[var(--primary-strong)] shadow-[inset_0_0_0_1px_rgba(20,83,45,0.04)]">
        <FeatureIcon icon={icon} />
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-slate-950 lg:text-3xl">{title}</h3>
        <p className="mt-3 text-xl leading-9 text-slate-600">{description}</p>
      </div>
    </article>
  );
}

function FeatureIcon({ icon }: { icon: "chart" | "search" | "shield" }) {
  if (icon === "search") {
    return (
      <svg aria-hidden="true" className="h-12 w-12" fill="none" viewBox="0 0 24 24">
        <path
          d="m20 20-4.6-4.6m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (icon === "chart") {
    return (
      <svg aria-hidden="true" className="h-12 w-12" fill="none" viewBox="0 0 24 24">
        <path
          d="M5 19v-6h3v6H5Zm5.5 0V9h3v10h-3Zm5.5 0V5h3v14h-3Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-12 w-12" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3.5 18.5 6v5.3c0 4.1-2.6 7.7-6.5 9.2-3.9-1.5-6.5-5.1-6.5-9.2V6L12 3.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m9 12 2 2 4-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
