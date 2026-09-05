import Link from "next/link";
import { otherTools } from "@/lib/tool-catalog";

const calculatorLinks = [
  { href: "/lonnskalkulator", label: "Lønnskalkulator" },
  { href: "/laerer-lonn-kalkulator", label: "Lærerlønn" },
  { href: "/sykepleier-lonn-kalkulator", label: "Sykepleierlønn" },
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
  const toolLinks = otherTools.filter((link) => link.href !== currentHref);

  return (
    <div className="grid gap-6">
      <LinkSection heading="Andre kalkulatorer" links={links} />
      <LinkSection heading="Andre verktøy" links={toolLinks} />
    </div>
  );
}

type LinkSectionProps = {
  heading: string;
  links: ReadonlyArray<{ href: string; label: string }>;
};

function LinkSection({ heading, links }: LinkSectionProps) {
  return (
    <nav aria-label={heading}>
      <h2 className="mb-3 text-lg font-semibold tracking-[-0.02em] text-slate-950">
        {heading}
      </h2>
      <div className="flex flex-wrap gap-2.5">
        {links.map((link) => (
          <Link
            key={link.href}
            className="inline-flex min-h-11 items-center rounded-[5px] bg-[#edf4ee] px-4 py-2.5 text-sm font-semibold text-[#24563a] transition-colors hover:bg-[#dfece2] hover:text-[#123d27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e7855]"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
