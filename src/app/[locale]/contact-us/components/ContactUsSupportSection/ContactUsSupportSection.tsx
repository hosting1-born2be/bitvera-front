'use client';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { SupportForm } from '@/features/forms';

import { fadeInLeft, fadeInUp } from '@/shared/lib/helpers/animations';

import styles from './ContactUsSupportSection.module.scss';

export const ContactUsSupportSection = () => {
  const t = useTranslations('contactUsPage');
  const viewport = { once: true, amount: 0.2 };

  return (
    <section className={styles.section}>
      <Image
        src="/images/how-to-exchange/bitvera/support-token-side.avif"
        alt=""
        aria-hidden="true"
        width={449}
        height={427}
        className={styles.tokenSide}
      />

      <Image
        src="/images/how-to-exchange/bitvera/support-token-bottom.avif"
        alt=""
        aria-hidden="true"
        width={231}
        height={172}
        className={styles.tokenBottom}
      />

      <div className="container">
        <div className={styles.inner}>
          <motion.div
            className={styles.copy}
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <h1 className={styles.title}>
              {t('heroTitle', { fallback: 'Support service' })}
            </h1>

            <p className={styles.subtitle}>
              {t('heroSubtitle', {
                fallback:
                  'Contact us if you have any technical questions! We are always here for you.',
              })}
            </p>
          </motion.div>

          <motion.div
            className={styles.formWrap}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <SupportForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
