import assert from "node:assert/strict";
import test from "node:test";
import { searchRealWageOccupations, type OccupationRealWageData } from "./occupation-real-wage";

const occupations: OccupationRealWageData["occupations"] = [
  { code: "2221", label: "Spesialsykepleiere", salaries: [] },
  { code: "2223", label: "Sykepleiere", salaries: [] },
  { code: "7131", label: "Malere og byggtapetserere", salaries: [] },
  { code: "7126", label: "Rørleggere og VVS-montører", salaries: [] },
  { code: "8211", label: "Montører av mekaniske produkter", salaries: [] },
];

test("yrkessøk viser treff på yrkesnavn og prioriterer navn som begynner med søkeordet", () => {
  const matches = searchRealWageOccupations(occupations, "  SYKEPLEIER  ");
  assert.deepEqual(matches.map((item) => item.code), ["2223", "2221"]);
  assert.equal(searchRealWageOccupations(occupations, "Sykepleiere")[0].code, "2223");
});

test("yrkessøk støtter koder, flere ord og norske bokstaver skrevet uten diakritiske tegn", () => {
  assert.deepEqual(searchRealWageOccupations(occupations, "7126").map((item) => item.code), ["7126"]);
  assert.deepEqual(searchRealWageOccupations(occupations, "rorlegger").map((item) => item.code), ["7126"]);
  assert.deepEqual(searchRealWageOccupations(occupations, "VVS   RØR").map((item) => item.code), ["7126"]);
  assert.deepEqual(searchRealWageOccupations(occupations, "montor mekanisk").map((item) => item.code), ["8211"]);
});

test("tomt søk, ingen treff og sortering endrer ikke den opprinnelige yrkeslisten", () => {
  const original = occupations.map((item) => item.code);
  assert.deepEqual(searchRealWageOccupations(occupations, " \t "), occupations);
  assert.deepEqual(searchRealWageOccupations(occupations, "finnesikke"), []);
  searchRealWageOccupations(occupations, "sykepleier");
  assert.deepEqual(occupations.map((item) => item.code), original);
});
