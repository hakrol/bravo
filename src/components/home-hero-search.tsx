"use client";

import Image from "next/image";
import Link from "next/link";
import type { OccupationSalaryRow } from "@/components/occupation-salary-overview";
import type { OccupationCardStats } from "@/lib/occupation-card-stats";
import styles from "./home-hero-search.module.css";

type HomeHeroSearchProps = {
  occupationCardStatsByCode: Record<string, OccupationCardStats>;
  periodLabel?: string;
  rows: OccupationSalaryRow[];
};

type HomeOccupationSearchFieldProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

const currencyFormatter = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });

const occupationImages = {
  politicians: "/images/hero-occupations/politikere.webp",
  electricians: "/images/hero-occupations/elektrikere.webp",
  specialists: "/images/hero-occupations/legespesialister.webp",
  pilots: "/images/hero-occupations/flygere.webp",
};

export function HomeHeroSearch({
  occupationCardStatsByCode,
  periodLabel,
  rows,
}: HomeHeroSearchProps) {
  const featuredRow = findFeaturedRow(rows);
  const featuredStats = featuredRow
    ? occupationCardStatsByCode[featuredRow.occupationCode]
    : undefined;
  const occupationCount = rows.filter((row) => row.medianAll !== undefined).length;
  const salary = featuredRow?.medianAll;
  const salaryGrowth = featuredStats?.salaryGrowthPercent;
  const averageAge = featuredStats?.averageAge;
  const womenSalaryShare = getWomenSalaryShare(featuredRow);
  const currentPeriod = periodLabel ?? "siste tilgjengelige periode";

  return (
    <section aria-labelledby="home-hero-heading" className={styles.heroSection}>
      <div className={styles.heroInner}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span aria-hidden="true" className={styles.statusDot} />
            <span>{occupationCount} yrker</span>
            <span aria-hidden="true" className={styles.badgeDivider} />
            <span>Oppdatert med tall for {currentPeriod}</span>
          </div>

          <h1 className={styles.heading} id="home-hero-heading">
            Hva tjener folk
            <span>i ditt yrke?</span>
          </h1>

          <p className={styles.description}>
            Sammenlign lønn, lønnsutvikling, kjønnsforskjeller og arbeidsmarkedstrender på
            tvers av {occupationCount} yrker i Norge.
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/yrker">
              Alle yrker
              <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryAction} href="/lonnsjekk">
              Lønnsjekk
            </Link>
          </div>
        </div>

        <HeroVisualization
          averageAge={averageAge}
          salary={salary}
          salaryGrowth={salaryGrowth}
          womenSalaryShare={womenSalaryShare}
        />

        <div className={styles.supportingContent}>
          <div className={styles.benefits}>
            <Benefit icon="trend">Sammenlign lønn og utvikling</Benefit>
            <Benefit icon="spark">Enkelt å utforske yrker</Benefit>
          </div>

          <div className={styles.trust}>
            <ShieldIcon />
            <p>
              <strong>Pålitelig. Uavhengig. Datadrevet.</strong>
              <span>Tall fra SSB, NAV og offentlige kilder.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeOccupationSearchField({
  query,
  onQueryChange,
}: HomeOccupationSearchFieldProps) {
  return (
    <div className={`${styles.searchWrap} ${styles.directorySearch}`} id="yrke-sok">
      <label htmlFor="occupation-search">
        <span className="sr-only">Søk etter yrke</span>
        <span className={styles.searchField}>
          <SearchIcon className={styles.searchIcon} />
          <input
            id="occupation-search"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Søk etter yrke, for eksempel regnskapsfører"
            type="search"
            value={query}
          />
        </span>
      </label>
    </div>
  );
}

function HeroVisualization({
  averageAge,
  salary,
  salaryGrowth,
  womenSalaryShare,
}: {
  averageAge?: number;
  salary?: number;
  salaryGrowth?: number;
  womenSalaryShare?: number;
}) {
  const share = Math.round(womenSalaryShare ?? 89);

  return (
    <div aria-label="Eksempler på lønnsinnsikt" className={styles.visualization}>
      <div aria-hidden="true" className={styles.visualBackdrop} />
      <div aria-hidden="true" className={styles.dotPattern} />

      <OccupationImageCard
        alt="En norsk politisk sal med talerstol og representantplasser"
        className={styles.politicians}
        label="Politikere"
        priority
        src={occupationImages.politicians}
      />
      <OccupationImageCard
        alt="Sikringsskap og verktøy i et elektrisk verksted"
        className={styles.electricians}
        label="Elektrikere"
        src={occupationImages.electricians}
      />
      <OccupationImageCard
        alt="Radiologirom med MR-maskin og diagnostiske skjermer"
        className={styles.specialists}
        label="Legespesialister"
        src={occupationImages.specialists}
      />
      <OccupationImageCard
        alt="Passasjerfly på en norsk flyplass"
        className={styles.pilots}
        label="Flygere"
        src={occupationImages.pilots}
      />

      <article className={`${styles.statCard} ${styles.salaryCard}`}>
        <p className={styles.statLabel}>Median månedslønn</p>
        <p className={styles.salaryValue}>{formatSalary(salary)}</p>
        <div className={styles.salaryGrowthRow}>
          <div>
            <span>Lønnsvekst (1 år)</span>
            <strong>{formatPercent(salaryGrowth)}</strong>
          </div>
          <SalarySparkline />
        </div>
      </article>

      <article className={`${styles.statCard} ${styles.genderCard}`}>
        <p className={styles.statLabel}>Lønnsforskjell</p>
        <p className={styles.genderLead}>
          Kvinner tjener <strong>{share} %</strong>
          <span>av menns lønn</span>
        </p>
        <div className={styles.barRows} aria-label={`Kvinner tjener ${share} prosent av menns lønn`}>
          <BarRow label="Menn" value={100} />
          <BarRow label="Kvinner" value={share} muted />
        </div>
        <Link href="/lonnsforskjell-mellom-kvinner-og-menn">
          Se alle kjønnsforskjeller <span aria-hidden="true">→</span>
        </Link>
      </article>

      <article className={`${styles.statCard} ${styles.ageCard}`}>
        <div>
          <p className={styles.statLabel}>Snittalder</p>
          <p className={styles.ageValue}>{averageAge ? `${averageAge} år` : "41 år"}</p>
        </div>
        <AgeBars />
      </article>
    </div>
  );
}

function OccupationImageCard({
  alt,
  className,
  label,
  priority = false,
  src,
}: {
  alt: string;
  className: string;
  label: string;
  priority?: boolean;
  src: string;
}) {
  return (
    <figure className={`${styles.imageCard} ${className}`}>
      <Image
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 767px) 42vw, (max-width: 1099px) 18vw, 190px"
        src={src}
      />
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function Benefit({ children, icon }: { children: React.ReactNode; icon: BenefitIconName }) {
  return (
    <div className={styles.benefit}>
      <BenefitIcon name={icon} />
      <span>{children}</span>
    </div>
  );
}

type BenefitIconName = "trend" | "spark";

function BenefitIcon({ name }: { name: BenefitIconName }) {
  const paths = {
    trend: <path d="m4 17 5-5 3 3 7-8m-4 0h4v4" />,
    spark: <path d="M12 3c.8 4.4 3.6 7.2 8 8-4.4.8-7.2 3.6-8 8-.8-4.4-3.6-7.2-8-8 4.4-.8 7.2-3.6 8-8Z" />,
  };

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
        {paths[name]}
      </g>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className={styles.shield} fill="none" viewBox="0 0 32 36">
      <path d="M16 1.5 29 6v9.3c0 8.5-5.5 15.7-13 18.8C8.5 31 3 23.8 3 15.3V6l13-4.5Z" fill="currentColor" />
      <path d="m10.2 17.8 3.6 3.5 7.9-8" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="m20 20-4.5-4.5m2-5A7 7 0 1 1 3.5 10.5a7 7 0 0 1 14 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function SalarySparkline() {
  return (
    <svg aria-hidden="true" className={styles.sparkline} fill="none" viewBox="0 0 128 56">
      <path d="M2 50c13-7 20-9 31-6 12 3 17-7 29-10 12-3 17 3 26-9 9-12 17-8 26-17 5-5 8-6 12-7v55H2V50Z" fill="url(#salary-fill)" />
      <path d="M2 50c13-7 20-9 31-6 12 3 17-7 29-10 12-3 17 3 26-9 9-12 17-8 26-17 5-5 8-6 12-7" stroke="#17643a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <defs><linearGradient id="salary-fill" x1="64" x2="64" y1="0" y2="56"><stop stopColor="#5f9c72" stopOpacity=".24" /><stop offset="1" stopColor="#5f9c72" stopOpacity="0" /></linearGradient></defs>
    </svg>
  );
}

function BarRow({ label, muted = false, value }: { label: string; muted?: boolean; value: number }) {
  return (
    <div className={styles.barRow}>
      <span>{label}</span>
      <span className={styles.barTrack}><span className={muted ? styles.barMuted : undefined} style={{ width: `${Math.min(value, 100)}%` }} /></span>
      <strong>{value} %</strong>
    </div>
  );
}

function AgeBars() {
  const bars = [8, 12, 17, 22, 30, 38, 50, 64, 78, 58, 42, 29, 18];
  return (
    <div aria-hidden="true" className={styles.ageBars}>
      {bars.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
    </div>
  );
}

function findFeaturedRow(rows: OccupationSalaryRow[]) {
  return rows.find((row) => normalizeText(row.occupationLabel).includes("politikere")) ?? rows[0];
}

function getWomenSalaryShare(row?: OccupationSalaryRow) {
  if (!row?.medianWomen || !row.medianMen) return undefined;
  return (row.medianWomen / row.medianMen) * 100;
}

function normalizeText(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function formatSalary(value?: number) {
  return value === undefined ? "Se siste tall" : `${currencyFormatter.format(value)} kr`;
}

function formatPercent(value?: number) {
  if (value === undefined) return "Se utvikling";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("nb-NO", { maximumFractionDigits: 1 })} %`;
}
