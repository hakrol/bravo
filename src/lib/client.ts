import type {
  JsonStat2Dataset,
  SsbHttpErrorCode,
  SsbLanguage,
  SsbPostBody,
  SsbQueryParams,
  SsbTableInfo,
  SsbTableMetadata,
  SsbTableSummary,
} from "./types";

export const SSB_BASE_URL = "https://data.ssb.no/api/pxwebapi/v2";
export const SSB_MAX_CELLS = 800000;
export const SSB_MAX_REQUESTS_PER_MINUTE = 30;
export const SSB_MAX_GET_URL_LENGTH = 2100;
const SSB_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const SSB_RETRY_ATTEMPTS = 2;
const SSB_RETRY_BASE_DELAY_MS = 1500;

type RequestOptions = {
  lang?: SsbLanguage;
  query?: SsbQueryParams;
  init?: RequestInit;
};

export function buildSsbUrl(path: string, options: RequestOptions = {}) {
  const url = new URL(`${SSB_BASE_URL}${path}`);
  const searchParams = new URLSearchParams();

  if (options.lang) {
    searchParams.set("lang", options.lang);
  }

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        searchParams.set(key, value.join(","));
        continue;
      }

      searchParams.set(key, String(value));
    }
  }

  url.search = searchParams.toString();

  if (url.toString().length > SSB_MAX_GET_URL_LENGTH) {
    throw new Error(
      `GET query exceeded the SSB URL limit of about ${SSB_MAX_GET_URL_LENGTH} characters. Use POST, '*', '?', top(), from(), to(), or range() instead.`,
    );
  }

  return url;
}

export async function ssbGetJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildSsbUrl(path, options);
  const init: RequestInit = {
    ...options.init,
    headers: {
      Accept: "application/json",
      ...options.init?.headers,
    },
  };
  const cacheKey = getSsbGetCacheKey(url.toString(), init);
  const cachedValue = readCachedSsbGet<T>(cacheKey);

  if (cachedValue !== null) {
    return cachedValue;
  }

  const inFlightRequest = ssbGetInFlight.get(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest as Promise<T>;
  }

  const request = (async () => {
    const response = await fetchWithRetry(url, init);

    if (!response.ok) {
      throw createSsbHttpError(response.status as SsbHttpErrorCode, url.toString());
    }

    const payload = (await response.json()) as T;
    writeCachedSsbGet(cacheKey, payload);
    return payload;
  })();

  ssbGetInFlight.set(cacheKey, request);

  try {
    return await request;
  } finally {
    ssbGetInFlight.delete(cacheKey);
  }
}

export async function ssbPostJson<T>(
  path: string,
  body: SsbPostBody,
  options: RequestOptions = {},
): Promise<T> {
  const url = buildSsbUrl(path, options);
  const response = await fetchWithRetry(url, {
    method: "POST",
    ...options.init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.init?.headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw createSsbHttpError(response.status as SsbHttpErrorCode, url.toString());
  }

  return (await response.json()) as T;
}

async function fetchWithRetry(url: URL, init: RequestInit) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= SSB_RETRY_ATTEMPTS; attempt += 1) {
    try {
      await waitForSsbRequestSlot();
      const response = await fetch(url, init);

      if (
        response.ok ||
        (response.status !== 429 && response.status !== 503) ||
        attempt === SSB_RETRY_ATTEMPTS
      ) {
        return response;
      }

      await delay(getRetryDelayMs(response, attempt));
      continue;
    } catch (error) {
      lastError = error;

      if (attempt === SSB_RETRY_ATTEMPTS) {
        throw error;
      }

      await delay(getBackoffDelayMs(attempt));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("SSB request failed.");
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
  return SSB_RETRY_BASE_DELAY_MS * (attempt + 1);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ssbRequestTimestamps: number[] = [];
let ssbRateLimiter = Promise.resolve();

function waitForSsbRequestSlot() {
  const reservation = ssbRateLimiter.then(async () => {
    while (true) {
      const now = Date.now();
      pruneExpiredSsbRequestTimestamps(now);

      if (ssbRequestTimestamps.length < SSB_MAX_REQUESTS_PER_MINUTE) {
        ssbRequestTimestamps.push(now);
        return;
      }

      const oldestRequestTimestamp = ssbRequestTimestamps[0];
      const waitMs = oldestRequestTimestamp + SSB_RATE_LIMIT_WINDOW_MS - now + 50;
      await delay(Math.max(waitMs, 50));
    }
  });

  ssbRateLimiter = reservation.catch(() => undefined);
  return reservation;
}

function pruneExpiredSsbRequestTimestamps(now: number) {
  while (
    ssbRequestTimestamps.length > 0 &&
    now - ssbRequestTimestamps[0] >= SSB_RATE_LIMIT_WINDOW_MS
  ) {
    ssbRequestTimestamps.shift();
  }
}

export async function listTables(query?: SsbQueryParams, lang: SsbLanguage = "no") {
  return ssbGetJson<SsbTableSummary[]>("/tables", {
    lang,
    query,
  });
}

export async function getTableInfo(tableId: string, lang: SsbLanguage = "no") {
  return ssbGetJson<SsbTableInfo>(`/tables/${tableId}`, { lang });
}

export async function getTableMetadata(tableId: string, lang: SsbLanguage = "no") {
  return ssbGetJson<SsbTableMetadata>(`/tables/${tableId}/metadata`, { lang });
}

export async function getTableData(
  tableId: string,
  query: SsbQueryParams,
  lang: SsbLanguage = "no",
) {
  return ssbGetJson<JsonStat2Dataset>(`/tables/${tableId}/data`, {
    lang,
    query,
  });
}

export async function postTableData(
  tableId: string,
  body: SsbPostBody,
  query?: SsbQueryParams,
  lang: SsbLanguage = "no",
) {
  return ssbPostJson<JsonStat2Dataset>(`/tables/${tableId}/data`, body, {
    lang,
    query,
  });
}

function createSsbHttpError(status: SsbHttpErrorCode, url: string) {
  switch (status) {
    case 400:
      return new Error(`SSB rejected the query as invalid syntax (400). URL: ${url}`);
    case 403:
      return new Error(
        `SSB rejected the query because the dataset is too large (403). The limit is ${SSB_MAX_CELLS.toLocaleString("en-US")} cells including empty cells.`,
      );
    case 404:
      return new Error(
        "SSB resource was not found (404). Check the table id, path, or whether the GET URL became too long.",
      );
    case 429:
      return new Error(
        `SSB rate limit exceeded (429). The documented limit is ${SSB_MAX_REQUESTS_PER_MINUTE} requests per minute per IP.`,
      );
    case 503:
      return new Error("SSB service is temporarily unavailable (503). Retry later.");
    default:
      return new Error(`SSB request failed with status ${status}.`);
  }
}
const SSB_GET_CACHE_TTL_MS = 5 * 60 * 1000;

type SsbGetCacheEntry = {
  expiresAt: number;
  value: unknown;
};

const ssbGetCache = new Map<string, SsbGetCacheEntry>();
const ssbGetInFlight = new Map<string, Promise<unknown>>();

function getSsbGetCacheKey(input: string, init?: RequestInit) {
  return JSON.stringify({
    input,
    method: init?.method ?? "GET",
    headers: init?.headers ?? null,
    next: init?.next ?? null,
    cache: init?.cache ?? null,
  });
}

function readCachedSsbGet<T>(cacheKey: string) {
  const cached = ssbGetCache.get(cacheKey);

  if (!cached) {
    return null;
  }

  if (Date.now() > cached.expiresAt) {
    ssbGetCache.delete(cacheKey);
    return null;
  }

  return cached.value as T;
}

function writeCachedSsbGet(cacheKey: string, value: unknown) {
  ssbGetCache.set(cacheKey, {
    value,
    expiresAt: Date.now() + SSB_GET_CACHE_TTL_MS,
  });
}
