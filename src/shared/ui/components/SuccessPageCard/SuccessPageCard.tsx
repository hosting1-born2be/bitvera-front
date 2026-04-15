import type { ReactNode } from "react";

import { Button } from "../../kit/button/Button";
import styles from "./SuccessPageCard.module.scss";

import { Link } from "@/i18n/navigation";

type SuccessPageCardProps = {
  title: string;
  body: ReactNode;
  note?: ReactNode;
  prompt: string;
  ctaLabel: string;
  ctaHref: string;
};

const ArrowIcon = () => (
  <svg
    width="24"
    height="20"
    viewBox="0 0 24 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 10H21.5M21.5 10L13.75 2.25M21.5 10L13.75 17.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SuccessPageCard = ({
  title,
  body,
  note,
  prompt,
  ctaLabel,
  ctaHref,
}: SuccessPageCardProps) => {
  return (
    <section className={styles.card} aria-labelledby="success-page-title">
      <div className={styles.card__body}>
        <h1 id="success-page-title" className={styles.card__title}>
          {title}
        </h1>
        <div className={styles.card__content}>{body}</div>
      </div>

      {note ? <div className={styles.card__note}>{note}</div> : null}

      <div className={styles.card__footer}>
        <p className={styles.card__prompt}>{prompt}</p>
        <Button variant="filled" type="link" url={ctaHref}>
          <span>{ctaLabel}</span>
        </Button>
      </div>
    </section>
  );
};
