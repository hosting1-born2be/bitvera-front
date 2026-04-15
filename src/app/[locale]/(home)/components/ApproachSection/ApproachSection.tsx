"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { fadeInUp } from "@/shared/lib/helpers/animations";

import styles from "./ApproachSection.module.scss";

export const ApproachSection = () => {
  const t = useTranslations("homePage");
  const viewport = { once: true, amount: 0.2 };

  return (
    <motion.article
      className={styles.card}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      custom={0.16}
    >
      <div className={styles.copyGroup}>
        <p className={styles.copy}>
          {t("approachBodyPrimary", {
            fallback:
              "Every transaction is carefully screened and reviewed, not only for the platform's security but also for yours.",
          })}
        </p>

        <p className={styles.copy}>
          {t("approachBodySecondary", {
            fallback:
              "Bitvera offers a cryptocurrency exchange that is guaranteed safe, efficient and convenient. Anyone, whether new or experienced, may buy and sell crypto at competitive rates and in a 'worry-free' environment, thanks to the technologies we deploy.",
          })}
        </p>
      </div>
    </motion.article>
  );
};
