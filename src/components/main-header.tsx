import Link from "next/link";
import { MainNav } from "@/components/main-nav";

export function MainHeader() {
  return (
    <header className="relative z-10 px-5 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,250,243,0.92))] shadow-[0_18px_48px_rgba(27,36,48,0.08)]">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex items-center justify-between gap-4">
              <Link className="min-w-0" href="/">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] text-sm font-bold tracking-[0.18em] text-white shadow-sm">
                    LN
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
                      Lønnsdata
                    </p>
                    <p className="truncate text-sm text-[var(--muted)]">
                      Profesjonell lønnsinnsikt fra SSB
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex flex-col gap-3 lg:flex-1 lg:flex-row lg:items-center lg:justify-end">
              <div className="rounded-[5px] bg-[rgba(20,83,45,0.06)] p-1">
                <MainNav />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
