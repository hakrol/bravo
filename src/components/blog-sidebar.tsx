import { AdsenseAd } from "@/components/adsense-ad";
﻿import Link from "next/link";
import type { BlogPostPreview } from "@/lib/blog-shared";
import type { NewsPostPreview } from "@/lib/nyheter";

type BlogSidebarProps = {
  relatedPosts: BlogPostPreview[];
  salaryTips: BlogPostPreview[];
  latestNews: NewsPostPreview[];
  showAd?: boolean;
};

type SidebarIconName = "tools" | "chart" | "document" | "calendar" | "calculator" | "news" | "tips";

function SidebarIcon({ name }: { name: SidebarIconName }) {
  const paths: Record<SidebarIconName, string> = {
    tools: "M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18a2.1 2.1 0 0 0 3 3l5.3-5.3a5 5 0 0 0 6.4-6.4l-3.4 3.4-3-3 3.4-3.4Z",
    chart: "M3 21h18M5 17v-5h3v5M11 17V8h3v9M17 17V3h3v14",
    document: "M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6M9 16h6",
    calendar: "M4 5h16v16H4V5Zm4-3v6m8-6v6M4 10h16M8 14h2m4 0h2m-8 3h2",
    calculator: "M6 2h12v20H6V2Zm3 3h6v4H9V5Zm0 8h.01M12 13h.01M15 13h.01M9 16h.01M12 16h.01M15 16h.01M9 19h.01M12 19h.01M15 19h.01",
    news: "M5 3h15v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8h2m0-5v16M8 7h8M8 11h3v4H8v-4Zm6 0h3m-3 4h3M8 18h9",
    tips: "M9 18h6m-6 3h6M8 14a7 7 0 1 1 8 0c-1 .8-1 2-1 2H9s0-1.2-1-2Z",
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}

const toolLinks: { href: string; title: string; icon: SidebarIconName; emphasis?: boolean }[] = [
  { href: "/lonnsjekk", title: "Sjekk lønnen din", icon: "chart" },
  { href: "/jobbtilbud", title: "Lønnstilbud", icon: "document" },
  { href: "/feriekalkulator", title: "Feriekalkulator", icon: "calendar" },
  { href: "/kalkulatorer", title: "Lønnskalkulatorer", icon: "calculator" },
  { href: "/verktoy", title: "Se alle verktøy", icon: "tools", emphasis: true },
];

function SidebarLinks({ title, description, icon, links }: {
  title: string;
  description: string;
  icon: SidebarIconName;
  links: { href: string; title: string; icon?: SidebarIconName; emphasis?: boolean }[];
}) {
  return (
    <nav className="blog-sidebar-section" aria-label={title}>
      <div className="blog-sidebar-heading">
        <span className="blog-sidebar-icon"><SidebarIcon name={icon} /></span>
        <div><h2>{title}</h2><p>{description}</p></div>
      </div>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={link.emphasis ? "blog-sidebar-all-link" : undefined}>
              <SidebarIcon name={link.icon ?? (icon === "tools" ? "document" : icon)} />
              <span>{link.title}</span>
              <svg className="blog-sidebar-chevron" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 4 4 4-4 4" /></svg>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function BlogSidebar({ relatedPosts, salaryTips, latestNews, showAd = true }: BlogSidebarProps) {
  return (
    <aside className="blog-sidebar" aria-label="Verktøy, populære yrker, lesetips og nyheter">
      <SidebarLinks title="Nyttige verktøy" icon="tools" description="Praktiske kalkulatorer og oversikter som hjelper deg med lønn og karriere." links={toolLinks} />
      <SidebarLinks title="Populære yrker" icon="chart" description="Se lønnstall for populære yrker." links={[
        { href: "/yrke/politikere-lonn", title: "Politikere" },
        { href: "/yrke/elektrikere-lonn", title: "Elektrikere" },
        { href: "/yrke/flygere-lonn", title: "Flygere" },
        { href: "/yrke/butikkmedarbeidere-lonn", title: "Butikkmedarbeidere" },
        { href: "/yrke/sykepleiere-lonn", title: "Sykepleiere" },
        { href: "/yrke/dommere-lonn", title: "Dommere" },
        { href: "/yrker", title: "Alle yrker", emphasis: true },
      ]} />
      <SidebarLinks title="Les også" icon="document" description="Utforsk lønn, yrker og forskjeller i arbeidslivet." links={[
        ...relatedPosts.map((post) => ({
        href: `/blogg/${post.slug}`, title: post.title,
        })),
        { href: "/blogg", title: "Se alle artikler", emphasis: true },
      ]} />
      <SidebarLinks title="Siste nytt" icon="news" description="Hold deg oppdatert på lønn og arbeidsliv." links={[
        ...latestNews.map((post) => ({ href: `/nyheter/${post.slug}`, title: post.title })),
        { href: "/nyheter", title: "Se alle nyheter", emphasis: true },
      ]} />
      <SidebarLinks title="Gode lønnstips" icon="tips" description="Still bedre forberedt til neste lønnssamtale." links={[
        ...salaryTips.map((post) => ({ href: `/blogg/${post.slug}`, title: post.title })),
        { href: "/blogg/kategori/lonnsforhandling", title: "Se alle lønnstips", emphasis: true },
      ]} />
      {showAd ? (
        <div className="hidden xl:block">
          <AdsenseAd placement="blog-sidebar" />
        </div>
      ) : null}
    </aside>
  );
}
