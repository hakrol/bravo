import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { InfoPageHero } from "@/components/info-page-hero";
import { siteConfig } from "@/lib/site-config";

const description =
  "Kontakt Lønnsinnsikt om lønnstall, innhold, personvern, samarbeid eller andre spørsmål.";

export const metadata: Metadata = {
  title: "Kontakt",
  description,
  alternates: {
    canonical: "/kontakt",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/kontakt",
    siteName: siteConfig.name,
    title: `Kontakt | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Kontakt | ${siteConfig.name}`,
    description,
  },
};

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <InfoPageHero
        title="Ta kontakt med oss"
        description="Har du funnet en feil, lurer du på hvordan tallene brukes, eller ønsker du å snakke med oss? Send en melding, så svarer vi så snart vi kan."
        imageSrc="/images/hero-kontakt.png"
        imageAlt="Illustrasjon av en konvolutt, meldinger og en sendt henvendelse"
      />

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-3xl">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
