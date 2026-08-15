import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";
import { editorialIdentity } from "@/lib/editorial-identity";
import { getAllNewsPosts } from "@/lib/nyheter";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const description =
  "Se de siste artiklene fra Lønnsinnsikt og finn kontaktinformasjon til redaksjonelt ansvarlig.";

export const metadata: Metadata = {
  title: "Redaksjonen",
  description,
  alternates: {
    canonical: editorialIdentity.authorPath,
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: editorialIdentity.authorPath,
    siteName: siteConfig.name,
    title: `Redaksjonen | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary",
    title: `Redaksjonen | ${siteConfig.name}`,
    description,
  },
};

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function RedaksjonenPage() {
  const [blogPosts, newsPosts] = await Promise.all([getAllBlogPosts(), getAllNewsPosts()]);
  const latestPublished = [
    ...blogPosts.map((post) => ({
      ...post,
      contentType: "Blogginnlegg",
      href: `/blogg/${post.slug}`,
    })),
    ...newsPosts.map((post) => ({
      ...post,
      contentType: "Nyhetsartikkel",
      href: `/nyheter/${post.slug}`,
    })),
  ]
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    )
    .slice(0, 6);
  const authorUrl = getAbsoluteUrl(editorialIdentity.authorPath);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `Redaksjonen | ${siteConfig.name}`,
    url: authorUrl,
    mainEntity: {
      "@type": "Organization",
      name: editorialIdentity.authorName,
      url: authorUrl,
      member: {
        "@type": "Person",
        name: editorialIdentity.responsibleName,
      },
      parentOrganization: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />

      <section className="overflow-hidden bg-[#f4f7f1] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(340px,1.18fr)] lg:gap-14">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight text-slate-950 sm:text-6xl">
              Redaksjonen
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
              Her finner du de siste artiklene fra Lønnsinnsikt og kontaktinformasjon til
              redaksjonelt ansvarlig.
            </p>
          </div>

          <div className="relative aspect-[3/2] overflow-hidden rounded-[5px] bg-[#ebece2] shadow-[0_20px_50px_rgba(27,36,48,0.1)]">
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 540px"
              src="/images/redaksjonen-header.png"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
                Ansvarlig
              </p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-950">
                Håkon Rolfsen
              </h2>
              <dl className="mt-6 grid gap-3 text-sm leading-7 text-slate-700 sm:text-base">
                <div>
                  <dt className="font-extrabold text-slate-950">Kontakt</dt>
                  <dd>
                    <a
                      className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                      href={`mailto:${editorialIdentity.contactEmail}`}
                    >
                      {editorialIdentity.contactEmail}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="grid gap-5 text-base leading-8 text-slate-700 sm:text-lg">
              <p>
                Lønnsinnsikt utvikles og drives av Håkon Rolfsen som et uavhengig norsk
                hobbyprosjekt.
              </p>
              <p>
                Håkon har ansvar for nettstedets tekniske utvikling, valg av datakilder,
                presentasjon av beregninger og publisering av redaksjonelt innhold. Det
                innebærer også ansvar for å vurdere tilbakemeldinger og rette dokumenterte
                feil.
              </p>
              <p>
                Lønnsinnsikt er ikke en del av Statistisk sentralbyrå eller en offentlig
                myndighet. Offentlige kilder leverer datagrunnlaget, mens utvalg,
                sammenstillinger, beregninger og forklaringer er Lønnsinnsikts ansvar.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
              Publisert
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
              De siste artiklene fra Lønnsinnsikt.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPublished.map((post) => (
                <article
                  className="group flex h-full flex-col overflow-hidden rounded-[5px] bg-white shadow-[0_16px_38px_rgba(27,36,48,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(27,36,48,0.11)]"
                  key={post.href}
                >
                  <Link
                    aria-label={`Les ${post.title}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-[#eef6ef]"
                    href={post.href}
                  >
                    <Image
                      alt={post.coverImageAlt ?? post.title}
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                      src={post.coverImage}
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em]">
                      <span className="text-[var(--primary-strong)]">{post.contentType}</span>
                      <time className="text-slate-500" dateTime={post.publishedAt}>
                        {formatBlogDate(post.publishedAt)}
                      </time>
                    </div>
                    <h3 className="mt-3 text-xl font-extrabold leading-snug text-slate-950">
                      <Link
                        className="transition group-hover:text-[var(--primary-strong)]"
                        href={post.href}
                      >
                        {post.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <Link
                className="inline-flex items-center gap-3 font-extrabold text-[var(--primary-strong)] transition hover:text-[var(--primary)]"
                href="/blogg"
              >
                Se alle blogginnlegg
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                className="inline-flex items-center gap-3 font-extrabold text-[var(--primary-strong)] transition hover:text-[var(--primary)]"
                href="/nyheter"
              >
                Se alle nyheter
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="grid gap-5 rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-6 shadow-[0_14px_36px_rgba(27,36,48,0.05)] sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-950">Slik arbeider vi</h2>
            <p className="max-w-4xl text-base leading-8 text-slate-700">
              Les mer om hvordan data hentes, kontrolleres og forklares, hvordan AI kan
              brukes som arbeidsverktøy, og hvordan du melder fra dersom noe bør rettes.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/metode"
              >
                Metode
              </Link>
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/redaksjonelle-retningslinjer"
              >
                Redaksjonelle retningslinjer
              </Link>
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/rettelser"
              >
                Rettelser
              </Link>
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/kontakt"
              >
                Kontakt
              </Link>
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-500">Sist oppdatert 15. august 2026.</p>
        </div>
      </section>
    </main>
  );
}
