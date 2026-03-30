import Link from "next/link";
import { MainNav } from "@/components/main-nav";

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[rgba(249,246,239,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link className="min-w-0" href="/">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold tracking-[0.18em] text-white shadow-sm">
                LN
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
                  Lonnsdata
                </p>
                <p className="truncate text-sm text-[var(--muted)]">
                  Profesjonell lonnsinnsikt fra SSB
                </p>
              </div>
            </div>
          </Link>

          <Link
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-[var(--primary)] hover:text-[var(--primary-strong)] lg:hidden"
            href="/#yrke-sok"
          >
            Start sok
          </Link>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <MainNav />
          <Link
            className="hidden items-center justify-center rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] lg:inline-flex"
            href="/#yrke-sok"
          >
            Start sok
          </Link>
        </div>
      </div>
    </header>
  );
}
