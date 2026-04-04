import Link from "next/link";
import { logoutAdmin } from "@/app/(admin)/admin/login/actions";
import { requireAdminSession } from "@/lib/admin/auth";

type AdminDashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(20,83,45,0.10),transparent_38%),linear-gradient(180deg,#f7fbf8,#edf3ef)] px-5 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-6 py-5 shadow-[0_18px_48px_rgba(27,36,48,0.08)] sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
                Admin
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">Nettstedsoversikt</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Logget inn som {session.username}. Denne flaten er lesende og brukes til å følge med på innhold,
                metadata og drift.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex items-center rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-[var(--primary)] hover:text-[var(--primary-strong)]"
                href="/"
              >
                Åpne nettstedet
              </Link>

              <form action={logoutAdmin}>
                <button
                  className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  type="submit"
                >
                  Logg ut
                </button>
              </form>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
