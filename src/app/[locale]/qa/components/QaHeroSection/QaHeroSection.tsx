'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInLeft } from '@/shared/lib/helpers/animations';

import styles from './QaHeroSection.module.scss';

export const QaHeroSection = () => {
  const t = useTranslations('qaPage');
  const viewport = { once: true, amount: 0.2 };

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.content}
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h1 className={styles.title}>
            {t('heroTitle', { fallback: 'This is our little library' })}
          </h1>

          <p className={styles.subtitle}>
            {t('heroSubtitle', {
              fallback:
                'Here you can find answers to the most common questions you may have.',
            })}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
