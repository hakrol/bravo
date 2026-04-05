export type OccupationDescription = {
  occupationCode: string;
  intro: string;
};

const occupationDescriptions: Record<string, OccupationDescription> = {
  "2411": {
    occupationCode: "2411",
    intro:
      "Revisorer og regnskapsrådgivere arbeider med kontroll, kvalitetssikring og vurdering av økonomisk informasjon. Rollen omfatter ofte revisjon, regnskapsfaglige råd, etterlevelse av regelverk og oppfølging av rapportering, skatt og bokføring for virksomheter med ulike behov.",
  },
  "2412": {
    occupationCode: "2412",
    intro:
      "Finans- og investeringsrådgivere gir råd om sparing, finansiering og plassering av kapital ut fra kundens mål, tidshorisont og risikovilje. Arbeidet kan omfatte analyser, oppfølging av porteføljer, kundedialog og vurdering av hvilke finansielle løsninger som passer best.",
  },
  "2413": {
    occupationCode: "2413",
    intro:
      "Finansanalytikere vurderer selskaper, markeder og investeringer ved å bruke regnskapstall, nøkkeltall og prognoser. Jobben handler ofte om analyse, verdivurdering og beslutningsstøtte for investeringer, strategi og kapitalforvaltning.",
  },
  "3313": {
    occupationCode: "3313",
    intro:
      "Regnskapsførere arbeider med å føre regnskap, avstemme tall og sikre at økonomisk dokumentasjon er korrekt og oppdatert. Mange jobber også med lønn, skattemelding, årsoppgjør og rådgivning som hjelper virksomheter å få bedre oversikt over økonomien.",
  },
};

export function getOccupationDescription(occupationCode: string) {
  return occupationDescriptions[occupationCode] ?? null;
}

