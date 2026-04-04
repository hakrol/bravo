import Link from "next/link";
import type { MDXComponents } from "mdx/types";

export const blogMdxComponents: MDXComponents = {
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
  img: ({ alt = "", ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className="my-8 w-full rounded-[5px] border border-[var(--border)]" {...props} />
  ),
};
