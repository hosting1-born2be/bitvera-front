'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { SIGN_UP_URL } from '@/shared/lib/constants/constants';
import { fadeInUp } from '@/shared/lib/helpers/animations';
import { Button } from '@/shared/ui/kit/button/Button';

import styles from './AboutProfessionalsSection.module.scss';

export const AboutProfessionalsSection = () => {
  const t = useTranslations('aboutPage');
  const viewport = { once: true, amount: 0.2 };

  const items = [
    {
      number: '01',
      text: t('professionalsItemOne', {
        fallback:
          'Bitvera is owned and maintained by a company with an extra qualified team and years of experience in the industry.',
      }),
    },
    {
      number: '02',
      text: t('professionalsItemTwo', {
        fallback:
          'We offer the perfect exchange solution for you, whether you are new to the world of cryptocurrencies or an experienced user.',
      }),
    },
  ] as const;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionInner}>
          <div className={styles.headingRow}>
            <h2 className={styles.title}>
              {t('professionalsTitle', { fallback: 'Work with professionals' })}
            </h2>

            <div className={styles.buttonWrap}>
              <Button variant="bitveraDark" type="link" url={SIGN_UP_URL}>
                {t('professionalsCta', { fallback: 'Join Bitvera' })}
              </Button>
            </div>
          </div>

          <div className={styles.cardGrid}>
            {items.map((item, index) => (
              <motion.article
                key={item.number}
                className={styles.card}
                variants={fadeInUp}
                custom={index * 0.08}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                <span className={styles.badge}>{item.number}</span>
                <p className={styles.cardText}>{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
