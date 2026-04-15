'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInUp } from '@/shared/lib/helpers/animations';

import styles from './SecuritySection.module.scss';

export const SecuritySection = () => {
  const t = useTranslations('homePage');
  const viewport = { once: true, amount: 0.2 };

  return (
    <motion.article
      className={styles.card}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      custom={0.08}
    >
      <p className={styles.copy}>
        {t('servicesBody', {
          fallback:
            'Your privacy and security is our main objective. We have developed an impeccable safeguard system that excellently counters any threat to your data, funds, and transactions.',
        })}
      </p>
    </motion.article>
  );
};
