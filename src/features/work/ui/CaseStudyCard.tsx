import { WorkCaseStudyCardContent } from '../model/types';

import styles from './CaseStudyCard.module.scss';

export const CaseStudyCard = ({
  title,
  overviewLabel,
  overview,
  challengeLabel,
  challenge,
  solutionLabel,
  solution,
  featuresLabel,
  featureItems,
}: WorkCaseStudyCardContent) => {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.detail}>
            <span className={styles.divider} />
            <p className={styles.label}>{overviewLabel}</p>
            <p className={styles.text}>{overview}</p>
          </div>

          <div className={styles.detail}>
            <span className={styles.divider} />
            <p className={styles.label}>{challengeLabel}</p>
            <p className={styles.text}>{challenge}</p>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.detail}>
            <span className={styles.divider} />
            <p className={styles.label}>{solutionLabel}</p>
            <p className={styles.text}>{solution}</p>
          </div>

          <div className={styles.detail}>
            <span className={styles.divider} />
            <p className={styles.label}>{featuresLabel}</p>

            <ul className={styles.features}>
              {featureItems.map((item) => (
                <li key={item} className={styles.featureItem}>
                  <span className={styles.bullet} aria-hidden="true" />
                  <p className={styles.featureText}>{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
};
