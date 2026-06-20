import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";
import { WorkYearCalculatorDashboard } from "@/components/work-year-calculator-dashboard";
import { getPublicHolidaySummary, workYearProfiles } from "@/lib/arsverk";
import { siteConfig } from "@/lib/site-config";

const description =
  "Beregn brutto årsverk, arbeidstimer uten helligdager og disponibel arbeidstid etter ferie og andre fridager.";

export const metadata: Metadata = {
  title: "Årsverkskalkulator",
  description,
  alternates: {
    canonical: "/arsverk-kalkulator",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/arsverk-kalkulator",
    siteName: siteConfig.name,
    title: `Årsverkskalkulator | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Årsverkskalkulator | ${siteConfig.name}`,
    description,
  },
};

export default function ArsverkKalkulatorPage() {
  return (
    <div className="min-h-screen px-5 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <CalculatorCrossLinks currentHref="/arsverk-kalkulator" />
        <WorkYearCalculatorDashboard />
        <WorkYearGuide />
      </div>
    </div>
  );
}

function WorkYearGuide() {
  const currentYear = new Date().getFullYear();
  const holidayYears = Array.from({ length: 10 }, (_, index) =>
    getPublicHolidaySummary(currentYear + index),
  );

  return (
    <article className="px-1 py-4 sm:px-2 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Tre ulike mål på arbeidstid
        </h2>
        <div className="mt-6 grid gap-8 text-base leading-8 text-slate-600">
          <section className="grid gap-3">
            <p>
              Brutto årsverk er uketimer ganger 52 uker. Arbeidstid uten helligdager bruker
              faktiske hverdager i valgt år og trekker fra offentlige helligdager som faller på
              mandag til fredag. Disponibel arbeidstid trekker i tillegg fra ferie og andre
              fridager.
            </p>
            <p>
              Tallene erstatter ikke hverandre. De viser ulike nivåer av fratrekk og kan derfor
              alle være riktige samtidig.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Hva betyr valgene for arbeidstid?
            </h3>
            <p>
              Velg arbeidstidsordningen som følger av arbeidsavtalen, tariffområdet eller
              arbeidsplanen din. Lærervalgene bygger på årsrammene i SFS 2213.
            </p>
            <div className="mt-2 grid gap-4">
              {workYearProfiles.map((profile) => (
                <article
                  className="rounded-[5px] border border-black/8 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]"
                  key={profile.value}
                >
                  <h4 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
                    {profile.label}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{profile.description}</p>
                  <a
                    className="mt-3 inline-flex text-sm font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                    href={profile.sourceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {profile.sourceLabel}
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Helligdager på hverdager de neste årene
            </h3>
            <p>
              Kalkulatoren trekker fra offentlige helligdager som faller på mandag til fredag.
              Antallet varierer fordi flere av de faste helligdagene kan falle i en helg.
            </p>
            <div className="mt-2 overflow-x-auto rounded-[5px] border border-black/8 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-5 py-3 font-semibold" scope="col">
                      År
                    </th>
                    <th className="px-5 py-3 text-right font-semibold" scope="col">
                      På hverdager
                    </th>
                    <th className="px-5 py-3 text-right font-semibold" scope="col">
                      I helgen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {holidayYears.map((item) => (
                    <tr className="border-t border-black/6" key={item.year}>
                      <th className="px-5 py-3 font-semibold text-slate-950" scope="row">
                        {item.year}
                      </th>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-700">
                        {item.publicHolidaysOnWeekdays}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-700">
                        {item.publicHolidaysOnWeekends}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm leading-6 text-slate-500">
              Tabellen teller unike kalenderdager. Dersom to helligdager faller på samme dato,
              trekkes dagen bare fra én gang. Første påske- og pinsedag er ikke med fordi de alltid
              faller på søndag.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Les mer om årsverk
            </h3>
            <p>
              Se også forklaringen av{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/forklarer/arsverk"
              >
                hva et årsverk er
              </Link>
              . For de generelle grensene kan du lese{" "}
              <a
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/"
                rel="noreferrer"
                target="_blank"
              >
                Arbeidstilsynets oversikt over arbeidstid
              </a>
              . Lærere kan lese{" "}
              <a
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="https://www.utdanningsforbundet.no/lonn-og-arbeidsvilkar/tariffavtaler/ks/ks-tariffavtaler/sfs-2213/"
                rel="noreferrer"
                target="_blank"
              >
                SFS 2213 Arbeidstid skole
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
