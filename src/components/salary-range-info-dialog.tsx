"use client";

import { useEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import styles from "./salary-range-explorer.module.css";

type SalaryRangeInfoDialogProps = {
  id: string;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  isTestData?: boolean;
};

export function SalaryRangeInfoDialog({ id, onClose, returnFocusRef, isTestData }: SalaryRangeInfoDialogProps) {
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
      const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
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
    <button type="button" tabIndex={-1} className={styles.infoBackdrop} aria-label="Lukk forklaring om lønnsspennet" onClick={onClose} />
    <div ref={dialogRef} id={id} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={`${id}-intro`}
      tabIndex={-1} onKeyDown={handleKeyDown} className={styles.infoDialog}>
      <div className={styles.infoHeading}>
        <h3 id={`${id}-title`}>Slik leser du lønnsspennet</h3>
        <button type="button" className={styles.infoClose} aria-label="Lukk forklaring" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <p id={`${id}-intro`} className={styles.infoIntro}>Diagrammet viser hvordan lønnsnivået og spennet mellom lavere og høyere lønninger har endret seg over tid.</p>
      <dl className={styles.infoDefinitions}>
        <div><dt>Nedre kvartil · 25 %</dt><dd>Dette er grensen for den lavest lønnede fjerdedelen. Omtrent 25 % tjener dette beløpet eller mindre.</dd></div>
        <div><dt>Median · 50 %</dt><dd>Linjen viser midtpunktet i lønnsfordelingen. Halvparten tjener mindre og halvparten mer. Medianen er ikke det samme som gjennomsnittslønnen.</dd></div>
        <div><dt>Øvre kvartil · 75 %</dt><dd>Omtrent 75 % tjener dette beløpet eller mindre. Den høyest lønnede fjerdedelen ligger over denne grensen.</dd></div>
        <div><dt>Båndet · de midterste 50 %</dt><dd>Det fargede feltet går fra nedre til øvre kvartil. Det viser hvor den midterste halvparten av lønningene ligger, ikke den aller laveste og høyeste lønnen.</dd></div>
        <div><dt>Din lønn</dt><dd>Den stiplede turkise linjen viser årslønnen du velger med slideren. Ligger beløpet utenfor skalaen, vises linjen øverst eller nederst i diagrammet, mens tallet fortsatt viser den faktiske lønnen. Samme beløp sammenlignes med hvert år, uten inflasjonsjustering. Det er ikke din historiske lønnsutvikling, og diagrammet anslår ikke en nøyaktig persentil.</dd></div>
        <div><dt>Kjønn og lønnsgrunnlag</dt><dd>«Begge kjønn» viser en egen samlet fordeling. «Menn» og «Kvinner» viser hver sin fordeling. Tallene gjelder fast avtalt brutto lønn omregnet til 100 % stilling, uten bonus, tillegg og overtid. Årsbeløp er månedslønn ganget med tolv.</dd></div>
      </dl>
      {isTestData ? <p className={styles.infoTestNote}>Denne utviklingsvisningen bruker fiktive testdata.</p> : null}
      <button type="button" onClick={onClose} className={styles.infoDone}>Tilbake til diagrammet</button>
    </div>
  </div>;
}
