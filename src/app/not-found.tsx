import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px", maxWidth: 500, margin: "0 auto" }}>
      <span style={{ fontSize: "4rem", display: "block", marginBottom: 16 }}>🔍</span>
      <h1 style={{ fontSize: "var(--font-size-2xl)", marginBottom: 8 }}>Page Not Found</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
        The page you are looking for doesn&apos;t exist or may have been moved.
        Try searching for jobs or browsing categories.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        <Link href="/" className="btn btn-primary">Go Home</Link>
        <Link href="/jobs" className="btn btn-secondary">Browse Jobs</Link>
        <Link href="/search" className="btn btn-outline">Search</Link>
      </div>
    </div>
  );
}
