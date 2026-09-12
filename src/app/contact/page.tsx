import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = { title: "Contact Us", description: `Get in touch with ${SITE_NAME}. Report incorrect information, suggest improvements, or ask questions.` };

export default function ContactPage() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
      <div className="page-section" style={{ maxWidth: 600 }}>
        <h1>Contact Us</h1>
        <p style={{ color: "var(--text-secondary)", margin: "12px 0 24px", lineHeight: 1.7 }}>
          Have a question, found incorrect information, or want to report an issue?
          Fill out the form below and we will get back to you as soon as possible.
        </p>

        <form action="/api/contact" method="POST" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Your Name *</label>
            <input type="text" id="name" name="name" required className="form-input" placeholder="Full name" />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address *</label>
            <input type="email" id="email" name="email" required className="form-input" placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject *</label>
            <select id="subject" name="subject" required className="form-select">
              <option value="">Select a subject</option>
              <option value="incorrect_info">Report Incorrect Information</option>
              <option value="scam">Report a Scam/Fake Listing</option>
              <option value="broken_link">Report a Broken Link</option>
              <option value="suggestion">Suggestion / Feedback</option>
              <option value="creator">Join as Content Creator</option>
              <option value="business">Business Inquiry</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message" className="form-label">Message *</label>
            <textarea id="message" name="message" required className="form-textarea" rows={5} placeholder="Describe your question or issue in detail..." />
          </div>
          {/* Honeypot for bot detection */}
          <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>

        <p style={{ marginTop: 24, fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
          We typically respond within 1-2 business days. For urgent job-related queries,
          please contact the official employer or organization directly.
        </p>
      </div>
    </div>
  );
}
