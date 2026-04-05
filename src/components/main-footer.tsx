import Link from "next/link";
import { SiteBrand } from "@/components/site-brand";

const footerLinks = [
  { href: "#", label: "Om tjenesten" },
  { href: "#", label: "Personvern" },
  { href: "#", label: "Kontakt" },
  { href: "#", label: "Ofte stilte sp\u00f8rsm\u00e5l" },
] as const;

export function MainFooter() {
  return (
    <footer className="relative z-20 border-t border-black/5 bg-[#fffaf3]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:px-8 lg:py-14">
        <div className="max-w-2xl">
          <SiteBrand size="footer" />

          <p className="mt-5 text-sm leading-7 text-[var(--muted)] sm:text-base">
            {"L\u00f8nnsinnsikt samler og presenterer oversiktlige l\u00f8nnstall for ulike yrker, slik at det blir enklere \u00e5 utforske forskjeller i inntekt etter rolle, erfaring og kj\u00f8nn."}
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
