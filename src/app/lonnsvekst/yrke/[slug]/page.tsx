import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogFAQ, BlogFAQItem } from "@/components/blog-faq";
import { OccupationSalaryGrowthView } from "@/components/occupation-salary-growth-view";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import {
  buildOccupationSalaryGrowthData,
  buildOccupationSalaryGrowthHref,
  getOccupationSalaryGrowthDetail,
  getOccupationSalaryGrowthStaticParams,
  hasOccupationSalaryGrowthData,
  type OccupationSalaryGrowthRow,
} from "@/lib/occupation-salary-growth";

export const revalidate = 2592000;
export const dynamic = "force-static";
export const dynamicParams = false;

type OccupationSalaryGrowthPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = getOccupationSalaryGrowthStaticParams;

export async function generateMetadata({
  params,
}: OccupationSalaryGrowthPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getOccupationSalaryGrowthDetail(slug);

  if (!detail) {
    return {};
  }

  const occupationLabel = formatOccupationDisplayLabel(detail.detailPage.label);
  const textLabel = occupationLabel.toLocaleLowerCase("nb-NO");
  const canonical = buildOccupationSalaryGrowthHref(detail.detailPage.slug);
  const description = `Se lønnsvekst for ${textLabel} år for år, med historisk lønn, KPI, reallønnsvekst og diagram fordelt på kvinner og menn.`;

  return {
    title: `Lønnsvekst for ${textLabel}`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "nb_NO",
      url: canonical,
      title: `Lønnsvekst for ${textLabel}`,
      description,
    },
  };
}

export default async function OccupationSalaryGrowthPage({
  params,
}: OccupationSalaryGrowthPageProps) {
  const { slug } = await params;
  const detail = await getOccupationSalaryGrowthDetail(slug);

  if (!detail) {
    notFound();
  }

  const occupationLabel = formatOccupationDisplayLabel(detail.detailPage.label);
  const textLabel = occupationLabel.toLocaleLowerCase("nb-NO");
  const { rows, chartPoints, latestYear, measureLabel, sourceTableId } =
    buildOccupationSalaryGrowthData(detail);

  if (!hasOccupationSalaryGrowthData(rows)) {
    notFound();
  }

  const faqItems = buildFaqItems(textLabel, rows);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        type="application/ld+json"
      />
      <div className="mx-auto w-full max-w-7xl">
        <header className="max-w-4xl">
          <h1 className="text-4xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
            Lønnsvekst for {textLabel}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
            Her ser du lønnsvekst for {textLabel} år for år. Tabellen viser median månedslønn,
            lønnsveksten fra året før, KPI og reallønnsvekst, slik at du kan se om lønnen har økt
            mer eller mindre enn prisene.
          </p>
          <Link
            className="mt-3 inline-flex text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition hover:text-emerald-900 hover:decoration-emerald-900"
            href={detail.detailPage.href}
          >
            Se lønn og nøkkeltall for {textLabel}
          </Link>
        </header>

        <OccupationSalaryGrowthView
          chartPoints={chartPoints}
          latestYear={latestYear}
          measureLabel={measureLabel}
          occupationLabel={occupationLabel}
          rows={rows}
        />

        <div className="mt-14 w-full">
          <BlogFAQ
            aria-label={`Spørsmål om lønnsvekst for ${textLabel}`}
            className="occupation-salary-growth-faq"
          >
            {faqItems.map((item) => (
              <BlogFAQItem key={item.question} question={item.question}>
                <p>{item.answer}</p>
              </BlogFAQItem>
            ))}
          </BlogFAQ>

          <p className="mt-8 border-t border-slate-200 pt-5 text-sm leading-7 text-slate-600">
            Lønnstallene viser {measureLabel.toLocaleLowerCase("nb-NO")} fra{" "}
            <a
              className="font-medium text-[var(--primary-strong)] underline decoration-emerald-900/25 underline-offset-4 transition hover:decoration-emerald-900"
              href={`https://www.ssb.no/statbank/table/${sourceTableId}`}
              rel="noreferrer"
              target="_blank"
            >
              SSBs yrkesstatistikk, tabell {sourceTableId}
            </a>
            . KPI viser årlig prisvekst. Reallønnsvekst er beregnet ved å justere lønnsveksten for
            KPI.
          </p>
        </div>
      </div>
    </main>
  );
}

function buildFaqItems(occupationLabel: string, rows: OccupationSalaryGrowthRow[]) {
  const comparableRows = rows.filter((row) =>
    row.salaryGrowth !== undefined &&
    row.inflationGrowth !== undefined &&
    row.realGrowth !== undefined,
  ) as Array<OccupationSalaryGrowthRow & {
    salaryGrowth: number;
    inflationGrowth: number;
    realGrowth: number;
  }>;
  const yearlyQuestions = comparableRows.slice(0, 5).map((row) => ({
    question: `Hva var lønnsveksten til ${occupationLabel} i ${row.year}?`,
    answer: `Månedslønnen for ${occupationLabel} økte med ${formatPercent(row.salaryGrowth)} fra året før og var ${formatCurrency(row.salary)} i ${row.year}. Justert for KPI på ${formatPercent(row.inflationGrowth)} var reallønnsveksten ${formatSignedPercent(row.realGrowth)}.`,
  }));
  const latest = comparableRows[0];

  return [
    ...yearlyQuestions,
    ...(latest ? [{
      question: `Økte lønnen til ${occupationLabel} mer enn prisene i ${latest.year}?`,
      answer:
        latest.realGrowth > 0
          ? `Ja. Lønnsveksten var høyere enn KPI i ${latest.year}, og reallønnsveksten var ${formatSignedPercent(latest.realGrowth)}.`
          : latest.realGrowth < 0
            ? `Nei. KPI økte mer enn lønnen i ${latest.year}, og reallønnsveksten var ${formatSignedPercent(latest.realGrowth)}.`
            : `Lønnen og prisene utviklet seg omtrent likt i ${latest.year}. Reallønnsveksten var ${formatSignedPercent(latest.realGrowth)}.`,
    }] : [{
      question: `Hvorfor vises ikke årlig lønnsvekst for ${occupationLabel}?`,
      answer: `SSB-snapshotet har foreløpig ikke to sammenlignbare år med lønnstall for ${occupationLabel}. Derfor kan lønnsvekst og reallønnsvekst ikke beregnes ennå.`,
    }]),
    {
      question: `Hvordan beregnes reallønnsvekst for ${occupationLabel}?`,
      answer: "Reallønnsvekst beregnes ved å sammenligne den prosentvise lønnsveksten med KPI. Beregningen tar hensyn til at prosentendringene virker sammen, og viser om kjøpekraften har økt eller falt.",
    },
    {
      question: "Hva betyr KPI i tabellen?",
      answer: "KPI er konsumprisindeksen og brukes her som mål på prisveksten fra året før. Når lønnen øker mer enn KPI, er reallønnsveksten positiv.",
    },
  ];
}

function formatCurrency(value: number) {
  return `${new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 }).format(value)} kroner`;
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1 }).format(value)} prosent`;
}

function formatSignedPercent(value: number) {
  return `${value > 0 ? "+" : ""}${formatPercent(value)}`;
}

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
