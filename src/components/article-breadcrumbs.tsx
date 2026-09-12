import Link from "next/link";
import styles from "./article-breadcrumbs.module.css";

type ArticleBreadcrumbsProps = {
  section: "Forklarer" | "Nyheter" | "Blogg";
  href: "/forklarer" | "/nyheter" | "/blogg";
  title: string;
};

function Chevron() {
  return (
    <svg aria-hidden="true" className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function ArticleBreadcrumbs({ section, href, title }: ArticleBreadcrumbsProps) {
  return (
    <nav aria-label="Brødsmulesti" className={styles.breadcrumbs}>
      <ol>
        <li>
          <Link href="/">
            <svg aria-hidden="true" className={styles.home} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 10 9-8 9 8M5 8v13h14V8M9 21v-8h6v8" />
            </svg>
            Hjem
          </Link>
        </li>
        <li>
          <Chevron />
          <Link href={href}>{section}</Link>
        </li>
        <li className={styles.current}>
          <Chevron />
          <span aria-current="page" title={title}>{title}</span>
        </li>
      </ol>
    </nav>
  );
}
