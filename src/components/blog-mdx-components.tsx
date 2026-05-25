import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { Fragment } from "react";
import { BlogFAQ, BlogFAQItem } from "@/components/blog-faq";
import { BlogMdxImage } from "@/components/blog-mdx-image";
import { BlogTableOfContents } from "@/components/blog-table-of-contents";
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

export function buildBlogMdxComponents(tableOfContents: BlogTableOfContentsItem[]): MDXComponents {
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
  ToolCallout: ({ title, description, href = "/lonnsjekk", cta = "Prøv Lønnsjekk", ...props }) => (
    <div className="blog-tool-callout" {...props}>
      <div className="blog-tool-callout-content">
        <p className="blog-tool-callout-kicker">Verktøy</p>
        <h3 className="blog-tool-callout-title">{title ?? "Sjekk lønnsnivået ditt med Lønnsjekk"}</h3>
        <p className="blog-tool-callout-description">
          {description ??
            "Bruk Lønnsjekk for å sammenligne lønnen din med relevante tall og få et bedre utgangspunkt før du går inn i lønnssamtalen."}
        </p>
      </div>
      <Link className="blog-tool-callout-link" href={typeof href === "string" ? href : "/lonnsjekk"}>
        {typeof cta === "string" ? cta : "Prøv Lønnsjekk"}
      </Link>
    </div>
  ),
  FAQ: BlogFAQ,
  FAQItem: BlogFAQItem,
  Table: ({ children, ...props }) => (
    <div className="blog-table-wrap">
      <table className="blog-table" {...props}>
        {children}
      </table>
    </div>
  ),
  TableHead: ({ children, ...props }) => <thead className="blog-table-head" {...props}>{children}</thead>,
  TableBody: ({ children, ...props }) => <tbody className="blog-table-body" {...props}>{children}</tbody>,
  TableRow: ({ children, ...props }) => <tr className="blog-table-row" {...props}>{children}</tr>,
  TableHeader: ({ children, ...props }) => <th className="blog-table-header" {...props}>{children}</th>,
  TableCell: ({ children, ...props }) => <td className="blog-table-cell" {...props}>{children}</td>,
  };
}
