"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { fadeInUp } from "@/shared/lib/helpers/animations";
import { Button } from "@/shared/ui/kit/button/Button";

import styles from "./QuickLinks.module.scss";
export const QuickLinks = () => {
  const t = useTranslations("notFound");
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {t("quickLinks", { fallback: "Quick Links" })}
        </motion.h2>
        <div className={styles.quickLinks__content}>
          <Button variant="filled" url="/" type="link">
            {t("button1", { fallback: "Main Page" })}
          </Button>
          <Button variant="filled" url="/free-guides" type="link">
            {t("button2", { fallback: "Free Guides" })}
          </Button>
          <Button variant="bordered" url="/contact" type="link">
            {t("button3", { fallback: "Contact Us" })}
          </Button>
        </div>
      </div>
    </section>
  );
};
