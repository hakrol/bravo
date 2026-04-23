import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Utviklingsområde",
  description: "Internt utviklingsområde for prototyper og eksperimenter.",
};

const devAreas = [
  {
    href: "/dev/grafer",
    title: "Grafverksted",
    description: "Skisser, sammenligninger og visuelle prototyper for lønnsdata.",
  },
  {
    href: "/dev",
    title: "Komponenter",
    description: "Plassholder for fremtidige UI-prototyper som ikke er klare for produksjon.",
  },
  {
    href: "/dev",
    title: "Datavisning",
    description: "Plassholder for interne visninger av datagrunnlag og transformasjoner.",
  },
] as const;

export default function DevPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="fade-up border-y border-slate-200 bg-white px-6 py-10 sm:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
            Internt
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 text-balance sm:text-5xl">
            Utviklingsområde
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Et lukket arbeidsområde for grafer, datavisualiseringer og prototyper før de flyttes
            inn i ordinære sider og komponenter.
          </p>
        </section>

        <section className="fade-up-delay grid gap-4 md:grid-cols-3">
          {devAreas.map((area) => (
            <Link
              key={area.title}
              href={area.href}
              className="rounded-md border border-slate-200 bg-white px-6 py-6 shadow-sm transition duration-200 hover:border-[var(--primary)] hover:shadow-md"
            >
              <h2 className="text-2xl font-semibold text-slate-950">{area.title}</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted)]">{area.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
