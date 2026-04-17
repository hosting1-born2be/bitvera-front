"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import {
  fadeInLeft,
  fadeInRight,
  fadeInUp,
} from "@/shared/lib/helpers/animations";

import styles from "./AffiliateHeroSection.module.scss";

const heroCards = [
  {
    key: "primary",
    variant: "dark",
    descriptionKey: "introCardPrimaryText",
    descriptionFallback:
      "You will get a volume-based rebate for every completed exchange transaction of customers you bring to us.",
  },
  {
    key: "secondary",
    variant: "light",
    titleKey: "introCardSecondaryTitle",
    titleFallback: "We're glad you're here",
    descriptionKey: "introCardSecondaryText",
    descriptionFallback: "Your privacy and security are our main objectives.",
  },
  {
    key: "tertiary",
    variant: "darkMirrored",
    descriptionKey: "introCardTertiaryText",
    descriptionFallback:
      "Bitvera affiliate program is designed for customers with a strong online presence, from website owners, social media influencers, and affiliate marketers to SEO professionals.",
  },
] as const;

export const AffiliateHeroSection = () => {
  const t = useTranslations("affiliateProgramPage");
  const viewport = { once: true, amount: 0.2 };

  return (
    <section className={styles.section}>
      {/*eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/affiliate-program/bitvera/hero-coin-1.png"
        alt="Affiliate Hero Coin"
        className={styles.coin1}
      />
      <div className="container">
        <motion.div
          className={styles.content}
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h1 className={styles.title}>
            {t("heroTitle", {
              fallback:
                "Earn with our affiliate program when you bring new clients to Bitvera",
            })}
          </h1>

          <p className={styles.subtitle}>
            {t("heroSubtitle", {
              fallback:
                "We aim to provide customers with maximum advantages, focusing on offering effective and competitive partnership programs.",
            })}
          </p>
        </motion.div>

        <motion.div
          className={styles.cards}
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/*eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/affiliate-program/bitvera/hero-coin-2.png"
            alt="Affiliate Hero Coin Small"
            className={styles.coin2}
          />
          {heroCards.map((card, index) => (
            <motion.article
              key={card.key}
              className={`${styles.card} ${
                card.variant === "light"
                  ? styles.cardLight
                  : card.variant === "darkMirrored"
                  ? styles.cardDarkMirrored
                  : styles.cardDark
              }`}
              variants={fadeInUp}
              custom={index * 0.08}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <div className={styles.cardContent}>
                {"titleKey" in card ? (
                  <h2 className={styles.cardTitle}>
                    {t(card.titleKey, { fallback: card.titleFallback })}
                  </h2>
                ) : null}

                <p className={styles.cardDescription}>
                  {t(card.descriptionKey, {
                    fallback: card.descriptionFallback,
                  })}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
