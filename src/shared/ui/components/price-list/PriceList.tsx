"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { fadeInUp } from "@/shared/lib/helpers/animations";
import { Button } from "@/shared/ui/kit/button/Button";

import styles from "./PriceList.module.scss";

export const PriceList = () => {
  const t = useTranslations("priceList");

  return (
    <section className={styles.price_list}>
      <video src="/videos/guide-cta.mp4" autoPlay muted loop playsInline />
      <div className={"container"}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className={styles.price_list__content}
        >
          <h2>
            {t("title", { fallback: "Check our full price list" })}
          </h2>
          <Button variant="filled" url="https://bitvera .com/price-list.pdf" target="_blank" type="link">
            {t("button", { fallback: "Download" })}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
