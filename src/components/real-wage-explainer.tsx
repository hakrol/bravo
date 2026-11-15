const sourceClass = "font-medium text-[var(--primary-strong)] underline underline-offset-4";

export function RealWageExplainer() {
  return (
    <section className="border-t border-slate-200 pt-9 sm:pt-12" aria-labelledby="reallonn-explainer-title">
      <h2 id="reallonn-explainer-title" className="text-center text-balance text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">Forstå reallønn og kjøpekraft</h2>
      <div className="mt-7 grid gap-x-10 gap-y-8 text-base leading-8 text-slate-600 md:grid-cols-2">
        <article>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-slate-950">Hva er reallønn?</h3>
          <p>
            Reallønn er lønn justert for endringer i prisene. Den sier noe om hvor mye du kan
            kjøpe for lønnen din. Hvis lønnen stiger mer enn prisene, øker reallønnen. Hvis
            prisene stiger mer enn lønnen, faller den. På denne siden måler vi utviklingen i
            avtalt bruttolønn, før skatt.
          </p>
        </article>
        <article>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-slate-950">Nominell lønn vs. reallønn</h3>
          <p>
            Nominell lønn er beløpet i kroner. Reallønn tar også hensyn til hva varene og
            tjenestene koster. En lønnsøkning betyr derfor ikke nødvendigvis at kjøpekraften øker.
          </p>
          <p className="mt-2 rounded-[6px] bg-slate-100 px-4 py-3 text-slate-700">
            Eksempel: Fra 50 000 til 52 500 kroner øker lønnen med 5 %. Dersom prisene samtidig
            øker med 3 %, blir reallønnsveksten omtrent 1,9 %.
          </p>
        </article>
        <article>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-slate-950">Hva er median avtalt månedslønn?</h3>
          <p>
            Medianen er lønnen i midten når lønningene sorteres fra lavest til høyest.
            Avtalt månedslønn er fast lønn inkludert faste personlige tillegg. Her måler vi
            altså den midterste avtalte lønnen, omregnet til en heltidsstilling. Vi bruker
            SSBs publiserte median for hver gruppe.
          </p>
          <p className="mt-2">
            Les om <a className={sourceClass} href="https://www.ssb.no/arbeid-og-lonn/metoder-og-dokumentasjon/gjennomsnitt-median-eller-kvartiler">median og gjennomsnitt hos SSB</a>.
          </p>
        </article>
        <article>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-slate-950">Hva er forskjellen fra månedslønn?</h3>
          <p>
            SSBs begrep månedslønn omfatter også bonus og uregelmessige tillegg. Avtalt
            månedslønn holder disse utenfor. Overtid inngår heller ikke i den avtalte
            månedslønnen. Tallene på denne siden viser derfor utviklingen i fast avtalt lønn,
            og ikke hele utbetalingen på lønnsslippen.
          </p>
          <p className="mt-2">
            Se <a className={sourceClass} href="https://www.ssb.no/arbeid-og-lonn/sysselsetting/statistikk/antall-arbeidsforhold-og-lonn">SSBs definisjoner av lønnsbegrepene</a>.
          </p>
        </article>
        <article>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-slate-950">Hvordan beregnes reallønnsveksten?</h3>
          <p>
            Vi deler lønnsutviklingen på prisutviklingen, målt med konsumprisindeksen (KPI).
            KPI måler prisendringer på varer og tjenester som husholdningene kjøper.
            Flere kvartalers utvikling beregnes samlet fra start- til sluttverdien;
            kvartalsprosentene summeres ikke.
          </p>
          <p className="mt-2 break-words rounded-[6px] bg-slate-100 px-4 py-3 font-mono text-xs leading-6 text-slate-700">
            Reallønnsvekst = ((ny lønn / tidligere lønn) / (ny KPI / tidligere KPI) − 1) × 100
          </p>
          <p className="mt-2">
            Les om <a className={sourceClass} href="https://www.ssb.no/priser-og-prisindekser/konsumpriser/statistikk/konsumprisindeksen">KPI hos SSB</a>.
          </p>
        </article>
        <article>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-slate-950">Hva forteller sammenligningene?</h3>
          <p>
            Utviklingen gjelder medianen i en gruppe, og følger ikke de samme personene over
            tid. Jobbskifter og endringer i hvem som jobber i et yrke eller en aldersgruppe,
            kan påvirke resultatet. Din egen kjøpekraft påvirkes også av blant annet skatt,
            renter og hva du bruker penger på.
          </p>
        </article>
      </div>
      <div className="mt-8 rounded-[6px] border border-slate-200 bg-slate-50 px-5 py-5 text-xs leading-6 text-slate-600 sm:px-6">
        <h3 className="mb-2 text-sm font-semibold text-slate-800">Perioder og datagrunnlag</h3>
        <p>
          «Siste hele år» sammenligner 4. kvartal med 4. kvartal året før, og er ikke en
          sammenligning av årsgjennomsnitt. De tre boksene med høyest utvikling bruker samme
          årsperiode. Yrker sammenlignes på firesifret nivå, yrkesgrupper på ensifret nivå,
          og bare grupper med publiserte verdier i begge kvartaler inngår. Yrkesgruppene
          bruker SSBs samlede medianer, ikke et gjennomsnitt av yrkesmedianene.
        </p>
        <p className="mt-2">
          Lønn gjelder kvartalets midtmåned og prisjusteres med KPI for februar, mai, august
          eller november. Tallene er ikke sesongjustert. Manglende og skjermede verdier vises
          som «Mangler data». SSB opplyser om endret yrkesrapportering mellom 4. kvartal 2024
          og 1. kvartal 2025; store utslag over dette skillet bør tolkes med forsiktighet.
        </p>
        <p className="mt-2">
          Kilder: SSBs tabeller <a className={sourceClass} href="https://www.ssb.no/statbank/table/11658/">11658 (yrker og yrkesgrupper)</a>,{" "}
          <a className={sourceClass} href="https://www.ssb.no/statbank/table/11652/">11652 (alder i hele landet)</a> og{" "}
          <a className={sourceClass} href="https://www.ssb.no/statbank/table/14700/">14700 (KPI)</a>.
        </p>
      </div>
    </section>
  );
}
