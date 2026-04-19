import Link from "next/link";

type OccupationLinkGridItem = {
  title: string;
  description?: string;
  href: string;
};

type OccupationLinkGridProps = {
  title: string;
  description?: string;
  items: OccupationLinkGridItem[];
  eyebrow?: string;
  compact?: boolean;
};

export function OccupationLinkGrid({
  title,
  description,
  items,
  eyebrow,
  compact = false,
}: OccupationLinkGridProps) {
  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-8 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-10 lg:px-10">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,83,45,0.22),transparent)]" />
          <div className="relative max-w-3xl space-y-3">
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-balance text-slate-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">{description}</p>
            ) : null}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.href}
              className={[
                "group rounded-[5px] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.05)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
                compact
                  ? "px-5 py-4 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
                  : "px-6 py-5 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(15,23,42,0.08)]",
              ].join(" ")}
              href={item.href}
            >
              <div className={`flex h-full flex-col ${compact ? "gap-2" : "gap-3"}`}>
                <div className="flex items-start justify-between gap-3">
                  <h2
                    className={[
                      "font-semibold tracking-[-0.03em] text-slate-950",
                      compact ? "text-base leading-6" : "text-lg",
                    ].join(" ")}
                  >
                    {item.title}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="text-base text-[var(--primary-strong)] transition-transform group-hover:translate-x-0.5"
                  >
                    &gt;
                  </span>
                </div>
                {!compact && item.description ? (
                  <p className="text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
