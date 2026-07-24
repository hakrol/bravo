import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, getBlogUpdatedAt, type BlogPost } from "@/lib/blog";
import { getBlogCategory } from "@/lib/blog-taxonomy";
import { editorialIdentity } from "@/lib/editorial-identity";

type BlogPostHeaderProps = {
  post: BlogPost;
};

const aiCaptionText = "Illustrasjonen er AI-generert og brukes for visualisering av temaet.";

function sentence(value: string) {
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const coverImageDescription = post.coverImageAlt ?? `Illustrasjon til artikkelen ${post.title}`;
  const category = getBlogCategory(post.category);
  const updatedAt = getBlogUpdatedAt(post.publishedAt, post.updatedAt);

  return (
    <header className="blog-post-hero">
      <div className="blog-post-hero-card">
        <div className="blog-post-hero-heading">
          <h1 className="blog-post-hero-title" lang="nb">
            {post.title}
          </h1>
        </div>

        <figure className="blog-post-hero-figure">
          <div className="blog-post-hero-image">
            <Image
              alt={coverImageDescription}
              className="blog-post-hero-img"
              fill
              priority
              quality={92}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 92vw, 1120px"
              src={post.coverImage}
            />
          </div>
          <figcaption className="blog-post-hero-caption">
            {sentence(coverImageDescription)} {post.coverImageAiGenerated ? aiCaptionText : null}
          </figcaption>
        </figure>

        <div className="blog-post-hero-content">
          <div className="blog-post-meta-chips">
            {category ? (
              <Link className="blog-meta-chip" href={category.href}>
                {category.label}
              </Link>
            ) : null}
            {post.tags?.map((tag) => (
              <span key={tag} className="blog-meta-chip blog-meta-chip-muted">
                {tag}
              </span>
            ))}
          </div>

          <p className="blog-post-hero-description">{post.description}</p>

          <div className="blog-post-hero-author">
            <Link className="blog-post-hero-author-link" href={editorialIdentity.authorPath}>
              {post.author}
            </Link>
            <span aria-hidden="true">•</span>
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
            {updatedAt ? (
              <>
                <span aria-hidden="true">•</span>
                <span>
                  Oppdatert <time dateTime={updatedAt}>{formatBlogDate(updatedAt)}</time>
                </span>
              </>
            ) : null}
            <span aria-hidden="true">•</span>
            <span>{post.readingTimeMinutes} min lesetid</span>
          </div>
        </div>
      </div>
    </header>
  );
}
