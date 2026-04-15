"use client";

import { useTranslations } from "next-intl";

import { WEBSITE_EMAIL } from "@/shared/lib/constants/constants";

import styles from "./Footer.module.scss";

import { Link } from "@/i18n/navigation";

type FooterLinkItem = {
  key:
    | "home"
    | "about"
    | "howToExchange"
    | "affiliateProgram"
    | "faq"
    | "blog"
    | "contactUs"
    | "termsOfService"
    | "privacyPolicy"
    | "riskDisclosure"
    | "refundPolicy"
    | "amlPolicy";
  href: string;
};

const menuColumns: readonly FooterLinkItem[][] = [
  [
    { key: "home", href: "/" },
    { key: "about", href: "/#about" },
    { key: "howToExchange", href: "/#exchange" },
    { key: "affiliateProgram", href: "/#affiliate" },
  ],
  [
    { key: "faq", href: "/#faq" },
    { key: "blog", href: "/#blog" },
    { key: "contactUs", href: "/#contact" },
  ],
] as const;

const productLinks: readonly FooterLinkItem[] = [
  { key: "termsOfService", href: "/#terms-of-service" },
  { key: "privacyPolicy", href: "/#privacy-policy" },
  { key: "riskDisclosure", href: "/#risk-disclosure" },
  { key: "refundPolicy", href: "/#refund-policy" },
  { key: "amlPolicy", href: "/#aml-kyc-policy" },
] as const;

const productColumns: readonly FooterLinkItem[][] = [
  [
    { key: "termsOfService", href: "/#terms-of-service" },
    { key: "privacyPolicy", href: "/#privacy-policy" },
    { key: "riskDisclosure", href: "/#risk-disclosure" },
  ],
  [
    { key: "refundPolicy", href: "/#refund-policy" },
    { key: "amlPolicy", href: "/#aml-kyc-policy" },
  ],
] as const;

const renderFooterLink = (
  item: FooterLinkItem,
  label: string,
  className: string,
) => {
  if (item.href.startsWith("mailto:") || item.href.startsWith("tel:")) {
    return (
      <a key={item.key} href={item.href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link key={item.key} href={item.href} className={className}>
      {label}
    </Link>
  );
};

export const Footer = () => {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__top}>
        <div className="container">
          <div className={styles.footer__topInner}>
            <section className={styles.footer__section}>
              <p className={styles.footer__label}>
                {t("menuLabel", { fallback: "Menu" })}
              </p>
              <div className={styles.footer__menuColumns}>
                {menuColumns.map((column, columnIndex) => (
                  <div
                    key={`menu-column-${columnIndex}`}
                    className={styles.footer__column}
                  >
                    {column.map((item) =>
                      renderFooterLink(
                        item,
                        t(item.key, { fallback: item.key }),
                        styles.footer__link,
                      ),
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.footer__section}>
              <p className={styles.footer__label}>
                {t("productsLabel", { fallback: "Products" })}
              </p>

              <div className={styles.footer__productsDesktop}>
                {productLinks.map((item) =>
                  renderFooterLink(
                    item,
                    t(item.key, { fallback: item.key }),
                    styles.footer__link,
                  ),
                )}
              </div>

              <div className={styles.footer__productsMobile}>
                {productColumns.map((column, columnIndex) => (
                  <div
                    key={`product-column-${columnIndex}`}
                    className={styles.footer__column}
                  >
                    {column.map((item) =>
                      renderFooterLink(
                        item,
                        t(item.key, { fallback: item.key }),
                        styles.footer__link,
                      ),
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.footer__section}>
              <p className={styles.footer__label}>
                {t("officeLabel", { fallback: "Office" })}
              </p>
              <div className={styles.footer__column}>
                <p className={styles.footer__text}>
                  {t("officeAddress", {
                    fallback:
                      "Level 35, International Towers Sydney, 100 Barangaroo Ave, NSW 2000, Australia",
                  })}
                </p>
                <a href="tel:+61283173582" className={styles.footer__link}>
                  {t("officePhone", { fallback: "+61283173582" })}
                </a>
                <a
                  href={`mailto:${WEBSITE_EMAIL || "info@bitvera.com"}`}
                  className={styles.footer__link}
                >
                  {t("officeEmail", { fallback: "Email" })}
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className={styles.footer__bottom}>
        <div className="container">
          <div className={styles.footer__bottomInner}>
            <div className={styles.footer__bottomContent}>
              <div className={styles.footer__brandBlock}>
                <h2 className={styles.footer__brand}>
                  {t("brand", { fallback: "Bitvera" })}
                </h2>
                <p className={styles.footer__description}>
                  {t("description", {
                    fallback:
                      "Bitvera is a powerful and utterly safe crypto exchange platform.",
                  })}
                </p>
              </div>

              <div className={styles.footer__legal}>
                <p className={styles.footer__legalText}>
                  {t("legalPrimary", {
                    fallback:
                      "Bitvera.io is owned and operated by Digitex Corp Pty Ltd ACN 643 966 250 (Level 35, International Towers Sydney, 100 Barangaroo Ave, NSW 2000, Australia). Digital Currencies Exchange DCE No. 100713696-001",
                  })}
                </p>
                <p className={styles.footer__legalText}>
                  {t("legalSecondary", {
                    fallback:
                      "This website and its content have been produced and disseminated for persons outside of the United Kingdom. The information provided is not directed at or intended for distribution to, or use by, any person or entity located within the UK. The financial products and services mentioned on this website are not eligible for the UK. Cryptoassets are classified as Restricted Mass Market Investments in the UK, meaning that they are high-risk investments and are not suitable for most retail investors",
                  })}
                </p>
              </div>
            </div>

            <div className={styles.footer__bottomBar}>
              <p className={styles.footer__copyright}>
                {t("copyright", {
                  year,
                  fallback: `Copyright ${year} by Bitvera. All Right Reserved`,
                })}
              </p>
              {/*eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/layout/footer-payments.svg"
                alt={t("paymentsAlt", {
                  fallback: "Accepted payment cards",
                })}
                className={styles.footer__payments}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
