import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { formatAdminTimestamp, getAdminDashboardSnapshot } from "@/lib/admin/audit";
import type { AdminContentItem, AdminIssue } from "@/lib/admin/types";

function IssueList({ issues }: { issues: AdminIssue[] }) {
  if (issues.length === 0) {
    return <p className="text-sm text-[var(--muted)]">Ingen avvik funnet.</p>;
  }

  return (
    <ul className="space-y-2 text-sm text-slate-700">
      {issues.map((issue) => (
        <li key={`${issue.status}:${issue.label}`} className="rounded-2xl border border-black/5 bg-black/[0.02] px-3 py-2">
          <span className="font-medium text-slate-950">{issue.label}</span>
          {issue.details ? <span className="text-[var(--muted)]"> · {issue.details}</span> : null}
        </li>
      ))}
    </ul>
  );
}

function ContentTypeLabel({ item }: { item: AdminContentItem }) {
  switch (item.type) {
    case "side":
      return "Side";
    case "blogg":
      return "Blogg";
    case "rutegruppe":
      return "Rutegruppe";
  }
}

export default async function AdminDashboardPage() {
  const snapshot = await getAdminDashboardSnapshot();

  return (
    <main className="space-y-6">
      {snapshot.sectionIssues.length > 0 ? (
        <section className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">Delvise feil</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-rose-950">
                Ikke alle kilder kunne leses
              </h2>
            </div>
            <AdminStatusBadge status="error" />
          </div>
          <div className="mt-4">
            <IssueList issues={snapshot.sectionIssues} />
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <article className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-5 py-5 shadow-sm xl:col-span-2">
          <p className="text-sm font-medium text-[var(--muted)]">Sist oppdatert oversikt</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {formatAdminTimestamp(snapshot.overview.lastGeneratedAt)}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Siste datasynk: {formatAdminTimestamp(snapshot.overview.lastDataSyncAt)}
          </p>
        </article>

        <article className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-5 py-5 shadow-sm">
          <p className="text-sm font-medium text-[var(--muted)]">Blogginnlegg</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
            {snapshot.overview.blogPostCount}
          </p>
        </article>

        <article className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-5 py-5 shadow-sm">
          <p className="text-sm font-medium text-[var(--muted)]">Sider og rutegrupper</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
            {snapshot.overview.trackedPageCount}
          </p>
        </article>

        <article className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-5 py-5 shadow-sm">
          <p className="text-sm font-medium text-[var(--muted)]">Varsler</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-amber-700">
            {snapshot.overview.warningCount}
          </p>
        </article>

        <article className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-5 py-5 shadow-sm">
          <p className="text-sm font-medium text-[var(--muted)]">Feil</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-rose-700">
            {snapshot.overview.errorCount}
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-6 py-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                  Innhold
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">Sider og blogg</h2>
              </div>
              <p className="text-sm text-[var(--muted)]">{snapshot.contentItems.length} elementer overvåkes</p>
            </div>

            <div className="mt-4 space-y-4">
              {snapshot.contentItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                          <ContentTypeLabel item={item} />
                        </span>
                        <AdminStatusBadge status={item.status} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                      <div className="space-y-1 text-sm text-[var(--muted)]">
                        <p>URL: {item.url}</p>
                        <p>Canonical: {item.canonical ?? "Mangler"}</p>
                        <p>Metadata-tittel: {item.metadataTitle ?? "Mangler"}</p>
                        <p>Sist oppdaget: {formatAdminTimestamp(item.lastUpdated)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <IssueList issues={item.issues} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-6 py-6 shadow-sm">
            <div className="border-b border-[var(--border)] pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                SEO og struktur
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">Kontroller</h2>
            </div>

            <div className="mt-4 space-y-4">
              {snapshot.seoChecks.map((check) => (
                <article
                  key={check.id}
                  className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 md:flex-row md:items-start md:justify-between"
                >
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">{check.label}</h3>
                    <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{check.details}</p>
                  </div>
                  <AdminStatusBadge status={check.status} />
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-6 py-6 shadow-sm">
          <div className="border-b border-[var(--border)] pb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
              Data og drift
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">SSB-datasett</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Oversikten leser manifestet for genererte filer og markerer tomme eller gamle datasett.
            </p>
          </div>

          <div className="mt-4 space-y-4">
            {snapshot.datasetChecks.map((dataset) => (
              <article key={dataset.id} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">{dataset.label}</h3>
                    <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                      <p>Tabell: {dataset.tableId}</p>
                      <p>Fil: {dataset.fileName}</p>
                      <p>Rader: {dataset.rowCount}</p>
                      <p>Oppdatert hos kilde: {formatAdminTimestamp(dataset.updated)}</p>
                      <p>Manifest generert: {formatAdminTimestamp(dataset.generatedAt)}</p>
                    </div>
                  </div>

                  <AdminStatusBadge status={dataset.status} />
                </div>

                <div className="mt-4">
                  <IssueList issues={dataset.issues} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
