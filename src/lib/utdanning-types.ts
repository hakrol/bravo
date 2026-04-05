export type UtdanningOccupationApiResponse = {
  title?: string;
  body?: {
    value?: string;
    summary?: string;
  };
  sammenligning_id?: string;
  yrke_sist_kvalitetssikret?: string;
  yrke_hvor_jobber?: string | null;
  yrke_personegenskaper?: string | null;
  yrke_utdanning?: string | null;
  yrke_evu?: string | null;
  styrk08?: Array<{
    title?: string;
    styrk08_kode?: string;
  }>;
  interesse?: Array<{
    title?: string;
  }>;
  arbeidsoppgave?: Array<{
    title?: string;
  }>;
};

export type UtdanningOccupationSource = {
  sammenligningId: string;
  title: string;
  sourceUrl: string;
  summary: string;
  bodyText: string;
  whereWorks?: string;
  education?: string;
  furtherEducation?: string;
  qualities?: string;
  workTasks: string[];
  interests: string[];
  styrk08Codes: string[];
  reviewedAt?: string;
};

export type GeneratedOccupationDescription = {
  intro: string;
  workTasks: string[];
  whereWorks?: string;
  education?: string;
  qualities?: string;
  sourceTitle: string;
  sourceUrl: string;
  reviewedAt?: string;
  attribution: string;
};
