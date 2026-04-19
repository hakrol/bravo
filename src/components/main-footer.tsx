import Link from "next/link";
import { SiteBrand } from "@/components/site-brand";

const footerGroups = [
  {
    title: "Verktøy",
    links: [
      { href: "/lonnsjekk", label: "Lønnssjekk" },
      { href: "/lonnskalkulator", label: "Lønnskalkulator" },
      { href: "/lanekalkulator", label: "Lånekalkulator" },
    ],
  },
  {
    title: "Utforsk lønn",
    links: [
      { href: "/yrker", label: "Yrker" },
      { href: "/yrkesgrupper", label: "Yrkesgrupper" },
      { href: "/laerling", label: "Lærlingfag" },
    ],
  },
  {
    title: "Innhold",
    links: [
      { href: "/ressurser", label: "Ressurser" },
      { href: "/blogg", label: "Blogg" },
    ],
  },
  {
    title: "Om siden",
    links: [
      { href: "/om", label: "Om" },
      { href: "/personvern", label: "Personvern" },
    ],
  },
] as const;

export function MainFooter() {
  return (
    <footer className="relative z-20 border-t border-black/5 bg-[#fffaf3]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)] lg:px-8 lg:py-14">
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
    </footer>
  );
}
