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
          className="group mt-5 flex flex-col gap-3 text-slate-950 transition sm:mt-7 sm:flex-row sm:items-center sm:gap-5"
          href="/spesial/i-disse-yrkene-oker-kvinneandelen-raskest"
        >
          <span className="inline-flex w-fit shrink-0 items-center gap-2.5 rounded-full bg-[linear-gradient(90deg,#064e3b_0%,#166534_34%,#bbf7d0_50%,#166534_66%,#064e3b_100%)] bg-[length:220%_100%] bg-left px-3.5 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_14px_34px_rgba(20,83,45,0.18)] transition-[background-position,box-shadow] duration-500 ease-out group-hover:bg-right group-hover:shadow-[0_16px_38px_rgba(20,83,45,0.24)] sm:px-4">
            <span aria-hidden="true" className="flex h-3.5 w-4 items-end gap-0.5">
              <span className="h-1.5 w-1 rounded-full bg-white" />
              <span className="h-2.5 w-1 rounded-full bg-white" />
              <span className="h-3.5 w-1 rounded-full bg-white" />
            </span>
            Siste spesial
          </span>
          <span className="min-w-0 flex-1 text-sm font-extrabold leading-5 text-slate-950 sm:text-base">
            I disse yrkene øker kvinneandelen raskest
          </span>
          <span className="inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-[var(--primary-strong)]">
            Les saken
            <span
              aria-hidden="true"
              className="text-lg leading-none transition duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
