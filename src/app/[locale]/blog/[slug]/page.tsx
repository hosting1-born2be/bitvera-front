import { notFound } from "next/navigation";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ArticlePage, getArticle } from "@/features/articles";

import styles from "./page.module.scss";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle({ locale, slug });
  const t = await getTranslations({ locale, namespace: "blogPage" });

  if (!article) {
    return {
      title: t("metaArticleFallbackTitle", { fallback: "Article | Bitvera" }),
      description: t("metaDescription", {
        fallback: "Crypto insights, transaction guidance, and practical explainers from Bitvera.",
      }),
    };
  }

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
    },
  };
}

export default async function ArticleRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const article = await getArticle({ locale, slug });

  if (!article) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <ArticlePage
        article={article}
        labels={{
          backToBlog: t("backToBlog", { fallback: "Back" }),
          legalNotice: t("legalNotice", {
            fallback:
              "This article and its content have been produced and disseminated for persons outside of the United Kingdom. The information provided is not directed at or intended for distribution to, or use by, any person or entity located within the UK. The financial products and services mentioned in this article are not eligible for the UK. Cryptoassets are classified as Restricted Mass Market Investments in the UK, meaning that they are high-risk investments and are not suitable for most retail investors.",
          }),
        }}
      />
    </div>
  );
}
