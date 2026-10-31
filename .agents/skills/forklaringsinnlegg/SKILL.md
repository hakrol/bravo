---
name: forklaringsinnlegg
description: Skriv eller oppdater begrepsforklaringer under /forklarer i Lønnsinnsikt, som medianlønn eller reallønn. Dette er en egen innholdstype; overordnede lønnsanalyser og yrkesartikler følger bloggskillene.
---

# Forklaringsinnlegg

Les `AGENTS.MD`, `PROJECT.MD` og `FORKLARINGSINNLEGG.txt` fra prosjektroten. Kontroller frontmatter mot `src/lib/forklarer.ts` og komponentstøtte mot `src/components/forklarer-mdx-components.tsx`.

- Legg MDX i `src/content/forklarer/` med URL `/forklarer/<slug>`.
- Bruk `title`, `description`, `slug`, `publishedAt`, `author`, `term`, `seoTitle` og `seoDescription`; bruk `relatedTerms` når naturlig. Behold opprinnelig publiseringsdato ved oppdateringer.
- Bruk brukerens overskrifter som hovedstruktur. Forklar begrepet direkte i starten, deretter praktisk bruk i lønnssammenheng, eksempler, nærliggende begreper og vanlige misforståelser.
- Skriv rolig og konkret på norsk bokmål. Koble etterprøvbare opplysninger til konkrete kilder der de brukes; ikke avslutt med et eget `Kilder:`-avsnitt.
- Bruk relevante eksisterende interne lenker. Sidebaren skal bare lenke til begreper som faktisk har egen forklarerside, maksimalt 25 lenker.
- Ikke bruk blogg-coverbilde, `coverImage` eller `coverImageAlt`. Diagramkvoter fra blogginnlegg gjelder ikke. Bruk FAQ bare ved uttrykkelig bestilling.
- Ikke publiser automatisk. Gjør bare tekniske endringer som oppgaven krever, og følg prosjektets dokumentasjonskrav før slike endringer.
