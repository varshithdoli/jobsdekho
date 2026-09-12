import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = { title: "Privacy Policy", description: `${SITE_NAME} Privacy Policy — How we collect, use, and protect your personal data.` };

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 1, 2026";
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <article className="page-section" style={{ maxWidth: 800 }}>
        <h1>Privacy Policy</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)", marginBottom: 24 }}>Last updated: {lastUpdated}</p>

        <h2>1. Information We Collect</h2>
        <p>When you sign in with Google, we receive your name, email address, and profile picture from Google. We do not collect passwords. We also collect usage data such as pages viewed, search queries, and device information through analytics.</p>

        <h2>2. How We Use Your Information</h2>
        <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 2 }}>
          <li>To provide and maintain our service</li>
          <li>To enable features such as saved jobs and job alerts</li>
          <li>To improve our platform and user experience</li>
          <li>To detect and prevent fraud or abuse</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>3. Data Sharing</h2>
        <p>We do not sell your personal data. We may share anonymized, aggregated data with analytics providers. When you click an &ldquo;Apply&rdquo; link, you are redirected to the official employer website — we do not share your data with employers.</p>

        <h2>4. Cookies</h2>
        <p>We use essential cookies for authentication and session management. We may use analytics cookies (Google Analytics) to understand usage patterns. See our <a href="/cookie-policy">Cookie Policy</a> for details.</p>

        <h2>5. Data Security</h2>
        <p>We use industry-standard security measures including encrypted connections (SSL/TLS), secure authentication, and access controls to protect your data.</p>

        <h2>6. Your Rights</h2>
        <p>Under the Digital Personal Data Protection Act, 2023 (DPDPA), you have the right to access, correct, and request deletion of your personal data. Contact us at our <a href="/contact">Contact Page</a> to exercise these rights.</p>

        <h2>7. Data Retention</h2>
        <p>We retain your account data as long as your account is active. You may request deletion at any time. Analytics data is retained in anonymized form.</p>

        <h2>8. Third-Party Services</h2>
        <p>We use Google Analytics, Google OAuth, and may use Google AdSense. These services have their own privacy policies.</p>

        <h2>9. Children&apos;s Privacy</h2>
        <p>Our service is not directed to children under 13. We do not knowingly collect data from children.</p>

        <h2>10. Changes to This Policy</h2>
        <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>

        <h2>11. Grievance Officer</h2>
        <p>For data protection concerns, please contact us through our <a href="/contact">Contact Page</a>. We will respond within 30 days.</p>

        <div className="disclaimer-box" style={{ marginTop: 32 }}>
          <strong>Note:</strong> This privacy policy is a template and should be reviewed by a qualified legal professional before publication, especially for compliance with the DPDPA 2023 and IT Act 2000.
        </div>
      </article>
    </div>
  );
}
