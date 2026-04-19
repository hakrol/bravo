# Blog Post Agent

These instructions apply when creating, editing, or reviewing blog posts in `src/content/blog/`.

## Purpose

- Write practical Norwegian blog posts for Lonnsdata Norge.
- Help readers make better salary decisions with concrete advice, examples, and realistic framing.
- Preserve the style used in the existing posts about asking for higher salary.

## Required Context

- Read `src/content/blog/README.md` before creating or changing blog posts.
- Check existing posts in `src/content/blog/` before writing new content, especially when matching tone, structure, CTA usage, or SEO style.
- If the change affects blog rendering, MDX components, routing, metadata, caching, or data fetching, read the relevant Next.js documentation in `node_modules/next/dist/docs/` first and mention which documentation was used.

## Content Style

- Write in Norsk Bokmål with correct ÆØÅ.
- Use direct `du` language when giving advice.
- Be concrete, calm, and useful. Avoid fluff, generic motivational language, and vague claims.
- Prefer practical reasoning over hype: explain when something is smart, risky, realistic, or poorly timed.
- Make the reader feel more prepared, not pressured.
- Keep paragraphs readable and focused. Use examples when an abstract point needs to become actionable.

## Article Structure

- Start with a clear introduction that names the reader's problem and explains what the article will help them decide or do.
- Use one clear search intent per post.
- Use `##` for main sections and `###` for useful subsections. These headings generate the table of contents.
- Prefer headings that match real questions readers search for.
- End with a practical conclusion that summarizes the decision logic, not a generic sign-off.

## Frontmatter

Every post must start with complete frontmatter:

```md
---
title: "Visible title"
description: "Concrete short description"
slug: "short-lowercase-slug"
publishedAt: "YYYY-MM-DD"
coverImage: "/blogg/<slug>/cover-or-descriptive-cover-file.png"
author: "Lønnsdata Norge"
seoTitle: "Search-focused title"
seoDescription: "Search-focused meta description"
---
```

- Keep `slug` short, lowercase, and hyphenated.
- Use `title` for humans first, not keyword stuffing.
- Use `seoTitle` when a more search-focused variant is useful.
- Keep `description` and `seoDescription` concrete and benefit-oriented.
- Avoid creating multiple posts with nearly identical search intent.

## Evidence And Sources

- Do not invent statistics, market claims, legal claims, or source references.
- Use external sources when discussing surveys, laws, salary statistics, official guidance, or concrete market claims.
- Prefer official or reputable Norwegian sources when possible, such as SSB, Arbeidstilsynet, unions, banks, or established publications.
- Explain what a source supports in plain language. Do not overstate what the source proves.
- Use links naturally in the prose, not as a source dump.

## Existing Patterns To Preserve

- Salary guidance should usually connect three things: responsibility, results, and market level.
- Strong arguments are concrete: changed role, increased responsibility, documented results, timing, market value, and internal salary process.
- Warn against common mistakes: vague arguments, random numbers, emotional framing, poor timing, wrong comparisons, and ending without next steps.
- Use realistic ranges only when they can be explained and framed as examples, not universal guarantees.
- When helpful, include short formulations the reader can reuse in a salary conversation.

## MDX Components

- Use `Example` for scripts, phrases, email text, or concrete wording the reader can reuse.
- Use `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader`, and `TableCell` for structured comparisons or calculations.
- Use `ToolCallout` when the article should point readers to Lønnsjekk.
- Avoid raw HTML and inline styling in new posts when an existing MDX component covers the pattern.
- Use regular Markdown blockquotes only for actual quotes or source-like excerpts.

## Lønnsjekk CTA

- Include a Lønnsjekk CTA when it genuinely helps the reader move from advice to action.
- Place the CTA after the reader has enough context to understand why checking salary level is useful.
- Keep CTA text relevant to the article's topic instead of using a generic interruption.
- Link to `/lonnsjekk`.

## Images

- Store images in `public/blogg/<slug>/`.
- Use `cover.*` or a descriptive cover filename that still follows lowercase hyphenated naming.
- Use `inline-1.*`, `inline-2.*`, or `figure-1.*` for images inside the article.
- Use descriptive `alt` text when the image adds information.
- Use empty `alt` text for decorative images.
- Do not use filenames with spaces, parentheses, copy suffixes, or random camera names.

## Quality Checklist

- The post has one clear search intent.
- Frontmatter is complete and matches the file, slug, and cover image path.
- The introduction quickly explains why the topic matters and what the reader will get.
- Headings are useful and specific enough for a table of contents.
- Claims are sourced when needed and not overstated.
- Examples, tables, and CTA components use the shared MDX components.
- The article sounds like the existing salary-guidance posts: practical, direct, and specific.
