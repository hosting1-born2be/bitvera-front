import { useTranslations } from 'next-intl';

import styles from './AboutMissionSection.module.scss';

export const AboutMissionSection = () => {
  const t = useTranslations('aboutPage');

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionInner}>
          <div className={styles.copyBlock}>
            <h2 className={styles.title}>
              {t('missionTitle', { fallback: 'We strive' })}
            </h2>

            <p className={styles.description}>
              {t('missionDescription', {
                fallback:
                  'to implement significant efficiency, security, and convenience features in our crypto exchanging platform.\nThe technology we utilise allows for quick and easy crypto buying and selling in a completely worry-free environment.',
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
