'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeIn } from '@/shared/lib/helpers/animations';

import styles from './AffiliateCtaSection.module.scss';

export const AffiliateCtaSection = () => {
  const t = useTranslations('affiliateProgramPage');
  const viewport = { once: true, amount: 0.2 };

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.content}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className={styles.title}>
            {t('ctaTitle', { fallback: 'Start earning today' })}
          </h2>

          <div className={styles.copy}>
            <p className={styles.body}>
              {t('ctaBodyLineOne', {
                fallback: 'We look forward to partnering with you!',
              })}
            </p>
            <p className={styles.body}>
              {t('ctaBodyLineTwo', {
                fallback:
                  'Please feel free to contact the Bitvera Affiliate Team with any questions. Generally, we respond to email requests within 24 hours.',
              })}
            </p>
            <p className={styles.body}>
              {t('ctaBodyLineThree', {
                fallback:
                  "Don't hesitate to contact our live chat customer support if you need urgent assistance.",
              })}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
