import { getImageProps } from "next/image";
import Link from "next/link";
import styles from "./occupation-hero.module.css";

type Breadcrumb = {
  label: string;
  href?: string;
};

type OccupationHeroProps = {
  occupationName: string;
  description: string;
  contentDescription: string;
  medianMonthlySalary?: number | null;
  averageAge?: number | null;
  salaryGrowthPercent?: number | null;
  employeeGrowthPercent?: number | null;
  salaryRank?: number | null;
  salaryGrowthRank?: number | null;
  averageBonusRank?: number | null;
  oldestAverageAgeRank?: number | null;
  youngestAverageAgeRank?: number | null;
  employeeCountRank?: number | null;
  backgroundImage?: string;
  mobileBackgroundImage?: string;
  breadcrumbs?: Breadcrumb[];
};

type RankingCardData = {
  href: string;
  icon: "medal" | "growth" | "bonus" | "age" | "workforce";
  label: string;
  rank?: number | null;
};

type MetricCardData = {
  icon: "salary" | "age" | "growth" | "workforce";
  label: string;
  tone?: "positive" | "negative";
  value: string;
};

export function OccupationHero({
  occupationName,
  description,
  contentDescription,
  medianMonthlySalary,
  averageAge,
  salaryGrowthPercent,
  employeeGrowthPercent,
  salaryRank,
  salaryGrowthRank,
  averageBonusRank,
  oldestAverageAgeRank,
  youngestAverageAgeRank,
  employeeCountRank,
  backgroundImage,
  mobileBackgroundImage,
  breadcrumbs = [
    { label: "Hjem", href: "/" },
    { label: "Yrker", href: "/yrker" },
    { label: occupationName },
  ],
}: OccupationHeroProps) {
  const metricCards = buildMetricCards({
    averageAge,
    employeeGrowthPercent,
    medianMonthlySalary,
    salaryGrowthPercent,
  });
  const allRankingCards: RankingCardData[] = [
    {
      href: "/topp-50-lonnsniva",
      icon: "medal",
      label: "Lønnsnivå",
      rank: salaryRank,
    },
    {
      href: "/topp-50-lonnsvekst",
      icon: "growth",
      label: "Lønnsvekst",
      rank: salaryGrowthRank,
    },
    {
      href: "/topp-50-gjennomsnittlig-bonus",
      icon: "bonus",
      label: "Bonus",
      rank: averageBonusRank,
    },
    {
      href: "/topp-50-eldste-snittalder",
      icon: "age",
      label: "Eldste snittalder",
      rank: oldestAverageAgeRank,
    },
    {
      href: "/topp-50-yngste-snittalder",
      icon: "age",
      label: "Yngste snittalder",
      rank: youngestAverageAgeRank,
    },
    {
      href: "/topp-50-arbeidstakere",
      icon: "workforce",
      label: "Arbeidstakere",
      rank: employeeCountRank,
    },
  ];
  const rankingCards = allRankingCards.filter((card) => formatRanking(card.rank) !== null);

  return (
    <section aria-labelledby="occupation-hero-heading" className={styles.hero}>
      <div className={styles.inner}>
        {backgroundImage ? (
          <div aria-hidden="true" className={styles.illustration}>
            <HeroBackgroundImage
              desktopSrc={backgroundImage}
              mobileSrc={mobileBackgroundImage ?? backgroundImage}
            />
          </div>
        ) : (
          <div aria-hidden="true" className={styles.visualFallback} />
        )}

        <div className={styles.imageFade} />

        <div className={styles.content}>
          <Breadcrumbs items={breadcrumbs} />

          <h1 className={styles.heading} id="occupation-hero-heading">
            <span>Lønn for </span>
            <span className={styles.occupationName}>{occupationName}</span>
          </h1>

          <div className={styles.description}>
            <p>{description}</p>
            <p>{contentDescription}</p>
          </div>

          {metricCards.length > 0 ? <MetricCards cards={metricCards} /> : null}
          {rankingCards.length > 0 ? <RankingCards cards={rankingCards} /> : null}
        </div>
      </div>
    </section>
  );
}

function MetricCards({ cards }: { cards: MetricCardData[] }) {
  return (
    <div aria-label="Nøkkeltall for yrket" className={styles.metricCards}>
      {cards.map((card) => (
        <div className={styles.metricCard} key={card.label}>
          <span aria-hidden="true" className={styles.metricIcon}>
            <MetricIcon icon={card.icon} />
          </span>
          <span className={styles.metricText}>
            <span className={styles.metricLabel}>{card.label}</span>
            <strong
              className={[
                styles.metricValue,
                card.tone === "positive" ? styles.metricValuePositive : "",
                card.tone === "negative" ? styles.metricValueNegative : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {card.value}
            </strong>
          </span>
        </div>
      ))}
    </div>
  );
}

function HeroBackgroundImage({
  desktopSrc,
  mobileSrc,
}: {
  desktopSrc: string;
  mobileSrc: string;
}) {
  const common = {
    alt: "",
    fetchPriority: "high" as const,
    sizes: "100vw",
  };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    height: 887,
    quality: 85,
    src: desktopSrc,
    width: 1774,
  });
  const {
    props: { srcSet: mobileSrcSet, ...imageProps },
  } = getImageProps({
    ...common,
    height: 1536,
    quality: 82,
    src: mobileSrc,
    width: 1024,
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
      <img {...imageProps} alt="" className={styles.illustrationImage} />
    </picture>
  );
}

function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Brødsmulesti" className={styles.breadcrumbs}>
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {index === 0 ? <HomeIcon /> : null}
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
            {index < items.length - 1 ? <ChevronIcon /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function RankingCards({ cards }: { cards: RankingCardData[] }) {
  return (
    <div aria-label="Plassering blant yrker" className={styles.rankingCards}>
      {cards.map((card) => (
        <Link
          aria-label={`${formatRanking(card.rank)} i ${card.label.toLowerCase()}. Se topp 50-listen.`}
          className={styles.rankingCard}
          href={card.href}
          key={card.label}
        >
          <span aria-hidden="true" className={styles.rankingIcon}>
            <RankingIcon icon={card.icon} />
          </span>
          <span className={styles.rankingValue}>{formatRanking(card.rank)}</span>
          <span aria-hidden="true" className={styles.rankingSeparator}>·</span>
          <span className={styles.rankingLabel}>{card.label}</span>
        </Link>
      ))}
    </div>
  );
}

function buildMetricCards({
  averageAge,
  employeeGrowthPercent,
  medianMonthlySalary,
  salaryGrowthPercent,
}: {
  averageAge?: number | null;
  employeeGrowthPercent?: number | null;
  medianMonthlySalary?: number | null;
  salaryGrowthPercent?: number | null;
}) {
  const cards: Array<MetricCardData | null> = [
    isFiniteNumber(medianMonthlySalary)
      ? {
          icon: "salary",
          label: "Månedslønn",
          value: `${medianMonthlySalary.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`,
        }
      : null,
    isFiniteNumber(averageAge)
      ? {
          icon: "age",
          label: "Snittalder",
          value: `${averageAge.toLocaleString("nb-NO", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} år`,
        }
      : null,
    isFiniteNumber(salaryGrowthPercent)
      ? {
          icon: "growth",
          label: "Lønnsvekst",
          tone: getGrowthTone(salaryGrowthPercent),
          value: `${salaryGrowthPercent > 0 ? "+" : ""}${salaryGrowthPercent.toLocaleString("nb-NO", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} %`,
        }
      : null,
    isFiniteNumber(employeeGrowthPercent)
      ? {
          icon: "workforce",
          label: "Arbeidstaker",
          tone: getGrowthTone(employeeGrowthPercent),
          value: `${employeeGrowthPercent > 0 ? "+" : ""}${employeeGrowthPercent.toLocaleString("nb-NO", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} %`,
        }
      : null,
  ];

  return cards.filter((card): card is MetricCardData => Boolean(card));
}

function isFiniteNumber(value?: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function getGrowthTone(value: number): MetricCardData["tone"] {
  if (value > 0) {
    return "positive";
  }

  if (value < 0) {
    return "negative";
  }

  return undefined;
}

export function formatRanking(rank?: number | null) {
  if (!rank || rank < 1 || !Number.isFinite(rank)) {
    return null;
  }

  if (rank <= 10) {
    return "Topp 10";
  }

  if (rank <= 50) {
    return "Topp 50";
  }

  return null;
}

function RankingIcon({ icon }: { icon: RankingCardData["icon"] }) {
  const commonProps = {
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
    viewBox: "0 0 24 24",
  };

  if (icon === "medal") {
    return (
      <svg {...commonProps}>
        <path d="m8 3 4 6 4-6M7 3h10" />
        <circle cx="12" cy="15" r="5" />
        <path d="m12 12 1 2 2 .3-1.5 1.5.4 2.2-1.9-1-1.9 1 .4-2.2L9 14.3l2-.3 1-2Z" />
      </svg>
    );
  }

  if (icon === "bonus") {
    return (
      <svg {...commonProps}>
        <path d="M7 7.5h10a3 3 0 0 1 3 3v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5H17" />
        <path d="M15.5 11.5H21v4h-5.5a2 2 0 1 1 0-4Z" />
      </svg>
    );
  }

  if (icon === "age") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (icon === "workforce") {
    return (
      <svg {...commonProps}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M3.5 19c.5-3.4 2.5-5.2 5.5-5.2s5 1.8 5.5 5.2M14.5 14.2c3.3-.8 5.5.8 6 3.8" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="m3 17 6-6 4 4 7-8" />
      <path d="M15 7h5v5" />
    </svg>
  );
}

function MetricIcon({ icon }: { icon: MetricCardData["icon"] }) {
  const commonProps = {
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
    viewBox: "0 0 24 24",
  };

  if (icon === "salary") {
    return (
      <svg {...commonProps}>
        <path d="M4 7.5h14.5A1.5 1.5 0 0 1 20 9v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17V7.5Z" />
        <path d="M4 7.5 16 4v3.5M16 11h5v4h-5a2 2 0 1 1 0-4Z" />
      </svg>
    );
  }

  if (icon === "age") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (icon === "workforce") {
    return (
      <svg {...commonProps}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 18c.5-3.2 2.4-4.8 5.5-4.8s5 1.6 5.5 4.8M16 12h5M18.5 9.5V14.5" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="m4 17 5-5 4 3 7-8" />
      <path d="M15 7h5v5" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m3 11 9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 9.5V21h13V9.5M9.5 21v-6h5v6" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
      <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
