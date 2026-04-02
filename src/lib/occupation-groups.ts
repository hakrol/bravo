export type OccupationGroup = {
  code: string;
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
};

const occupationGroups: OccupationGroup[] = [
  {
    code: "1",
    slug: "ledere",
    label: "Ledere",
    shortLabel: "Ledere",
    description: "Yrkesfeltet omfatter ledelsesroller på tvers av privat og offentlig sektor.",
  },
  {
    code: "2",
    slug: "akademiske-yrker",
    label: "Akademiske yrker",
    shortLabel: "Akademiske yrker",
    description: "Yrkesfeltet omfatter stillinger som vanligvis krever lang høyere utdanning.",
  },
  {
    code: "4",
    slug: "kontoryrker",
    label: "Kontoryrker",
    shortLabel: "Kontoryrker",
    description: "Yrkesfeltet omfatter kontorarbeid, administrasjon og støttefunksjoner.",
  },
  {
    code: "5",
    slug: "salgs-og-serviceyrker",
    label: "Salgs- og serviceyrker",
    shortLabel: "Salg og service",
    description: "Yrkesfeltet omfatter serviceyrker, kundearbeid og omsorgsrettede roller.",
  },
  {
    code: "6",
    slug: "bonder-fiskere-mv",
    label: "Bønder, fiskere mv.",
    shortLabel: "Jordbruk og fiske",
    description: "Yrkesfeltet omfatter jordbruk, skogbruk, fiske og nærliggende primærnæringer.",
  },
  {
    code: "7",
    slug: "handverkere",
    label: "Håndverkere",
    shortLabel: "Håndverkere",
    description: "Yrkesfeltet omfatter håndverksfag, byggfag og andre praktiske fagyrker.",
  },
  {
    code: "8",
    slug: "prosess-og-maskinoperatorer-transport",
    label: "Prosess- og maskinoperatører, transportarbeidere mv.",
    shortLabel: "Operatører og transport",
    description: "Yrkesfeltet omfatter prosessindustri, maskindrift og transportarbeid.",
  },
  {
    code: "9",
    slug: "renholdere-hjelpearbeidere-mv",
    label: "Renholdere, hjelpearbeidere mv.",
    shortLabel: "Renhold og hjelpearbeid",
    description: "Yrkesfeltet omfatter renhold, hjelpearbeid og andre yrker uten formelle krav til utdanning.",
  },
];

export function listOccupationGroups() {
  return occupationGroups;
}

export function getOccupationGroupBySlug(slug: string) {
  return occupationGroups.find((group) => group.slug === slug) ?? null;
}

export function getOccupationGroupByCode(code: string) {
  return occupationGroups.find((group) => group.code === code) ?? null;
}
