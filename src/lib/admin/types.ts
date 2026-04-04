export type AdminStatus = "ok" | "warning" | "error";

export type AdminIssue = {
  status: AdminStatus;
  label: string;
  details?: string;
};

export type AdminOverview = {
  blogPostCount: number;
  trackedPageCount: number;
  indexedRouteCount: number;
  datasetCount: number;
  warningCount: number;
  errorCount: number;
  lastGeneratedAt: string;
  lastDataSyncAt: string | null;
};

export type AdminContentItem = {
  id: string;
  type: "side" | "blogg" | "rutegruppe";
  title: string;
  url: string;
  canonical: string | null;
  metadataTitle: string | null;
  description: string | null;
  lastUpdated: string | null;
  status: AdminStatus;
  issues: AdminIssue[];
};

export type AdminSeoCheck = {
  id: string;
  label: string;
  status: AdminStatus;
  details: string;
};

export type AdminDatasetCheck = {
  id: string;
  label: string;
  tableId: string;
  fileName: string;
  updated: string | null;
  generatedAt: string | null;
  rowCount: number;
  status: AdminStatus;
  issues: AdminIssue[];
};

export type AdminDashboardSnapshot = {
  generatedAt: string;
  overview: AdminOverview;
  contentItems: AdminContentItem[];
  seoChecks: AdminSeoCheck[];
  datasetChecks: AdminDatasetCheck[];
  sectionIssues: AdminIssue[];
};
