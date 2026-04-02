import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topp jobber | Lønnsdata Norge",
  description: "Planlagt side for å utforske de best betalte jobbene og lønnsvekst over tid.",
};

const focusAreas = [
  "de mest betalte jobbene akkurat nå",
  "hvilke jobber som har vokst mest i lønn de siste årene",
  "yrker som kombinerer høy lønn og sterk utvikling",
] as const;

export default function TopJobsPage() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="fade-up rounded-md border bg-[var(--surface)] px-6 py-8 shadow-sm sm:px-8 sm:py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
            Idéside
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
            Topp jobber
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Denne siden skal samle jobbene som skiller seg ut med høyest lønn og sterkest
            lønnsvekst, slik at det blir lett å se hvilke yrker som leder an.
          </p>
        </section>

        <section className="fade-up-delay rounded-md border bg-white/85 px-6 py-8 shadow-sm sm:px-8">
          <h2 className="text-xl font-semibold text-slate-950">Hva siden skal vise</h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-slate-700">
            {focusAreas.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" aria-hidden />
                <span className="text-balance capitalize">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
