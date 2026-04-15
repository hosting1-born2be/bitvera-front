"use client";

import { useTranslations } from "next-intl";

import { SuccessPageCard } from "@/shared/ui/components/SuccessPageCard/SuccessPageCard";

export const NotFoundPage = () => {
  const t = useTranslations("notFoundPage");

  return (
    <div className="container">
      <SuccessPageCard
        title={t("title", {
          fallback: "This Destination Doesn’t Exist",
        })}
        body={
          <>
            <p>
              {t("messagePrimary", {
                fallback:
                  "The page you’re looking for seems to have taken a different route.",
              })}
            </p>
            <p>
              {t("messageSecondary", {
                fallback:
                  "It may have moved — or perhaps it never existed at all. Either way, your journey continues.",
              })}
            </p>
          </>
        }
        prompt={t("prompt", {
          fallback: "Return to the previous page or:",
        })}
        ctaLabel={t("cta", {
          fallback: "Head Back Home",
        })}
        ctaHref="/"
      />
    </div>
  );
};
