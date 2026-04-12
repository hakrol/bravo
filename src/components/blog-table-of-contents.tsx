import Link from "next/link";
import type { BlogTableOfContentsItem } from "@/lib/blog";

type BlogTableOfContentsProps = {
  items: BlogTableOfContentsItem[];
};

export function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  let sectionNumber = 0;
  let subSectionNumber = 0;

  return (
    <nav
      aria-label="Innholdsfortegnelse"
      className="mb-6 overflow-hidden rounded-[5px] border border-[var(--border)] bg-white shadow-[0_10px_24px_rgba(27,36,48,0.04)]"
    >
      <p className="m-0 border-b border-black/8 bg-black/[0.03] px-3 py-2 text-[0.78rem] font-bold tracking-[0.04em] text-[var(--muted)] uppercase">
        Innholdsfortegnelse
      </p>
      <ol className="m-0 list-none px-3 py-3">
        {items.map((item) => {
          if (item.level === 2) {
            sectionNumber += 1;
            subSectionNumber = 0;
          } else {
            subSectionNumber += 1;
          }

          const numberLabel = item.level === 2 ? `${sectionNumber}.` : `${sectionNumber}.${subSectionNumber}`;

          return (
            <li
              key={item.id}
              className={`grid items-start gap-x-2 ${item.id !== items[0]?.id ? "mt-1" : ""} ${item.level === 3 ? "ml-4 grid-cols-[2.75rem_minmax(0,1fr)]" : "grid-cols-[2rem_minmax(0,1fr)]"}`}
            >
              <span
                aria-hidden="true"
                className={`pt-1 text-right text-[0.92rem] leading-5 text-[var(--muted)] ${item.level === 3 ? "text-[0.86rem]" : ""}`}
              >
                {numberLabel}
              </span>
              <Link
                className={`block rounded-[5px] px-2 py-1 text-[0.92rem] leading-5 text-[var(--foreground)] no-underline! transition hover:bg-black/[0.04] hover:text-[var(--primary-strong)] ${item.level === 3 ? "text-[0.89rem] text-[var(--muted)]" : ""}`}
                href={`#${item.id}`}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
