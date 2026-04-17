"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { SIGN_IN_URL,SIGN_UP_URL, WEBSITE_EMAIL } from "@/shared/lib/constants/constants";

import { Button } from "../../kit/button/Button";
import styles from "./Header.module.scss";

import { Link, usePathname } from "@/i18n/navigation";

type HeaderNavItem = {
  key:
    | "home"
    | "about"
    | "howToExchange"
    | "affiliateProgram"
    | "faq"
    | "blog"
    | "contactUs";
  href: string;
};

const navigationItems: readonly HeaderNavItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "howToExchange", href: "/how-to-exchange" },
  { key: "affiliateProgram", href: "/#affiliate" },
  { key: "faq", href: "/#faq" },
  { key: "blog", href: "/#blog" },
  { key: "contactUs", href: "/#contact" },
] as const;

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("header");
  const isDarkRoute = pathname === "/about" || pathname === "/how-to-exchange";

  useEffect(() => {
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((previousValue) => !previousValue);
  };

  return (
    <>
      <div className={styles.notice}>
        <div className="container">
          <div className={styles.notice__inner}>
            <p className={styles.notice__title}>
              {t("noticeTitle", { fallback: "IMPORTANT NOTICE" })}
            </p>
            <div className={styles.notice__copy}>
              <p className={styles.notice__body}>
                {t("noticeBodyPrimary", {
                  fallback:
                    "This website is not intended for the UK audience. If you are accessing this website from the UK, please exit this site immediately.",
                })}
              </p>
              <p className={styles.notice__body}>
                {t("noticeBodySecondary", {
                  fallback:
                    "Please be informed that services offered on this website are currently not accessible to Retail Clients based in the UK.",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <header
        className={`${styles.header} ${isScrolled ? styles.isScrolled : ""} ${
          isDarkRoute && !isScrolled ? styles.isDark : ""
        }`}
        data-mobile-open={isMobileMenuOpen}
      >
        <div className="container">
          <div className={styles.header__shell}>
            <div className={styles.header__main}>
              <Link href="/" className={styles.header__brand}>
                <span>{t("brand", { fallback: "Bitvera" })}</span>
              </Link>

              <div className={styles.header__actions}>
                <div className={styles.header__desktopActions}>
                  <div className={styles.header__buttonWrap}>
                    <Button variant="headerLight" type="link" url={SIGN_UP_URL}>
                      <span>{t("signUp", { fallback: "Sign Up" })}</span>
                    </Button>
                  </div>

                  <div className={styles.header__buttonWrap}>
                    <Button variant="headerDark" type="link" url={SIGN_IN_URL}>
                      <span>{t("logIn", { fallback: "Log In" })}</span>
                    </Button>
                  </div>
                </div>

                <div className={styles.header__buttonWrap}>
                  <Button
                    variant={isDarkRoute && !isScrolled ? "headerMenuLight" : "headerMenu"}
                    type="button"
                    onClick={toggleMobileMenu}
                  >
                    <span>{t("menu", { fallback: "Menu" })}</span>
                    <img
                      src="/images/layout/menu-grid.svg"
                      alt=""
                      aria-hidden="true"
                      className={styles.header__menuIcon}
                    />
                  </Button>
                </div>
              </div>
            </div>

            <div
              id="header-mobile-menu"
              className={styles.header__mobileMenu}
              data-open={isMobileMenuOpen}
            >
              <div className={styles.header__mobileMenuInner}>
                <nav className={styles.header__mobileNav}>
                  {navigationItems.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={styles.header__mobileNavItem}
                      onClick={closeMobileMenu}
                    >
                      {t(item.key, { fallback: item.key })}
                    </Link>
                  ))}
                </nav>

                <div className={styles.header__mobileButtons}>
                  <div className={styles.header__buttonWrap}>
                    <Button variant="headerLight" type="link" url={SIGN_UP_URL}>
                      <span>{t("signUp", { fallback: "Sign Up" })}</span>
                    </Button>
                  </div>

                  <div className={styles.header__buttonWrap}>
                    <Button variant="headerDark" type="link" url={SIGN_IN_URL}>
                      <span>{t("logIn", { fallback: "Log In" })}</span>
                    </Button>
                  </div>
                </div>

                {WEBSITE_EMAIL ? (
                  <a
                    href={`mailto:${WEBSITE_EMAIL}`}
                    className={styles.header__mobileMeta}
                  >
                    {WEBSITE_EMAIL}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
