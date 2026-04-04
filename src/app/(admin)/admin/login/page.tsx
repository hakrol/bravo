import Link from "next/link";
import { loginAdmin } from "@/app/(admin)/admin/login/actions";
import { getAdminSession, isAdminAuthConfigured } from "@/lib/admin/auth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "invalid":
      return "Brukernavn eller passord er feil.";
    case "config":
      return "ADMIN_USERNAME, ADMIN_PASSWORD og ADMIN_SESSION_SECRET må settes før admin kan brukes.";
    default:
      return null;
  }
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const session = await getAdminSession();
  const resolvedSearchParams = await searchParams;
  const errorMessage = getErrorMessage(resolvedSearchParams.error);
  const isConfigured = isAdminAuthConfigured();

  if (session) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(20,83,45,0.10),transparent_40%),linear-gradient(180deg,#f7fbf8,#eef4ef)] px-5 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-[2rem] border border-[var(--border)] bg-white/95 p-8 shadow-[0_24px_70px_rgba(27,36,48,0.10)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
            Admin
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950">Du er allerede logget inn</h1>
          <p className="text-base leading-7 text-[var(--muted)]">
            Gå videre til dashboardet for å se status på innhold, SEO og datasett.
          </p>
          <Link
            className="inline-flex w-fit items-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
            href="/admin"
          >
            Åpne dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(20,83,45,0.10),transparent_40%),linear-gradient(180deg,#f7fbf8,#eef4ef)] px-5 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-start">
        <section className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-white/90 p-8 shadow-[0_24px_70px_rgba(27,36,48,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">Admin</p>
          <h1 className="max-w-2xl text-5xl font-semibold tracking-[-0.07em] text-balance text-slate-950">
            Oversikt over innhold, struktur og drift
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Denne flaten er kun for intern kontroll. Herfra kan du se hvilke sider og blogginnlegg som finnes,
            om metadata er komplette, og om SSB-datasettet ser friskt ut.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
              <p className="text-sm font-medium text-[var(--muted)]">Område</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">Innhold</p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
              <p className="text-sm font-medium text-[var(--muted)]">Kontroll</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">SEO og struktur</p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
              <p className="text-sm font-medium text-[var(--muted)]">Drift</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">Datasettstatus</p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-white/95 p-8 shadow-[0_24px_70px_rgba(27,36,48,0.10)]">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Logg inn</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Admin bruker miljøvariablene <code>ADMIN_USERNAME</code>, <code>ADMIN_PASSWORD</code> og{" "}
            <code>ADMIN_SESSION_SECRET</code>.
          </p>

          {errorMessage ? (
            <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {errorMessage}
            </div>
          ) : null}

          {!isConfigured ? (
            <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Admin er ikke konfigurert i miljøet ennå.
            </div>
          ) : null}

          <form action={loginAdmin} className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-900">Brukernavn</span>
              <input
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[var(--primary)]"
                name="username"
                type="text"
                autoComplete="username"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-900">Passord</span>
              <input
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[var(--primary)]"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>

            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={!isConfigured}
            >
              Åpne admin-dashboard
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
