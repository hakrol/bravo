import { getAdminStatusClasses } from "@/lib/admin/audit";
import type { AdminStatus } from "@/lib/admin/types";

type AdminStatusBadgeProps = {
  status: AdminStatus;
};

const labels: Record<AdminStatus, string> = {
  ok: "OK",
  warning: "Varsel",
  error: "Feil",
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        getAdminStatusClasses(status),
      ].join(" ")}
    >
      {labels[status]}
    </span>
  );
}
