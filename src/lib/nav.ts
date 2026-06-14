export const NAV_GRUNNBELOEP_BASE_URL = "https://g.nav.no/api/v1";
export const NAV_GRUNNBELOEP_SWAGGER_URL = "https://g.nav.no/api/v1/swagger_doc";
export const NAV_GRUNNBELOEP_CURRENT_PATH = "/grunnbeloep";
export const NAV_GRUNNBELOEP_HISTORY_PATH = "/historikk/grunnbel%C3%B8p";

const NAV_RETRY_ATTEMPTS = 2;
const NAV_RETRY_BASE_DELAY_MS = 750;

export type NavGrunnbeloep = {
  dato: string;
  grunnbeloep: number;
  grunnbeloepPerMaaned: number;
  gjennomsnittPerAar?: number;
  omregningsfaktor?: number;
  virkningstidspunktForMinsteinntekt?: string;
};

export type NavGrunnbeloepHistorySnapshot = {
  version: 1;
  source: {
    name: "NAV";
    apiBaseUrl: typeof NAV_GRUNNBELOEP_BASE_URL;
    swaggerUrl: typeof NAV_GRUNNBELOEP_SWAGGER_URL;
    endpoint: string;
    documentedEndpoint: string;
    downloadedAt: string;
  };
  notes: string[];
  count: number;
  latest: NavGrunnbeloep;
  entries: NavGrunnbeloep[];
};

type NavQueryParams = Record<string, string | number | boolean | undefined>;
type NavRequestInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

export function buildNavGrunnbeloepUrl(path: string, query: NavQueryParams = {}) {
  const url = new URL(`${NAV_GRUNNBELOEP_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

export async function navGetJson<T>(
  path: string,
  query: NavQueryParams = {},
  init: NavRequestInit = {},
): Promise<T> {
  const url = buildNavGrunnbeloepUrl(path, query);
  const response = await fetchWithRetry(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  if (!response.ok) {
    throw new Error(`NAV grunnbelop-kall feilet med status ${response.status}. URL: ${url}`);
  }

  return (await response.json()) as T;
}

export async function getRemoteGrunnbeloep(dato?: string): Promise<NavGrunnbeloep> {
  const payload = await navGetJson<unknown>(
    NAV_GRUNNBELOEP_CURRENT_PATH,
    { dato },
    { next: { revalidate: 60 * 60 * 24 } },
  );

  return normalizeNavGrunnbeloep(payload);
}

export async function getRemoteGrunnbeloepHistory(fra?: string): Promise<NavGrunnbeloep[]> {
  const payload = await navGetJson<unknown[]>(
    NAV_GRUNNBELOEP_HISTORY_PATH,
    { fra },
    { next: { revalidate: 60 * 60 * 24 } },
  );

  return payload
    .map(normalizeNavGrunnbeloep)
    .sort((left, right) => right.dato.localeCompare(left.dato, "nb-NO"));
}

export function findGrunnbeloepForDate(
  entries: NavGrunnbeloep[],
  date: string | Date,
): NavGrunnbeloep | undefined {
  const dateCode = toIsoDate(date);

  return [...entries]
    .sort((left, right) => right.dato.localeCompare(left.dato, "nb-NO"))
    .find((entry) => entry.dato <= dateCode);
}

export function normalizeNavGrunnbeloep(payload: unknown): NavGrunnbeloep {
  if (!payload || typeof payload !== "object") {
    throw new Error("NAV grunnbelop-rad mangler eller har feil format.");
  }

  const record = payload as Record<string, unknown>;
  const dato = readString(record, ["dato"]);
  const grunnbeloep = readNumber(record, ["grunnbeloep", "grunnbel\u00f8p"]);
  const grunnbeloepPerMaaned = readNumber(record, [
    "grunnbeloepPerMaaned",
    "grunnbeloep_per_maaned",
    "grunnbel\u00f8pPerM\u00e5ned",
    "grunnbel\u00f8p_per_m\u00e5ned",
  ]);

  if (!dato || grunnbeloep === undefined || grunnbeloepPerMaaned === undefined) {
    throw new Error("NAV grunnbelop-rad mangler dato, grunnbelop eller manedsbelop.");
  }

  return {
    dato,
    grunnbeloep,
    grunnbeloepPerMaaned,
    gjennomsnittPerAar: readNumber(record, [
      "gjennomsnittPerAar",
      "gjennomsnitt_per_aar",
      "gjennomsnittPer\u00c5r",
      "gjennomsnitt_per_\u00e5r",
    ]),
    omregningsfaktor: readNumber(record, ["omregningsfaktor"]),
    virkningstidspunktForMinsteinntekt: readString(record, [
      "virkningstidspunktForMinsteinntekt",
      "virkningstidspunkt_for_minsteinntekt",
    ]),
  };
}

async function fetchWithRetry(url: URL, init: RequestInit) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= NAV_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, init);

      if (
        response.ok ||
        (response.status !== 429 && response.status !== 503) ||
        attempt === NAV_RETRY_ATTEMPTS
      ) {
        return response;
      }

      await delay(getRetryDelayMs(response, attempt));
    } catch (error) {
      lastError = error;

      if (attempt === NAV_RETRY_ATTEMPTS) {
        throw error;
      }

      await delay(getBackoffDelayMs(attempt));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("NAV grunnbelop-kall feilet.");
}

function getRetryDelayMs(response: Response, attempt: number) {
  const retryAfterHeader = response.headers.get("retry-after");
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : Number.NaN;

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
    return retryAfterSeconds * 1000;
  }

  return getBackoffDelayMs(attempt);
}

function getBackoffDelayMs(attempt: number) {
  return NAV_RETRY_BASE_DELAY_MS * (attempt + 1);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readString(record: Record<string, unknown>, keys: string[]) {
  const value = keys.map((key) => record[key]).find((entry) => typeof entry === "string");
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readNumber(record: Record<string, unknown>, keys: string[]) {
  const value = keys.map((key) => record[key]).find((entry) => typeof entry === "number");
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function toIsoDate(date: string | Date) {
  if (typeof date === "string") {
    return date.slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}
