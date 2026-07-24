import type { Metadata } from "next";
import Link from "next/link";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";
import { editorialIdentity } from "@/lib/editorial-identity";
import { getAllForklarerPosts } from "@/lib/forklarer";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const description =
  "Møt Redaksjonen i Lønnsinnsikt og se hvem som har ansvar for nettstedets artikler, databruk og redaksjonelle innhold.";

const responsibilities = [
  "velge og prioritere temaer som er nyttige for arbeidstakere og jobbsøkere",
  "kontrollere at lønnstall og andre datapunkter kan spores til oppgitte kilder",
  "skille tydelig mellom offisiell statistikk, egne beregninger og redaksjonelle vurderinger",
  "oppdatere innhold når nye tall eller vesentlige opplysninger blir tilgjengelige",
  "behandle tips om feil og gjennomføre nødvendige rettelser",
];

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
  const [blogPosts, forklarerPosts] = await Promise.all([
    getAllBlogPosts(),
    getAllForklarerPosts(),
  ]);
  const latestBlogPosts = blogPosts.slice(0, 6);
  const latestForklarerPosts = forklarerPosts.slice(0, 6);
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

      <section className="bg-[#f4f7f1] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
            Forfatter
          </p>
          <h1 className="mt-3 text-5xl font-extrabold leading-tight text-slate-950 sm:text-6xl">
            Redaksjonen
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            Redaksjonen er den felles bylinen for artikler og forklaringer som publiseres av
            Lønnsinnsikt. Her kan du se hvem som har ansvaret, og hvordan innholdet blir
            utviklet og kontrollert.
          </p>
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
                  <dt className="font-extrabold text-slate-950">Rolle</dt>
                  <dd>Eier, utvikler og redaksjonelt ansvarlig</dd>
                </div>
                <div>
                  <dt className="font-extrabold text-slate-950">Organisasjonsnummer</dt>
                  <dd>{editorialIdentity.organizationNumber}</dd>
                </div>
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
                hobbyprosjekt. «Redaksjonen» er en redaksjonell avsender, ikke en påstand om
                at nettstedet har en stor eller separat bemannet redaksjon.
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

          <div className="border-t border-[rgba(27,36,48,0.12)] pt-10">
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
              Hva Redaksjonen har ansvar for
            </h2>
            <ul className="mt-6 grid gap-4" aria-label="Redaksjonens ansvarsområder">
              {responsibilities.map((responsibility) => (
                <li className="flex gap-3 text-base leading-8 text-slate-700" key={responsibility}>
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-strong)]" />
                  <span>{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[rgba(27,36,48,0.12)] pt-10">
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
              Publisert av Redaksjonen
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
              Bylinen brukes på nettstedets redaksjonelle artikler og forklaringer. Her er
              et utvalg av det nyeste innholdet.
            </p>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-extrabold text-slate-950">Nyeste artikler</h3>
                <ul className="mt-4 grid gap-3">
                  {latestBlogPosts.map((post) => (
                    <li
                      className="rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-4"
                      key={post.slug}
                    >
                      <Link
                        className="font-extrabold leading-6 text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                        href={`/blogg/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatBlogDate(post.publishedAt)}
                      </p>
                    </li>
                  ))}
                </ul>
                <Link
                  className="mt-4 inline-block font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                  href="/blogg"
                >
                  Se alle artikler
                </Link>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-950">Forklaringer</h3>
                <ul className="mt-4 grid gap-3">
                  {latestForklarerPosts.map((post) => (
                    <li
                      className="rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-4"
                      key={post.slug}
                    >
                      <Link
                        className="font-extrabold leading-6 text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                        href={`/forklarer/${post.slug}`}
                      >
                        {post.term}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  className="mt-4 inline-block font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                  href="/forklarer"
                >
                  Se alle forklaringer
                </Link>
              </div>
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

          <p className="text-sm leading-7 text-slate-500">Sist oppdatert 24. juli 2026.</p>
        </div>
      </section>
    </main>
  );
}
