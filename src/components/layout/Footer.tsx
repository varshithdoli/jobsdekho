import Link from "next/link";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";
import styles from "@/styles/components/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span>💼</span>
              <span className={styles.logoText}>{SITE_NAME}</span>
            </Link>
            <p className={styles.tagline}>
              Discover verified career opportunities across India. Government jobs, IT jobs, internships, scholarships and more.
            </p>
            <div className={styles.trust}>
              <span>✅ Free to use</span>
              <span>🔒 Privacy-friendly</span>
              <span>📱 Mobile-friendly</span>
            </div>
          </div>

          {/* Categories */}
          <div className={styles.linkGroup}>
            <h3 className={styles.linkTitle}>Job Categories</h3>
            <ul className={styles.links}>
              {CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`}>{cat.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div className={styles.linkGroup}>
            <h3 className={styles.linkTitle}>More Categories</h3>
            <ul className={styles.links}>
              {CATEGORIES.slice(7).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`}>{cat.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className={styles.linkGroup}>
            <h3 className={styles.linkTitle}>Company</h3>
            <ul className={styles.links}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/editorial-policy">Editorial Policy</Link></li>
              <li><Link href="/verification-policy">Verification Policy</Link></li>
              <li><Link href="/correction-policy">Correction Policy</Link></li>
              <li><Link href="/creator-terms">Join as Creator</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.linkGroup}>
            <h3 className={styles.linkTitle}>Legal</h3>
            <ul className={styles.links}>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
              <li><Link href="/cookie-policy">Cookie Policy</Link></li>
              <li><Link href="/creator-earnings-policy">Creator Earnings</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            {SITE_NAME} is an independent career information platform. We are not affiliated with any government body or employer.
            Job information is sourced from official notifications and verified where possible. Always verify details on the official website before applying.
          </p>
        </div>
      </div>
    </footer>
  );
}
