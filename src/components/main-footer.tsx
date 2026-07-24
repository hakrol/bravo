import Link from "next/link";
import { SiteBrand } from "@/components/site-brand";

const footerGroups = [
  {
    title: "Verktøy",
    links: [
      { href: "/lonnsjekk", label: "Lønnssjekk" },
      { href: "/lonnskalkulator", label: "Lønnskalkulator" },
      { href: "/sammenlign-lonn", label: "Sammenlign lønn" },
      { href: "/feriekalkulator", label: "Feriekalkulator" },
      { href: "/feriedager-norge", label: "Feriedager i Norge" },
      { href: "/lanekalkulator", label: "Lånekalkulator" },
      { href: "/kilometergodtgjorelse-kalkulator", label: "Kilometergodtgjørelse" },
    ],
  },
  {
    title: "Utforsk lønn",
    links: [
      { href: "/yrker", label: "Yrker" },
      { href: "/yrkesgrupper", label: "Yrkesgrupper" },
      { href: "/yrkesomrader", label: "Yrkesområder" },
      { href: "/yrkesfamilier", label: "Yrkesfamilier" },
      { href: "/laerling", label: "Lærlingfag" },
      { href: "/lønnsforskjell-mellom-kvinner-og-menn", label: "Lønnsforskjell mellom kvinner og menn" },
      {
        href: "/lonnsforskjeller-mellom-offentlige-og-private-yrker",
        label: "Lønnsforskjeller offentlig og privat",
      },
    ],
  },
  {
    title: "Innhold",
    links: [
      { href: "/ressurser", label: "Ressurser" },
      { href: "/spesial", label: "Spesial" },
      { href: "/forklarer", label: "Forklarer" },
      { href: "/ordbok", label: "Ordbok" },
      { href: "/blogg", label: "Blogg" },
      { href: "/blogg/kategori/lonnsforhandling", label: "Lønnsforhandling" },
    ],
  },
  {
    title: "Lønnsinnsikt",
    links: [
      { href: "/om", label: "Om" },
      { href: "/kontakt", label: "Kontakt" },
      { href: "/hjelpeside", label: "Hjelpeside" },
      { href: "/kilder", label: "Kilder" },
      { href: "/redaksjonelle-retningslinjer", label: "Redaksjonelle retningslinjer" },
      { href: "/personvern", label: "Personvern" },
    ],
  },
] as const;

export function MainFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-black/5 bg-[#fffaf3]">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)]">
          <div className="max-w-2xl">
            <SiteBrand size="footer" />

            <p className="mt-5 text-sm leading-7 text-[var(--muted)] sm:text-base">
              Lønnsinnsikt samler og presenterer oversiktlige lønnstall for ulike yrker, slik
              at det blir enklere å utforske forskjeller i inntekt etter rolle, erfaring og
              kjønn.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                  {group.title}
                </h2>
                <nav aria-label={group.title} className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      className="text-sm text-slate-700 transition hover:text-[var(--primary-strong)]"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[rgba(27,36,48,0.1)] pt-6 text-sm leading-6 text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Lønnsinnsikt. Alle rettigheter reservert.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              className="clickio-cmp-settings-display font-semibold text-slate-700 underline underline-offset-4 transition hover:text-[var(--primary-strong)]"
              href="#"
              style={{ display: "none" }}
            >
              Personvernvalg
            </a>
            <p>Bygget på åpne kilder og offisiell statistikk.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
