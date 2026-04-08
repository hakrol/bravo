import { MainNav } from "@/components/main-nav";
import { SiteBrand } from "@/components/site-brand";

export function MainHeader() {
  return (
    <header className="relative z-50 px-5 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl ">
        <div className="relative rounded-[5px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,250,243,0.92))] shadow-[0_18px_48px_rgba(27,36,48,0.08)]">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5 lg:px-6">
            <div className="min-w-0">
              <SiteBrand size="header" />
            </div>

            <MainNav />
          </div>
        </div>
      </div>
    </header>
  );
}
