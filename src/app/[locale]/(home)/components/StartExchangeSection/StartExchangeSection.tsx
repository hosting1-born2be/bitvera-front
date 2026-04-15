"use client";

import { useTranslations } from "next-intl";

import { SIGN_UP_URL } from "@/shared/lib/constants/constants";
import { Button } from "@/shared/ui/kit/button/Button";

import styles from "./StartExchangeSection.module.scss";

type Step = {
  number: string;
  title: string;
};

export const StartExchangeSection = () => {
  const t = useTranslations("homePage");

  const steps: readonly Step[] = [
    {
      number: "01",
      title: t("startStepOne", {
        fallback: "Sign up and verify your email",
      }),
    },
    {
      number: "02",
      title: t("startStepTwo", {
        fallback: "Complete your profile verification process",
      }),
    },
    {
      number: "03",
      title: t("startStepThree", {
        fallback: "Exchange with no limits",
      }),
    },
  ] as const;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionInner}>
          <div className={styles.headingRow}>
            <h2 className={styles.title}>
              {t("startTitle", {
                fallback: "How to start exchanging?",
              })}
            </h2>

            <div className={styles.buttonWrap}>
              <Button variant="filled" type="link" url={SIGN_UP_URL}>
                <span>{t("startCta", { fallback: "Create a profile" })}</span>
              </Button>
            </div>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <article key={step.number} className={styles.stepCard}>
                <span className={styles.stepBadge}>{step.number}</span>
                <p className={styles.stepTitle}>{step.title}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
