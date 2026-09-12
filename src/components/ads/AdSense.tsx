"use client";

import { useEffect } from "react";

/**
 * Google AdSense auto-ads script loader.
 * Add your AdSense publisher ID in .env.local as NEXT_PUBLIC_ADSENSE_ID
 * Example: NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
 */
export default function AdSense() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!publisherId) return;

    // Don't load in development
    if (process.env.NODE_ENV === "development") return;

    // Check if script is already loaded
    if (document.querySelector(`script[src*="pagead2.googlesyndication.com"]`)) return;

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [publisherId]);

  return null;
}
