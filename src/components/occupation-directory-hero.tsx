type OccupationDirectoryHeroProps = {
  description: string;
  icon?: string;
  title: string;
};

export function OccupationDirectoryHero({
  description,
  icon,
  title,
}: OccupationDirectoryHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_15%,rgba(214,230,216,0.64),transparent_28%),linear-gradient(180deg,#fbfcf8_0%,#ffffff_100%)] px-5 pb-24 pt-12 sm:px-6 sm:pb-28 sm:pt-16 lg:px-8 lg:pb-32 lg:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full border-[42px] border-[#dce9dc]/70 sm:-left-20 sm:-top-24 sm:h-96 sm:w-96 sm:border-[54px]"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] top-7 hidden h-24 w-24 text-[#76a67f] opacity-40 sm:block"
        viewBox="0 0 96 96"
      >
        <defs>
          <pattern id="occupation-directory-hero-dots" height="16" patternUnits="userSpaceOnUse" width="16">
            <circle cx="3" cy="3" fill="currentColor" r="1.5" />
          </pattern>
        </defs>
        <rect fill="url(#occupation-directory-hero-dots)" height="96" width="96" />
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-3 hidden h-44 w-[22rem] text-[#78a782] opacity-20 md:block lg:w-[30rem]"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 480 176"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <path
            d={`M0 ${72 + index * 8} C 95 ${8 + index * 8}, 150 ${142 + index * 4}, 250 ${76 + index * 7} S 390 ${28 + index * 7}, 480 ${68 + index * 8}`}
            key={index}
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
      </svg>

      <header className="relative z-10 mx-auto max-w-4xl space-y-5 text-center">
        <h1 className="text-balance text-[clamp(2.7rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[var(--foreground)]">
          {title}
          {icon ? (
            <span aria-hidden="true" className="ml-3 inline-block align-[0.08em] text-[0.72em]">
              {icon}
            </span>
          ) : null}
        </h1>
        <p className="mx-auto max-w-[700px] text-[1.05rem] leading-[1.6] text-[var(--muted)]">
          {description}
        </p>
      </header>
    </section>
  );
}
