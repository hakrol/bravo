import Image from "next/image";
import Link from "next/link";

type SiteBrandProps = {
  size?: "header" | "footer";
};

export function SiteBrand({ size = "header" }: SiteBrandProps) {
  const isHeader = size === "header";
  const imageSize = isHeader ? 34 : 38;

  return (
    <Link className="inline-flex min-w-0 items-center gap-3" href="/">
      <span
        aria-hidden="true"
        className={[
          "flex shrink-0 items-center justify-center",
          isHeader ? "h-9 w-9" : "h-10 w-10",
        ].join(" ")}
      >
        <Image
          alt=""
          className="h-auto w-full"
          height={imageSize}
          priority={isHeader}
          src="/Logo/Logo%20lonnsinnsikt.png"
          width={imageSize}
        />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
          {"L\u00f8nnsinnsikt"}
        </p>
        <p className="truncate text-sm text-[var(--muted)]">
          {"Full innsikt i l\u00f8nn"}
        </p>
      </div>
    </Link>
  );
}
