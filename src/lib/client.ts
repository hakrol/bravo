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
  const response = await fetch(url, {
    ...options.init,
    headers: {
      Accept: "application/json",
      ...options.init?.headers,
    },
  });

  if (!response.ok) {
    throw createSsbHttpError(response.status as SsbHttpErrorCode, url.toString());
  }

  return (await response.json()) as T;
}

export async function ssbPostJson<T>(
  path: string,
  body: SsbPostBody,
  options: RequestOptions = {},
): Promise<T> {
  const url = buildSsbUrl(path, options);
  const response = await fetch(url, {
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
