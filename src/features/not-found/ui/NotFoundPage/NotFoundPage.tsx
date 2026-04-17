"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { fadeInUp } from "@/shared/lib/helpers/animations";
import { Button } from "@/shared/ui/kit/button/Button";

import styles from "./NotFoundPage.module.scss";

export const NotFoundPage = () => {
  const t = useTranslations("notFoundPage");
  const viewport = { once: true, amount: 0.2 };

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className="container">
          <motion.div
            className={styles.content}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >

            <h1 className={styles.title}>
              {t("title", {
                fallback: "This Destination Doesn’t Exist",
              })}
            </h1>

            <p className={styles.subtitle}>
              {t("messagePrimary", {
                fallback:
                  "The page you’re looking for seems to have taken a different route.",
              })}
            </p>

            <div className={styles.buttonWrap}>
              <Button variant="bitveraDark" type="link" url="/">
                {t("cta", { fallback: "Head Back Home" })}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
