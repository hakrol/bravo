import type { Metadata } from "next";
import { RentesjekkAd } from "@/components/rentesjekk-ad";

export const metadata: Metadata = {
  title: "Rentesjekk – annonsevisning",
  description: "Intern forhåndsvisning av Rentesjekk-annonsene.",
};

export default function RentesjekkPreviewPage() {
  return (
    <div className="min-h-screen bg-[#eef2ee] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-slate-600">Intern forhåndsvisning</p>
          <h1 className="text-3xl font-extrabold text-[#203c39]">Rentesjekk – lavere rente</h1>
          <p className="max-w-2xl text-slate-600">
            De samme annonsene brukes på nettstedets eksisterende annonseflater.
            Visninger og klikk på denne forhåndsvisningssiden sendes ikke til GA4.
          </p>
        </header>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#203c39]">Bred annonse</h2>
          <RentesjekkAd placement="calculator-after-tool" />
        </section>
        <div className="grid items-start gap-10 sm:grid-cols-[minmax(0,360px)_160px]">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#203c39]">Kompakt / mobil</h2>
            <div className="w-full max-w-[360px]">
              <RentesjekkAd placement="blog-before-content" />
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#203c39]">Sidefelt</h2>
            <div className="w-[160px] [&>aside]:block">
              <RentesjekkAd placement="blog-sidebar" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
