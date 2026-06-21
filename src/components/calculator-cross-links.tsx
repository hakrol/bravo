import Link from "next/link";

const calculatorLinks = [
  { href: "/lonnskalkulator", label: "Lønnskalkulator" },
  { href: "/bruttolonn-kalkulator", label: "Brutto/netto" },
  { href: "/lonnsvekst", label: "Lønnsvekst" },
  { href: "/arsverk-kalkulator", label: "Årsverk" },
  { href: "/feriekalkulator", label: "Feriekalkulator" },
  { href: "/lanekalkulator", label: "Lånekalkulator" },
  { href: "/rente-og-avdrag-kalkulator", label: "Rente og avdrag" },
  { href: "/kilometergodtgjorelse-kalkulator", label: "Kilometergodtgjørelse" },
] as const;

type CalculatorCrossLinksProps = {
  currentHref: string;
};

export function CalculatorCrossLinks({ currentHref }: CalculatorCrossLinksProps) {
  const links = calculatorLinks.filter((link) => link.href !== currentHref);

  return (
    <nav aria-label="Andre kalkulatorer" className="flex flex-wrap gap-1.5">
      {links.map((link) => (
        <Link
          key={link.href}
          className="inline-flex min-h-7 items-center rounded-[5px] border border-slate-200 bg-white/70 px-2.5 text-xs font-semibold text-slate-700 shadow-[0_2px_6px_rgba(15,23,42,0.05)] transition hover:border-[rgba(20,83,45,0.24)] hover:bg-white hover:text-[var(--primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(20,83,45,0.35)]"
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
