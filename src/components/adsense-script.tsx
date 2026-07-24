"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ADSENSE_CLIENT_ID = "ca-pub-3073306475357950";
const ADSENSE_SCRIPT_ID = "google-adsense";
const ADSENSE_EXCLUDED_PATHS = new Set(["/personvern"]);

export function AdsenseScript() {
  const pathname = usePathname();

  useEffect(() => {
    const existingScript = document.getElementById(ADSENSE_SCRIPT_ID);

    if (ADSENSE_EXCLUDED_PATHS.has(pathname)) {
      existingScript?.remove();
      return;
    }

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    document.head.appendChild(script);
  }, [pathname]);

  return null;
}
