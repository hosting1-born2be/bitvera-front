import Image from "next/image";

import type { ArticleListItem } from "@/features/articles/model/types";

import styles from "./InsightCard.module.scss";

import { Link } from "@/i18n/navigation";

type InsightCardProps = {
  article: ArticleListItem;
};

export const InsightCard = ({ article }: InsightCardProps) => {
  return (
    <Link href={`/blog/${article.slug}`} className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.excerpt}>{article.excerpt}</p>
      </div>

      <span className={styles.iconWrap} aria-hidden="true">
        <Image src="/images/insights/card-arrow.svg" alt="" width={24} height={24} />
      </span>
    </Link>
  );
};
