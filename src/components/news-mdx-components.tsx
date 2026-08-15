import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { BlogMdxImage } from "@/components/blog-mdx-image";

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

export function buildNewsMdxComponents(): MDXComponents {
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

      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
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
  };
}
