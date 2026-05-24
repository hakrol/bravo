import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, type BlogPostPreview } from "@/lib/blog";

type HomeLatestBlogSectionProps = {
  posts: BlogPostPreview[];
};

export function HomeLatestBlogSection({ posts }: HomeLatestBlogSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-white px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Siste fra bloggen
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Praktiske guider og forklaringer som hjelper deg å bruke lønnstall bedre.
            </p>
          </div>

          <Link
            className="inline-flex w-fit items-center gap-3 text-sm font-semibold text-[var(--primary-strong)] transition hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
            href="/blogg"
          >
            Se alle innlegg
            <span aria-hidden="true" className="text-xl leading-none">
              →
            </span>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <article
              className="group flex h-full flex-col overflow-hidden rounded-md border border-black/8 bg-[#fbfbf8] shadow-[0_16px_38px_rgba(27,36,48,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(27,36,48,0.09)]"
              key={post.slug}
            >
              <Link className="relative block aspect-[16/10] overflow-hidden bg-[#eef6ef]" href={`/blogg/${post.slug}`}>
                <Image
                  alt={post.title}
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  src={post.coverImage}
                />
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {formatBlogDate(post.publishedAt)}
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-slate-950">
                  <Link
                    className="transition group-hover:text-[var(--primary-strong)]"
                    href={`/blogg/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--muted)]">
                  {post.description}
                </p>

                <Link
                  className="mt-6 inline-flex h-11 w-fit items-center justify-center rounded-md border border-black/10 bg-white px-4 text-sm font-semibold text-[var(--primary-strong)] shadow-[0_8px_20px_rgba(27,36,48,0.05)] transition hover:border-[var(--primary)]/30 hover:bg-[#eef6ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                  href={`/blogg/${post.slug}`}
                >
                  Les innlegget
                  <span aria-hidden="true" className="ml-3 text-base">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
