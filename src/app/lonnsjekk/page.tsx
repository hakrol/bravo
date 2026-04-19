import type { Metadata } from "next";
import Link from "next/link";
import { LonnsjekkTool } from "@/components/lonnsjekk-tool";
import { buildLonnsjekkPageData } from "@/lib/lonnsjekk";
import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestSalaryDataset,
  getOccupationMedianSalaryOverview,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
} from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

const description =
  "Sammenlign lønnen din med markedet og få en rask vurdering basert på oppdaterte lønnstall fra SSB.";

export const metadata: Metadata = {
  title: "Lønnssjekk: Sammenlign lønnen din med markedet",
  description,
  alternates: {
    canonical: "/lonnsjekk",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/lonnsjekk",
    siteName: siteConfig.name,
    title: `Lønnssjekk: Sammenlign lønnen din med markedet | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Lønnssjekk: Sammenlign lønnen din med markedet | ${siteConfig.name}`,
    description,
  },
};

export default async function LonnsjekkPage() {
  const averageDataset = await getLatestSalaryDataset(
    "occupationDetailed",
    OCCUPATION_MONTHLY_SALARY_FILTERS,
  );
  const averageOverview = buildOccupationSalaryOverview(averageDataset);
  const medianOverview = await getOccupationMedianSalaryOverview(
    averageOverview.rows.map((row) => row.occupationCode),
    OCCUPATION_MONTHLY_SALARY_FILTERS,
  );
  const data = buildLonnsjekkPageData({
    averageRows: averageOverview.rows,
    medianRows: medianOverview.rows,
    averageMonthlySalaryAll: averageOverview.averageMonthlySalary,
    periodLabel: averageOverview.periodLabel ?? medianOverview.periodLabel,
    updated: averageDataset.updated,
  });

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <LonnsjekkTool data={data} />
        <LonnsjekkInternalLinks />
      </div>
    </div>
  );
}

function LonnsjekkInternalLinks() {
  return (
    <article className="px-1 py-4 sm:px-2 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">
          Les mer om lønn
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Se også{" "}
          <Link
            className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
            href="/blogg/hvordan-be-om-mer-lonn"
          >
            hvordan du kan be om mer lønn
          </Link>{" "}
          ,{" "}
          <Link
            className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
            href="/blogg/hvor-mye-mer-kan-man-be-om-i-lonn"
          >
            hvor mye mer lønn det er vanlig å be om
          </Link>{" "}
          og{" "}
          <Link
            className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
            href="/yrkesgrupper"
          >
            lønn etter yrkesgrupper
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
