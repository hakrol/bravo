export type OccupationFaqItem = {
  answer: string;
  question: string;
};

type OccupationFaqProps = {
  items: OccupationFaqItem[];
  occupationLabel: string;
};

export function OccupationFaq({ items, occupationLabel }: OccupationFaqProps) {
  return (
    <section
      aria-labelledby="vanlige-sporsmal-heading"
      className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
      id="vanlige-sporsmal"
    >
      <div className="space-y-3">
        <h2
          className="text-2xl font-semibold text-slate-950 sm:text-3xl"
          id="vanlige-sporsmal-heading"
        >
          Vanlige spørsmål om {occupationLabel.toLowerCase()}
        </h2>
      </div>

      <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
        {items.map((item) => (
          <details className="group" key={item.question}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-semibold text-slate-950 transition hover:text-[var(--primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)] [&::-webkit-details-marker]:hidden sm:text-lg">
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className="relative h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-45"
              >
                <span className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
                <span className="absolute left-1/2 top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
              </span>
            </summary>
            <p className="max-w-4xl pb-5 pr-9 text-base leading-7 text-slate-700">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
