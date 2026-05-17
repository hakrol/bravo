import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { SiteBrand } from "@/components/site-brand";

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#f4f7f1] px-5 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-visible">
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="min-w-0">
              <SiteBrand size="header" />
            </div>

            <MainNav />
          </div>
        </div>

        <Link
          className="group mt-2 flex items-center gap-3 rounded-[5px] border border-[rgba(20,83,45,0.14)] bg-white/70 px-3 py-2 text-xs leading-5 text-slate-700 shadow-[0_10px_28px_rgba(27,36,48,0.06)] backdrop-blur transition hover:border-[rgba(20,83,45,0.28)] hover:bg-white sm:px-4"
          href="/spesial/i-disse-yrkene-oker-kvinneandelen-raskest"
        >
          <span className="shrink-0 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
            Siste spesial
          </span>
          <span className="min-w-0 flex-1 truncate">
            I disse yrkene øker kvinneandelen raskest
          </span>
          <span className="hidden shrink-0 font-semibold text-[var(--primary-strong)] transition group-hover:translate-x-0.5 sm:inline">
            Les saken →
          </span>
        </Link>
      </div>
    </header>
  );
}
