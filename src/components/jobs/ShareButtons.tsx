"use client";

import { useState } from "react";
import styles from "@/styles/components/share.module.css";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${siteUrl}/jobs/${slug}`;
  const text = `${title} — Apply now!`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback for older browsers */ }
  };

  return (
    <div className={styles.shareButtons}>
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text + "\n" + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.shareBtn} ${styles.whatsapp}`}
        aria-label="Share on WhatsApp"
      >
        WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.shareBtn} ${styles.telegram}`}
        aria-label="Share on Telegram"
      >
        Telegram
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.shareBtn} ${styles.linkedin}`}
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.shareBtn} ${styles.twitter}`}
        aria-label="Share on X (Twitter)"
      >
        X / Twitter
      </a>
      <button onClick={copyLink} className={`${styles.shareBtn} ${styles.copy}`}>
        {copied ? "✓ Copied!" : "📋 Copy Link"}
      </button>
    </div>
  );
}
