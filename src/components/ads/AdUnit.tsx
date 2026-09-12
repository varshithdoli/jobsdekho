"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  style?: React.CSSProperties;
}

/**
 * Individual AdSense ad unit.
 * Usage: <AdUnit slot="1234567890" format="auto" responsive />
 */
export default function AdUnit({ slot, format = "auto", responsive = true, style }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!publisherId || process.env.NODE_ENV === "development") return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet
    }
  }, [publisherId]);

  if (!publisherId || process.env.NODE_ENV === "development") {
    return null;
  }

  return (
    <div ref={adRef} style={{ textAlign: "center", margin: "24px 0", ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
