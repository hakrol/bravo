"use client";

import { useEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import styles from "./salary-range-explorer.module.css";

type SalaryGenderInfoDialogProps = {
  id: string;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  monthlyHours: number | null;
};

export function SalaryGenderInfoDialog({ id, onClose, returnFocusRef, monthlyHours }: SalaryGenderInfoDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = returnFocusRef.current;
    dialog?.focus({ preventScroll: true });
    if (dialog) {
      const rect = dialog.getBoundingClientRect();
      if (rect.top < 16 || rect.bottom > window.innerHeight - 16) dialog.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
    return () => { trigger?.focus({ preventScroll: true }); };
  }, [returnFocusRef]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    } else if (event.key === "Tab") {
      const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  }

  return <div className={styles.infoOverlay}>
    <button type="button" tabIndex={-1} className={styles.infoBackdrop} aria-label="Lukk forklaring om median samlet månedslønn" onClick={onClose} />
    <div ref={dialogRef} id={id} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={`${id}-intro`}
      tabIndex={-1} onKeyDown={handleKeyDown} className={styles.infoDialog}>
      <div className={styles.infoHeading}>
        <h3 id={`${id}-title`}>Hva er median samlet månedslønn?</h3>
        <button type="button" className={styles.infoClose} aria-label="Lukk forklaring" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <p id={`${id}-intro`} className={styles.infoIntro}>Stolpene viser medianen av samlet månedslønn for kvinner og menn hver for seg, i samme yrkesgruppe og periode.</p>
      <dl className={styles.infoDefinitions}>
        <div><dt>Median · midtpunktet</dt><dd>Medianen er lønnen i midten når lønningene sorteres fra lavest til høyest. Halvparten ligger under og halvparten over. Median er ikke det samme som gjennomsnitt.</dd></div>
        <div><dt>Samlet månedslønn · før skatt</dt><dd>Omfatter avtalt månedslønn, uregelmessige tillegg og bonus. Overtidsgodtgjørelse er ikke inkludert. Deltidslønn er omregnet til en heltidsstilling. Medianen gjelder den samlede månedslønnen, ikke summen av medianene for hver lønnsdel.</dd></div>
        <div><dt>Års- og timelønn · omregnet</dt><dd>Årsbeløpet er månedslønnen ganget med 12.{monthlyHours !== null ? ` Timebeløpet er månedslønnen delt på ${monthlyHours.toLocaleString("nb-NO")} timer per måned.` : " Timelønn er utilgjengelig fordi gyldig timetall mangler."} Dette er omregninger, ikke egne observerte års- eller timelønninger.</dd></div>
      </dl>
      <p className={styles.infoTestNote}>Les mer om lønnsbegrepene hos <a href="https://www.ssb.no/arbeid-og-lonn/lonn-og-arbeidskraftkostnader/statistikk/lonn" className="underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2">SSB</a>.</p>
      <button type="button" onClick={onClose} className={styles.infoDone}>Tilbake til diagrammet</button>
    </div>
  </div>;
}
