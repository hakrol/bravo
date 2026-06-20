type CalculatorPageVisualVariant =
  | "salary"
  | "gross-net"
  | "loan"
  | "growth"
  | "mileage"
  | "work-year";

type CalculatorPageVisualProps = {
  variant?: CalculatorPageVisualVariant;
};

const variantConfig = {
  salary: {
    eyebrow: "Lønn",
    value: "42 800",
    unit: "kr/mnd",
    accent: "bg-[var(--primary-strong)]",
    soft: "bg-emerald-50",
    text: "text-emerald-900",
    bar: "bg-emerald-700",
  },
  "gross-net": {
    eyebrow: "Brutto/netto",
    value: "650 000",
    unit: "kr/år",
    accent: "bg-[#d98b2b]",
    soft: "bg-amber-50",
    text: "text-amber-900",
    bar: "bg-[#d98b2b]",
  },
  loan: {
    eyebrow: "Lån",
    value: "3,2 mill.",
    unit: "låneevne",
    accent: "bg-sky-700",
    soft: "bg-sky-50",
    text: "text-sky-950",
    bar: "bg-sky-700",
  },
  growth: {
    eyebrow: "Vekst",
    value: "+4,3",
    unit: "%",
    accent: "bg-cyan-700",
    soft: "bg-cyan-50",
    text: "text-cyan-950",
    bar: "bg-cyan-700",
  },
  mileage: {
    eyebrow: "Kjøring",
    value: "5,30",
    unit: "kr/km",
    accent: "bg-teal-700",
    soft: "bg-teal-50",
    text: "text-teal-950",
    bar: "bg-teal-700",
  },
  "work-year": {
    eyebrow: "Årsverk",
    value: "1 703",
    unit: "timer",
    accent: "bg-teal-700",
    soft: "bg-teal-50",
    text: "text-teal-950",
    bar: "bg-teal-700",
  },
} satisfies Record<CalculatorPageVisualVariant, {
  eyebrow: string;
  value: string;
  unit: string;
  accent: string;
  soft: string;
  text: string;
  bar: string;
}>;

export function CalculatorPageVisual({ variant = "salary" }: CalculatorPageVisualProps) {
  const config = variantConfig[variant];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-[5px] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.08)] ring-1 ring-black/8"
    >
      <div className={`absolute inset-0 rounded-[5px] ${config.soft}`} />
      <div className="relative grid h-11 w-10 grid-rows-[0.8rem_1fr] overflow-hidden rounded-[5px] bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.10)]">
        <div className={`${config.accent}`} />
        <div className="grid grid-cols-3 gap-1 p-1.5">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <span
              className={`rounded-[2px] ${item === 5 ? config.accent : "bg-slate-200"}`}
              key={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
