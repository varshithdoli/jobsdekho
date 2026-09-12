import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = { title: "Editorial Policy", description: `${SITE_NAME} Editorial Policy — How we create and verify content.` };

export default function EditorialPolicyPage() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Editorial Policy" }]} />
      <article className="page-section" style={{ maxWidth: 800 }}>
        <h1>Editorial Policy</h1>

        <h2>Our Commitment</h2>
        <p>{SITE_NAME} is committed to providing accurate, timely, and useful career information to Indian job seekers. Every listing and article undergoes a review process before publication.</p>

        <h2>Content Sources</h2>
        <p>Our job listings are sourced from official channels including government notification portals, company career pages, and verified recruitment announcements. We always link to the official source.</p>

        <h2>Editorial vs Official Content</h2>
        <p>We clearly distinguish between official information and our editorial additions:</p>
        <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 2 }}>
          <li><strong>Official:</strong> Job title, organization, eligibility, dates, and apply links are sourced directly from official notifications.</li>
          <li><strong>Editorial:</strong> Sections like &ldquo;Who Should Apply,&rdquo; FAQs, and eligibility summaries are our editorial analysis to help candidates understand the opportunity better.</li>
        </ul>

        <h2>Verification Process</h2>
        <p>Before publishing, our team verifies: the source notification is genuine, apply links are working and point to official domains, key details (dates, eligibility, vacancies) are accurate, and the opportunity is currently active.</p>

        <h2>Corrections</h2>
        <p>If you find incorrect information, please report it through our <a href="/contact">Contact Page</a>. We investigate and correct verified errors promptly. See our <a href="/correction-policy">Correction Policy</a>.</p>

        <h2>Independence</h2>
        <p>{SITE_NAME} does not accept payment for editorial coverage. Sponsored listings are clearly marked. Editorial decisions are independent of advertising relationships.</p>
      </article>
    </div>
  );
}
