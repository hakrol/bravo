import type { SalaryResponse } from "@/lib/ssb";

const numberFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

type SalaryFormProps = {
  data: SalaryResponse;
};

export function SalaryForm({ data }: SalaryFormProps) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 rounded-xl border bg-[var(--surface-strong)] p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">SSB-tabell</h2>
          <p className="text-sm text-slate-600">
            Live snapshot fra tabell {data.tableId} hos Statistikkbanken.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Siste periode" value={data.lastPeriod ?? "Ukjent"} />
          <StatCard label="Antall celler" value={numberFormatter.format(data.valueCount)} />
          <StatCard label="Kilde" value={data.source.toUpperCase()} />
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border bg-[var(--surface-strong)] p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">Variabler</h2>
          <p className="text-sm text-slate-600">Tabellen eksponerer disse variablene i metadata.</p>
        </div>

        <ul className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          {data.variableNames.map((variableName) => (
            <li key={variableName} className="rounded-xl border bg-white px-4 py-3">
              {variableName}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 rounded-xl border bg-[var(--surface-strong)] p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">Eksempelverdier</h2>
          <p className="text-sm text-slate-600">
            De seks forste verdiene fra json-stat2-responsen for siste periode.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {data.sampleValues.map((value, index) => (
            <StatCard
              key={`${data.tableId}-${index}`}
              label={`Verdi ${index + 1}`}
              value={value === null ? "null" : numberFormatter.format(value)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
