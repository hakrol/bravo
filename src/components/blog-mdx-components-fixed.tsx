import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { Fragment } from "react";
import { BlogChart } from "@/components/blog-chart";
import {
  AutomatikerGenderSalaryCards,
  AutomatikerSalaryBubbleChart,
  AutomatikerSalaryDevelopmentChart,
  AutomatikerSalaryEditorialChart,
} from "@/components/blog-automatiker-salary-chart";
import {
  BartenderGenderSalaryCards,
  BartenderRealSalaryDevelopmentChart,
  BartenderSalaryBubbleChart,
  BartenderSalaryDevelopmentChart,
  BartenderSalaryDistributionChart,
} from "@/components/blog-bartender-salary-chart";
import {
  CarMechanicGenderSalaryCards,
  CarMechanicSalaryBubbleChart,
  CarMechanicSalaryEditorialChart,
} from "@/components/blog-car-mechanic-salary-chart";
import {
  ConcreteWorkerGenderSalaryCards,
  ConcreteWorkerSalaryBubbleChart,
  ConcreteWorkerSalaryEditorialChart,
} from "@/components/blog-concrete-worker-salary-chart";
import {
  BuildingWorkerFamiliesSalaryChart,
  BuildingWorkerFamiliesSalaryDevelopmentChart,
} from "@/components/blog-building-workers-salary-chart";
import {
  BussjaforerTrikkeforereGenderSalaryCards,
  BussjaforerTrikkeforereSalaryBubbleChart,
  BussjaforerTrikkeforereSalaryDevelopmentChart,
} from "@/components/blog-bussjaforer-trikkeforere-salary-chart";
import {
  BlogElectricianSalaryChart,
  BlogPsychologistSalaryChart,
  DoctorSalaryBubbleChart,
  HealthSalaryBubbleChart,
  NorwayOccupationSalary2025Chart,
  SalaryJumpBarChart,
  SalaryLevelStackedChart,
  SsbSalaryExampleChart,
} from "@/components/blog-chart-examples";
import { DoctorSalaryEditorialChart } from "@/components/blog-doctor-salary-chart";
import { ElectricianSalaryBubbleChart, ElectricianSalaryEditorialChart } from "@/components/blog-electrician-salary-chart";
import {
  EnergyInstallerGenderSalaryCards,
  EnergyInstallerSalaryBubbleChart,
  EnergyInstallerSalaryDevelopmentChart,
  EnergyInstallerSalaryEditorialChart,
} from "@/components/blog-energy-installer-salary-chart";
import {
  ErgoterapeutFysioterapeutSalaryBubbleChart,
  ErgoterapeutFysioterapeutSalaryDevelopmentChart,
  ErgoterapeutFysioterapeutSalaryEditorialChart,
  ErgoterapeutGenderSalaryCards,
  FysioterapeutGenderSalaryCards,
} from "@/components/blog-ergoterapeut-fysioterapeut-salary-chart";
import { FirefighterSalaryBubbleChart, FirefighterSalaryEditorialChart } from "@/components/blog-firefighter-salary-chart";
import { BlogFAQ, BlogFAQItem } from "@/components/blog-faq";
import {
  FortrykkereGenderSalaryCards,
  FortrykkereSalaryDevelopmentChart,
  FortrykkereSalaryEditorialChart,
} from "@/components/blog-fortrykkere-salary-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  GlassWorkerGenderSalaryCards,
  GlassWorkerSalaryBubbleChart,
  GlassWorkerSalaryEditorialChart,
} from "@/components/blog-glass-worker-salary-chart";
import { BlogHandverkerSalaryChart } from "@/components/blog-handverker-salary-chart";
import { BlogLonnsjekkCallout } from "@/components/blog-lonnsjekk-callout";
import {
  NorwayAverageSalaryDevelopmentChart,
  NorwayRealSalaryGrowthChart,
  NorwayTopOccupationSalaryGrowthChart,
  NorwayTopOccupationSalaryGrowthTable,
} from "@/components/blog-average-salary-growth-chart";
import {
  IntensivsykepleierGenderSalaryCards,
  IntensivsykepleierSalaryBubbleChart,
  IntensivsykepleierSalaryDevelopmentChart,
} from "@/components/blog-intensivsykepleier-salary-chart";
import {
  KonduktorGenderSalaryCards,
  KonduktorSalaryDevelopmentChart,
  KonduktorSalaryEditorialChart,
} from "@/components/blog-konduktor-salary-chart";
import { BlogMdxImage } from "@/components/blog-mdx-image";
import { LowestPaidOccupationsBubbleChart } from "@/components/blog-lowest-paid-occupations-chart";
import { MillionSalaryGrowthChart } from "@/components/blog-million-salary-chart";
import {
  NorwayCommonOccupationsChart,
  NorwayCommonOccupationsSalaryGrowthChart,
} from "@/components/blog-norway-common-occupations-chart";
import { MalerGenderSalaryCards, MalerSalaryBubbleChart, MalerSalaryDevelopmentChart } from "@/components/blog-maler-salary-chart";
import { LegalSalaryDevelopmentChart } from "@/components/blog-legal-salary-chart";
import { BlogOccupationSalaryTable } from "@/components/blog-occupation-salary-table";
import { TopOvertimePay2025Chart } from "@/components/blog-overtime-ranking-chart";
import { PilotSalaryDevelopmentChart, PilotSalaryEditorialChart } from "@/components/blog-pilot-salary-chart";
import { BlogSalaryDevelopmentChart } from "@/components/blog-salary-development-chart";
import { TopSalaryGrowth2024To2025Chart } from "@/components/blog-salary-growth-ranking-chart";
import {
  ServitorGenderSalaryCards,
  ServitorSalaryBubbleChart,
  ServitorSalaryDevelopmentChart,
} from "@/components/blog-servitor-salary-chart";
import { PoliceSalaryBubbleChart, PoliceSalaryEditorialChart } from "@/components/blog-police-salary-chart";
import {
  RorleggerGenderSalaryCards,
  RorleggerSalaryBubbleChart,
  RorleggerSalaryDevelopmentChart,
  RorleggerSalaryEditorialChart,
} from "@/components/blog-rorlegger-salary-chart";
import { SnekkerSalaryBubbleChart, SnekkerSalaryEditorialChart } from "@/components/blog-snekker-salary-chart";
import {
  StoreManagerAgeEditorialChart,
  StoreManagerGenderGapEditorialChart,
  StoreManagerGenderSalaryCards,
  StoreManagerSalaryBubbleChart,
  StoreManagerSalaryDevelopmentChart,
  StoreManagerSalaryEditorialChart,
} from "@/components/blog-store-manager-salary-chart";
import { SurgeonSalaryBubbleChart, SurgeonSalaryEditorialChart } from "@/components/blog-surgeon-salary-chart";
import { BlogTableOfContents } from "@/components/blog-table-of-contents";
import {
  TopHandverkerGenderSalaryCards,
  TopHandverkerSalaryEditorialChart,
} from "@/components/blog-top-handverker-salary-chart";
import {
  TopApprenticeGenderSalaryCards,
  TopApprenticeSalaryEditorialChart,
} from "@/components/blog-top-apprentice-salary-chart";
import {
  BlogTeacherHourlySalaryChart,
  BlogTeacherSalaryChart,
  TeacherLeaderGenderSalaryCards,
  TeacherLeaderSalaryDevelopmentChart,
  TeacherSalaryBubbleChart,
} from "@/components/blog-teacher-salary-chart";
import {
  VernepleierGenderSalaryCards,
  VernepleierSalaryBubbleChart,
  VernepleierSalaryDevelopmentChart,
} from "@/components/blog-vernepleier-salary-chart";
import type { BlogTableOfContentsItem } from "@/lib/blog";

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9æøå\s-]/gi, "")
    .replace(/[æÆ]/g, "ae")
    .replace(/[øØ]/g, "o")
    .replace(/[åÅ]/g, "a")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildBlogMdxComponentsFixed(tableOfContents: BlogTableOfContentsItem[]): MDXComponents {
  let hasRenderedTableOfContents = false;

  return {
    a: ({ href = "", children, ...props }) => {
      if (href.startsWith("/")) {
        return (
          <Link className="font-semibold text-[var(--primary-strong)] underline" href={href} {...props}>
            {children}
          </Link>
        );
      }

      return (
        <a
          className="font-semibold text-[var(--primary-strong)] underline"
          href={href}
          rel="noreferrer"
          target="_blank"
          {...props}
        >
          {children}
        </a>
      );
    },
    h2: ({ children, ...props }) => {
      const text = typeof children === "string" ? children : "";
      const id = props.id ?? (text ? slugifyHeading(text) : undefined);
      const shouldRenderTableOfContents = !hasRenderedTableOfContents && tableOfContents.length > 0;

      hasRenderedTableOfContents = true;

      return (
        <Fragment>
          {shouldRenderTableOfContents ? <BlogTableOfContents items={tableOfContents} /> : null}
          <h2 id={id} {...props}>
            {children}
          </h2>
        </Fragment>
      );
    },
    h3: ({ children, ...props }) => {
      const text = typeof children === "string" ? children : "";
      const id = props.id ?? (text ? slugifyHeading(text) : undefined);

      return (
        <h3 id={id} {...props}>
          {children}
        </h3>
      );
    },
    img: BlogMdxImage,
    Example: ({ children, title, ...props }) => (
      <div className="blog-example" {...props}>
        {title ? <p className="blog-example-title">{title}</p> : null}
        <div className="blog-example-body">{children}</div>
      </div>
    ),
    ToolCallout: ({ title, description, href, cta, ...props }) => {
      void title;
      void description;
      void href;
      void cta;

      return <BlogLonnsjekkCallout {...props} />;
    },
    FAQ: BlogFAQ,
    FAQItem: BlogFAQItem,
    Table: ({ children, ...props }) => (
      <div className="blog-table-wrap">
        <table className="blog-table" {...props}>
          {children}
        </table>
      </div>
    ),
    TableHead: ({ children, ...props }) => (
      <thead className="blog-table-head" {...props}>
        {children}
      </thead>
    ),
    TableBody: ({ children, ...props }) => (
      <tbody className="blog-table-body" {...props}>
        {children}
      </tbody>
    ),
    TableRow: ({ children, ...props }) => (
      <tr className="blog-table-row" {...props}>
        {children}
      </tr>
    ),
    TableHeader: ({ children, ...props }) => (
      <th className="blog-table-header" {...props}>
        {children}
      </th>
    ),
    TableCell: ({ children, ...props }) => (
      <td className="blog-table-cell" {...props}>
        {children}
      </td>
    ),
    BlogChart,
    AutomatikerGenderSalaryCards,
    AutomatikerSalaryBubbleChart,
    AutomatikerSalaryDevelopmentChart,
    AutomatikerSalaryEditorialChart,
    BartenderGenderSalaryCards,
    BartenderRealSalaryDevelopmentChart,
    BartenderSalaryBubbleChart,
    BartenderSalaryDevelopmentChart,
    BartenderSalaryDistributionChart,
    BuildingWorkerFamiliesSalaryChart,
    BuildingWorkerFamiliesSalaryDevelopmentChart,
    CarMechanicGenderSalaryCards,
    CarMechanicSalaryBubbleChart,
    CarMechanicSalaryEditorialChart,
    ConcreteWorkerGenderSalaryCards,
    ConcreteWorkerSalaryBubbleChart,
    ConcreteWorkerSalaryEditorialChart,
    BlogElectricianSalaryChart,
    BussjaforerTrikkeforereGenderSalaryCards,
    BussjaforerTrikkeforereSalaryBubbleChart,
    BussjaforerTrikkeforereSalaryDevelopmentChart,
    ElectricianSalaryBubbleChart,
    ElectricianSalaryEditorialChart,
    EnergyInstallerGenderSalaryCards,
    EnergyInstallerSalaryBubbleChart,
    EnergyInstallerSalaryDevelopmentChart,
    EnergyInstallerSalaryEditorialChart,
    ErgoterapeutFysioterapeutSalaryBubbleChart,
    ErgoterapeutFysioterapeutSalaryDevelopmentChart,
    ErgoterapeutFysioterapeutSalaryEditorialChart,
    ErgoterapeutGenderSalaryCards,
    FysioterapeutGenderSalaryCards,
    FirefighterSalaryBubbleChart,
    FirefighterSalaryEditorialChart,
    FortrykkereGenderSalaryCards,
    FortrykkereSalaryDevelopmentChart,
    FortrykkereSalaryEditorialChart,
    GlassWorkerGenderSalaryCards,
    GlassWorkerSalaryBubbleChart,
    GlassWorkerSalaryEditorialChart,
    BlogGenderSalaryCards,
    BlogPsychologistSalaryChart,
    DoctorSalaryBubbleChart,
    DoctorSalaryEditorialChart,
    BlogHandverkerSalaryChart,
    LegalSalaryDevelopmentChart,
    BlogSalaryDevelopmentChart,
    TopSalaryGrowth2024To2025Chart,
    HealthSalaryBubbleChart,
    IntensivsykepleierGenderSalaryCards,
    IntensivsykepleierSalaryBubbleChart,
    IntensivsykepleierSalaryDevelopmentChart,
    KonduktorGenderSalaryCards,
    KonduktorSalaryDevelopmentChart,
    KonduktorSalaryEditorialChart,
    MalerGenderSalaryCards,
    MalerSalaryBubbleChart,
    MalerSalaryDevelopmentChart,
    MillionSalaryGrowthChart,
    LowestPaidOccupationsBubbleChart,
    NorwayCommonOccupationsChart,
    NorwayCommonOccupationsSalaryGrowthChart,
    PoliceSalaryBubbleChart,
    PoliceSalaryEditorialChart,
    PilotSalaryDevelopmentChart,
    PilotSalaryEditorialChart,
    RorleggerGenderSalaryCards,
    RorleggerSalaryBubbleChart,
    RorleggerSalaryDevelopmentChart,
    RorleggerSalaryEditorialChart,
    ServitorGenderSalaryCards,
    ServitorSalaryBubbleChart,
    ServitorSalaryDevelopmentChart,
    SnekkerSalaryBubbleChart,
    SnekkerSalaryEditorialChart,
    StoreManagerAgeEditorialChart,
    StoreManagerGenderGapEditorialChart,
    StoreManagerGenderSalaryCards,
    StoreManagerSalaryBubbleChart,
    StoreManagerSalaryDevelopmentChart,
    StoreManagerSalaryEditorialChart,
    BlogOccupationSalaryTable,
    TopOvertimePay2025Chart,
    SurgeonSalaryBubbleChart,
    SurgeonSalaryEditorialChart,
    TopHandverkerGenderSalaryCards,
    TopHandverkerSalaryEditorialChart,
    TopApprenticeGenderSalaryCards,
    TopApprenticeSalaryEditorialChart,
    NorwayAverageSalaryDevelopmentChart,
    NorwayRealSalaryGrowthChart,
    NorwayTopOccupationSalaryGrowthChart,
    NorwayTopOccupationSalaryGrowthTable,
    BlogTeacherHourlySalaryChart,
    BlogTeacherSalaryChart,
    TeacherLeaderGenderSalaryCards,
    TeacherLeaderSalaryDevelopmentChart,
    TeacherSalaryBubbleChart,
    VernepleierGenderSalaryCards,
    VernepleierSalaryBubbleChart,
    VernepleierSalaryDevelopmentChart,
    NorwayOccupationSalary2025Chart,
    SalaryJumpBarChart,
    SalaryLevelStackedChart,
    SsbSalaryExampleChart,
  };
}
