import type { PolicyDetail } from "@/features/policies/model/types";
import { PolicyArticle } from "@/features/policies/ui/article/PolicyArticle";

import { PolicyBackLink } from "./PolicyBackLink";
import styles from "./PolicyPage.module.scss";

type PolicyPageLabels = {
  back: string;
  lastUpdated: string;
  tableOfContents: string;
};

type PolicyPageProps = {
  policy: PolicyDetail;
  formattedLastUpdated: string | null;
  labels: PolicyPageLabels;
};

export const PolicyPage = ({
  policy,
  formattedLastUpdated,
  labels,
}: PolicyPageProps) => (
  <article className={styles.page}>
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroInner}>
          <PolicyBackLink fallbackHref="/" label={labels.back} />

          <div className={styles.heroCopy}>
            <h1 className={styles.title}>{policy.title}</h1>
            {formattedLastUpdated ? (
              <p className={styles.updated}>
                {labels.lastUpdated}: {formattedLastUpdated}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>

    <section className={styles.body}>
      <div className="container">
        <PolicyArticle
          content={policy.content}
          labels={{ tableOfContents: labels.tableOfContents }}
        />
      </div>
    </section>
  </article>
);
