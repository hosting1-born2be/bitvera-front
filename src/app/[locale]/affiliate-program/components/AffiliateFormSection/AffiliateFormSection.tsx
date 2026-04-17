'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { AffiliateForm } from '@/features/forms';
import { fadeInLeft, fadeInRight } from '@/shared/lib/helpers/animations';

import styles from './AffiliateFormSection.module.scss';

export const AffiliateFormSection = () => {
  const t = useTranslations('affiliateProgramPage');
  const viewport = { once: true, amount: 0.2 };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <motion.h2
            className={styles.title}
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {t('formTitle', {
              fallback:
                'Create your affiliate profile and get an individual referral link',
            })}
          </motion.h2>

          <motion.div
            className={styles.formWrap}
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <AffiliateForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
