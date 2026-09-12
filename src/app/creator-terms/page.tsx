import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = { title: "Creator Terms", description: `${SITE_NAME} Creator Terms — Guidelines for content creators.` };

export default function CreatorTermsPage() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Creator Terms" }]} />
      <article className="page-section" style={{ maxWidth: 800 }}>
        <h1>Creator Terms</h1>

        <h2>1. Who Can Be a Creator</h2>
        <p>Anyone can apply to become a content creator on {SITE_NAME}. Creators submit job listings for review and potential publication. Approval is at our discretion.</p>

        <h2>2. Content Standards</h2>
        <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 2 }}>
          <li>Only submit genuine, verified job opportunities from official sources</li>
          <li>Include the official apply URL — never link to your own website or affiliate</li>
          <li>Include the official notification link where available</li>
          <li>Accurately represent eligibility, salary, dates, and other details</li>
          <li>Do not submit duplicate listings already on the platform</li>
          <li>Do not submit fraudulent, misleading, or scam opportunities</li>
        </ul>

        <h2>3. Review Process</h2>
        <p>All submissions go through editorial review before publication. We may edit submissions for clarity, accuracy, or formatting. Submissions that do not meet our standards will be rejected with a reason.</p>

        <h2>4. Reputation System</h2>
        <p>Creators build reputation based on submission quality. Consistently accurate submissions earn higher trust. Repeated inaccurate or low-quality submissions may result in reduced review priority or account suspension.</p>

        <h2>5. Prohibited Content</h2>
        <p>Creators must not submit: fake or non-existent job postings, listings requiring payment from applicants, multi-level marketing or pyramid schemes, listings that discriminate based on protected characteristics, or any content that violates Indian law.</p>

        <h2>6. Account Suspension</h2>
        <p>{SITE_NAME} reserves the right to suspend or ban creator accounts that violate these terms, submit fraudulent content, or abuse the platform.</p>

        <h2>7. Intellectual Property</h2>
        <p>By submitting content, you grant {SITE_NAME} a non-exclusive, royalty-free license to publish, edit, and display the submitted content on our platform.</p>
      </article>
    </div>
  );
}
