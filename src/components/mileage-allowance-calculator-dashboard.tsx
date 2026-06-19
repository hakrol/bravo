"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { CalculatorPageVisual } from "@/components/calculator-page-visual";
import {
  calculateMileageAllowance,
  mileageAdditionRates,
  mileageAllowanceYear,
  mileageVehicleRates,
  type MileageAllowanceCalculation,
  type MileageVehicleValue,
} from "@/lib/kilometergodtgjorelse";

type SubmittedInput = {
  distance: number;
  employerRate: number;
  vehicle: MileageVehicleValue;
  passengers: number;
  forestRoad: boolean;
  equipment: boolean;
};

const inputClassName =
  "h-11 w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]";

export function MileageAllowanceCalculatorDashboard() {
  const [distanceInput, setDistanceInput] = useState("500");
  const [employerRateInput, setEmployerRateInput] = useState("5,30");
  const [vehicle, setVehicle] = useState<MileageVehicleValue>("car");
  const [passengersInput, setPassengersInput] = useState("0");
  const [forestRoad, setForestRoad] = useState(false);
  const [equipment, setEquipment] = useState(false);
  const [submittedInput, setSubmittedInput] = useState<SubmittedInput | null>(null);
  const [error, setError] = useState("");

  const selectedVehicle =
    mileageVehicleRates.find((option) => option.value === vehicle) ?? mileageVehicleRates[0];
  const calculation = useMemo(
    () => (submittedInput ? calculateMileageAllowance(submittedInput) : null),
    [submittedInput],
  );

  function handleVehicleChange(nextVehicle: MileageVehicleValue) {
    const option =
      mileageVehicleRates.find((vehicleOption) => vehicleOption.value === nextVehicle) ??
      mileageVehicleRates[0];

    setVehicle(nextVehicle);
    setEmployerRateInput(formatInputNumber(option.defaultEmployerRate));
    setSubmittedInput(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const distance = parsePositiveNumber(distanceInput);
    const employerRate = parsePositiveNumber(employerRateInput);
    const passengers = parseNonNegativeWholeNumber(passengersInput);

    if (distance === undefined || employerRate === undefined || passengers === undefined) {
      setError("Fyll inn gyldig antall kilometer, sats og antall passasjerer.");
      setSubmittedInput(null);
      return;
    }

    setError("");
    setSubmittedInput({
      distance,
      employerRate,
      vehicle,
      passengers,
      forestRoad,
      equipment,
    });
  }

  return (
    <section className="fade-up grid gap-6 lg:gap-8">
      <div className="relative overflow-hidden rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(14,116,144,0.24),transparent)]" />
        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <CalculatorPageVisual variant="mileage" />
            <div className="max-w-4xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                Verktøy
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
                Kilometergodtgjørelse kalkulator
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Beregn utbetaling, skattefri kilometergodtgjørelse og eventuell skattepliktig del
                ved yrkeskjøring med privat kjøretøy.
              </p>
            </div>
          </div>

          <form className="grid gap-5 border-t border-black/6 pt-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Kjøretøy">
                <select
                  className={inputClassName}
                  onChange={(event) =>
                    handleVehicleChange(event.target.value as MileageVehicleValue)
                  }
                  value={vehicle}
                >
                  {mileageVehicleRates.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Antall kilometer">
                <input
                  className={inputClassName}
                  inputMode="decimal"
                  onChange={(event) => setDistanceInput(sanitizeNumericInput(event.target.value))}
                  type="text"
                  value={distanceInput}
                />
              </Field>

              <Field label="Arbeidsgivers sats (kr/km)">
                <input
                  className={inputClassName}
                  inputMode="decimal"
                  onChange={(event) =>
                    setEmployerRateInput(sanitizeNumericInput(event.target.value))
                  }
                  type="text"
                  value={employerRateInput}
                />
                <p className="text-xs leading-5 text-slate-500">
                  Skattefri sats for {selectedVehicle.label.toLocaleLowerCase("nb-NO")}:{" "}
                  {formatRate(selectedVehicle.taxFreeRate)} kr/km.
                </p>
              </Field>

              <Field label="Antall passasjerer">
                <input
                  className={inputClassName}
                  inputMode="numeric"
                  min="0"
                  onChange={(event) =>
                    setPassengersInput(event.target.value.replace(/[^0-9]/g, ""))
                  }
                  type="number"
                  value={passengersInput}
                />
              </Field>
            </div>

            <div className="grid gap-3 rounded-[5px] bg-slate-50 p-4 md:grid-cols-2">
              <Checkbox
                checked={forestRoad}
                label={`Kjøring på skogs- og anleggsvei (+${formatRate(mileageAdditionRates.forestRoad)} kr/km)`}
                onChange={setForestRoad}
              />
              <Checkbox
                checked={equipment}
                label={`Tungt utstyr eller materiell (+${formatRate(mileageAdditionRates.equipment)} kr/km)`}
                onChange={setEquipment}
              />
            </div>

            <div className="flex justify-end">
              <button
                className="inline-flex h-12 items-center justify-center rounded-[5px] bg-[var(--primary-strong)] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(20,83,45,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
                type="submit"
              >
                Beregn kilometergodtgjørelse
              </button>
            </div>

            {error ? (
              <p className="rounded-[5px] bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </p>
            ) : null}
          </form>
        </div>
      </div>

      {calculation ? (
        <MileageAllowanceReport calculation={calculation} />
      ) : (
        <section className="rounded-[5px] border border-dashed border-slate-300 bg-white/70 p-6 text-sm leading-6 text-slate-600">
          Fyll inn opplysningene og trykk på «Beregn kilometergodtgjørelse» for å se resultatet.
        </section>
      )}
    </section>
  );
}

function MileageAllowanceReport({
  calculation,
}: {
  calculation: MileageAllowanceCalculation;
}) {
  return (
    <section aria-live="polite" className="grid gap-5">
      <div className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
          Beregning for {mileageAllowanceYear}
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
          {formatCurrency(calculation.totalPayout)} i kilometergodtgjørelse
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {formatDistance(calculation.distance)} med {calculation.vehicleLabel.toLocaleLowerCase("nb-NO")}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ResultCard
          label="Total utbetaling"
          tone="default"
          value={formatCurrency(calculation.totalPayout)}
        />
        <ResultCard
          label="Skattefri del"
          tone="positive"
          value={formatCurrency(calculation.taxFreeAmount)}
        />
        <ResultCard
          label="Skattepliktig del"
          tone={calculation.taxableAmount > 0 ? "warning" : "positive"}
          value={formatCurrency(calculation.taxableAmount)}
        />
      </div>

      <section className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
          Slik er beløpet beregnet
        </h2>
        <div className="mt-5 grid gap-3">
          <ResultRow
            label={`Grunnbeløp (${formatDistance(calculation.distance)} × ${formatRate(calculation.employerRate)} kr)`}
            value={formatCurrency(calculation.baseAmount)}
          />
          {calculation.passengerAddition > 0 ? (
            <ResultRow
              label={`Passasjertillegg (${calculation.passengers} × ${formatRate(mileageAdditionRates.passenger)} kr/km)`}
              value={formatCurrency(calculation.passengerAddition)}
            />
          ) : null}
          {calculation.forestRoadAddition > 0 ? (
            <ResultRow
              label="Tillegg for skogs- og anleggsvei"
              value={formatCurrency(calculation.forestRoadAddition)}
            />
          ) : null}
          {calculation.equipmentAddition > 0 ? (
            <ResultRow
              label="Tillegg for tungt utstyr eller materiell"
              value={formatCurrency(calculation.equipmentAddition)}
            />
          ) : null}
          <ResultRow
            emphasized
            label="Total utbetaling"
            value={formatCurrency(calculation.totalPayout)}
          />
          <ResultRow
            label={`Skattefri del (grunnsats inntil ${formatRate(calculation.taxFreeRate)} kr/km + godkjente tillegg)`}
            value={formatCurrency(calculation.taxFreeAmount)}
          />
          <ResultRow
            label="Skattepliktig del"
            value={formatCurrency(calculation.taxableAmount)}
          />
        </div>
      </section>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid content-start gap-2">
      <span className="text-sm font-semibold text-slate-950">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700">
      <input
        checked={checked}
        className="mt-1 h-4 w-4 rounded border-slate-300 accent-[var(--primary-strong)]"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );
}

function ResultCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "positive" | "warning";
}) {
  const className =
    tone === "positive"
      ? "bg-emerald-50 text-emerald-800"
      : tone === "warning"
        ? "bg-amber-50 text-amber-800"
        : "bg-white text-slate-950";

  return (
    <article className={`rounded-[5px] p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] ${className}`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] tabular-nums">{value}</p>
    </article>
  );
}

function ResultRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={[
        "flex flex-col gap-1 rounded-[5px] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        emphasized ? "bg-emerald-50" : "bg-slate-50",
      ].join(" ")}
    >
      <span className={`text-sm ${emphasized ? "font-semibold text-slate-950" : "text-slate-700"}`}>
        {label}
      </span>
      <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-950">{value}</span>
    </div>
  );
}

function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9,.\s]/g, "").replace(/\./g, ",");
}

function parsePositiveNumber(value: string) {
  const normalized = value.replace(/\s+/g, "").replace(",", ".");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parseNonNegativeWholeNumber(value: string) {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

function formatInputNumber(value: number) {
  return value.toLocaleString("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatRate(value: number) {
  return value.toLocaleString("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} kr`;
}

function formatDistance(value: number) {
  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 2,
  })} km`;
}
