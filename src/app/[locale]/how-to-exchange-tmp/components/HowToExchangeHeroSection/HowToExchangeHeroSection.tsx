'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInLeft } from '@/shared/lib/helpers/animations';

import styles from './HowToExchangeHeroSection.module.scss';

export const HowToExchangeHeroSection = () => {
  const t = useTranslations('howToExchangePage');
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
          <div className={styles.copy}>
            <h1 className={styles.title}>
              {t('heroTitle', {
                fallback: 'How to Start Exchanging Cryptocurrency',
              })}
            </h1>

            <p className={styles.subtitle}>
              {t('heroSubtitle', {
                fallback: 'Bitvera currently offers BTC and ETH for exchange.',
              })}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
