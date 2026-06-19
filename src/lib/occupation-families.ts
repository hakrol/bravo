import { getOccupationGroupByCode } from "@/lib/occupation-groups";
import type { SsbNormalizedDataset } from "@/lib/types";

export type OccupationFamily = {
  code: string;
  slug: string;
  label: string;
  groupCode: string;
  groupLabel: string;
  groupIcon: string;
  medianMonthlySalary: number;
  occupationCount: number;
};

export function listOccupationFamilies(dataset: SsbNormalizedDataset) {
  const occupationDimensionCode = dataset.dimensions.find((dimension) =>
    dimension.toLocaleLowerCase("nb-NO").includes("yrke"),
  );
  const genderDimensionCode = dataset.dimensions.find((dimension) =>
    dimension.toLocaleLowerCase("nb-NO").includes("kjonn"),
  );

  if (!occupationDimensionCode || !genderDimensionCode) {
    throw new Error("Fant ikke forventede dimensjoner i SSB-datasettet for yrkesfamilier.");
  }

  const occupationCountByFamilyCode = new Map<string, number>();

  for (const row of dataset.rows) {
    const occupation = row.dimensions[occupationDimensionCode];
    const gender = row.dimensions[genderDimensionCode];

    if (
      occupation &&
      gender?.code === "0" &&
      /^\d{4}$/.test(occupation.code) &&
      occupation.code !== "0000" &&
      row.value !== null
    ) {
      const familyCode = occupation.code.slice(0, 3);
      occupationCountByFamilyCode.set(
        familyCode,
        (occupationCountByFamilyCode.get(familyCode) ?? 0) + 1,
      );
    }
  }

  return dataset.rows
    .flatMap((row) => {
      const occupation = row.dimensions[occupationDimensionCode];
      const gender = row.dimensions[genderDimensionCode];
      const occupationCount = occupation
        ? occupationCountByFamilyCode.get(occupation.code) ?? 0
        : 0;

      if (
        !occupation ||
        gender?.code !== "0" ||
        !/^\d{3}$/.test(occupation.code) ||
        occupation.code === "000" ||
        row.value === null ||
        occupationCount === 0
      ) {
        return [];
      }

      const groupCode = occupation.code.charAt(0);
      const group = getOccupationGroupByCode(groupCode);

      return [
        {
          code: occupation.code,
          slug: slugifyOccupationFamily(occupation.label),
          label: occupation.label,
          groupCode,
          groupLabel: group?.label ?? getFallbackOccupationGroupLabel(groupCode),
          groupIcon: group?.icon ?? getFallbackOccupationGroupIcon(groupCode),
          medianMonthlySalary: row.value,
          occupationCount,
        },
      ];
    })
    .sort((left, right) => left.label.localeCompare(right.label, "nb-NO"));
}

export function getOccupationFamilyBySlug(dataset: SsbNormalizedDataset, slug: string) {
  return listOccupationFamilies(dataset).find((family) => family.slug === slug) ?? null;
}

export function slugifyOccupationFamily(label: string) {
  return label
    .toLocaleLowerCase("nb-NO")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFallbackOccupationGroupLabel(groupCode: string) {
  if (groupCode === "0") {
    return "Militære yrker";
  }

  if (groupCode === "3") {
    return "Høyskoleyrker";
  }

  return "Andre yrker";
}

function getFallbackOccupationGroupIcon(groupCode: string) {
  if (groupCode === "0") {
    return "🎖️";
  }

  if (groupCode === "3") {
    return "🧰";
  }

  return "💼";
}
