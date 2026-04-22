import type { CSSProperties } from "react";

import { getArticleRegistryEntry } from "@/features/articles/lib/articleRegistry";
import type { ArticleDetail } from "@/features/articles/model/types";

import styles from "./ArticlePage.module.scss";
import { ArticleRichTextBlocks, groupArticleSections } from "./ArticleRichText";

import { Link } from "@/i18n/navigation";

type ArticlePageLabels = {
  backToBlog: string;
  legalNotice: string;
};

type ArticlePageProps = {
  article: ArticleDetail;
  labels: ArticlePageLabels;
};

export const ArticlePage = ({ article, labels }: ArticlePageProps) => {
  const registryEntry = getArticleRegistryEntry(article.slug);
  const sections = groupArticleSections(article.content);
  const backgroundImage =
    article.image?.url || `/images/blog/${article.slug}.webp`;

  return (
    <article className={styles.page}>
      <section
        className={styles.hero}
        style={
          {
            "--hero-desktop-image": `url('${backgroundImage}')`,
            "--hero-mobile-image": `url('${backgroundImage}')`,
          } as CSSProperties
        }
      >
        <div className="container">
          <div className={styles.heroInner}>
            <Link href="/blog" className={styles.backLink}>
              <span className={styles.backIcon} aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>{labels.backToBlog}</span>
            </Link>

            <h1 className={styles.title}>{article.title}</h1>
          </div>
        </div>
      </section>

      <section className={styles.body}>
        <div className="container">
          <div className={styles.bodyInner}>
            <aside className={styles.legal}>{labels.legalNotice}</aside>

            <div className={styles.contentRail}>
              {article.info?.root?.children?.length ? (
                <section className={styles.section}>
                  <div className={styles.sectionContent}>
                    <ArticleRichTextBlocks content={article.info} />
                  </div>
                </section>
              ) : null}

              {sections.map((section) => (
                <section key={section.id} className={styles.section}>
                  {section.title ? (
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                  ) : null}
                  <div className={styles.sectionContent}>
                    <ArticleRichTextBlocks
                      content={{ root: { children: section.nodes } }}
                    />
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};
