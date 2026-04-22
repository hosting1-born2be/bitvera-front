import { notFound } from "next/navigation";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getPolicy, PolicyPage } from "@/features/policies";

import styles from "./page.module.scss";

const formatPolicyDate = (value: string | null, locale: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const policy = await getPolicy({ locale, slug });
  const t = await getTranslations({ locale, namespace: "legalPage" });

  if (!policy) {
    return {
      title: t("metaFallbackTitle", { fallback: "Legal | Bitvera" }),
      description: t("metaDescription", {
        fallback:
          "Read Bitvera's legal information, policies, and compliance disclosures.",
      }),
    };
  }

  return {
    title: policy.seoTitle || policy.title,
    description:
      policy.seoDescription ||
      t("metaDescription", {
        fallback:
          "Read Bitvera's legal information, policies, and compliance disclosures.",
      }),
    openGraph: {
      title: policy.seoTitle || policy.title,
      description:
        policy.seoDescription ||
        t("metaDescription", {
          fallback:
            "Read Bitvera's legal information, policies, and compliance disclosures.",
        }),
    },
  };
}

export default async function LegalPolicyRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const policy = await getPolicy({ locale, slug });
  const t = await getTranslations({ locale, namespace: "legalPage" });

  if (!policy) {
    notFound();
  }

  console.log(policy);

  return (
    <div className={styles.page}>
      <PolicyPage
        policy={policy}
        formattedLastUpdated={formatPolicyDate(policy.lastUpdated, locale)}
        labels={{
          back: t("back", { fallback: "Back" }),
          lastUpdated: t("lastUpdated", { fallback: "Last updated" }),
          tableOfContents: t("tableOfContents", { fallback: "Table of contents" }),
        }}
      />
    </div>
  );
}
