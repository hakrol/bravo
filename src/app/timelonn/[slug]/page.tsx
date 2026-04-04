import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHourlySalaryPageBySlug, getHourlySalaryPages } from "@/lib/hourly-salary-pages";
import { siteConfig } from "@/lib/site-config";

type HourlySalaryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getHourlySalaryPages().map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: HourlySalaryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getHourlySalaryPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.href,
    },
    openGraph: {
      type: "article",
      locale: "nb_NO",
      url: page.href,
      siteName: siteConfig.name,
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
    },
  };
}

export default async function HourlySalaryPage({ params }: HourlySalaryPageProps) {
  const { slug } = await params;
  const page = getHourlySalaryPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <section className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-6 py-8 shadow-sm sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">Timelønn</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {page.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-[var(--muted)] sm:text-lg">{page.intro}</p>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] px-6 py-8 shadow-sm sm:px-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Videre fra denne siden</h2>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">
            Denne første versjonen fungerer som en landingsside for timelønnssøk. Neste steg kan være å koble på
            grafer og nivåer direkte her, men enn så lenge peker siden videre til full yrkesdetalj.
          </p>
          <Link
            className="mt-6 inline-flex items-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
            href={page.detailHref}
          >
            Se full yrkesdetalj
          </Link>
        </section>
      </div>
    </div>
  );
}
