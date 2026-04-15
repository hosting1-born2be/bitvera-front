'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInUp } from '@/shared/lib/helpers/animations';
import { Button } from '@/shared/ui/kit/button/Button';

import styles from './WorkSection.module.scss';

export const WorkSection = () => {
  const t = useTranslations('homePage');
  const viewport = { once: true, amount: 0.2 };
  const items = [
    {
      key: 'security',
      title: t('workSecurityTitle', { fallback: 'Security' }),
      description: t('workSecurityDescription', {
        fallback: 'We use cutting edge technologies to secure your transactions.',
      }),
    },
    {
      key: 'transparency',
      title: t('workTransparencyTitle', { fallback: 'Transparency' }),
      description: t('workTransparencyDescription', {
        fallback: 'No hidden fees or conditions',
      }),
    },
    {
      key: 'platform',
      title: t('workPlatformTitle', { fallback: 'The platform' }),
      description: t('workPlatformDescription', {
        fallback:
          'The platform is built for your convenience, based on time saving and easy to use methods.',
      }),
    },
    {
      key: 'support',
      title: t('workSupportTitle', { fallback: 'Professional support' }),
      description: t('workSupportDescription', {
        fallback:
          'A highly experienced customer support staff is at your disposal for any issue you may have.',
      }),
    },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {t('workTitle', { fallback: 'Why Bitvera?' })}
          </motion.h2>

          <div className={styles.grid}>
            {items.map((item, index) => (
              <motion.article
                key={item.key}
                className={styles.card}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                custom={index * 0.08}
              >
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </motion.article>
            ))}
          </div>

          <motion.div
            className={styles.buttonWrap}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            custom={0.24}
          >
            <Button variant="filled" url="/get-in-touch" type="link">
              {t('workCta', { fallback: 'Create a profile' })}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
