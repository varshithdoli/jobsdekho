import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = { title: "Verification Policy", description: `${SITE_NAME} Verification Policy — How we verify job listings.` };

export default function VerificationPolicyPage() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Verification Policy" }]} />
      <article className="page-section" style={{ maxWidth: 800 }}>
        <h1>Verification Policy</h1>

        <h2>Verification Standards</h2>
        <p>Every listing on {SITE_NAME} goes through a verification process. Listings marked with a ✅ verified badge have been checked against official sources.</p>

        <h2>What We Verify</h2>
        <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 2 }}>
          <li>The organization exists and is legitimate</li>
          <li>The official notification or job posting is genuine</li>
          <li>Apply links point to official domains (not third-party)</li>
          <li>Key dates (deadlines, exam dates) are accurate</li>
          <li>Eligibility criteria matches the official notification</li>
          <li>Salary and vacancy information is current</li>
        </ul>

        <h2>Verification Levels</h2>
        <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 2 }}>
          <li><strong>Verified ✅:</strong> Cross-checked with official notification. Apply link confirmed working.</li>
          <li><strong>Unverified:</strong> Sourced from credible channels but not independently cross-checked. Use caution and verify on the official website.</li>
        </ul>

        <h2>Re-verification</h2>
        <p>Published listings are periodically re-checked for accuracy, especially around deadline dates. Expired or changed listings are updated or archived.</p>

        <h2>Limitations</h2>
        <p>Despite our best efforts, information can change without notice. Always verify critical details (eligibility, fees, dates) on the official website before applying. {SITE_NAME} is not responsible for changes made by the employer after our verification.</p>
      </article>
    </div>
  );
}
