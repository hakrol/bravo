"use client";

type HomeHeroSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export function HomeHeroSearch({ query, onQueryChange }: HomeHeroSearchProps) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-1 text-center">
      <h1 className="max-w-4xl text-5xl font-semibold leading-none text-slate-950 sm:text-6xl lg:text-7xl">
        Hva tjener folk
        <span className="mt-1 block text-[var(--primary)]">i ditt yrke</span>
      </h1>

      <div className="mt-8 w-full max-w-3xl" id="yrke-sok">
        <label className="grid" htmlFor="occupation-search">
          <span className="sr-only">Søk etter yrke</span>
          <span className="relative block">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--primary-strong)]" />
            <input
              id="occupation-search"
              className="h-14 w-full rounded-md border border-black/10 bg-white/88 px-5 pl-12 text-base text-slate-900 shadow-[0_14px_36px_rgba(22,61,38,0.08)] outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[rgba(20,83,45,0.1)]"
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Skriv f.eks. regnskapsfører"
              type="search"
              value={query}
            />
          </span>
        </label>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Oversikten filtreres fortløpende mens du skriver.
        </p>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m20 20-4.5-4.5m2-5A7 7 0 1 1 3.5 10.5a7 7 0 0 1 14 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}
