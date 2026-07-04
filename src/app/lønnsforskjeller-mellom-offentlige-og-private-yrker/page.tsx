import type { Metadata } from "next";
import { MetricInfoButton } from "@/components/metric-info-button";
import { OccupationSectorSalaryGapRanking } from "@/components/occupation-sector-salary-gap-ranking";
import { getOccupationSectorSalaryGapRanking } from "@/lib/occupation-sector-salary-gap-ranking";
import { siteConfig } from "@/lib/site-config";

const title = "Lønnsforskjeller mellom offentlige og private yrker";
const description =
  "Se lønnsforskjeller mellom privat sektor, kommune og stat i norske yrker.";
const pagePath = "/lønnsforskjeller-mellom-offentlige-og-private-yrker";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: pagePath,
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: pagePath,
    siteName: siteConfig.name,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default async function OccupationSectorSalaryGapPage() {
  const data = await getOccupationSectorSalaryGapRanking();

  return (
    <main className="min-h-screen px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="mx-auto max-w-4xl space-y-4 text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Hvor er forskjellen størst? Her finner du yrker der SSB har publisert
            medianlønn for privat sektor og minst ett offentlig nivå: kommune,
            stat eller begge deler.
          </p>
          <div className="flex justify-center">
            <MetricInfoButton
              description={<SelectionInfoContent />}
              label="Utvalg og beregning"
              variant="muted"
            >
              Les mer om dette utvalget
            </MetricInfoButton>
          </div>
        </header>

        <OccupationSectorSalaryGapRanking data={data} />

        <section className="rounded-[5px] border border-slate-200 bg-white px-5 py-5 text-sm leading-6 text-slate-600 shadow-[0_18px_46px_rgba(15,23,42,0.05)] sm:px-6">
          <h2 className="text-base font-semibold text-slate-950">Om tallene</h2>
          <p className="mt-2">
            Yrket tas bare med hvis det har median månedslønn for privat sektor
            og offentlig lønn i kommune, stat eller begge deler. Hvis både
            kommune og stat finnes, beregnes forskjellen på begge nivåer.
          </p>
          <p className="mt-2">
            Lønnsforskjellen er beregnet fra median månedslønn for begge kjønn
            og arbeidstid i alt. Prosenten viser forskjellen relativt til privat
            medianlønn, og kronebeløpet viser avviket i månedslønn.
          </p>
          <p className="mt-2">
            Arbeidsforholdene i median-kortene viser antall arbeidsforhold med
            lønn i samme sektor og yrke. Et arbeidsforhold er en jobb med lønn,
            og én person kan ha flere arbeidsforhold.
          </p>
          <p className="mt-2">
            Kilde: {data.source}. Periode: {data.periodLabel ?? "siste tilgjengelige periode"}.
          </p>
        </section>
      </div>
    </main>
  );
}

function SelectionInfoContent() {
  return (
    <div className="space-y-4">
      <p>
        Listen bruker SSB tabell 11418 og tar bare med yrker som har publisert
        median månedslønn for privat sektor og minst ett offentlig nivå:
        kommuneforvaltningen, statsforvaltningen eller begge deler.
      </p>
      <p>
        For hvert yrke sammenlignes privat medianlønn med kommune og stat hver
        for seg. Hvis både kommune og stat finnes, beregnes begge forskjellene.
        Rangeringen bruker den største prosentvise forskjellen i yrket.
      </p>
      <p>
        Prosenten beregnes relativt til privat medianlønn. Kronebeløpet viser
        forskjellen i månedslønn mellom privat sektor og det offentlige nivået
        som gir størst utslag.
      </p>
      <p>
        SSBs private sektor heter egentlig «Privat sektor og offentlige eide
        foretak». Det betyr at privat-tallet ikke bare omfatter rene private
        bedrifter, men også foretak som er offentlig eid og organisert utenfor
        forvaltningen.
      </p>
      <p>
        Yrke og sektor er to separate dimensjoner i SSB-dataene. Et yrke kan
        derfor ha et navn som høres offentlig ut, samtidig som det finnes
        observasjoner i sektoren «Privat sektor og offentlige eide foretak».
      </p>
      <p>
        Arbeidsforholdene i kortene viser antall jobber med lønn i samme sektor
        og yrke. Ett menneske kan ha flere arbeidsforhold, så tallet er ikke det
        samme som unike personer.
      </p>
    </div>
  );
}
