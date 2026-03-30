<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`.
Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# Project Rules

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
