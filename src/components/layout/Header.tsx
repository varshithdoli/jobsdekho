"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";
import styles from "@/styles/components/header.module.css";

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const user = session?.user;
  const role = (user as { role?: string })?.role;

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.logo} aria-label="JobsDekho Home">
            <span className={styles.logoIcon}>💼</span>
            <span className={styles.logoText}>{SITE_NAME}</span>
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            <Link href="/jobs" className={styles.navLink}>All Jobs</Link>
            <Link href="/companies" className={styles.navLink}>Companies</Link>
            <div
              className={styles.dropdown}
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                className={styles.navLink}
                aria-expanded={categoriesOpen}
                aria-haspopup="true"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                Categories
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </button>
              {categoriesOpen && (
                <div className={styles.dropdownMenu} role="menu">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      className={styles.dropdownItem}
                      role="menuitem"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      <span className={styles.dropdownIcon}>{cat.icon}</span>
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/search" className={styles.navLink}>Search</Link>
          </nav>

          <div className={styles.actions}>
            {user ? (
              <div className={styles.dropdown} ref={userMenuRef}>
                <button
                  className={styles.userBtn}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {user.image ? (
                    <img src={user.image} alt="" className={styles.avatar} width={32} height={32} referrerPolicy="no-referrer" />
                  ) : (
                    <span className={styles.avatarPlaceholder}>
                      {user.name?.[0] || user.email?.[0] || "U"}
                    </span>
                  )}
                </button>
                {userMenuOpen && (
                  <div className={styles.userMenu}>
                    <div className={styles.userInfo}>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <hr className={styles.divider} />
                    <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>Dashboard</Link>
                    <Link href="/dashboard/profile" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>My Profile</Link>
                    <Link href="/dashboard/bookmarks" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>Saved Jobs</Link>
                    <Link href="/dashboard/applications" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>My Applications</Link>
                    {role === "creator" || role === "admin" ? (
                      <Link href="/creator" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>Creator Portal</Link>
                    ) : null}
                    {role === "admin" ? (
                      <Link href="/admin" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>Admin Panel</Link>
                    ) : null}
                    <hr className={styles.divider} />
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }} className={styles.dropdownItem}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link href="/login" className={styles.signInLink}>
                  Sign In
                </Link>
                <Link href="/login?mode=signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}

            <button
              className={styles.menuBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className={`mobile-overlay active`} onClick={() => setMobileOpen(false)} />
      )}
      <nav className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ""}`} aria-label="Mobile navigation">
        <div className={styles.mobileNavHeader}>
          <span className={styles.logoText}>{SITE_NAME}</span>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className={styles.closeBtn}>✕</button>
        </div>
        <Link href="/jobs" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>All Jobs</Link>
        <Link href="/search" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Search</Link>
        <div className={styles.mobileDivider}>Categories</div>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className={styles.mobileLink}
            onClick={() => setMobileOpen(false)}
          >
            <span>{cat.icon}</span> {cat.label}
          </Link>
        ))}
        {!user && (
          <div className={styles.mobileActions}>
            <Link
              href="/login"
              className="btn btn-outline"
              style={{ width: "100%", marginBottom: 8, textAlign: "center" }}
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/login?mode=signup"
              className="btn btn-primary"
              style={{ width: "100%", textAlign: "center" }}
              onClick={() => setMobileOpen(false)}
            >
              Sign Up — Free
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
