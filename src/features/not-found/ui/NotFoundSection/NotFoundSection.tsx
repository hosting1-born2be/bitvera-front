"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { fadeInUp } from "@/shared/lib/helpers/animations";

import styles from "./NotFoundSection.module.scss";

export const NotFoundSection = () => {
  const t = useTranslations("notFound");

  return (
    <section className={styles.notFound}>
      <video src="/videos/guide-cta.mp4" autoPlay muted loop playsInline />
      <div className={"container"}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className={styles.notFound__content}
        >
          <h1>
            {t("title", { fallback: "404 — Page Not Found" })}
          </h1>
          <p>
            {t("description", {
              fallback:
                "The page you tried to reach isn’t here.",
            })}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
