import Link from "next/link";
import { listOccupationGroups } from "@/lib/occupation-groups";

export function HomeExploreOccupationsSection() {
  const groups = listOccupationGroups();

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f1ed] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="text-center text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
          Utforsk yrker
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-4 sm:mt-12">
          {groups.map((group) => (
            <Link
              className="group flex min-h-14 items-center gap-3 rounded-[5px] bg-white px-6 py-4 text-base font-semibold text-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ed] sm:px-7"
              href={`/yrkesgrupper/${group.slug}`}
              key={group.slug}
            >
              <span aria-hidden="true" className="text-xl">
                {group.icon}
              </span>
              <span className="transition-colors group-hover:text-[var(--primary-strong)]">
                {group.shortLabel}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
