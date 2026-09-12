import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = { title: "Terms & Conditions", description: `${SITE_NAME} Terms & Conditions — Rules and guidelines for using our platform.` };

export default function TermsPage() {
  const lastUpdated = "September 1, 2026";
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />
      <article className="page-section" style={{ maxWidth: 800 }}>
        <h1>Terms &amp; Conditions</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)", marginBottom: 24 }}>Last updated: {lastUpdated}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using {SITE_NAME}, you accept and agree to be bound by these terms. If you do not agree, please do not use our platform.</p>

        <h2>2. Nature of Service</h2>
        <p>{SITE_NAME} is an independent career information platform. We aggregate and curate job listings, internships, scholarships, and exam notifications from official sources. We are NOT a recruitment agency and do not guarantee employment.</p>

        <h2>3. No Employment Guarantee</h2>
        <p>We do not guarantee that any job listing is currently active, that deadlines are accurate, or that you will receive employment through our platform. Always verify details on the official website before applying.</p>

        <h2>4. User Accounts</h2>
        <p>You may sign in using Google OAuth. You are responsible for maintaining the security of your account. You agree not to share your account or use our platform for unauthorized purposes.</p>

        <h2>5. Acceptable Use</h2>
        <p>You agree not to: scrape or crawl our website beyond what is permitted by robots.txt; use automated tools to access our services; post false or misleading content; attempt to gain unauthorized access; use our platform for any illegal purpose.</p>

        <h2>6. Intellectual Property</h2>
        <p>Original editorial content, design, and branding on {SITE_NAME} are protected by copyright. Job information sourced from official notifications is attributed to the original source. You may share individual job links but may not reproduce our editorial content without permission.</p>

        <h2>7. Third-Party Links</h2>
        <p>Our platform contains links to external websites (official application portals, government websites). We are not responsible for the content, policies, or availability of these external sites.</p>

        <h2>8. Disclaimer of Warranties</h2>
        <p>Our services are provided &ldquo;as is&rdquo; without warranties of any kind. We do not warrant that our platform will be uninterrupted, error-free, or that information will always be current.</p>

        <h2>9. Limitation of Liability</h2>
        <p>{SITE_NAME} shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform, including but not limited to missed deadlines, incorrect information, or loss of opportunities.</p>

        <h2>10. Content Creators</h2>
        <p>Content creators who submit listings agree to our <a href="/creator-terms">Creator Terms</a>. Creators are responsible for the accuracy of submitted content.</p>

        <h2>11. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of modified terms.</p>

        <h2>12. Governing Law</h2>
        <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>

        <div className="disclaimer-box" style={{ marginTop: 32 }}>
          <strong>Note:</strong> These terms are a template and should be reviewed by a qualified legal professional before publication.
        </div>
      </article>
    </div>
  );
}
