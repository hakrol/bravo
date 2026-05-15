"use client";

import { useMemo, useState } from "react";

export type DictionaryEntry = Readonly<{
  term: string;
  definition: string;
}>;

type DictionaryFilterProps = Readonly<{
  entries: DictionaryEntry[];
}>;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ".split("");

export function DictionaryFilter({ entries }: DictionaryFilterProps) {
  const [activeLetter, setActiveLetter] = useState<string>("Alle");

  const availableLetters = useMemo(
    () => new Set(entries.map((entry) => entry.term.charAt(0).toUpperCase())),
    [entries],
  );

  const filteredEntries =
    activeLetter === "Alle"
      ? entries
      : entries.filter((entry) => entry.term.toUpperCase().startsWith(activeLetter));

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-2" aria-label="Filtrer ordbok etter bokstav">
        <button
          type="button"
          aria-pressed={activeLetter === "Alle"}
          className={[
            "min-h-10 rounded-[5px] border px-4 text-sm font-extrabold transition",
            activeLetter === "Alle"
              ? "border-[#14532d] bg-[#14532d] text-white shadow-[0_10px_24px_rgba(20,83,45,0.18)]"
              : "border-[rgba(27,36,48,0.14)] bg-white text-slate-700 hover:border-[#14532d] hover:text-[#14532d]",
          ].join(" ")}
          onClick={() => setActiveLetter("Alle")}
        >
          Alle
        </button>

        {alphabet.map((letter) => {
          const isActive = activeLetter === letter;
          const hasEntries = availableLetters.has(letter);

          return (
            <button
              key={letter}
              type="button"
              aria-pressed={isActive}
              disabled={!hasEntries}
              className={[
                "grid h-10 w-10 place-items-center rounded-[5px] border text-sm font-extrabold transition",
                isActive
                  ? "border-[#b45309] bg-[#b45309] text-white shadow-[0_10px_24px_rgba(180,83,9,0.18)]"
                  : "border-[rgba(27,36,48,0.14)] bg-white text-slate-700 hover:border-[#14532d] hover:text-[#14532d]",
                !hasEntries ? "cursor-not-allowed opacity-35 hover:border-[rgba(27,36,48,0.14)] hover:text-slate-700" : "",
              ].join(" ")}
              onClick={() => setActiveLetter(letter)}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredEntries.map((entry) => (
          <article
            key={entry.term}
            className="rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-5 shadow-[0_14px_36px_rgba(27,36,48,0.05)]"
          >
            <h2 className="text-xl font-extrabold leading-tight text-slate-950">{entry.term}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{entry.definition}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
