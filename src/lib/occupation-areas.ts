import { getOccupationGroupByCode } from "@/lib/occupation-groups";
import type { SsbNormalizedDataset } from "@/lib/types";

export type OccupationArea = {
  code: string;
  slug: string;
  label: string;
  groupCode: string;
  groupLabel: string;
  groupIcon: string;
  medianMonthlySalary: number;
  occupationCount: number;
};

export function listOccupationAreas(dataset: SsbNormalizedDataset) {
  const occupationDimensionCode = dataset.dimensions.find((dimension) =>
    dimension.toLocaleLowerCase("nb-NO").includes("yrke"),
  );
  const genderDimensionCode = dataset.dimensions.find((dimension) =>
    dimension.toLocaleLowerCase("nb-NO").includes("kjonn"),
  );

  if (!occupationDimensionCode || !genderDimensionCode) {
    throw new Error("Fant ikke forventede dimensjoner i SSB-datasettet for yrkesområder.");
  }

  const occupationCountByAreaCode = new Map<string, number>();

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
      const areaCode = occupation.code.slice(0, 2);
      occupationCountByAreaCode.set(
        areaCode,
        (occupationCountByAreaCode.get(areaCode) ?? 0) + 1,
      );
    }
  }

  return dataset.rows
    .flatMap((row) => {
      const occupation = row.dimensions[occupationDimensionCode];
      const gender = row.dimensions[genderDimensionCode];
      const occupationCount = occupation
        ? occupationCountByAreaCode.get(occupation.code) ?? 0
        : 0;

      if (
        !occupation ||
        gender?.code !== "0" ||
        !/^\d{2}$/.test(occupation.code) ||
        occupation.code === "00" ||
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
          slug: slugifyOccupationArea(occupation.label),
          label: occupation.label,
          groupCode,
          groupLabel: group?.label ?? "Andre yrker",
          groupIcon: group?.icon ?? "💼",
          medianMonthlySalary: row.value,
          occupationCount,
        },
      ];
    })
    .sort((left, right) => left.label.localeCompare(right.label, "nb-NO"));
}

export function getOccupationAreaBySlug(dataset: SsbNormalizedDataset, slug: string) {
  return listOccupationAreas(dataset).find((area) => area.slug === slug) ?? null;
}

export function slugifyOccupationArea(label: string) {
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
