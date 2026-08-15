import Image from "next/image";
import Link from "next/link";
import { editorialIdentity } from "@/lib/editorial-identity";
import { formatNewsDate, getNewsUpdatedAt, type NewsPost } from "@/lib/nyheter";

type NewsArticleHeaderProps = {
  post: NewsPost;
};

export function NewsArticleHeader({ post }: NewsArticleHeaderProps) {
  const updatedAt = getNewsUpdatedAt(post.publishedAt, post.updatedAt);

  return (
    <header>
      <nav aria-label="Brødsmuler" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
        <Link className="text-[var(--primary-strong)] hover:underline" href="/nyheter">
          Lønnsnytt
        </Link>
        <span aria-hidden="true">→</span>
        <span>{post.topic}</span>
      </nav>

      <div className="mt-10 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
          <span>{post.topic}</span>
          {post.isTest ? (
            <span className="rounded-[3px] bg-[#fff0d9] px-2.5 py-1.5 text-[#8a4307]">Testartikkel</span>
          ) : null}
        </div>

        <h1 className="mt-5 text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] text-slate-950 sm:text-7xl">
          {post.title}
        </h1>
        <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">{post.description}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 border-y border-black/10 py-4 text-sm text-slate-600">
          <span>Av</span>
          <Link className="font-bold text-[var(--primary-strong)] hover:underline" href={editorialIdentity.authorPath}>
            {post.author}
          </Link>
          <span aria-hidden="true">•</span>
          <time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time>
          {updatedAt ? (
            <>
              <span aria-hidden="true">•</span>
              <span>
                Oppdatert <time dateTime={updatedAt}>{formatNewsDate(updatedAt)}</time>
              </span>
            </>
          ) : null}
          <span aria-hidden="true">•</span>
          <span>{post.readingTimeMinutes} min lesetid</span>
        </div>
      </div>

      <figure className="mt-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[5px] bg-[#e9eee7]">
          <Image
            alt={post.coverImageAlt}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1152px"
            src={post.coverImage}
          />
        </div>
        <figcaption className="mt-3 text-sm leading-6 text-slate-500">
          {post.imageCaption ?? post.coverImageAlt}
        </figcaption>
      </figure>
    </header>
  );
}
