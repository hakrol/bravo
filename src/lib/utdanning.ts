import { unstable_cache } from "next/cache";
import type {
  GeneratedOccupationDescription,
  UtdanningOccupationApiResponse,
  UtdanningOccupationSource,
} from "./utdanning-types";

const UTDANNING_BASE_URL = "https://utdanning.no/api/v1/data_norge--yrkesbeskrivelse";
const UTDANNING_ATTRIBUTION =
  "Yrkesbeskrivelsen er inspirert av \u00e5pne data fra Utdanning.no og er underlagt Norsk lisens for offentlige data (NLOD). Teksten hos oss er omskrevet, og originalteksten vedlikeholdes p\u00e5 Utdanning.no.";

const OCCUPATION_ID_OVERRIDES: Record<string, string[]> = {
  "2411": ["y_revisor", "y_regnskapsforer"],
  "2412": ["y_finansanalytiker", "y_aksjemegler", "y_bank_rad"],
  "2413": ["y_finansanalytiker"],
  "3313": ["y_regnskapsforer"],
};

type UtdanningOccupationIndexEntry = {
  id: string;
  normalizedId: string;
};

const getUtdanningOccupationIndex = unstable_cache(
  async (): Promise<UtdanningOccupationIndexEntry[]> => {
    const response = await fetch(UTDANNING_BASE_URL, {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      throw new Error(`Klarte ikke \u00e5 hente Utdanning.no-indeksen. Status: ${response.status}.`);
    }

    const data = (await response.json()) as {
      value?: unknown;
    };
    const urls = Array.isArray(data.value) ? data.value : [];

    return urls
      .map((value) => (typeof value === "string" ? value : null))
      .filter((value): value is string => Boolean(value))
      .map((url) => {
        const id = url.split("/").pop();

        if (!id) {
          return null;
        }

        return {
          id,
          normalizedId: normalizeSearchValue(id.replace(/^y_/, "")),
        };
      })
      .filter((entry): entry is UtdanningOccupationIndexEntry => Boolean(entry));
  },
  ["utdanning-occupation-index"],
  { revalidate: 60 * 60 * 24 },
);

const getUtdanningOccupationById = unstable_cache(
  async (sammenligningId: string): Promise<UtdanningOccupationSource | null> => {
    const response = await fetch(`${UTDANNING_BASE_URL}/${sammenligningId}`, {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as UtdanningOccupationApiResponse;
    return normalizeOccupationSource(payload, sammenligningId);
  },
  ["utdanning-occupation-by-id"],
  { revalidate: 60 * 60 * 24 },
);

export async function getGeneratedOccupationDescription(
  occupationCode: string,
  occupationLabel: string,
): Promise<GeneratedOccupationDescription | null> {
  const source = await resolveUtdanningOccupationSource(occupationCode, occupationLabel);

  if (!source) {
    return null;
  }

  return {
    intro: buildInspiredIntro(source, occupationLabel),
    workTasks: source.workTasks.slice(0, 5).map(paraphraseTask),
    whereWorks: paraphraseSupportText(source.whereWorks),
    education: paraphraseSupportText(source.education || source.furtherEducation),
    qualities: paraphraseSupportText(source.qualities),
    sourceTitle: source.title,
    sourceUrl: source.sourceUrl,
    reviewedAt: source.reviewedAt,
    attribution: UTDANNING_ATTRIBUTION,
  };
}

async function resolveUtdanningOccupationSource(
  occupationCode: string,
  occupationLabel: string,
) {
  const index = await getUtdanningOccupationIndex();
  const candidateIds = buildCandidateIds(index, occupationCode, occupationLabel);

  for (const candidateId of candidateIds) {
    const source = await getUtdanningOccupationById(candidateId);

    if (!source) {
      continue;
    }

    if (source.styrk08Codes.includes(occupationCode)) {
      return source;
    }
  }

  for (const candidateId of candidateIds.slice(0, 3)) {
    const source = await getUtdanningOccupationById(candidateId);

    if (!source) {
      continue;
    }

    if (isStrongTitleMatch(source.title, occupationLabel)) {
      return source;
    }
  }

  return null;
}

function buildCandidateIds(
  index: UtdanningOccupationIndexEntry[],
  occupationCode: string,
  occupationLabel: string,
) {
  const overrides = OCCUPATION_ID_OVERRIDES[occupationCode] ?? [];
  const searchVariants = buildSearchVariants(occupationLabel);
  const rankedMatches = index
    .map((entry) => ({
      id: entry.id,
      score: scoreIndexEntry(entry, searchVariants),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 8)
    .map((entry) => entry.id);

  return Array.from(new Set([...overrides, ...rankedMatches]));
}

function buildSearchVariants(occupationLabel: string) {
  const variants = new Set<string>();
  const formatted = occupationLabel
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  for (const value of formatted) {
    addSearchVariant(variants, value);

    if (value.includes(" og ")) {
      for (const part of value.split(" og ")) {
        addSearchVariant(variants, part);
      }
    }
  }

  return Array.from(variants);
}

function addSearchVariant(variants: Set<string>, value: string) {
  const normalized = normalizeSearchValue(value);

  if (!normalized) {
    return;
  }

  variants.add(normalized);

  const singular = singularizeNormalizedPhrase(normalized);

  if (singular) {
    variants.add(singular);
  }
}

function scoreIndexEntry(
  entry: UtdanningOccupationIndexEntry,
  searchVariants: string[],
) {
  let bestScore = 0;

  for (const variant of searchVariants) {
    if (!variant) {
      continue;
    }

    if (entry.normalizedId === variant) {
      bestScore = Math.max(bestScore, 120);
      continue;
    }

    if (entry.normalizedId.startsWith(variant) || variant.startsWith(entry.normalizedId)) {
      bestScore = Math.max(bestScore, 90);
    }

    const entryTokens = new Set(entry.normalizedId.split("_").filter(Boolean));
    const variantTokens = variant.split("_").filter(Boolean);
    const sharedTokenCount = variantTokens.filter((token) => entryTokens.has(token)).length;

    if (sharedTokenCount > 0) {
      bestScore = Math.max(bestScore, sharedTokenCount * 25);
    }
  }

  return bestScore;
}

function normalizeOccupationSource(
  payload: UtdanningOccupationApiResponse,
  sammenligningId: string,
): UtdanningOccupationSource | null {
  const title = cleanInlineText(payload.title);

  if (!title) {
    return null;
  }

  return {
    sammenligningId,
    title,
    sourceUrl: `${UTDANNING_BASE_URL}/${sammenligningId}`,
    summary: cleanInlineText(payload.body?.summary),
    bodyText: htmlToText(payload.body?.value),
    whereWorks: htmlToText(payload.yrke_hvor_jobber),
    education: htmlToText(payload.yrke_utdanning),
    furtherEducation: htmlToText(payload.yrke_evu),
    qualities: htmlToText(payload.yrke_personegenskaper),
    workTasks: extractWorkTasks(payload),
    interests: (payload.interesse ?? [])
      .map((entry) => cleanInlineText(entry.title))
      .filter((value): value is string => Boolean(value)),
    styrk08Codes: (payload.styrk08 ?? [])
      .map((entry) => entry.styrk08_kode?.trim())
      .filter((value): value is string => Boolean(value)),
    reviewedAt: payload.yrke_sist_kvalitetssikret?.trim() || undefined,
  };
}

function extractWorkTasks(payload: UtdanningOccupationApiResponse) {
  const structuredTasks = (payload.arbeidsoppgave ?? [])
    .map((entry) => cleanInlineText(entry.title))
    .filter((value): value is string => Boolean(value));

  if (structuredTasks.length > 0) {
    return structuredTasks;
  }

  return extractListItems(payload.body?.value).slice(0, 8);
}

function buildInspiredIntro(source: UtdanningOccupationSource, occupationLabel: string) {
  const lowerLabel = occupationLabel.toLowerCase();
  const taskPreview = source.workTasks.slice(0, 3).map(paraphraseTask);
  const summarySentence = paraphraseSummarySentence(source.summary, occupationLabel);
  const taskSentence =
    taskPreview.length >= 2
      ? `${occupationLabel} arbeider ofte med ${joinWithOg(taskPreview.map(lowercaseFirst))}.`
      : undefined;
  const workplaceSentence = source.whereWorks
    ? `${occupationLabel} finnes gjerne i ${lowercaseFirst(paraphraseSupportText(source.whereWorks) ?? source.whereWorks)}`
    : undefined;

  return [summarySentence, taskSentence, workplaceSentence]
    .filter((segment): segment is string => Boolean(segment))
    .join(" ")
    .replaceAll(`${occupationLabel} ${occupationLabel.toLowerCase()}`, `${occupationLabel}`)
    .replaceAll(`${lowerLabel} ${lowerLabel}`, lowerLabel);
}

function paraphraseSummarySentence(summary: string, occupationLabel: string) {
  const normalizedSummary = cleanInlineText(summary);

  if (!normalizedSummary) {
    return `${occupationLabel} er et yrke der oppgaver, ansvar og faglig retning varierer etter arbeidsplass og spesialisering.`;
  }

  const rewritten = rewriteSentence(normalizedSummary)
    .replace(/^En\s+/i, "")
    .replace(/^Ei\s+/i, "")
    .replace(/^Et\s+/i, "");

  return `${occupationLabel} ${lowercaseFirst(rewritten)}`;
}

function paraphraseTask(task: string) {
  const normalizedTask = cleanInlineText(task);

  if (!normalizedTask) {
    return task;
  }

  return lowercaseFirst(
    rewriteSentence(normalizedTask)
      .replace(/\.$/, "")
      .replace(/^\u00e5\s+/i, "")
      .replace(/^og\s+/i, ""),
  );
}

function paraphraseSupportText(value?: string) {
  const normalized = cleanInlineText(value);

  if (!normalized) {
    return undefined;
  }

  const firstSentence = normalized.split(/(?<=[.!?])\s+/)[0] ?? normalized;
  return rewriteSentence(firstSentence);
}

function rewriteSentence(value: string) {
  return value
    .replace(/\bjobber med\b/gi, "arbeider med")
    .replace(/\bjobber du med\b/gi, "arbeider du ofte med")
    .replace(/\bjobber du\b/gi, "arbeider du")
    .replace(/\binneb\u00e6rer\b/gi, "omfatter")
    .replace(/\bs\u00f8rger for\b/gi, "har ansvar for")
    .replace(/\bfor \u00e5 kunne\b/gi, "slik at man kan")
    .replace(/\bfor \u00e5\b/gi, "slik at man kan")
    .replace(/\bkan m\u00e5tte\b/gi, "m\u00e5 i noen perioder")
    .replace(/\bgir\b/gi, "skal gi")
    .replace(/\bog bruker sin\b/gi, "og bruker")
    .replace(/\bI tillegg\b/gi, "Dessuten")
    .replace(/\bSom\b/gi, "Som");
}

function htmlToText(value?: string | null) {
  if (!value) {
    return "";
  }

  return cleanInlineText(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/h[1-6]>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, " "),
  );
}

function extractListItems(value?: string) {
  if (!value) {
    return [];
  }

  return Array.from(value.matchAll(/<li[^>]*>(.*?)<\/li>/gis))
    .map((match) => htmlToText(match[1]))
    .map((entry) => cleanInlineText(entry))
    .filter((entry): entry is string => Boolean(entry));
}

function cleanInlineText(value?: string | null) {
  if (!value) {
    return "";
  }

  return decodeHtmlEntities(value)
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u00e6/g, "ae")
    .replace(/\u00f8/g, "o")
    .replace(/\u00e5/g, "a")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function singularizeNormalizedPhrase(value: string) {
  return value
    .split("_")
    .map((token) => singularizeToken(token))
    .join("_");
}

function singularizeToken(token: string) {
  if (token.length <= 4) {
    return token;
  }

  if (token.endsWith("ere")) {
    return token.slice(0, -1);
  }

  if (token.endsWith("orer")) {
    return token.slice(0, -2);
  }

  if (token.endsWith("erer")) {
    return token.slice(0, -2);
  }

  if (token.endsWith("er")) {
    return token.slice(0, -2);
  }

  return token;
}

function isStrongTitleMatch(sourceTitle: string, occupationLabel: string) {
  const left = singularizeNormalizedPhrase(normalizeSearchValue(sourceTitle));
  const right = singularizeNormalizedPhrase(normalizeSearchValue(occupationLabel));

  return left === right || left.startsWith(right) || right.startsWith(left);
}

function lowercaseFirst(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toLowerCase() + value.slice(1);
}

function joinWithOg(values: string[]) {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} og ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")} og ${values[values.length - 1]}`;
}
