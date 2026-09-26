import type { Metadata } from "next";
import Link from "next/link";
import { AdsenseAd } from "@/components/adsense-ad";
import { siteConfig } from "@/lib/site-config";

const description =
  "Finn sider om minstelønn i Norge. Se gjeldende satser og regler for restaurant, renhold og elektro, samt tariffbaserte butikksatser.";

export const metadata: Metadata = {
  title: "Minstelønn i Norge – satser og regler",
  description,
  alternates: { canonical: "/minstelonn" },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/minstelonn",
    siteName: siteConfig.name,
    title: `Minstelønn i Norge – satser og regler | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Minstelønn i Norge – satser og regler | ${siteConfig.name}`,
    description,
  },
};

type MinimumWageCard = {
  badge: string;
  category: string;
  description: string;
  href: string;
  icon: "cleaning" | "electricity" | "restaurant" | "retail";
  title: string;
};

const minimumWagePages: readonly MinimumWageCard[] = [
  {
    badge: "Lovpålagt",
    category: "Renholdsbransjen",
    description: "Se gjeldende satser for ansatte over og under 18 år, nattillegg, overtid og hvem forskriften gjelder for.",
    href: "/minstelonn/minstelonn-renholder",
    icon: "cleaning",
    title: "Minstelønn for renholdere",
  },
  {
    badge: "Lovpålagt",
    category: "Elektrobransjen",
    description: "Finn satser for faglærte og ufaglærte, og les om skiftarbeid, overtid og reglene i elektrobransjen.",
    href: "/minstelonn/minstelonn-elektriker",
    icon: "electricity",
    title: "Minstelønn for elektrikere",
  },
  {
    badge: "Lovpålagt",
    category: "Restaurant · servering · catering",
    description: "Se gjeldende satser etter alder og praksis, og les om tips, tillegg, overtid og forskjellen på minstelønn og Riksavtalen.",
    href: "/minstelonn/minstelonn-restaurant",
    icon: "restaurant",
    title: "Minstelønn i restaurant",
  },
  {
    badge: "Tariff",
    category: "Varehandel · Virke–HK",
    description: "Det finnes ingen generell lovpålagt minstelønn i butikk. Se tariffbaserte lønnstrinn, ungdomssatser og tillegg.",
    href: "/minstelonn/minstelonn-butikkmedarbeider",
    icon: "retail",
    title: "Satser for butikkmedarbeidere",
  },
] as const;

const faqItems = [
  {
    question: "Har Norge en generell lovpålagt minstelønn?",
    answer: "Nei. Norge har ikke én generell minstelønn som gjelder for alle arbeidstakere. Lovpålagte minstesatser gjelder i bestemte bransjer der en tariffavtale er allmenngjort.",
  },
  {
    question: "Hvem har krav på lovpålagt minstelønn?",
    answer: "Det avhenger av hvilken bransje virksomheten tilhører, hvilket arbeid du utfører og virkeområdet i den aktuelle forskriften. Yrkestittelen alene avgjør ikke alltid om du er omfattet.",
  },
  {
    question: "Er tariffsats og lovpålagt minstelønn det samme?",
    answer: "Nei. En tariffsats følger en tariffavtale og gjelder normalt i tariffbundne arbeidsforhold. Lovpålagt minstelønn følger en allmenngjøringsforskrift og gjelder for arbeidstakere som omfattes av forskriften.",
  },
  {
    question: "Kan arbeidsgiver betale mer enn minstelønnen?",
    answer: "Ja. Minstelønnen er et nedre lønnsgulv, ikke en anbefalt eller vanlig lønn. Arbeidsavtale, tariffavtale, erfaring, ansvar, kompetanse og lokale forhandlinger kan gi høyere lønn.",
  },
  {
    question: "Hvordan finner jeg riktig minstelønnssats?",
    answer: "Start med bransjen og virksomheten du arbeider i, og kontroller deretter alder, kompetanse, arbeidsoppgaver og eventuelle tillegg. Bransjesidene våre viser satsene og lenker videre til de offisielle kildene.",
  },
] as const;

function MinimumWageIcon({ icon }: { icon: MinimumWageCard["icon"] }) {
  const commonProps = {
    "aria-hidden": true,
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  if (icon === "electricity") {
    return <svg {...commonProps}><path d="m13 2-8 12h7l-1 8 8-12h-7z" /></svg>;
  }

  if (icon === "retail") {
    return <svg {...commonProps}><path d="M4 10v10h16V10M3 10l2-6h14l2 6" /><path d="M3 10a3 3 0 0 0 5 2 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 5-2M9 20v-5h6v5" /></svg>;
  }

  if (icon === "restaurant") {
    return <svg {...commonProps}><path d="M4 3v7a3 3 0 0 0 3 3v8M7 3v10M10 3v7a3 3 0 0 1-3 3M16 3v18M16 3c3 1 4 4 4 7v2h-4" /></svg>;
  }

  return <svg {...commonProps}><path d="M7 21h10M9 21v-7l2-3V5h5v6l2 3v7" /><path d="M11 5V3h5v2M6 9h3m-4 3h4" /></svg>;
}

function MinimumWagePageCard({ badge, category, description: cardDescription, href, icon, title }: MinimumWageCard) {
  return (
    <Link className="group relative flex min-h-72 flex-col rounded-[22px] border border-[#e1e8e4] bg-white p-6 shadow-[0_14px_34px_rgba(27,36,48,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(20,83,45,0.3)] hover:shadow-[0_20px_44px_rgba(27,36,48,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--primary-strong)] sm:p-7" href={href}>
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#eaf6f0] text-[var(--primary-strong)]"><MinimumWageIcon icon={icon} /></span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge === "Lovpålagt" ? "bg-[var(--primary-strong)] text-white" : "bg-amber-100 text-amber-900"}`}>{badge}</span>
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">{category}</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950">{title}</h2>
        <p className="mt-3 text-[15px] leading-6 text-[var(--muted)]">{cardDescription}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[var(--primary-strong)]">Se satser og regler <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
      </div>
    </Link>
  );
}

export default function MinimumWageOverviewPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Minstelønn i Norge",
      description,
      url: `${siteConfig.siteUrl}/minstelonn`,
      hasPart: minimumWagePages.map((page) => ({ "@type": "WebPage", name: page.title, url: `${siteConfig.siteUrl}${page.href}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
    },
  ];

  return (
    <main className="min-h-screen bg-[#fbfcfa] px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      {structuredData.map((data, index) => <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} key={index} type="application/ld+json" />)}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 lg:gap-16">
        <section className="fade-up grid gap-4 text-center sm:mx-auto sm:max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">Minstelønn</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">Minstelønn i Norge</h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-[var(--muted)]">Finn gjeldende satser, tillegg og regler for bransjer med lovpålagt minstelønn, og se tariffbaserte satser der tariffavtalen avgjør.</p>
        </section>

        <section className="fade-up-delay grid gap-7">
          <div className="grid gap-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Velg bransje</h2>
            <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">Gå til den relevante siden for oppdaterte satser, virkeområde, tillegg og praktiske forklaringer.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {minimumWagePages.map((page) => <MinimumWagePageCard {...page} key={page.href} />)}
          </div>
        </section>

        <AdsenseAd placement="overview-between-sections" />

        <section className="mx-auto w-full max-w-3xl">
          <header>
            <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem] sm:leading-[1.1]">Slik bør du lese satsene</h2>
            <p className="mt-4 text-[1.03rem] leading-[1.8] text-slate-700 sm:text-lg sm:leading-[1.95]">Minstelønn, tariff og vanlig lønnsnivå er forskjellige begreper. Det er viktig å vite hvilken type sats du ser på før du bruker den til å vurdere egen lønn.</p>
          </header>

          <div className="mt-10 space-y-10">
            <section>
              <h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-2xl">Lovpålagt minstelønn</h3>
              <div className="mt-4 space-y-5 text-[1.03rem] leading-[1.8] text-slate-800 sm:text-lg sm:leading-[1.95]"><p>Norge har ikke én generell lovpålagt minstelønn som gjelder for alle. I enkelte bransjer er deler av en tariffavtale allmenngjort. Da blir minstesatsene bindende også for arbeidstakere som ikke selv er medlem av en fagforening.</p><p>Om du er omfattet, avhenger blant annet av virksomheten, arbeidsoppgavene og virkeområdet i forskriften. Satsene kan også variere etter alder, fagbrev eller type arbeid. Derfor bør du alltid kontrollere den konkrete bransjesiden og originalkilden.</p></div>
            </section>

            <section>
              <h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-2xl">Tariffbasert minstesats</h3>
              <div className="mt-4 space-y-5 text-[1.03rem] leading-[1.8] text-slate-800 sm:text-lg sm:leading-[1.95]"><p>En tariffavtale er en avtale mellom partene i arbeidslivet. Den kan inneholde lønnstrinn, ansiennitetsregler, arbeidstid og tillegg for kveld, helg eller overtid. Slike satser gjelder normalt i virksomheter og arbeidsforhold som er bundet av avtalen.</p><p>En tariffbasert sats er derfor ikke automatisk en lovpålagt minstelønn for alle i yrket. Dette skillet er særlig viktig i bransjer som varehandel, der arbeidsplassen og tariffavtalen kan avgjøre hvilke satser som gjelder.</p></div>
            </section>

            <section>
              <h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-2xl">Faktisk lønnsnivå</h3>
              <div className="mt-4 space-y-5 text-[1.03rem] leading-[1.8] text-slate-800 sm:text-lg sm:leading-[1.95]"><p>Minstelønnen er et gulv, ikke et mål på hva de fleste i yrket tjener. Den sier heller ikke hva som er en konkurransedyktig lønn for en bestemt rolle. Erfaring, ansvar, utdanning, arbeidstid, geografi og etterspørsel kan gi et helt annet lønnsnivå.</p><p>Når du skal vurdere egen lønn, bør du derfor sammenligne minstesatsen med faktisk lønnsstatistikk og vilkårene i arbeidsavtalen din. En markedsbasert sammenligning gir et bedre grunnlag for lønnssamtaler og vurdering av jobbtilbud.</p></div>
            </section>
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl">
          <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem] sm:leading-[1.1]">Ofte stilte spørsmål om minstelønn</h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {faqItems.map((item) => <details className="group py-5" key={item.question}><summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-lg font-semibold leading-7 text-slate-950 marker:hidden"><span>{item.question}</span><span aria-hidden="true" className="mt-0.5 text-2xl font-normal leading-none text-[var(--primary-strong)] transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 max-w-2xl text-[1.03rem] leading-[1.8] text-slate-700 sm:text-lg sm:leading-[1.9]">{item.answer}</p></details>)}
          </div>
        </section>
      </div>
    </main>
  );
}
