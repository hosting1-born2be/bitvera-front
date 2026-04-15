'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInUp } from '@/shared/lib/helpers/animations';
import { Button } from '@/shared/ui/kit/button/Button';

import styles from './PlansSection.module.scss';

export const PlansSection = () => {
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
                <Button variant="filled" url="/get-in-touch" type="link">
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
