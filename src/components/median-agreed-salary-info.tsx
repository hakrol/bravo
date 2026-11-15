"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { InteractiveChartTooltip } from "@/components/interactive-chart-tooltip";

export function MedianAgreedSalaryInfo() {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);
  const close = useCallback(() => {
    cancelClose();
    pinnedRef.current = false;
    setIsOpen(false);
  }, [cancelClose]);
  function show() {
    cancelClose();
    setIsOpen(true);
  }
  function scheduleClose() {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      if (!pinnedRef.current && !triggerRef.current?.matches(":focus-visible")) setIsOpen(false);
    }, 180);
  }

  useEffect(() => cancelClose, [cancelClose]);
  useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !triggerRef.current?.contains(event.target) && !tooltipRef.current?.contains(event.target)) close();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    function position() {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      if (!trigger || !tooltip) return;
      const anchor = trigger.getBoundingClientRect();
      const width = tooltip.offsetWidth;
      const height = tooltip.offsetHeight;
      const left = Math.max(16, Math.min(window.innerWidth - width - 16, anchor.left + anchor.width / 2 - width / 2));
      const preferredTop = anchor.bottom + 10 + height <= window.innerHeight - 16 ? anchor.bottom + 10 : anchor.top - height - 10;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${Math.max(16, Math.min(window.innerHeight - height - 16, preferredTop))}px`;
      tooltip.style.visibility = "visible";
    }
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [isOpen]);

  return <>
    <button ref={triggerRef} type="button" aria-label="Hva er median avtalt månedslønn?"
      aria-expanded={isOpen} aria-describedby={isOpen ? id : undefined}
      className="inline cursor-help font-semibold text-[var(--primary-strong)] underline decoration-dotted decoration-1 underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary-strong)]"
      onPointerEnter={(event) => { if (event.pointerType === "mouse" || event.pointerType === "pen" && event.buttons === 0) show(); }}
      onPointerLeave={scheduleClose}
      onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) show(); }}
      onBlur={() => { if (!pinnedRef.current) close(); }}
      onClick={() => {
        if (pinnedRef.current) close();
        else { pinnedRef.current = true; show(); }
      }}>
      median avtalt månedslønn<span aria-hidden="true" className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-current align-middle text-[10px] leading-none no-underline">i</span>
    </button>
    {isOpen ? createPortal(<InteractiveChartTooltip ref={tooltipRef} id={id}
      className="fixed z-[70] max-h-[calc(100dvh-2rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto text-left"
      style={{ left: 0, top: 0, visibility: "hidden", fontSize: "0.875rem", lineHeight: "1.5rem" }}
      onPointerEnter={cancelClose} onPointerLeave={scheduleClose}>
      <p className="mb-1 font-semibold text-slate-950">Median avtalt månedslønn</p>
      <p>
        Medianen er lønnen i midten når lønningene sorteres fra lavest til høyest.
        Avtalt månedslønn er fast lønn inkludert faste personlige tillegg, omregnet til en heltidsstilling.
        Bonus, uregelmessige tillegg og overtidsbetaling er ikke med. Beløpet er før skatt.
      </p>
    </InteractiveChartTooltip>, document.body) : null}
  </>;
}
