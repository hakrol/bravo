<!-- BEGIN:nextjs-agent-rules -->

# Next.js documentation

Before changing App Router, metadata, routing, server actions, caching, or data fetching:
- Read the relevant documentation in `node_modules/next/dist/docs/`
- Briefly mention which documentation was used

<!-- END:nextjs-agent-rules -->

# Project Rules

## Project context

- Read `PROJECT.MD` when work affects product positioning, page content, UX copy, blog strategy, information architecture, or feature prioritization.
- Use `PROJECT.MD` as the source of truth for target audience, value proposition, product purpose, and editorial direction.

## Blogginnlegg

- Når du lager eller oppdaterer blogginnlegg, skal `description` fungere som en engasjerende hook på bloggforsiden, ikke bare en nøktern oppsummering. Den skal gi leseren lyst til å klikke videre, samtidig som den er presis og ikke overdriver innholdet.
- Datadrevne blogginnlegg som handler om en bestemt periode, for eksempel "2025", skal bruke et frosset snapshot av tallgrunnlaget. Ikke la historiske blogginnlegg lese direkte fra `latest`-JSON eller andre datakilder som endrer seg når SSB-data oppdateres.
- Desktop/Bravo-prosjektet er stabil innholdskilde for blogginnlegg. Hvis en midlertidig Codex-worktree brukes til utkast eller forhåndsvisning, skal MDX-fil, snapshot, public-assets, relevante komponentendringer og `daily-brief.md` synkes samlet til Desktop/Bravo før temaet regnes som ferdig.

## Bloggbrief

Når et blogginnlegg lages fra tema-køen, skal briefen under temaet følges.

Briefen kan inneholde:
- Tittel
- Beskrivelse av hva innlegget skal svare på, hensikt og mål
- Overskrifter og mellomoverskrifter som skal brukes eller vurderes
- Interne lenker som skal inn i teksten
- Eksterne lenker som skal brukes som kilder eller videre lesing

Hvis briefen mangler noen av feltene, skal Codex bruke beste skjønn basert på prosjektreglene og eksisterende blogginnlegg.

## Execution model

- Default to code generation, not autonomous execution
- Do not run commands unless explicitly instructed

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Architecture

- Use App Router only (no /pages)
- Separate UI, data fetching, and API logic
- Use /lib for API logic (SSB)
- Use /components for reusable UI

## File structure rules

- All API logic goes in /lib
- UI components go in /components
- Pages go in /app
- Do not create new root-level folders unless necessary

## Data handling (SSB)

- All SSB API calls must go through /lib/ssb.ts
- Use a centralized fetch function
- Always type responses with TypeScript
- Never hardcode API URLs inside components

## SSB API

- Follow rules in /lib/ssb/docs.md
- Use existing functions in /lib/ssb/queries.ts
- Do NOT construct raw API calls inside components

## Code quality

- Keep components small and reusable
- Prefer server components where possible
- Avoid unnecessary state

## Simplicity

- Prefer the simplest possible solution
- Avoid abstractions unless clearly needed

## Restrictions

- Do NOT install libraries unless necessary
- Do NOT use outdated Next.js patterns
- Do NOT refactor unrelated code

## Behavior

- Always explain what you are doing briefly
- Ask if something is unclear instead of guessing

## Output format

- When generating code, always show full file paths
- Group changes by file
- Briefly explain what was done

## Language

- Always use Norsk Bokmål and ÆØÅ.
