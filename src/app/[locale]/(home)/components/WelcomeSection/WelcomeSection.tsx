'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInUp } from '@/shared/lib/helpers/animations';
import { Button } from '@/shared/ui/kit/button/Button';

import styles from './WelcomeSection.module.scss';

export const WelcomeSection = () => {
  const t = useTranslations('homePage');
  const viewport = { once: true, amount: 0.2 };

  return (
    <motion.article
      className={styles.card}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <div className={styles.cardContent}>
        <h2 className={styles.title}>
          <span>{t('solutionsTitleLineOne', { fallback: 'Welcome' })}</span>
          <span>{t('solutionsTitleLineTwo', { fallback: 'to Bitvera!' })}</span>
        </h2>

        <div className={styles.sideContent}>
          <p className={styles.description}>
            {t('solutionsDescription', {
              fallback: 'Your privacy and security are our main objectives.',
            })}
          </p>

          <div className={styles.buttonWrap}>
            <Button
              variant="bitveraDark"
              type="button"
              onClick={() =>
                document.getElementById('bitvera-safety')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }
            >
              {t('solutionsCta', { fallback: 'More about safety' })}
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
