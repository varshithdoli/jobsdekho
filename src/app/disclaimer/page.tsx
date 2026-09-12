import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = { title: "Disclaimer", description: `${SITE_NAME} Disclaimer — Important information about our platform and limitations.` };

export default function DisclaimerPage() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />
      <article className="page-section" style={{ maxWidth: 800 }}>
        <h1>Disclaimer</h1>
        <div className="disclaimer-box" style={{ marginBottom: 24 }}>
          <strong>Important:</strong> Please read this disclaimer carefully before using {SITE_NAME}.
        </div>

        <h2>General Information</h2>
        <p>{SITE_NAME} is an independent career information platform. We are NOT affiliated with, endorsed by, or connected to any government body, company, employer, university, or organization listed on this website.</p>

        <h2>No Employment Guarantee</h2>
        <p>We do not guarantee employment, interview calls, or selection in any position listed on our platform. Job listings are provided for informational purposes only.</p>

        <h2>Information Accuracy</h2>
        <p>While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy, completeness, or timeliness of any information on our platform. Job details including deadlines, eligibility criteria, fees, and vacancies may change without notice. Always verify information on the official website before applying.</p>

        <h2>Editorial Content</h2>
        <p>Sections marked as editorial content (such as &ldquo;Who Should Apply&rdquo; and &ldquo;FAQs&rdquo;) are our own analysis and recommendations. They should not be treated as official information from the employer or organization.</p>

        <h2>External Links</h2>
        <p>Our platform contains links to external websites. We are not responsible for the content, availability, or privacy practices of these external sites. Clicking &ldquo;Apply&rdquo; buttons will redirect you to the official employer website.</p>

        <h2>Financial Advice</h2>
        <p>Salary figures mentioned in listings are indicative and may vary. We do not provide financial advice. Consult official sources for accurate salary and benefit information.</p>

        <h2>Anti-Fraud Warning</h2>
        <p><strong>Never pay anyone for a job, interview, or placement.</strong> Legitimate employers do not ask for money. If you encounter a suspicious listing on our platform, please <a href="/contact">report it immediately</a>.</p>
      </article>
    </div>
  );
}
