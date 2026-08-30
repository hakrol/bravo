"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Ref } from "react";
import { MainNav } from "@/components/main-nav";
import { SiteBrand } from "@/components/site-brand";

const MOBILE_QUERY = "(max-width: 63.999rem)";
const TOP_OFFSET = 8;
const HIDE_THRESHOLD = 16;
const SHOW_THRESHOLD = 4;

type MainHeaderProps = Readonly<{
  regionRef?: Ref<HTMLElement>;
}>;

export function MainHeader({ regionRef }: MainHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const menuOpenRef = useRef(false);
  const focusWithinRef = useRef(false);

  const handleMenuOpenChange = useCallback((isOpen: boolean) => {
    menuOpenRef.current = isOpen;

    if (isOpen) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    let lastScrollY = window.scrollY;
    let accumulatedDistance = 0;
    let lastDirection = 0;
    let frameId: number | null = null;

    const updateVisibility = () => {
      frameId = null;
      const currentScrollY = Math.max(window.scrollY, 0);

      if (!mobileQuery.matches || currentScrollY <= TOP_OFFSET) {
        accumulatedDistance = 0;
        lastDirection = 0;
        lastScrollY = currentScrollY;
        setIsVisible(true);
        return;
      }

      if (menuOpenRef.current || focusWithinRef.current) {
        accumulatedDistance = 0;
        lastDirection = 0;
        lastScrollY = currentScrollY;
        setIsVisible(true);
        return;
      }

      const distance = currentScrollY - lastScrollY;
      const direction = Math.sign(distance);

      if (direction !== 0 && direction !== lastDirection) {
        accumulatedDistance = 0;
      }

      accumulatedDistance += distance;
      lastDirection = direction || lastDirection;
      lastScrollY = currentScrollY;

      if (accumulatedDistance >= HIDE_THRESHOLD) {
        setIsVisible(false);
        accumulatedDistance = 0;
      } else if (accumulatedDistance <= -SHOW_THRESHOLD) {
        setIsVisible(true);
        accumulatedDistance = 0;
      }
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateVisibility);
      }
    };

    const handleViewportChange = () => {
      lastScrollY = Math.max(window.scrollY, 0);
      accumulatedDistance = 0;
      lastDirection = 0;
      setIsVisible(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    mobileQuery.addEventListener("change", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mobileQuery.removeEventListener("change", handleViewportChange);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 bg-[#f4f7f1] px-5 py-3 transition-transform duration-200 ease-out motion-reduce:transition-none sm:px-6 lg:translate-y-0 lg:px-8 print:hidden",
        isVisible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
      ref={regionRef}
      onBlurCapture={(event) => {
        const nextFocusedElement = event.relatedTarget;

        if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) {
          focusWithinRef.current = false;
        }
      }}
      onFocusCapture={() => {
        focusWithinRef.current = true;
        setIsVisible(true);
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-visible">
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="min-w-0">
              <SiteBrand size="header" />
            </div>

            <MainNav onOpenChange={handleMenuOpenChange} />
          </div>
        </div>
      </div>
    </header>
  );
}
