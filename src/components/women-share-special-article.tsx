import Link from "next/link";
import type { WomenShareSpecialData, WomenShareSpecialRow } from "@/lib/women-share-special";

type WomenShareSpecialArticleProps = {
  data: WomenShareSpecialData;
};

const numberFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const heroLineRows = [
  { label: "Allmennpraktiserende leger", start: 49.3, end: 57.4 },
  { label: "Andre sivilingeniører", start: 35.2, end: 42.8 },
  { label: "Havbruksarbeidere", start: 13.8, end: 21.3 },
  { label: "Politibetjenter", start: 31.0, end: 38.4 },
];

export function WomenShareSpecialArticle({ data }: WomenShareSpecialArticleProps) {
  return (
    <main className="min-h-screen bg-[#f7f3eb] text-[#151614]">
      <Hero data={data} />
      <article>
        <IntroSection data={data} />
        <FindingsSection data={data} />
        <LargeBarSection rows={data.rows} />
        <NarrativeBreak data={data} />
        <SlopeSection rows={data.rows.slice(0, 8)} />
        <ContrastSection data={data} />
        <MethodSection data={data} />
      </article>
    </main>
  );
}

function Hero({ data }: { data: WomenShareSpecialData }) {
  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden bg-[#090c0d] text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_28%,rgba(94,188,157,0.28),transparent_30%),radial-gradient(circle_at_38%_78%,rgba(199,150,79,0.18),transparent_32%),linear-gradient(135deg,#08090a_0%,#101819_48%,#050606_100%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:72px_72px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(180deg,transparent,#090c0d_72%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[92svh] max-w-[1500px] grid-rows-[auto_1fr] px-5 pb-10 pt-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-6 text-xs font-semibold uppercase text-white/65">
          <Link className="tracking-[0.28em]" href="/">
            Lønnsinnsikt
          </Link>
          <span className="tracking-[0.2em]">Spesial</span>
        </div>

        <div className="grid items-center gap-14 py-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.78fr)] lg:py-20">
          <div className="max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#d3aa6c]">
              Arbeidsliv / SSB-analyse
            </p>
            <h1 className="mt-7 max-w-5xl font-serif text-[clamp(3.6rem,9vw,9.4rem)] font-black leading-[0.86] tracking-normal text-[#fff8ed]">
              I disse yrkene øker kvinneandelen raskest
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl sm:leading-9">
              En gjennomgang av lønnstakerdata viser hvilke større yrker som har flyttet
              kjønnsbalansen mest siden {formatPeriod(data.startPeriod)}.
            </p>
            <p className="mt-7 text-sm leading-6 text-white/52">
              {data.source} tabell {data.tableId}. Sammenligning: {formatPeriod(data.startPeriod)} til{" "}
              {formatPeriod(data.endPeriod)}. Minst {formatNumber(data.minimumWorkforce)} lønnstakere
              i begge perioder.
            </p>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative min-h-[26rem] overflow-hidden lg:min-h-[42rem]" aria-hidden="true">
      <div className="absolute inset-y-8 left-6 right-0 rounded-l-[999px] border border-white/10 bg-white/[0.035]" />
      <div className="absolute inset-0">
        {heroLineRows.map((row, index) => {
          const y = 70 + index * 86;
          const startX = 74 + row.start * 4.2;
          const endX = 74 + row.end * 4.2;

          return (
            <svg
              key={row.label}
              className="absolute left-0 top-0 h-full w-full overflow-visible"
              viewBox="0 0 520 520"
            >
              <path
                d={`M ${startX} ${y} C ${startX + 72} ${y - 26}, ${endX - 70} ${y + 34}, ${endX} ${y}`}
                fill="none"
                stroke={index === 0 ? "#f2c079" : "#6fbca4"}
                strokeLinecap="round"
                strokeWidth={index === 0 ? 8 : 5}
              />
              <circle cx={startX} cy={y} fill="#111717" r="9" stroke="#fff5e5" strokeWidth="3" />
              <circle cx={endX} cy={y} fill={index === 0 ? "#f2c079" : "#6fbca4"} r="12" />
            </svg>
          );
        })}
      </div>
      <div className="absolute bottom-10 right-2 max-w-[18rem] text-right">
        <p className="font-serif text-7xl font-black leading-none text-[#f2c079]/95 sm:text-8xl">
          +8,2
        </p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/52">
          prosentpoeng i toppfunnet
        </p>
      </div>
    </div>
  );
}

function IntroSection({ data }: { data: WomenShareSpecialData }) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
        <div className="max-w-3xl">
          <p className="font-serif text-3xl leading-tight text-[#181917] sm:text-5xl sm:leading-tight">
            Det er ikke bare i de klassisk kvinnedominerte yrkene kvinneandelen øker.
            Flere store profesjons- og beredskapsyrker har hatt en tydelig forskyvning.
          </p>
          <div className="mt-12 space-y-8 text-lg leading-9 text-[#4b4d47]">
            <p>
              Lønnsinnsikt har sett på 4-siffer-yrker i SSBs lønnstakerstatistikk og sammenlignet
              kvinneandelen i {formatPeriod(data.startPeriod)} med {formatPeriod(data.endPeriod)}.
              For å unngå at små yrker dominerer listen, er bare yrker med minst{" "}
              {formatNumber(data.minimumWorkforce)} lønnstakere i begge perioder tatt med.
            </p>
            <p>
              Resultatet er et bilde av gradvis strukturell endring. Noen yrker har passert
              vippepunktet og blitt kvinnemajoritet. Andre er fortsatt klart mannsdominerte,
              men beveger seg raskere enn resten av arbeidsmarkedet.
            </p>
          </div>
        </div>

        <aside className="border-l border-[#d9cfbf] pl-6 text-sm leading-7 text-[#68665d]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#96713d]">
            Avgrensning
          </p>
          <p className="mt-4">
            Dette er en pilot for en ny spesialartikkeltype. Tallene viser lønnstakere,
            ikke alle sysselsatte, og bør leses som en endring i registrert yrkessammensetning.
          </p>
        </aside>
      </div>
    </section>
  );
}

function FindingsSection({ data }: { data: WomenShareSpecialData }) {
  const findings = [
    {
      kicker: "Størst skifte",
      value: `+${formatPercent(data.topFinding.changePercentagePoints)} pp`,
      text: `${data.topFinding.occupationLabel} hadde den største økningen i kvinneandel blant de større yrkene i utvalget.`,
    },
    {
      kicker: "Fra mindretall til flertall",
      value: formatPercent(data.topFinding.endShare),
      text: `Kvinneandelen blant ${data.topFinding.occupationLabel.toLowerCase()} var ${formatPercent(data.topFinding.endShare)} i ${formatPeriod(data.endPeriod)}.`,
    },
    {
      kicker: "Lavt utgangspunkt",
      value: formatPercent(data.lowStartFinding.endShare),
      text: `${data.lowStartFinding.occupationLabel} er fortsatt mannsdominert, men økte med ${formatPercent(data.lowStartFinding.changePercentagePoints)} prosentpoeng.`,
    },
    {
      kicker: "Utvalg",
      value: formatNumber(data.totalOccupations),
      text: `yrker oppfylte kravet om minst ${formatNumber(data.minimumWorkforce)} lønnstakere i begge perioder.`,
    },
  ];

  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-6xl divide-y divide-[#d8cdbb] border-y border-[#d8cdbb]">
        {findings.map((finding) => (
          <div key={finding.kicker} className="grid gap-6 py-10 md:grid-cols-[18rem_minmax(0,1fr)] md:py-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#96713d]">
                {finding.kicker}
              </p>
              <p className="mt-3 font-serif text-5xl font-black leading-none text-[#171814] sm:text-7xl">
                {finding.value}
              </p>
            </div>
            <p className="max-w-3xl font-serif text-3xl leading-tight text-[#22231f] sm:text-4xl sm:leading-tight">
              {finding.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LargeBarSection({ rows }: { rows: WomenShareSpecialRow[] }) {
  const maxChange = Math.max(...rows.map((row) => row.changePercentagePoints));

  return (
    <section className="bg-[#fbfaf7] px-5 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker="Første graf"
          title="Yrker der kvinneandelen økte mest"
          text="Målt i prosentpoeng fra fjerde kvartal 2016 til fjerde kvartal 2025. Listen viser større 4-siffer-yrker i SSBs lønnstakerstatistikk."
        />

        <div className="mt-16 space-y-8">
          {rows.map((row) => (
            <div key={row.occupationCode} className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)_8rem] lg:items-center">
              <div>
                <p className="font-serif text-2xl font-black leading-tight text-[#171814]">
                  {row.occupationLabel}
                </p>
                <p className="mt-1 text-sm text-[#777166]">
                  {formatPercent(row.startShare)} til {formatPercent(row.endShare)}
                </p>
              </div>
              <div className="h-5 bg-[#ece4d8]">
                <div
                  className="h-full bg-[#167764]"
                  style={{ width: `${Math.max(8, (row.changePercentagePoints / maxChange) * 100)}%` }}
                />
              </div>
              <p className="font-serif text-4xl font-black text-[#167764] lg:text-right">
                +{formatPercent(row.changePercentagePoints)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NarrativeBreak({ data }: { data: WomenShareSpecialData }) {
  return (
    <section className="bg-[#111715] px-5 py-24 text-[#f7f3eb] sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d3aa6c]">
            Kontrasten
          </p>
          <p className="mt-6 font-serif text-6xl font-black leading-[0.92] sm:text-8xl">
            Tallene beveger seg sakte. Men retningen er tydelig.
          </p>
        </div>
        <div className="max-w-2xl space-y-8 text-lg leading-9 text-white/72">
          <p>
            I toppen av listen ligger ikke ett samlet fagfelt, men yrker fra helse,
            teknologi, havbruk, politi, juss og ledelse. Det gjør utviklingen mindre
            som en enkel trend og mer som en bred forskyvning i hvem som går inn i
            ulike kompetanseyrker.
          </p>
          <p>
            For {data.lowStartFinding.occupationLabel.toLowerCase()} er kvinneandelen fortsatt bare{" "}
            {formatPercent(data.lowStartFinding.endShare)}. Likevel er økningen på{" "}
            {formatPercent(data.lowStartFinding.changePercentagePoints)} prosentpoeng stor nok til
            å plassere yrket høyt i utvalget.
          </p>
        </div>
      </div>
    </section>
  );
}

function SlopeSection({ rows }: { rows: WomenShareSpecialRow[] }) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker="Ny graf"
          title="Fra startpunkt til siste kvartal"
          text="Linjene viser hvor stor del av lønnstakerne som var kvinner i start- og sluttperioden. Hver linje er ett yrke."
        />
        <div className="mt-14 overflow-x-auto pb-4">
          <div className="min-w-[760px]">
            <SlopeChart rows={rows} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SlopeChart({ rows }: { rows: WomenShareSpecialRow[] }) {
  const width = 960;
  const height = 560;
  const leftX = 230;
  const rightX = 730;
  const topY = 50;
  const bottomY = 490;

  return (
    <svg className="h-auto w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Kvinneandel fra 2016K4 til 2025K4">
      <line x1={leftX} x2={leftX} y1={topY} y2={bottomY} stroke="#d8cdbb" strokeWidth="2" />
      <line x1={rightX} x2={rightX} y1={topY} y2={bottomY} stroke="#d8cdbb" strokeWidth="2" />
      <text fill="#7b7367" fontSize="18" fontWeight="700" x={leftX} y="26" textAnchor="middle">
        2016K4
      </text>
      <text fill="#7b7367" fontSize="18" fontWeight="700" x={rightX} y="26" textAnchor="middle">
        2025K4
      </text>

      {[20, 40, 60, 80].map((tick) => {
        const y = shareToY(tick, topY, bottomY);

        return (
          <g key={tick}>
            <line x1={leftX - 20} x2={rightX + 20} y1={y} y2={y} stroke="#ebe2d6" strokeWidth="1" />
            <text fill="#948a7c" fontSize="13" x={leftX - 34} y={y + 5} textAnchor="end">
              {tick} %
            </text>
          </g>
        );
      })}

      {rows.map((row, index) => {
        const startY = shareToY(row.startShare, topY, bottomY);
        const endY = shareToY(row.endShare, topY, bottomY);
        const tone = index === 0 ? "#167764" : "#b98a45";

        return (
          <g key={row.occupationCode}>
            <line x1={leftX} x2={rightX} y1={startY} y2={endY} stroke={tone} strokeLinecap="round" strokeWidth={index === 0 ? 5 : 3} />
            <circle cx={leftX} cy={startY} fill="#f7f3eb" r="7" stroke={tone} strokeWidth="3" />
            <circle cx={rightX} cy={endY} fill={tone} r="8" />
            <text fill="#23241f" fontSize="16" fontWeight={index === 0 ? "800" : "600"} x={leftX - 36} y={startY + 5} textAnchor="end">
              {row.occupationLabel}
            </text>
            <text fill="#23241f" fontSize="16" fontWeight="800" x={rightX + 36} y={endY + 5}>
              {formatPercent(row.endShare)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ContrastSection({ data }: { data: WomenShareSpecialData }) {
  const rows = [data.topFinding, data.lowStartFinding, data.largestWomenGrowth];

  return (
    <section className="bg-[#eee4d6] px-5 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="Kontraster"
          title="Tre forskjellige typer endring"
          text="Kvinneandelen kan øke fordi et yrke vokser, fordi rekrutteringen endrer seg, eller fordi et tidligere mannsdominert yrke gradvis åpner seg."
        />

        <div className="mt-16 divide-y divide-[#cfc1ad] border-y border-[#cfc1ad]">
          {rows.map((row) => (
            <div key={row.occupationCode} className="grid gap-8 py-10 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a6839]">
                  {row.occupationCode}
                </p>
                <h3 className="mt-3 font-serif text-4xl font-black leading-tight text-[#171814] sm:text-5xl">
                  {row.occupationLabel}
                </h3>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#5a554d]">
                  Antall kvinnelige lønnstakere økte fra {formatNumber(row.startWomen)} til{" "}
                  {formatNumber(row.endWomen)}, mens totalstørrelsen på yrket endret seg med{" "}
                  {formatSignedNumber(row.totalChange)}.
                </p>
              </div>
              <BeforeAfterBars row={row} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterBars({ row }: { row: WomenShareSpecialRow }) {
  return (
    <div className="space-y-7">
      <ShareBar label="2016K4" value={row.startShare} />
      <ShareBar label="2025K4" value={row.endShare} emphasis />
    </div>
  );
}

function ShareBar({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-4">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#766f65]">{label}</p>
        <p className={["font-serif text-4xl font-black", emphasis ? "text-[#167764]" : "text-[#383832]"].join(" ")}>
          {formatPercent(value)}
        </p>
      </div>
      <div className="h-6 bg-[#d8cdbb]">
        <div className={["h-full", emphasis ? "bg-[#167764]" : "bg-[#9c7b4a]"].join(" ")} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MethodSection({ data }: { data: WomenShareSpecialData }) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="border border-[#d8cdbb] bg-[#fbfaf7] p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#96713d]">
            Metode og kilder
          </p>
          <div className="mt-6 grid gap-8 text-sm leading-7 text-[#5a554d] md:grid-cols-2">
            <p>
              Analysen bruker SSB tabell {data.tableId}, «Yrkes- (4-siffernivå), kjønns- og
              aldersfordeling for lønnstakere, jobber og lønn». Vi har brukt innholdskoden
              «Antall lønnstakere», alle aldre, kvinner og begge kjønn.
            </p>
            <p>
              Kvinneandel er beregnet som kvinnelige lønnstakere delt på alle lønnstakere i
              samme yrke og periode. Rangeringen viser endring i prosentpoeng fra{" "}
              {formatPeriod(data.startPeriod)} til {formatPeriod(data.endPeriod)}. Yrker med
              færre enn {formatNumber(data.minimumWorkforce)} lønnstakere i en av periodene er
              utelatt. SSB-data sist oppdatert {formatDate(data.updated)}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#96713d]">{kicker}</p>
      <h2 className="mt-4 font-serif text-5xl font-black leading-[0.96] text-[#171814] sm:text-7xl">
        {title}
      </h2>
      <p className="mt-6 text-lg leading-8 text-[#5d5b53]">{text}</p>
    </header>
  );
}

function shareToY(share: number, topY: number, bottomY: number) {
  return bottomY - (Math.min(85, Math.max(10, share)) / 85) * (bottomY - topY);
}

function formatPercent(value: number) {
  return percentFormatter.format(value);
}

function formatNumber(value: number) {
  return numberFormatter.format(Math.round(value));
}

function formatSignedNumber(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatNumber(value)}`;
}

function formatPeriod(period: string) {
  const match = period.match(/^(\d{4})K([1-4])$/);

  if (!match) {
    return period;
  }

  return `${Number(match[2])}. kvartal ${match[1]}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "ukjent dato";
  }

  return date.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
