import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { BlogPage, getArticles } from "@/features/articles";

import styles from "./page.module.scss";

const POSTS_PER_PAGE = 5;

const resolvePageNumber = (value?: string) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });

  return {
    title: t("metaTitle", { fallback: "Blog | Bitvera" }),
    description: t("metaDescription", {
      fallback: "Crypto insights, transaction guidance, and practical explainers from Bitvera.",
    }),
    openGraph: {
      title: t("metaTitle", { fallback: "Blog | Bitvera" }),
      description: t("metaDescription", {
        fallback: "Crypto insights, transaction guidance, and practical explainers from Bitvera.",
      }),
    },
  };
}

export default async function BlogRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page } = await searchParams;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const articles = await getArticles({ locale });
  const totalPages = Math.max(1, Math.ceil(articles.length / POSTS_PER_PAGE));
  const currentPage = Math.min(resolvePageNumber(page), totalPages);
  const visibleArticles = articles.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  return (
    <div className={styles.page}>
      <BlogPage
        articles={visibleArticles}
        currentPage={currentPage}
        totalPages={totalPages}
        labels={{
          title: t("title", { fallback: "Blog" }),
          readMore: t("readMore", { fallback: "Read more" }),
          emptyTitle: t("emptyTitle", { fallback: "Articles will appear here soon" }),
          emptyDescription: t("emptyDescription", {
            fallback:
              "Connect the frontend to the CMS and import the Bitvera blog posts to populate this page.",
          }),
          paginationPrevious: t("paginationPrevious", { fallback: "Previous page" }),
          paginationNext: t("paginationNext", { fallback: "Next page" }),
          paginationCurrent: t("paginationCurrent", { fallback: "Current page" }),
          paginationInactive: t("paginationInactive", { fallback: "Inactive page" }),
        }}
      />
    </div>
  );
}
