'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInLeft } from '@/shared/lib/helpers/animations';

import styles from './ContactUsHeroSection.module.scss';

export const ContactUsHeroSection = () => {
  const t = useTranslations('contactUsPage');
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
                fallback: 'Support service',
              })}
            </h1>

            <p className={styles.subtitle}>
              {t('heroSubtitle', {
                fallback:
                  'Contact us if you have any technical questions! We are always here for you.',
              })}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
