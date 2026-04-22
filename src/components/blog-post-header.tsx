import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, type BlogPost } from "@/lib/blog";

type BlogPostHeaderProps = {
  post: BlogPost;
};

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <header className="blog-post-hero">
      <div className="blog-post-hero-card">
        <div className="blog-post-hero-content">
          <nav aria-label="Brødsmuler" className="blog-post-hero-breadcrumb">
            <Link href="/blogg">Blogg</Link>
            <span aria-hidden="true">→</span>
            <span>{post.title}</span>
          </nav>

          <div>
            <time className="blog-post-hero-date" dateTime={post.publishedAt}>
              {formatBlogDate(post.publishedAt)}
            </time>
            <h1 className="blog-post-hero-title">{post.title}</h1>
            <p className="blog-post-hero-description">{post.description}</p>
          </div>

          <div className="blog-post-hero-author">
            <span>{post.author}</span>
            <span aria-hidden="true">•</span>
            <span>{post.readingTimeMinutes} min lesetid</span>
          </div>
        </div>

        <div className="blog-post-hero-image">
          <Image
            alt={post.title}
            className="blog-post-hero-img"
            fill
            priority
            quality={92}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 620px"
            src={post.coverImage}
          />
        </div>
      </div>
    </header>
  );
}
