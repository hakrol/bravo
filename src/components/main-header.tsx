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
      </div>
    </header>
  );
}
