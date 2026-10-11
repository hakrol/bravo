"use client";

import { useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { SalaryGrowthExplorer } from "@/components/salary-growth-explorer";
import { salaryGrowthTestSnapshot } from "@/lib/development-diagram-data";

type DevelopmentDiagram = {
  id: string;
  label: string;
  Component: ComponentType;
};

function SalaryGrowthTestDiagram() {
  return <SalaryGrowthExplorer snapshot={salaryGrowthTestSnapshot} />;
}

// Legg til én oppføring per nytt diagram. Bruk testdata i utviklingsvisningen.
const diagrams: DevelopmentDiagram[] = [
  {
    id: "lonnsutvikling",
    label: "Interaktiv lønnsutvikling",
    Component: SalaryGrowthTestDiagram,
  },
];

export function DevelopmentDiagramTabs() {
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
        className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-3"
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
            className={`shrink-0 rounded-md px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] ${
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
          {activeIndex === index ? <ActiveDiagram /> : null}
        </div>
      ))}
    </div>
  );
}
