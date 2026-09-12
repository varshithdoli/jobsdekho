import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = { title: "Correction Policy", description: `${SITE_NAME} Correction Policy — How we handle errors and corrections.` };

export default function CorrectionPolicyPage() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Correction Policy" }]} />
      <article className="page-section" style={{ maxWidth: 800 }}>
        <h1>Correction Policy</h1>

        <h2>Our Approach</h2>
        <p>{SITE_NAME} strives for accuracy in all content. When errors are identified, we correct them promptly and transparently.</p>

        <h2>Reporting Errors</h2>
        <p>If you find incorrect information on our platform, please report it through our <a href="/contact">Contact Page</a> selecting &ldquo;Report Incorrect Information.&rdquo; Include the specific page URL, the incorrect detail, and the correct information with source if available.</p>

        <h2>Correction Process</h2>
        <ol style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>Report is received and acknowledged within 24 hours.</li>
          <li>Our team verifies the reported error against official sources.</li>
          <li>If confirmed, the correction is made immediately.</li>
          <li>For significant errors affecting eligibility or deadlines, a correction note is added to the listing.</li>
        </ol>

        <h2>Transparency</h2>
        <p>Major corrections are noted on the affected page. We do not silently alter published content when the change could affect a candidate&apos;s decision to apply.</p>
      </article>
    </div>
  );
}
