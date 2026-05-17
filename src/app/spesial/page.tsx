import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const description =
  "Oversikt over Lønnsinnsikts spesialartikler, analyser og større datadrevne sider.";

const specials = [
  {
    href: "/spesial/i-disse-yrkene-oker-kvinneandelen-raskest",
    label: "Arbeidsliv",
    title: "I disse yrkene øker kvinneandelen raskest",
    description:
      "Se hvilke yrker som har fått klart flere kvinner de siste årene.",
    image:
      "/spesial/i-disse-yrkene-oker-kvinneandelen-raskest/hero-kvinneandel-vokser-raskest.png",
    imageAlt: "",
    featured: true,
  },
  {
    href: "/spesial/topp-10-yrker",
    label: "Lønn",
    title: "Topp 10 yrker med høyest lønn",
    description:
      "Her ser du hvilke yrker som ligger helt øverst i lønnsstatistikken.",
    image: null,
    imageAlt: "",
    featured: false,
  },
] as const;

export const metadata: Metadata = {
  title: "Spesial",
  description,
  alternates: {
    canonical: "/spesial",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/spesial",
    siteName: siteConfig.name,
    title: `Spesial | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Spesial | ${siteConfig.name}`,
    description,
  },
};

export default function SpecialOverviewPage() {
  return (
    <main className="bg-[#f7f3eb] text-[#151614]">
      <section className="px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#96713d]">
            Lønnsinnsikt spesial
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-black leading-[0.96] text-[#171814] sm:text-6xl lg:text-7xl">
            Større saker om lønn, yrker og arbeidsliv
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#5d5b53] sm:text-lg">
            Her samler vi datadrevne spesialartikler og større visualiseringer som går
            dypere enn vanlige oversiktssider.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="mx-auto max-w-6xl divide-y divide-[#d8cdbb] border-y border-[#d8cdbb]">
          {specials.map((special) => (
            <Link
              key={special.href}
              className="group grid gap-8 py-10 transition sm:py-12 lg:grid-cols-[minmax(0,0.48fr)_minmax(360px,0.52fr)] lg:items-center lg:gap-16"
              href={special.href}
            >
              <div>
                <h2 className="max-w-3xl font-serif text-3xl font-black leading-tight text-[#171814] transition group-hover:text-[#167764] sm:text-5xl">
                  {special.title}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#67645d] sm:text-lg">
                  {special.description}
                </p>
                <span className="mt-7 inline-flex items-center gap-3 text-base font-bold text-[#167764] transition group-hover:text-[#0f5f50]">
                  Les spesial
                  <span aria-hidden="true" className="text-2xl leading-none transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>

              <SpecialPreview special={special} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function SpecialPreview({ special }: { special: (typeof specials)[number] }) {
  if (special.image) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[5px] bg-[#e8decf]">
        <Image
          alt={special.imageAlt}
          className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.025]"
          fill
          sizes="(min-width: 1024px) 540px, 100vw"
          src={special.image}
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[5px] bg-[#ebe4d8] px-7 py-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(22,119,100,0.13),transparent_28%)]" />
      <div className="relative flex h-full flex-col justify-end gap-3">
        {[95, 92, 88, 84, 80, 76, 74, 70].map((width, index) => (
          <div key={width} className="flex items-center gap-4">
            <div
              className="h-4 bg-[#245f43] transition group-hover:bg-[#167764]"
              style={{ width: `${width}%` }}
            />
            <div className="h-px flex-1 bg-[#d4c9b8]" />
            <span className="w-5 text-right text-xs font-bold text-[#8a8174]">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
