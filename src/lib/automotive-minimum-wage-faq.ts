import { automotiveMinimumWage as rates, formatAutomotiveRate as money } from "./automotive-minimum-wage";

export const automotiveFaq = [
  ["Hva er minstelønnen i bilbransjen i 2026?", `Fra 15. juni er satsene ${money(rates.newlyQualifiedSkilled)} for nyutlært fagarbeider, ${money(rates.skilledOneYear)} for fagarbeider etter ett års praksis, ${money(rates.helper18Plus)} for hjelpearbeider som har fylt 18 år og ${money(rates.helperOneYear)} for hjelpearbeider 18+ etter ett års praksis. Alle satsene er per time og forutsetter at arbeidet omfattes.`],
  ["Hva er minstelønnen for en bilmekaniker?", `En bilmekaniker med fagarbeiderstatus har minst ${money(rates.newlyQualifiedSkilled)} per time som nyutlært og ${money(rates.skilledOneYear)} etter ett års praksis, når forskriften gjelder.`],
  ["Gjelder minstelønn for bilpleie, bilvask, dekkskift og dekkhotell?", "Ja. Manuell bilpleie og bilvask, hjulskift og hjullagring omfattes, med forskriftens unntak. Arbeidstilsynets godkjenningsordning stiller også krav om at virksomheten oppfyller minstelønns- og arbeidsvilkårene fra 15. juni 2026."],
  ["Hva er minstelønnen hvis jeg er under 18 år?", "Forskriften fastsetter hjelpearbeidersatsen først fra fylte 18 år. Den inneholder ingen egen allmenngjort sats for hjelpearbeidere på 16 eller 17 år. Lønn må vurderes etter arbeidsavtalen og eventuell tariffavtale."],
  ["Har lærlinger krav på samme minstelønn?", "Nei. Lærlinger og personer på arbeidsmarkedstiltak er uttrykkelig unntatt. Biloverenskomsten har egne regler om lærlinglønn."],
  ["Hva er overtidsbetalingen i bilbransjen?", "Lovens minimum ved overtidsarbeid er 40 prosent tillegg til avtalt ordinær timelønn. Med 223,50 kr i ordinær timelønn blir det 312,90 kr. Merarbeid for deltidsansatte er ikke automatisk overtid; tariffavtale kan gi bedre rettigheter."],
  ["Er 249 kroner den nye lovpålagte minstelønnen?", `Nei, per 4. oktober 2026 er dette ny tariffsats og foreslått allmenngjort sats. Forslaget er under behandling. Gjeldende lovsats for nyutlært fagarbeider er fortsatt ${money(rates.newlyQualifiedSkilled)} per time.`],
].map(([question, answer]) => ({ question, answer }));
