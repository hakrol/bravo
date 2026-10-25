"use client";

import { useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { SalaryGrowthExplorer } from "@/components/salary-growth-explorer";
import { DevelopmentSalaryGenderGap } from "@/components/development-salary-gender-gap";
import { DevelopmentRealWage } from "@/components/development-real-wage";
import { DevelopmentOccupationComparison } from "@/components/development-occupation-comparison";
import { DevelopmentSalaryRange } from "@/components/development-salary-range";
import { DevelopmentWorkforceGrowth } from "@/components/development-workforce-growth";
import type { WorkforceGrowthDataset } from "@/lib/workforce-growth";
import { salaryGrowthTestSnapshot } from "@/lib/development-diagram-data";

type DevelopmentDiagram = {
  id: string;
  label: string;
  Component?: ComponentType;
};

function SalaryGrowthTestDiagram() {
  return <SalaryGrowthExplorer snapshot={salaryGrowthTestSnapshot} />;
}

// Én oppføring per diagram. Lønnstakerdiagrammet får faktiske SSB-data fra serveren.
const diagrams: DevelopmentDiagram[] = [
  {
    id: "lonnsutvikling",
    label: "Interaktiv lønnsutvikling",
    Component: SalaryGrowthTestDiagram,
  },
  {
    id: "lonnsforskjell",
    label: "Interaktiv lønnsforskjell",
    Component: DevelopmentSalaryGenderGap,
  },
  {
    id: "reallonn",
    label: "Interaktiv reallønn",
    Component: DevelopmentRealWage,
  },
  {
    id: "yrkessammenligning",
    label: "Interaktiv yrkessammenligning",
    Component: DevelopmentOccupationComparison,
  },
  {
    id: "lonnsspenn",
    label: "Interaktivt lønnsspenn",
    Component: DevelopmentSalaryRange,
  },
  {
    id: "lonnstakere",
    label: "Interaktiv lønnstakerutvikling",
  },
];

export function DevelopmentDiagramTabs({ workforceDatasets = [] }: { workforceDatasets?: WorkforceGrowthDataset[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeDiagram = diagrams[activeIndex];
  const ActiveDiagram = activeDiagram.Component;

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % diagrams.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + diagrams.length) % diagrams.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = diagrams.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Diagrammer"
        className="flex flex-wrap gap-2 border-b border-slate-200 pb-3"
      >
        {diagrams.map((diagram, index) => (
          <button
            key={diagram.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`diagram-tab-${diagram.id}`}
            aria-controls={`diagram-panel-${diagram.id}`}
            aria-selected={activeIndex === index}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            className={`max-w-full rounded-md px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] ${
              activeIndex === index
                ? "bg-[#0b376d] text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            {diagram.label}
          </button>
        ))}
      </div>
      {diagrams.map((diagram, index) => (
        <div
          key={diagram.id}
          role="tabpanel"
          id={`diagram-panel-${diagram.id}`}
          aria-labelledby={`diagram-tab-${diagram.id}`}
          hidden={activeIndex !== index}
          tabIndex={0}
          className="pt-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b376d]"
        >
          {activeIndex === index ? diagram.id === "lonnstakere"
            ? <DevelopmentWorkforceGrowth datasets={workforceDatasets} />
            : ActiveDiagram ? <ActiveDiagram /> : null : null}
        </div>
      ))}
    </div>
  );
}
