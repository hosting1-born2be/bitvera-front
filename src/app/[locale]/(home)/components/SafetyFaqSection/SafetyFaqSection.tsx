'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInUp } from '@/shared/lib/helpers/animations';

import styles from './SafetyFaqSection.module.scss';

export const SafetyFaqSection = () => {
  const t = useTranslations('homePage');
  const viewport = { once: true, amount: 0.2 };
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const faqItems = [
    {
      key: 'personalDataEncryption',
      title: t('faqPersonalDataEncryptionTitle', {
        fallback: 'Personal data encryption',
      }),
      body: t('faqPersonalDataEncryptionBody', {
        fallback:
          'Your personal information is completely encrypted with cutting-edge technologies.',
      }),
    },
    {
      key: 'compliance',
      title: t('faqComplianceTitle', { fallback: 'Compliance' }),
      body: t('faqComplianceBody', {
        fallback:
          "We verify our client’s identity at the highest level of compliance through AML and KYC checks.",
      }),
    },
    {
      key: 'transactionSecurity',
      title: t('faqTransactionSecurityTitle', { fallback: 'Transaction security' }),
      body: t('faqTransactionSecurityBody', {
        fallback:
          'We are always one step ahead! Our multi-layer security protocol ensures the highest standards of client safety.',
      }),
    },
    {
      key: 'kyc',
      title: t('faqKycTitle', { fallback: 'Why do I need to pass the KYC check?' }),
      body: t('faqKycBody', {
        fallback:
          'KYC verification helps us manage risks by verifying that every customer using our platform is not a risk to us or, more importantly, to you.',
      }),
      bodySecondary: t('faqKycBodySecondary', {
        fallback:
          'KYC is developed to avoid the risk of identity theft, money laundering, financial fraud, and criminal organisation financing.',
      }),
    },
    {
      key: 'support',
      title: t('faqSupportTitle', { fallback: 'Excellent support service' }),
      body: t('faqSupportBody', {
        fallback:
          'We are here six days a week, from Monday till Saturday 10:00 – 02:00 GMT+3. On all other hours, you can email the support, and we will be in contact with you in less than 24 hours.',
      }),
    },
  ];

  return (
    <section id="bitvera-safety" className={styles.section}>
      <div className="container">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.copy}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <h2 className={styles.title}>{t('faqTitle', { fallback: 'We put safety first' })}</h2>
            <p className={styles.description}>
              {t('faqDescription', { fallback: 'Our KYC process is simple and secure:' })}
            </p>
          </motion.div>

          <div className={styles.faqList}>
            {faqItems.map((item, index) => {
              const isOpen = activeKey === item.key;

              return (
                <motion.div
                  key={item.key}
                  className={styles.faqItem}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  custom={index * 0.06}
                >
                  <button
                    type="button"
                    className={styles.faqButton}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.key}`}
                    onClick={() => setActiveKey((current) => (current === item.key ? null : item.key))}
                  >
                    <span className={styles.faqQuestion}>{item.title}</span>
                    <span className={styles.faqIcon} data-open={isOpen} aria-hidden="true">
                      <span className={styles.faqIconHorizontal} />
                      <span className={styles.faqIconVertical} />
                    </span>
                  </button>

                  {isOpen ? (
                    <div id={`faq-panel-${item.key}`} className={styles.faqAnswer}>
                      <p>{item.body}</p>
                      {'bodySecondary' in item && item.bodySecondary ? <p>{item.bodySecondary}</p> : null}
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
