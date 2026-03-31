import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Om tjenesten" },
  { href: "#", label: "Personvern" },
  { href: "#", label: "Kontakt" },
  { href: "#", label: "Ofte stilte spørsmål" },
] as const;

export function MainFooter() {
  return (
    <footer className="border-t border-black/5 bg-[rgba(255,250,243,0.88)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:px-8 lg:py-14">
        <div className="max-w-2xl">
          <Link className="inline-flex items-center gap-3" href="/">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-sm font-bold tracking-[0.18em] text-white shadow-sm">
              LN
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
                Lonnsdata
              </p>
              <p className="text-sm text-[var(--muted)]">Nettside for lonnsinnsikt i Norge</p>
            </div>
          </Link>

          <p className="mt-5 text-sm leading-7 text-[var(--muted)] sm:text-base">
            Lonnsdata samler og presenterer oversiktlige lonnstall for ulike yrker, slik at det
            blir enklere a utforske forskjeller i inntekt etter rolle, erfaring og kjonn.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
            Utforsk videre
          </h2>
          <nav aria-label="Footerlenker" className="mt-4 flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                className="text-sm text-slate-700 transition hover:text-[var(--primary-strong)]"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
