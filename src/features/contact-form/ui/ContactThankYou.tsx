"use client";

import { useTranslations } from "next-intl";

import { SuccessPageCard } from "@/shared/ui/components/SuccessPageCard/SuccessPageCard";

export const ContactThankYou = () => {
  const t = useTranslations("contactThankYou");

  return (
    
    <SuccessPageCard
      title={t("title", {
        fallback: "Thank you for reaching out to Travellio Global!",
      })}
      body={
        <>
          <p>
            {t("messageReceived", {
              fallback:
                "Your message has been successfully received. Our team will review your inquiry carefully and respond shortly.",
            })}
          </p>
          <p>
            {t("appreciation", {
              fallback:
                "We appreciate your interest and look forward to assisting you.",
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
  );
};
