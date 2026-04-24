"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { formatBlogDate, type BlogPostPreview } from "@/lib/blog-shared";

type BlogHeroCarouselProps = {
  posts: BlogPostPreview[];
};

const AUTO_ADVANCE_MS = 7000;

function getWrappedIndex(index: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return (index + total) % total;
}

export function BlogHeroCarousel({ posts }: BlogHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = useEffectEvent((index: number) => {
    setActiveIndex(getWrappedIndex(index, posts.length));
  });

  const goToNext = useEffectEvent(() => {
    setActiveIndex((current) => getWrappedIndex(current + 1, posts.length));
  });

  useEffect(() => {
    if (posts.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      goToNext();
    }, AUTO_ADVANCE_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [goToNext, posts.length]);

  if (posts.length === 0) {
    return null;
  }

  const activePost = posts[activeIndex];
  const previousPost = posts[getWrappedIndex(activeIndex - 1, posts.length)];
  const nextPost = posts[getWrappedIndex(activeIndex + 1, posts.length)];

  return (
    <section className="fade-up flex flex-col gap-8">
      <div className="flex flex-col gap-4 lg:max-w-[58rem]">
        <h1 className="text-6xl font-semibold tracking-[-0.085em] text-[var(--foreground)] sm:text-7xl">
          Blogg
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
          Innsikt om lønn, karriere og valg i arbeidslivet, skrevet for norske arbeidstakere og
          jobbsøkere.
        </p>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="mx-auto grid max-w-[1680px] items-center gap-5 px-4 lg:grid-cols-[minmax(0,0.2fr)_minmax(0,1fr)_minmax(0,0.2fr)] lg:px-6">
          <div className="hidden lg:block">
            <CarouselSideCard direction="left" post={previousPost} onClick={() => goToSlide(activeIndex - 1)} />
          </div>

          <article className="grid min-h-[440px] gap-8 rounded-[5px] border border-[rgba(27,36,48,0.06)] bg-white px-7 py-7 shadow-[0_18px_42px_rgba(27,36,48,0.04)] md:grid-cols-[minmax(0,0.78fr)_minmax(360px,1.02fr)] md:items-center md:px-8 md:py-8 lg:min-h-[480px] lg:gap-12 lg:px-10 lg:py-10">
            <div className="order-2 flex flex-col justify-center gap-6 md:order-1">
              <div className="space-y-4">
                <div className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Artikkel · {activePost.readingTimeMinutes} min lesetid
                </div>
                <h2 className="max-w-[10.5ch] text-4xl font-semibold tracking-[-0.075em] text-balance text-[var(--foreground)] sm:text-5xl lg:text-[4.25rem]">
                  <Link
                    className="transition duration-200 hover:text-[var(--primary-strong)]"
                    href={`/blogg/${activePost.slug}`}
                  >
                    {activePost.title}
                  </Link>
                </h2>
                <p className="max-w-xl text-lg leading-8 text-[var(--muted)]">{activePost.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[var(--foreground)]">Lønnsinnsikt</div>
                  <div className="text-sm text-[var(--muted)]">{formatBlogDate(activePost.publishedAt)}</div>
                </div>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] transition duration-200 hover:text-[var(--primary-strong)]"
                  href={`/blogg/${activePost.slug}`}
                >
                  Les artikkelen
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <Link
              aria-label={`Les ${activePost.title}`}
              className="order-1 block md:order-2"
              href={`/blogg/${activePost.slug}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[5px] bg-[rgba(27,36,48,0.04)]">
                <Image
                  alt={activePost.title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 52vw, 760px"
                  src={activePost.coverImage}
                />
              </div>
            </Link>
          </article>

          <div className="hidden lg:block">
            <CarouselSideCard direction="right" post={nextPost} onClick={() => goToSlide(activeIndex + 1)} />
          </div>
        </div>
      </div>
    </section>
  );
}

type CarouselSideCardProps = {
  direction: "left" | "right";
  post: BlogPostPreview;
  onClick: () => void;
};

function CarouselSideCard({ direction, post, onClick }: CarouselSideCardProps) {
  return (
    <button
      className={[
        "flex min-h-[340px] w-full flex-col justify-center gap-5 px-5 text-left transition duration-300 hover:opacity-74",
        direction === "left" ? "-translate-x-[14%] opacity-38" : "translate-x-[14%] opacity-38",
      ].join(" ")}
      type="button"
      onClick={onClick}
    >
      <div className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[rgba(27,36,48,0.34)]">
        Artikkel · {post.readingTimeMinutes} min lesetid
      </div>
      <h3 className="max-w-[11ch] text-[2.25rem] font-semibold tracking-[-0.07em] text-[rgba(27,36,48,0.28)]">
        {post.title}
      </h3>
      <div className="text-sm text-[rgba(27,36,48,0.3)]">{formatBlogDate(post.publishedAt)}</div>
    </button>
  );
}
