'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { SIGN_UP_URL } from '@/shared/lib/constants/constants';
import { fadeInUp } from '@/shared/lib/helpers/animations';
import { Button } from '@/shared/ui/kit/button/Button';

import styles from './InstantExchangeSection.module.scss';

export const InstantExchangeSection = () => {
  const t = useTranslations('homePage');
  const viewport = { once: true, amount: 0.2 };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.banner}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >

            <div className={styles.bannerContent}>
              <h2 className={styles.title}>
                {t('plansTitle', { fallback: 'Exchange instantly!' })}
              </h2>

              <p className={styles.description}>
                {t('plansDescription', {
                  fallback:
                    'Exchange swiftly and securely. At Bitvera, all of your funds are transferred using the safest possible methods.',
                })}
              </p>

              <div className={styles.buttonWrap}>
                <Button variant="filled" url={SIGN_UP_URL} type="link">
                  {t('plansCta', { fallback: 'Exchange now' })}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
