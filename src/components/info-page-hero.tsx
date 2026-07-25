import Image from "next/image";

type InfoPageHeroProps = Readonly<{
  eyebrow?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}>;

export function InfoPageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
}: InfoPageHeroProps) {
  return (
    <section className="bg-[#f4f7f1]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:items-stretch lg:px-8 lg:py-16">
        <div className="flex min-w-0 flex-col justify-center py-4">
          {eyebrow ? (
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={`max-w-[10ch] text-5xl font-extrabold leading-[0.98] text-slate-950 sm:text-6xl lg:text-7xl ${
              eyebrow ? "mt-4" : ""
            }`}
          >
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
            {description}
          </p>
        </div>

        <div className="relative min-h-72 overflow-hidden rounded-[5px] bg-[#dfe7dc] sm:min-h-96 lg:min-h-[28rem]">
          <Image
            fill
            priority
            alt={imageAlt}
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={imageSrc}
          />
        </div>
      </div>
    </section>
  );
}
