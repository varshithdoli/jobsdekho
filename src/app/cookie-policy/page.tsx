import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = { title: "Cookie Policy", description: `${SITE_NAME} Cookie Policy` };

export default function CookiePolicyPage() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cookie Policy" }]} />
      <article className="page-section" style={{ maxWidth: 800 }}>
        <h1>Cookie Policy</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)", marginBottom: 24 }}>Last updated: September 1, 2026</p>

        <h2>What Are Cookies</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.</p>

        <h2>How We Use Cookies</h2>
        <h3>Essential Cookies</h3>
        <p>Required for authentication and session management. These cookies are necessary for the website to function and cannot be switched off.</p>
        <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 2 }}>
          <li><strong>Session cookie</strong> — Keeps you signed in during your visit</li>
          <li><strong>CSRF token</strong> — Protects against cross-site request forgery</li>
        </ul>

        <h3>Analytics Cookies</h3>
        <p>We may use Google Analytics to understand how visitors interact with our website. These cookies collect information anonymously and help us improve our service.</p>

        <h3>Advertising Cookies</h3>
        <p>We may use Google AdSense to display relevant advertisements. These cookies are used to show you ads based on your interests. You can opt out of personalized advertising through Google Ad Settings.</p>

        <h2>Managing Cookies</h2>
        <p>You can control and delete cookies through your browser settings. Blocking essential cookies may affect website functionality. Visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">aboutcookies.org</a> for guidance on managing cookies in your browser.</p>

        <h2>Changes</h2>
        <p>We may update this Cookie Policy from time to time. Changes will be posted on this page.</p>
      </article>
    </div>
  );
}
