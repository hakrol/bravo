"use client";

import Link from "next/link";
import type { HTMLAttributes } from "react";
import { track } from "@vercel/analytics";

const LONNSJEKK_CALLOUT_HREF = "/lonnsjekk";
const LONNSJEKK_CALLOUT_TITLE = "Vil du sjekke din egen årslønn mot markedet?";
const LONNSJEKK_CALLOUT_DESCRIPTION =
  "Bruk Lønnsjekk for å sammenligne lønnen din med SSB-tall for riktig yrke og få et bedre grunnlag før lønnssamtale eller jobbskifte.";
const LONNSJEKK_CALLOUT_CTA = "Prøv Lønnsjekk";

type BlogLonnsjekkCalloutProps = Omit<HTMLAttributes<HTMLDivElement>, "title">;

export function BlogLonnsjekkCallout({ className, ...props }: BlogLonnsjekkCalloutProps) {
  function handleClick() {
    track("Blog lonnsjekk CTA clicked", {
      cta: LONNSJEKK_CALLOUT_CTA,
      href: LONNSJEKK_CALLOUT_HREF,
      page_path: window.location.pathname,
      source: "blog_tool_callout",
    });
  }

  return (
    <div className={["blog-tool-callout", className].filter(Boolean).join(" ")} {...props}>
      <div className="blog-tool-callout-content">
        <h3 className="blog-tool-callout-title">{LONNSJEKK_CALLOUT_TITLE}</h3>
        <div className="blog-tool-callout-description">{LONNSJEKK_CALLOUT_DESCRIPTION}</div>
      </div>
      <Link className="blog-tool-callout-link" href={LONNSJEKK_CALLOUT_HREF} onClick={handleClick}>
        {LONNSJEKK_CALLOUT_CTA}
      </Link>
    </div>
  );
}
