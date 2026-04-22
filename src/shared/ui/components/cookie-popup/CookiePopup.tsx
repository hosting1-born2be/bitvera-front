"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/kit/button/Button";

import styles from "./CookiePopup.module.scss";

import { Link } from "@/i18n/navigation";

export const CookiePopup = () => {
  const t = useTranslations("cookiePopup");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    const hasDeclined = localStorage.getItem("cookiesDeclined");

    if (!hasAccepted && !hasDeclined) {
      const id = window.setTimeout(() => setIsVisible(true), 0);

      return () => window.clearTimeout(id);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={styles.cookiePopup}
      role="dialog"
      aria-live="polite"
      aria-label={t("title", { fallback: "Cookie Notice" })}
    >
      <div className="container">
        <div className={styles.content}>
          <div className={styles.copy}>
            <h2 className={styles.title}>
              {t("title", { fallback: "Cookie Notice" })}
            </h2>
            <p className={styles.text}>
              {t("text", {
                fallback:
                  "We use cookies to keep things working as expected and to better understand how visitors interact with the site.",
              })}
            </p>
          </div>

          <div className={styles.actions}>
            <div className={styles.acceptButtonWrap}>
              <Button type="button" variant="filled" onClick={handleAccept}>
                {t("accept", { fallback: "Accept Cookies" })}
              </Button>
            </div>

            <Link href="/cookie-policy" className={styles.moreLink}>
              {t("link", { fallback: "More About Cookies" })}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
