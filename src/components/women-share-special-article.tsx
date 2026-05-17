import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { QuarterlyWomenShareChart } from "@/components/quarterly-women-share-chart";
import { WomenShareSpecialNav } from "@/components/women-share-special-nav";
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

const introImageSrc =
  "/spesial/i-disse-yrkene-oker-kvinneandelen-raskest/spesial-kvinneandel-seksjon-1-2.png";
const introImagePath = path.join(process.cwd(), "public", introImageSrc);
const aquacultureImageSrc =
  "/spesial/i-disse-yrkene-oker-kvinneandelen-raskest/spesial-kvinneandel-seksjon-2-1.png";
const aquacultureImagePath = path.join(process.cwd(), "public", aquacultureImageSrc);

export function WomenShareSpecialArticle({ data }: WomenShareSpecialArticleProps) {
  return (
    <main className="min-h-screen bg-[#f7f3eb] text-[#151614]">
      <WomenShareSpecialNav title="I disse yrkene øker kvinneandelen raskest" />
      <Hero />
      <article>
        <IntroSection data={data} />
        <FindingsSection data={data} />
        <LargeBarSection rows={data.rows} />
        {existsSync(aquacultureImagePath) ? <AquacultureImageSection /> : null}
        <NarrativeBreak data={data} />
        <MethodSection data={data} />
      </article>
    </main>
  );
}

function Hero() {
  return (
    <section
      className="relative isolate min-h-[92svh] overflow-hidden bg-[#090c0d] text-white"
      id="special-hero"
    >
      <Image
        alt=""
        className="absolute inset-0 -z-30 h-full w-full object-cover opacity-78 [object-position:61%_center] min-[390px]:[object-position:64%_center] sm:opacity-74 sm:[object-position:66%_center] lg:opacity-82"
        fill
        priority
        sizes="100vw"
        src="/spesial/i-disse-yrkene-oker-kvinneandelen-raskest/hero-kvinneandel-vokser-raskest.png"
      />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_22%,rgba(94,188,157,0.18),transparent_30%),linear-gradient(90deg,#070909_0%,rgba(7,9,9,0.88)_38%,rgba(7,9,9,0.30)_74%,rgba(7,9,9,0.52)_100%),linear-gradient(180deg,rgba(7,9,9,0.30)_0%,rgba(7,9,9,0.24)_34%,rgba(7,9,9,0.88)_78%,#070909_100%)] sm:bg-[radial-gradient(circle_at_76%_30%,rgba(94,188,157,0.20),transparent_28%),linear-gradient(90deg,#070909_0%,rgba(7,9,9,0.94)_22%,rgba(7,9,9,0.72)_48%,rgba(7,9,9,0.20)_78%,rgba(7,9,9,0.58)_100%),linear-gradient(180deg,rgba(7,9,9,0.38)_0%,rgba(7,9,9,0.08)_42%,#070909_100%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:72px_72px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(180deg,transparent,#090c0d_72%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[92svh] max-w-[1500px] px-5 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-24 lg:px-12">
        <div className="grid items-end gap-8 pb-8 pt-28 sm:items-center sm:gap-14 sm:py-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(360px,0.5fr)] lg:py-20">
          <div className="max-w-5xl">
            <h1 className="max-w-[22rem] font-serif text-6xl font-black leading-[0.86] tracking-normal text-[#fff8ed] min-[390px]:text-7xl sm:hidden">
              <span className="block">I disse</span>
              <span className="block">yrkene øker</span>
              <span className="block">kvinneandelen</span>
              <span className="block">raskest</span>
            </h1>
            <h1 className="hidden max-w-5xl font-serif font-black leading-[0.86] tracking-normal text-[#fff8ed] sm:block sm:text-[clamp(4.6rem,9vw,9.6rem)]">
              I disse yrkene øker kvinneandelen raskest
            </h1>
            <p className="mt-7 max-w-[21.5rem] text-[1.02rem] leading-7 text-white/84 min-[390px]:max-w-[23rem] min-[390px]:text-lg min-[390px]:leading-8 sm:mt-8 sm:max-w-3xl sm:text-2xl sm:leading-10 sm:text-white/82">
              Kvinner har tatt en større plass i flere store yrker som lenge var dominert
              av menn. Øverst ligger allmennpraktiserende leger, fulgt av blant annet
              sivilingeniører, havbruksarbeidere og politibetjenter.
            </p>
            <p className="mt-6 font-serif text-6xl font-black leading-none text-[#f2c079]/95 min-[390px]:text-7xl sm:hidden">
              +8,2%
            </p>
          </div>

          <HeroDataSignal />
        </div>
      </div>
    </section>
  );
}

function HeroDataSignal() {
  return (
    <div className="relative hidden min-h-[36rem] lg:block" aria-hidden="true">
      <div className="absolute bottom-12 right-0 max-w-[18rem] text-right">
        <p className="font-serif text-7xl font-black leading-none text-[#f2c079]/90 sm:text-8xl">
          +8,2%
        </p>
      </div>
    </div>
  );
}

function IntroSection({ data }: { data: WomenShareSpecialData }) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-4xl">
          <p className="font-serif text-3xl leading-tight text-[#181917] sm:text-5xl sm:leading-tight">
            Kvinneandelen øker ikke bare i yrker der kvinner allerede er i flertall.
            Flere store yrker som lenge har hatt mange menn, er i endring.
          </p>
          <div className="mt-12 max-w-3xl space-y-8 text-lg leading-9 text-[#4b4d47]">
            <p>
              Lønnsinnsikt har sammenlignet kvinneandelen i norske yrker fra{" "}
              {formatPeriod(data.startPeriod)} til {formatPeriod(data.endPeriod)}. For å få en
              ryddig liste har vi bare tatt med yrker med minst {formatNumber(data.minimumWorkforce)}{" "}
              lønnstakere i begge perioder.
            </p>
            <p>
              Noen yrker har nå flere kvinner enn menn. Andre er fortsatt mannsdominerte,
              men har fått en klart større andel kvinner på få år.
            </p>
          </div>
        </div>
        {existsSync(introImagePath) ? <IntroImageFigure /> : null}
      </div>
    </section>
  );
}

function IntroImageFigure() {
  return (
    <figure className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,760px)_minmax(240px,0.34fr)] lg:items-end">
      <div className="relative isolate w-full max-w-[760px] overflow-hidden bg-[#e8decf] p-2.5 shadow-[18px_18px_0_#d6c4aa] sm:p-3">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(22,119,100,0.16),transparent_30%),linear-gradient(135deg,#f6efe4,#d9c7ac)]"
          aria-hidden="true"
        />
        <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full border border-[#96713d]/35" aria-hidden="true" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-[#167764]/10" aria-hidden="true" />
        <Image
          alt="Kvinnelig lege skriver notater under en pasientsamtale."
          className="relative aspect-[5/4] w-full object-cover"
          height={800}
          sizes="(min-width: 1024px) 760px, 100vw"
          src={introImageSrc}
          width={1000}
        />
      </div>

      <figcaption className="border-l border-[#d8cdbb] pl-5 text-sm leading-7 text-[#68645b]">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#96713d]">
          I toppen
        </p>
        <p className="mt-4">
          Allmennpraktiserende leger er yrket i utvalget der kvinneandelen har økt mest.
          I 2025 var 57,4 prosent av lønnstakerne kvinner.
        </p>
      </figcaption>
    </figure>
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
          kicker=""
          title="Yrker der kvinneandelen økte mest"
          text="Målt i prosentpoeng fra fjerde kvartal 2016 til fjerde kvartal 2025."
        />

        <div className="mt-16 space-y-8">
          {rows.map((row) => (
            <div key={row.occupationCode} className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)_8rem] lg:items-center">
              <div>
                {row.href ? (
                  <Link
                    className="font-serif text-2xl font-black leading-tight text-[#171814] underline decoration-[#167764]/35 underline-offset-4 transition hover:text-[#167764] hover:decoration-[#167764]"
                    href={row.href}
                  >
                    {row.occupationLabel}
                  </Link>
                ) : (
                  <p className="font-serif text-2xl font-black leading-tight text-[#171814]">
                    {row.occupationLabel}
                  </p>
                )}
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

function AquacultureImageSection() {
  return (
    <section className="bg-[#fbfaf7] px-5 pb-24 pt-4 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-3xl leading-tight text-[#181917] sm:text-5xl">
            Blant havbruksarbeidere har kvinneandelen økt betraktelig, selv om yrket
            fortsatt har flest menn.
          </p>
        </div>

        <figure className="mx-auto mt-14 max-w-[1000px]">
          <Image
            alt="Arbeid i havbruk, brukt som illustrasjon for økt kvinneandel blant havbruksarbeidere."
            className="aspect-[5/4] w-full object-cover"
            height={800}
            sizes="(min-width: 1024px) 1000px, 100vw"
            src={aquacultureImageSrc}
            width={1000}
          />
        </figure>
      </div>
    </section>
  );
}

function NarrativeBreak({ data }: { data: WomenShareSpecialData }) {
  return (
    <section className="bg-[#111715] px-5 py-20 text-[#f7f3eb] sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-end">
          <h2 className="max-w-4xl font-serif text-4xl font-black leading-[0.98] sm:text-6xl">
            Kvinneandelen øker kvartal for kvartal
          </h2>
          <div className="max-w-2xl space-y-6 text-lg leading-9 text-white/72">
          <p>
            Havbruksarbeidere skiller seg tydeligst ut. Kvinneandelen er fortsatt lav,
            men har økt fra 13,8 til 21,3 prosent.
          </p>
          <p>
            Blant allmennpraktiserende leger har kvinner gått fra knapt halvparten til
            klart flertall i samme periode.
          </p>
          </div>
        </div>

        <div className="mt-16 overflow-x-auto pb-4">
          <div className="min-w-[980px]">
            <QuarterlyWomenShareChart series={data.timeSeries} />
          </div>
        </div>
      </div>
    </section>
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
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#96713d]">
          {kicker}
        </p>
      ) : null}
      <h2 className={["font-serif text-5xl font-black leading-[0.96] text-[#171814] sm:text-7xl", kicker ? "mt-4" : ""].join(" ")}>
        {title}
      </h2>
      <p className="mt-6 text-lg leading-8 text-[#5d5b53]">{text}</p>
    </header>
  );
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
