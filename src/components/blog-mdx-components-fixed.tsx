import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { Fragment } from "react";
import { BlogChart } from "@/components/blog-chart";
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
import { FirefighterSalaryBubbleChart, FirefighterSalaryEditorialChart } from "@/components/blog-firefighter-salary-chart";
import { BlogHandverkerSalaryChart } from "@/components/blog-handverker-salary-chart";
import { BlogOccupationSalaryTable } from "@/components/blog-occupation-salary-table";
import { PoliceSalaryBubbleChart, PoliceSalaryEditorialChart } from "@/components/blog-police-salary-chart";
import { SnekkerSalaryBubbleChart, SnekkerSalaryEditorialChart } from "@/components/blog-snekker-salary-chart";
import { SurgeonSalaryBubbleChart, SurgeonSalaryEditorialChart } from "@/components/blog-surgeon-salary-chart";
import { BlogTableOfContents } from "@/components/blog-table-of-contents";
import { BlogTeacherHourlySalaryChart, BlogTeacherSalaryChart } from "@/components/blog-teacher-salary-chart";
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
    img: ({ alt = "", ...props }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} className="my-8 w-full rounded-[5px] border border-[var(--border)]" {...props} />
    ),
    Example: ({ children, title, ...props }) => (
      <div className="blog-example" {...props}>
        {title ? <p className="blog-example-title">{title}</p> : null}
        <div className="blog-example-body">{children}</div>
      </div>
    ),
    ToolCallout: ({ title, description, href = "/lonnsjekk", cta = "Prøv Lønnsjekk", ...props }) => (
      <div className="blog-tool-callout" {...props}>
        <div className="blog-tool-callout-content">
          <h3 className="blog-tool-callout-title">{title ?? "Sjekk lønnen din gratis"}</h3>
          <div className="blog-tool-callout-description">
            {description ??
              "Bruk Lønnsjekk for å sammenligne lønnen din med relevante tall og få et bedre utgangspunkt før du går inn i lønnssamtalen."}
          </div>
        </div>
        <Link className="blog-tool-callout-link" href={typeof href === "string" ? href : "/lonnsjekk"}>
          {typeof cta === "string" ? cta : "Prøv Lønnsjekk"}
        </Link>
      </div>
    ),
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
    BlogElectricianSalaryChart,
    ElectricianSalaryBubbleChart,
    ElectricianSalaryEditorialChart,
    FirefighterSalaryBubbleChart,
    FirefighterSalaryEditorialChart,
    BlogPsychologistSalaryChart,
    DoctorSalaryBubbleChart,
    DoctorSalaryEditorialChart,
    BlogHandverkerSalaryChart,
    HealthSalaryBubbleChart,
    PoliceSalaryBubbleChart,
    PoliceSalaryEditorialChart,
    SnekkerSalaryBubbleChart,
    SnekkerSalaryEditorialChart,
    BlogOccupationSalaryTable,
    SurgeonSalaryBubbleChart,
    SurgeonSalaryEditorialChart,
    BlogTeacherHourlySalaryChart,
    BlogTeacherSalaryChart,
    NorwayOccupationSalary2025Chart,
    SalaryJumpBarChart,
    SalaryLevelStackedChart,
    SsbSalaryExampleChart,
  };
}
