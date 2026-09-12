import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = { title: "About Us", description: `Learn about ${SITE_NAME} — India's trusted career opportunities platform.` };

export default function AboutPage() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
      <article className="page-section" style={{ maxWidth: 800 }}>
        <h1>About {SITE_NAME}</h1>
        <p style={{ color: "var(--text-secondary)", margin: "12px 0 24px", lineHeight: 1.7 }}>
          {SITE_NAME} is an independent career information platform dedicated to helping Indian students,
          fresh graduates, and job seekers discover verified career opportunities across India.
        </p>
        <h2>Our Mission</h2>
        <p style={{ lineHeight: 1.7, margin: "8px 0 20px" }}>
          We believe every Indian job seeker deserves access to verified, well-organized career information
          without wading through spam, scams, or misleading listings. Our mission is to curate opportunities
          from official sources and present them with genuine editorial value.
        </p>
        <h2>What We Cover</h2>
        <ul style={{ lineHeight: 2, margin: "8px 0 20px", paddingLeft: 20, listStyle: "disc" }}>
          <li>Government Jobs (Central, State, PSU, SSC, UPSC)</li>
          <li>IT & Technology Jobs</li>
          <li>Banking & Finance Jobs</li>
          <li>Railway & Defence Recruitment</li>
          <li>Internships & Apprenticeships</li>
          <li>Walk-in Interviews</li>
          <li>Remote & Work-from-Home Opportunities</li>
          <li>Scholarships & Competitive Exams</li>
        </ul>
        <h2>How We Work</h2>
        <p style={{ lineHeight: 1.7, margin: "8px 0 20px" }}>
          Our team monitors official government notifications, company career pages, and verified
          recruitment portals. Each listing is reviewed for accuracy and supplemented with original
          editorial content including eligibility summaries, who should apply guidance, and FAQs.
          We clearly distinguish between officially verified information and our editorial additions.
        </p>
        <h2>What We Are Not</h2>
        <p style={{ lineHeight: 1.7, margin: "8px 0 20px" }}>
          {SITE_NAME} is not a recruitment agency. We do not collect job applications, charge fees,
          or guarantee employment. We are an information platform that helps you discover opportunities
          and directs you to official application portals.
        </p>
        <h2>Contact Us</h2>
        <p style={{ lineHeight: 1.7 }}>
          Have questions, feedback, or want to report incorrect information?
          Visit our <a href="/contact">Contact Page</a>.
        </p>
      </article>
    </div>
  );
}
