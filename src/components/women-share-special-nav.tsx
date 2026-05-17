"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type WomenShareSpecialNavProps = {
  title: string;
};

export function WomenShareSpecialNav({ title }: WomenShareSpecialNavProps) {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    let animationFrame = 0;

    function updateTitleState() {
      const hero = document.getElementById("special-hero");
      const heroBottom = hero?.getBoundingClientRect().bottom ?? window.innerHeight;

      setShowTitle(heroBottom <= 88);
    }

    function handleScroll() {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateTitleState);
    }

    updateTitleState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/0 bg-[#070909]/34 px-3 py-3 text-white backdrop-blur-[3px] transition-colors duration-500 data-[active=true]:border-white/10 data-[active=true]:bg-[#070909]/82 data-[active=true]:backdrop-blur-xl sm:px-8 sm:py-4 lg:px-12" data-active={showTitle}>
      <nav className="mx-auto grid max-w-[1500px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)_minmax(0,1fr)] lg:gap-5">
        <p className="min-w-0 truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-white/78 min-[390px]:text-[10px] min-[390px]:tracking-[0.22em] sm:text-xs sm:tracking-[0.28em]">
          Lønnsinnsikt Spesial
        </p>

        <p
          className={[
            "hidden justify-self-center truncate text-center text-sm font-semibold tracking-[0.02em] text-white/88 transition-all duration-500 lg:block",
            showTitle ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
          ].join(" ")}
        >
          {title}
        </p>

        <div className="flex shrink-0 items-center justify-end gap-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/72 min-[390px]:gap-3 min-[390px]:text-[10px] min-[390px]:tracking-[0.14em] sm:gap-5 sm:text-xs sm:tracking-[0.2em]">
          <Link className="transition hover:text-white" href="/">
            Gå hjem
          </Link>
        </div>
      </nav>
    </header>
  );
}
