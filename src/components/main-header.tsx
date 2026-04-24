import { MainNav } from "@/components/main-nav";
import { SiteBrand } from "@/components/site-brand";

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 px-5 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-visible rounded-[5px] border border-[rgba(27,36,48,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,250,243,0.84))] shadow-[0_18px_48px_rgba(27,36,48,0.08)] backdrop-blur-md">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(22,61,38,0),rgba(22,61,38,0.2),rgba(22,61,38,0))]" />
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
