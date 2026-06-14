import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { NavGrunnbeloepHistorySnapshot } from "./nav";

const GENERATED_DIR = path.join(process.cwd(), "src", "lib", "generated");
const GRUNNBELOEP_HISTORY_PATH = path.join(GENERATED_DIR, "nav-grunnbeloep-history.json");

async function main() {
  const nav = await import(new URL("./nav.ts", import.meta.url).href);
  const entries = await nav.getRemoteGrunnbeloepHistory();
  const latest = entries[0];

  if (!latest) {
    throw new Error("NAV returnerte ingen grunnbelop-rader.");
  }

  const snapshot: NavGrunnbeloepHistorySnapshot = {
    version: 1,
    source: {
      name: "NAV",
      apiBaseUrl: nav.NAV_GRUNNBELOEP_BASE_URL,
      swaggerUrl: nav.NAV_GRUNNBELOEP_SWAGGER_URL,
      endpoint: "/api/v1/historikk/grunnbel%C3%B8p",
      documentedEndpoint: "/api/v1/historikk/grunnbeløp",
      downloadedAt: new Date().toISOString(),
    },
    notes: [
      "Frosset snapshot fra NAVs API for grunnbelop.",
      "NAVs historikk-endepunkt bruker norsk bokstav i URL-en. I kode er URL-en percent-encodet.",
      "Interne feltnavn er normalisert til ASCII for trygg TypeScript-bruk.",
      "Eldre rader kan mangle gjennomsnittPerAar, omregningsfaktor eller virkningstidspunktForMinsteinntekt.",
    ],
    count: entries.length,
    latest,
    entries,
  };

  await mkdir(GENERATED_DIR, { recursive: true });
  await writeFile(GRUNNBELOEP_HISTORY_PATH, JSON.stringify(snapshot, null, 2), "utf8");
  console.log(`Ferdig. Skrev ${entries.length} grunnbelop-rader til ${GRUNNBELOEP_HISTORY_PATH}.`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
