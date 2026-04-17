'use client';

import { motion } from 'framer-motion';

import { useFormsPopup } from '@/features/forms/model/store';
import { ServiceCardContent } from '@/features/services/model/types';
import { fadeInUp } from '@/shared/lib/helpers/animations';
import { PlusSmallIcon } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/kit/button/Button';

import styles from './ServiceCard.module.scss';

type ServiceCardProps = ServiceCardContent & {
  delay?: number;
};

export const ServiceCard = ({
  order,
  title,
  description,
  includedLabel,
  includedItems,
  ctaLabel,
  delay = 0,
}: ServiceCardProps) => {
  const { openRequest } = useFormsPopup();
  const viewport = { once: true, amount: 0.15 };

  return (
    <motion.article
      className={styles.card}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      custom={delay}
    >
      <span className={styles.order}>{order}</span>

      <div className={styles.main}>
        <div className={styles.copy}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.buttonWrap}>
          <Button variant="borderedCompact" type="button" onClick={() => openRequest(title)}>
            <span className={styles.buttonContent}>
              <span>{ctaLabel}</span>
              <PlusSmallIcon className={styles.buttonIcon} aria-hidden="true" />
            </span>
          </Button>
        </div>
      </div>

      <div className={styles.included}>
        <span className={styles.divider} />
        <p className={styles.includedLabel}>{includedLabel}</p>

        <ul className={styles.includedList}>
          {includedItems.map((item) => (
            <li key={item} className={styles.includedItem}>
              <span className={styles.bullet} aria-hidden="true" />
              <p className={styles.includedText}>{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
};
