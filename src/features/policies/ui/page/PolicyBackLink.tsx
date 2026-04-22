"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./PolicyPage.module.scss";

type PolicyBackLinkProps = {
  fallbackHref: string;
  label: string;
};

export const PolicyBackLink = ({
  fallbackHref,
  label,
}: PolicyBackLinkProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button type="button" className={styles.backLink} onClick={handleClick}>
      <span className={styles.backIcon} aria-hidden="true">
        <Image
          src="/images/legal/policy-back-arrow.svg"
          alt=""
          width={24}
          height={24}
        />
      </span>
      <span>{label}</span>
    </button>
  );
};
