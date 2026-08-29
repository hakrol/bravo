"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { track } from "@vercel/analytics";
import { JobOfferReportView } from "@/components/job-offer-report";
import {
  buildJobOfferReport,
  type JobOfferLeadershipLevel,
  type JobOfferPageData,
  type JobOfferReport,
} from "@/lib/job-offer";
import type { OccupationSalaryDistribution } from "@/lib/types";

type JobOfferToolProps = {
  data: JobOfferPageData;
};

type WizardStep = "intro" | "offer" | "occupation" | "experience" | "leadership";

type FormState = {
  annualSalary: string;
  currentAnnualSalary: string;
  occupationCode: string;
  relevantExperienceYears: string;
  leadershipLevel: JobOfferLeadershipLevel | "";
  hasBudgetResponsibility: boolean;
};

const initialForm: FormState = {
  annualSalary: "",
  currentAnnualSalary: "",
  occupationCode: "",
  relevantExperienceYears: "",
  leadershipLevel: "",
  hasBudgetResponsibility: false,
};

const orderedSteps: Exclude<WizardStep, "intro">[] = [
  "offer",
  "occupation",
  "experience",
  "leadership",
];

const leadershipOptions: Array<{
  value: JobOfferLeadershipLevel;
  title: string;
  detail: string;
}> = [
  {
    value: "none",
    title: "Ingen lederansvar",
    detail: "Du har ikke formelt fag-, team- eller personalansvar.",
  },
  {
    value: "professional",
    title: "Fagansvar eller teamleder",
    detail: "Du leder fag eller oppgaver, men har ikke personalansvar.",
  },
  {
    value: "small-team",
    title: "Personalansvar for 1–5 personer",
    detail: "Du følger opp et mindre team og har medarbeideransvar.",
  },
  {
    value: "medium-team",
    title: "Personalansvar for 6–20 personer",
    detail: "Du leder en større gruppe eller avdeling.",
  },
  {
    value: "large-team",
    title: "Personalansvar for mer enn 20 personer",
    detail: "Du har omfattende personal- og organisasjonsansvar.",
  },
];

export function JobOfferTool({ data }: JobOfferToolProps) {
  const [step, setStep] = useState<WizardStep>("intro");
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<JobOfferReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [occupationQuery, setOccupationQuery] = useState("");
  const [isOccupationMenuOpen, setIsOccupationMenuOpen] = useState(false);
  const [activeOccupationIndex, setActiveOccupationIndex] = useState(0);
  const occupationPickerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const deferredOccupationQuery = useDeferredValue(occupationQuery);
  const filteredOccupations = useMemo(
    () =>
      filterOccupations(data.options, deferredOccupationQuery).slice(0, 8),
    [data.options, deferredOccupationQuery],
  );

  useEffect(() => {
    if (!isOccupationMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !occupationPickerRef.current?.contains(event.target)
      ) {
        setIsOccupationMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOccupationMenuOpen]);

  useEffect(() => {
    if (step !== "intro") {
      headingRef.current?.focus();
    }
  }, [step]);

  function start() {
    track("Job offer assessment started", { source: "job_offer_intro" });
    setStep("offer");
  }

  function goBack() {
    setError(null);

    if (step === "offer") {
      setStep("intro");
      return;
    }

    const index = orderedSteps.indexOf(step as Exclude<WizardStep, "intro">);
    setStep(orderedSteps[Math.max(0, index - 1)]);
  }

  function goNext() {
    const validationError = validateStep(step, form);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const index = orderedSteps.indexOf(step as Exclude<WizardStep, "intro">);

    if (index < orderedSteps.length - 1) {
      track("Job offer step completed", { step });
      setStep(orderedSteps[index + 1]);
    }
  }

  async function createReport() {
    const validationError = validateStep("leadership", form);

    if (validationError) {
      setError(validationError);
      return;
    }

    const annualSalary = parseSalary(form.annualSalary);
    const currentAnnualSalary = parseSalary(form.currentAnnualSalary);
    const relevantExperienceYears = parseInteger(form.relevantExperienceYears);

    if (
      annualSalary === undefined ||
      relevantExperienceYears === undefined ||
      !form.leadershipLevel
    ) {
      setError("Kontroller svarene før du lager rapporten.");
      return;
    }

    setError(null);
    setIsLoadingReport(true);

    let distribution: OccupationSalaryDistribution | null = null;

    try {
      const response = await fetch(
        `/api/occupation-distribution?occupationCode=${encodeURIComponent(form.occupationCode)}`,
      );

      if (response.ok) {
        distribution = (await response.json()) as OccupationSalaryDistribution | null;
      }
    } catch {
      distribution = null;
    }

    try {
      const nextReport = buildJobOfferReport({
        input: {
          annualSalary,
          currentAnnualSalary,
          occupationCode: form.occupationCode,
          relevantExperienceYears,
          leadershipLevel: form.leadershipLevel,
          hasBudgetResponsibility: form.hasBudgetResponsibility,
        },
        data,
        distribution,
      });

      if (!nextReport) {
        throw new Error("Kunne ikke lage en rapport for valgt yrke.");
      }

      setReport(nextReport);
      track("Job offer report completed", {
        assessment: nextReport.assessment,
        confidence: nextReport.confidence.level,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (reportError) {
      setError(
        reportError instanceof Error
          ? reportError.message
          : "Kunne ikke lage rapporten akkurat nå.",
      );
    } finally {
      setIsLoadingReport(false);
    }
  }

  function restart() {
    setForm(initialForm);
    setOccupationQuery("");
    setReport(null);
    setError(null);
    setStep("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (report) {
    return (
      <JobOfferReportView
        onEdit={() => {
          setReport(null);
          setStep("leadership");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onRestart={restart}
        report={report}
      />
    );
  }

  if (step === "intro") {
    return <IntroCard onStart={start} />;
  }

  const currentStepIndex = orderedSteps.indexOf(step);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <section className="overflow-visible rounded-[22px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.11)]">
        <div className="border-b border-slate-200 bg-[linear-gradient(145deg,#ecfdf5_0%,#f8fafc_100%)] px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
                Jobbtilbud
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                Steg {currentStepIndex + 1} av {orderedSteps.length}
              </p>
            </div>
            <span className="text-sm font-semibold text-slate-500">
              {Math.round(((currentStepIndex + 1) / orderedSteps.length) * 100)} %
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-emerald-700 transition-[width] duration-300"
              style={{
                width: `${((currentStepIndex + 1) / orderedSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="px-6 py-7 sm:px-8 sm:py-9">
          {step === "offer" ? (
            <OfferStep form={form} headingRef={headingRef} setForm={setForm} />
          ) : null}
          {step === "occupation" ? (
            <OccupationStep
              activeIndex={activeOccupationIndex}
              filteredOccupations={filteredOccupations}
              form={form}
              headingRef={headingRef}
              isOpen={isOccupationMenuOpen}
              occupationPickerRef={occupationPickerRef}
              occupationQuery={occupationQuery}
              onQueryChange={(value) => {
                setOccupationQuery(value);
                setActiveOccupationIndex(0);
                setIsOccupationMenuOpen(true);
                setForm((current) => ({ ...current, occupationCode: "" }));
              }}
              onSelect={(occupationCode, occupationLabel) => {
                setForm((current) => ({ ...current, occupationCode }));
                setOccupationQuery(occupationLabel);
                setIsOccupationMenuOpen(false);
                setError(null);
              }}
              setActiveIndex={setActiveOccupationIndex}
              setIsOpen={setIsOccupationMenuOpen}
            />
          ) : null}
          {step === "experience" ? (
            <ExperienceStep form={form} headingRef={headingRef} setForm={setForm} />
          ) : null}
          {step === "leadership" ? (
            <LeadershipStep form={form} headingRef={headingRef} setForm={setForm} />
          ) : null}

          {error ? (
            <p
              aria-live="polite"
              className="mt-5 rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-8 grid gap-3 sm:grid-cols-[0.42fr_1fr]">
            <button
              className="order-2 rounded-[9px] border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:order-1"
              onClick={goBack}
              type="button"
            >
              Tilbake
            </button>
            <button
              className="order-1 inline-flex items-center justify-center gap-2 rounded-[9px] bg-emerald-900 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(6,78,59,0.18)] transition hover:-translate-y-px hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70 sm:order-2"
              disabled={isLoadingReport}
              onClick={step === "leadership" ? () => void createReport() : goNext}
              type="button"
            >
              {step === "leadership"
                ? isLoadingReport
                  ? "Lager rapport …"
                  : "Se vurderingen"
                : "Neste"}
              <ArrowIcon />
            </button>
          </div>
        </div>
      </section>

      <p className="mx-auto mt-5 max-w-lg text-center text-xs leading-6 text-slate-500">
        Opplysningene brukes bare til å lage vurderingen i nettleseren. Vi lagrer ikke lønnen eller svarene dine.
      </p>
    </div>
  );
}

function IntroCard({ onStart }: { onStart: () => void }) {
  return (
    <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.11)]">
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.18),transparent_34%),linear-gradient(145deg,#ecfdf5_0%,#f8fafc_100%)] px-7 py-8 sm:px-10 sm:py-10">
        <div className="relative flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-800">
              Lønnsinnsikt
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-600">Jobbtilbud</p>
          </div>
          <OfferIllustration />
        </div>
      </div>

      <div className="px-7 py-8 sm:px-10 sm:py-10">
        <h1 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Er lønnen i jobbtilbudet riktig for deg?
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-700">
          Sammenlign tilbudet med offisielle lønnstall og få et forsiktig anslag som tar hensyn til relevant erfaring og lederansvar.
        </p>

        <div className="mt-7 grid gap-5">
          <IntroBenefit
            icon={<ChartIcon />}
            title="Offisielle markedsdata"
            text="Vi sammenligner fastlønnen med median og lønnsfordeling fra SSB."
          />
          <IntroBenefit
            icon={<EstimateIcon />}
            title="Åpent og forklart anslag"
            text="Erfaring og ansvar brukes i en tydelig beregningsmodell – ikke som en skjult fasit."
          />
          <IntroBenefit
            icon={<ShieldIcon />}
            title="Svarene lagres ikke"
            text="Vurderingen lages i nettleseren, og vi ber ikke om navn eller e-post."
          />
        </div>

        <button
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-[9px] bg-emerald-900 px-6 py-4 text-base font-semibold text-white shadow-[0_12px_28px_rgba(6,78,59,0.2)] transition hover:-translate-y-px hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          onClick={onStart}
          type="button"
        >
          Start vurderingen
          <ArrowIcon />
        </button>
        <p className="mt-3 text-center text-xs font-medium text-slate-500">
          Tar 30–60 sekunder
        </p>
      </div>
    </section>
  );
}

function OfferStep({
  form,
  setForm,
  headingRef,
}: StepProps) {
  return (
    <div>
      <StepHeading
        ref={headingRef}
        title="Hva er fastlønnen i tilbudet?"
        description="Bruk fast avtalt årslønn før skatt i 100 prosent stilling. Ikke ta med bonus, overtid eller feriepenger."
      />
      <label className="mt-7 grid gap-2" htmlFor="job-offer-salary">
        <span className="text-sm font-semibold text-slate-900">Tilbudt årslønn</span>
        <span className="relative">
          <input
            autoFocus
            className="h-14 w-full rounded-[9px] border border-slate-300 px-4 pr-14 text-lg font-semibold text-slate-950 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            id="job-offer-salary"
            inputMode="numeric"
            onChange={(event) =>
              setForm((current) => ({ ...current, annualSalary: event.target.value }))
            }
            placeholder="For eksempel 720 000"
            type="text"
            value={form.annualSalary}
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-600">
            kr
          </span>
        </span>
      </label>

      <label className="mt-5 grid gap-2" htmlFor="current-salary">
        <span className="text-sm font-semibold text-slate-900">
          Nåværende årslønn <span className="font-normal text-slate-500">(valgfritt)</span>
        </span>
        <span className="relative">
          <input
            className="h-12 w-full rounded-[9px] border border-slate-300 px-4 pr-14 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            id="current-salary"
            inputMode="numeric"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                currentAnnualSalary: event.target.value,
              }))
            }
            placeholder="For eksempel 680 000"
            type="text"
            value={form.currentAnnualSalary}
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-600">
            kr
          </span>
        </span>
      </label>
    </div>
  );
}

type OccupationStepProps = {
  form: FormState;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  occupationQuery: string;
  filteredOccupations: JobOfferPageData["options"];
  activeIndex: number;
  isOpen: boolean;
  occupationPickerRef: React.RefObject<HTMLDivElement | null>;
  onQueryChange: (value: string) => void;
  onSelect: (occupationCode: string, occupationLabel: string) => void;
  setActiveIndex: (value: number | ((current: number) => number)) => void;
  setIsOpen: (value: boolean) => void;
};

function OccupationStep({
  form,
  headingRef,
  occupationQuery,
  filteredOccupations,
  activeIndex,
  isOpen,
  occupationPickerRef,
  onQueryChange,
  onSelect,
  setActiveIndex,
  setIsOpen,
}: OccupationStepProps) {
  return (
    <div>
      <StepHeading
        ref={headingRef}
        title="Hvilket yrke gjelder tilbudet?"
        description="Velg yrket som best beskriver arbeidsoppgavene i den nye stillingen."
      />
      <div className="mt-7 grid gap-2" ref={occupationPickerRef}>
        <label className="text-sm font-semibold text-slate-900" htmlFor="job-offer-occupation">
          Søk etter yrke
        </label>
        <div className="relative">
          <input
            aria-activedescendant={
              isOpen && filteredOccupations.length > 0
                ? `job-offer-occupation-${activeIndex}`
                : undefined
            }
            aria-autocomplete="list"
            aria-controls="job-offer-occupation-options"
            aria-expanded={isOpen}
            autoComplete="off"
            autoFocus
            className="h-14 w-full rounded-[9px] border border-slate-300 px-4 pr-12 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            id="job-offer-occupation"
            onChange={(event) => onQueryChange(event.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setIsOpen(true);
                setActiveIndex((current) =>
                  Math.min(current + 1, filteredOccupations.length - 1),
                );
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((current) => Math.max(0, current - 1));
              } else if (
                event.key === "Enter" &&
                isOpen &&
                filteredOccupations[activeIndex]
              ) {
                event.preventDefault();
                const selected = filteredOccupations[activeIndex];
                onSelect(selected.occupationCode, selected.occupationLabel);
              } else if (event.key === "Escape") {
                setIsOpen(false);
              }
            }}
            placeholder="For eksempel regnskapsfører"
            role="combobox"
            type="search"
            value={occupationQuery}
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
            <SearchIcon />
          </span>

          {isOpen && filteredOccupations.length > 0 ? (
            <ul
              className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-72 overflow-y-auto rounded-[10px] border border-slate-200 bg-white py-2 shadow-[0_18px_44px_rgba(15,23,42,0.16)]"
              id="job-offer-occupation-options"
              role="listbox"
            >
              {filteredOccupations.map((occupation, index) => (
                <li key={occupation.occupationCode}>
                  <button
                    aria-selected={form.occupationCode === occupation.occupationCode}
                    className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none aria-selected:bg-emerald-50"
                    id={`job-offer-occupation-${index}`}
                    onClick={() =>
                      onSelect(occupation.occupationCode, occupation.occupationLabel)
                    }
                    onMouseEnter={() => setActiveIndex(index)}
                    role="option"
                    type="button"
                  >
                    <span className="font-medium text-slate-950">
                      {occupation.occupationLabel}
                    </span>
                    <span className="shrink-0 text-xs text-slate-500">
                      {occupation.groupLabel}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {occupationQuery.trim() && filteredOccupations.length === 0 ? (
          <p className="text-sm text-slate-600">Ingen yrker matcher søket.</p>
        ) : null}
      </div>
    </div>
  );
}

function ExperienceStep({ form, setForm, headingRef }: StepProps) {
  const quickChoices = [0, 2, 5, 10, 15];

  return (
    <div>
      <StepHeading
        ref={headingRef}
        title="Hvor mye relevant erfaring har du?"
        description="Tell erfaring som er direkte relevant for arbeidsoppgavene i den nye stillingen."
      />
      <label className="mt-7 grid gap-2" htmlFor="relevant-experience">
        <span className="text-sm font-semibold text-slate-900">Relevant erfaring</span>
        <span className="relative">
          <input
            autoFocus
            className="h-14 w-full rounded-[9px] border border-slate-300 px-4 pr-12 text-lg font-semibold text-slate-950 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            id="relevant-experience"
            inputMode="numeric"
            max="50"
            min="0"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                relevantExperienceYears: event.target.value,
              }))
            }
            placeholder="For eksempel 8"
            type="number"
            value={form.relevantExperienceYears}
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-600">
            år
          </span>
        </span>
      </label>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Vanlige valg">
        {quickChoices.map((years) => (
          <button
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              form.relevantExperienceYears === String(years)
                ? "border-emerald-800 bg-emerald-800 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-emerald-500 hover:bg-emerald-50"
            }`}
            key={years}
            onClick={() =>
              setForm((current) => ({
                ...current,
                relevantExperienceYears: String(years),
              }))
            }
            type="button"
          >
            {years === 0 ? "Ny i rollen" : `${years}+ år`}
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-[10px] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        Erfaring fra et nærliggende fagområde kan også være relevant, men vurder hvor mye av den du faktisk får brukt i den nye rollen.
      </div>
    </div>
  );
}

function LeadershipStep({ form, setForm, headingRef }: StepProps) {
  return (
    <div>
      <StepHeading
        ref={headingRef}
        title="Hvilket ansvar følger med stillingen?"
        description="Velg nivået som best beskriver det formelle ansvaret i jobbtilbudet."
      />
      <fieldset className="mt-7 grid gap-3">
        <legend className="sr-only">Lederansvar</legend>
        {leadershipOptions.map((option) => {
          const selected = form.leadershipLevel === option.value;

          return (
            <label
              className={`flex cursor-pointer gap-3 rounded-[11px] border p-4 transition ${
                selected
                  ? "border-emerald-700 bg-emerald-50 shadow-[0_0_0_1px_rgba(4,120,87,0.12)]"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
              key={option.value}
            >
              <input
                checked={selected}
                className="mt-1 h-4 w-4 border-slate-300 text-emerald-800 focus:ring-emerald-700"
                name="leadership-level"
                onChange={() =>
                  setForm((current) => ({
                    ...current,
                    leadershipLevel: option.value,
                  }))
                }
                type="radio"
                value={option.value}
              />
              <span>
                <span className="block font-semibold text-slate-950">{option.title}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  {option.detail}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <label className="mt-5 flex cursor-pointer gap-3 rounded-[11px] border border-indigo-200 bg-indigo-50/70 p-4">
        <input
          checked={form.hasBudgetResponsibility}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-700 focus:ring-indigo-600"
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              hasBudgetResponsibility: event.target.checked,
            }))
          }
          type="checkbox"
        />
        <span>
          <span className="block font-semibold text-slate-950">
            Stillingen har budsjett- eller resultatansvar
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">
            Kryss av hvis du får et tydelig økonomisk ansvar utover dine egne leveranser.
          </span>
        </span>
      </label>
    </div>
  );
}

type StepProps = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
};

const StepHeading = ({
  title,
  description,
  ref,
}: {
  title: string;
  description: string;
  ref: React.Ref<HTMLHeadingElement>;
}) => (
  <div>
    <h1
      className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl"
      ref={ref}
      tabIndex={-1}
    >
      {title}
    </h1>
    <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">{description}</p>
  </div>
);

function IntroBenefit({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-800">
        {icon}
      </span>
      <div>
        <h2 className="font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function validateStep(step: WizardStep, form: FormState) {
  if (step === "offer") {
    const annualSalary = parseSalary(form.annualSalary);
    const currentSalary = parseSalary(form.currentAnnualSalary);

    if (annualSalary === undefined || annualSalary < 100_000 || annualSalary > 20_000_000) {
      return "Legg inn en gyldig fast årslønn mellom 100 000 og 20 000 000 kroner.";
    }

    if (
      form.currentAnnualSalary.trim() &&
      (currentSalary === undefined || currentSalary <= 0)
    ) {
      return "Legg inn en gyldig nåværende årslønn, eller la feltet stå tomt.";
    }
  }

  if (step === "occupation" && !form.occupationCode) {
    return "Velg et yrke fra søkeresultatene før du går videre.";
  }

  if (step === "experience") {
    const years = parseInteger(form.relevantExperienceYears);

    if (years === undefined || years < 0 || years > 50) {
      return "Legg inn relevant erfaring mellom 0 og 50 år.";
    }
  }

  if (step === "leadership" && !form.leadershipLevel) {
    return "Velg nivået som best beskriver ansvaret i stillingen.";
  }

  return null;
}

function filterOccupations(
  options: JobOfferPageData["options"],
  query: string,
) {
  const normalized = normalizeText(query);

  if (!normalized) {
    return options.slice(0, 8);
  }

  return options
    .filter((option) => normalizeText(option.occupationLabel).includes(normalized))
    .sort((left, right) => {
      const leftStarts = normalizeText(left.occupationLabel).startsWith(normalized);
      const rightStarts = normalizeText(right.occupationLabel).startsWith(normalized);

      if (leftStarts !== rightStarts) {
        return leftStarts ? -1 : 1;
      }

      return left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO");
    });
}

function parseSalary(value: string) {
  const normalized = value.replace(/\s/g, "").replace(",", ".");

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseInteger(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}

function OfferIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="h-24 w-32 shrink-0 sm:h-28 sm:w-40"
      fill="none"
      viewBox="0 0 180 130"
    >
      <rect x="28" y="21" width="111" height="91" rx="13" fill="white" stroke="#A7F3D0" strokeWidth="2" />
      <rect x="43" y="39" width="49" height="8" rx="4" fill="#A7F3D0" />
      <rect x="43" y="57" width="80" height="6" rx="3" fill="#CBD5E1" />
      <rect x="43" y="70" width="67" height="6" rx="3" fill="#E2E8F0" />
      <path d="m48 94 10 9 20-24" stroke="#047857" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
      <circle cx="136" cy="40" r="24" fill="#312E81" />
      <path d="M126 40h20M136 30v20" stroke="white" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m13 13 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="M3 16V9h3v7m2 0V4h3v12m2 0v-6h3v6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function EstimateIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="M10 3v14M6 6.5h6a2 2 0 0 1 0 4H8a2 2 0 0 0 0 4h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="m10 2.5 6 2.4v4.4c0 3.8-2.4 6.4-6 8.2-3.6-1.8-6-4.4-6-8.2V4.9l6-2.4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="m7.2 9.8 1.8 1.8 3.9-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}
