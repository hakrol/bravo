import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";
import { MileageAllowanceCalculatorDashboard } from "@/components/mileage-allowance-calculator-dashboard";
import {
  mileageAdditionRates,
  mileageAllowanceSourceUrl,
  mileageAllowanceYear,
  mileageVehicleRates,
} from "@/lib/kilometergodtgjorelse";
import { siteConfig } from "@/lib/site-config";

const description =
  "Beregn kilometergodtgjørelse, skattefri del og eventuell skattepliktig del med oppdaterte satser for 2026.";

export const metadata: Metadata = {
  title: "Kilometergodtgjørelse kalkulator",
  description,
  alternates: {
    canonical: "/kilometergodtgjorelse-kalkulator",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/kilometergodtgjorelse-kalkulator",
    siteName: siteConfig.name,
    title: `Kilometergodtgjørelse kalkulator | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Kilometergodtgjørelse kalkulator | ${siteConfig.name}`,
    description,
  },
};

export default function MileageAllowanceCalculatorPage() {
  return (
    <div className="min-h-screen px-5 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <CalculatorCrossLinks currentHref="/kilometergodtgjorelse-kalkulator" />
        <MileageAllowanceCalculatorDashboard />
        <MileageAllowanceRates />
      </div>
    </div>
  );
}

function MileageAllowanceRates() {
  return (
    <article className="px-1 py-4 sm:px-2 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
            Satser for kilometergodtgjørelse i {mileageAllowanceYear}
          </h2>
          <p className="text-base leading-8 text-slate-600">
            Tabellen viser trekkfri og skattefri kilometergodtgjørelse ved yrkeskjøring med
            privat kjøretøy. Satsene gjelder uansett kjørelengde og også for reiser utenlands.
          </p>
        </div>

        <section className="mt-8 grid gap-4">
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            Satser etter kjøretøy
          </h3>
          <div className="overflow-x-auto rounded-[5px] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <thead className="bg-slate-50 text-sm text-slate-700">
                <tr>
                  <th className="px-5 py-4 font-semibold">Kjøretøy</th>
                  <th className="px-5 py-4 text-right font-semibold">Skattefri sats</th>
                </tr>
              </thead>
              <tbody>
                {mileageVehicleRates.map((rate) => (
                  <tr className="border-t border-black/6" key={rate.value}>
                    <td className="px-5 py-4 text-sm text-slate-700">{rate.label}</td>
                    <td className="px-5 py-4 text-right text-sm font-semibold tabular-nums text-slate-950">
                      {formatRate(rate.taxFreeRate)} kr/km
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-4">
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            Satser for tillegg
          </h3>
          <div className="overflow-x-auto rounded-[5px] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <thead className="bg-slate-50 text-sm text-slate-700">
                <tr>
                  <th className="px-5 py-4 font-semibold">Tillegg</th>
                  <th className="px-5 py-4 text-right font-semibold">Sats</th>
                </tr>
              </thead>
              <tbody>
                <RateRow
                  label="Passasjer"
                  value={`${formatRate(mileageAdditionRates.passenger)} kr/km per passasjer`}
                />
                <RateRow
                  label="Kjøring på skogs- og anleggsvei"
                  value={`${formatRate(mileageAdditionRates.forestRoad)} kr/km`}
                />
                <RateRow
                  label="Utstyr og materiell som krever tilhenger eller tilsvarende transport"
                  value={`${formatRate(mileageAdditionRates.equipment)} kr/km`}
                />
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-[5px] bg-amber-50 p-5 text-sm leading-7 text-slate-700 sm:p-6">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
            Statens sats og skattefri sats for bil
          </h3>
          <p className="mt-3">
            Statens sats for kjøregodtgjørelse er 5,30 kr/km, mens den skattefrie satsen er
            3,50 kr/km. Når arbeidsgiver utbetaler 5,30 kr/km, er differansen på 1,80 kr/km
            skattepliktig.
          </p>
        </section>

        <section className="mt-10 border-t border-black/8 pt-8">
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            Skatteetaten er fasit
          </h3>
          <p className="mt-3 text-base leading-8 text-slate-600">
            Kalkulatoren bruker satsene Skatteetaten oppgir for {mileageAllowanceYear}. Kontroller
            alltid vilkårene og de nyeste satsene hos Skatteetaten dersom beregningen skal brukes
            til lønn, reiseregning eller rapportering.
          </p>
          <Link
            className="mt-4 inline-flex items-center font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
            href={mileageAllowanceSourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Se offisielle satser hos Skatteetaten
          </Link>
        </section>
      </div>
    </article>
  );
}

function RateRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-t border-black/6">
      <td className="px-5 py-4 text-sm text-slate-700">{label}</td>
      <td className="px-5 py-4 text-right text-sm font-semibold tabular-nums text-slate-950">
        {value}
      </td>
    </tr>
  );
}

function formatRate(value: number) {
  return value.toLocaleString("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
