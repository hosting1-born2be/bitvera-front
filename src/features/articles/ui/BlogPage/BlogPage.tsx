import Image from "next/image";

import type { ArticleListItem } from "@/features/articles/model/types";

import styles from "./BlogPage.module.scss";

import { Link } from "@/i18n/navigation";

type BlogPageLabels = {
  title: string;
  readMore: string;
  emptyTitle: string;
  emptyDescription: string;
  paginationPrevious: string;
  paginationNext: string;
  paginationCurrent: string;
  paginationInactive: string;
};

type BlogPageProps = {
  articles: ArticleListItem[];
  currentPage: number;
  totalPages: number;
  labels: BlogPageLabels;
};

const formatPageNumber = (value: number) => String(value).padStart(2, "0");

const buildPageHref = (page: number) => (page <= 1 ? "/blog" : `/blog?page=${page}`);

export const BlogPage = ({
  articles,
  currentPage,
  totalPages,
  labels,
}: BlogPageProps) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.headingWrap}>
            <h1 className={styles.title}>{labels.title}</h1>
          </div>

          <div className={styles.content}>
            {articles.length > 0 ? (
              <div className={styles.list}>
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className={styles.card}
                  >
                    <Image
                      src={article.image?.url || `/images/blog/${article.slug}.webp`}
                      alt={article.image?.alt || article.title}
                      width={400}
                      height={232}
                      className={styles.cardImage}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={`/images/blog/${article.slug}.webp`}
                    />

                    <div className={styles.cardContent}>
                      <div className={styles.cardCopy}>
                        <h2 className={styles.cardTitle}>{article.title}</h2>
                        <p className={styles.cardExcerpt}>{article.excerpt}</p>
                      </div>
 
                      <span className={styles.cardAction}>{labels.readMore}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h2 className={styles.emptyTitle}>{labels.emptyTitle}</h2>
                <p className={styles.emptyDescription}>{labels.emptyDescription}</p>
              </div>
            )}

            {totalPages > 1 ? (
              <div className={styles.pagination} aria-label={labels.paginationCurrent}>
                {hasPreviousPage ? (
                  <Link
                    href={buildPageHref(currentPage - 1)}
                    className={`${styles.paginationArrow} ${styles.paginationLink}`}
                    aria-label={labels.paginationPrevious}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/blog/bitvera/pagination-arrow-left.svg"
                      alt=""
                      aria-hidden="true"
                    />
                  </Link>
                ) : null}

                {pages.map((page) =>
                  page === currentPage ? (
                    <span
                      key={page}
                      className={`${styles.paginationItem} ${styles.paginationItemActive}`}
                      aria-current="page"
                    >
                      {formatPageNumber(page)}
                    </span>
                  ) : (
                    <Link
                      key={page}
                      href={buildPageHref(page)}
                      className={`${styles.paginationItem} ${styles.paginationLink}`}
                      aria-label={labels.paginationInactive}
                    >
                      {formatPageNumber(page)}
                    </Link>
                  ),
                )}

                {hasNextPage ? (
                  <Link
                    href={buildPageHref(currentPage + 1)}
                    className={`${styles.paginationArrow} ${styles.paginationLink}`}
                    aria-label={labels.paginationNext}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/blog/bitvera/pagination-arrow-right.svg"
                      alt=""
                      aria-hidden="true"
                    />
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
