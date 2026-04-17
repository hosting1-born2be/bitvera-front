'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { SIGN_UP_URL } from '@/shared/lib/constants/constants';
import { fadeInLeft, fadeInRight, fadeInUp } from '@/shared/lib/helpers/animations';
import { Button } from '@/shared/ui/kit/button/Button';

import styles from './HowToExchangeProcessSection.module.scss';

type StepParagraph = {
  key: string;
  fallback: string;
  highlight?: boolean;
};

type Step = {
  number: string;
  titleKey: string;
  titleFallback: string;
  paragraphs: readonly StepParagraph[];
};

const steps: readonly Step[] = [
  {
    number: '01',
    titleKey: 'stepOneTitle',
    titleFallback: 'Register and create a profile',
    paragraphs: [
      {
        key: 'stepOneBody',
        fallback:
          "If you don't have a Bitvera profile yet, now is the time to register. It's free and doesn't take much time. You just need to fill out the form and confirm your registration.",
      },
    ],
  },
  {
    number: '02',
    titleKey: 'stepTwoTitle',
    titleFallback: 'Pass the quick verification',
    paragraphs: [
      {
        key: 'stepTwoBody',
        fallback:
          'Verification differs depending on the amount of the transaction. You can find our terms and verification requirements below.',
      },
    ],
  },
  {
    number: '03',
    titleKey: 'stepThreeTitle',
    titleFallback: 'Link your wallet to Bitvera',
    paragraphs: [
      {
        key: 'stepThreeBody',
        fallback:
          "We don't store any cryptocurrencies or fiat currency. To buy cryptocurrency, you need to have a wallet to store it.",
      },
      {
        key: 'stepThreeBodySecondary',
        fallback:
          'We recommend (but do not insist) to open wallets on the official website of Bitcoin or Ethereum to open up your designated virtual wallet, or you can get a multi-function e-wallet that can store different cryptocurrencies. If you already have an e-wallet, link it to your Bitvera profile.',
        highlight: true,
      },
    ],
  },
  {
    number: '04',
    titleKey: 'stepFourTitle',
    titleFallback: 'Choose the crypto and how much you want to buy/sell',
    paragraphs: [
      {
        key: 'stepFourBody',
        fallback:
          'We focus on Bitcoin and Ethereum to deliver a simple and reliable exchange experience.',
      },
    ],
  },
  {
    number: '05',
    titleKey: 'stepFiveTitle',
    titleFallback: 'Wait for the transaction to be approved!',
    paragraphs: [
      {
        key: 'stepFiveBody',
        fallback: "Don't worry. It might take a while.",
      },
    ],
  },
] as const;

export const HowToExchangeProcessSection = () => {
  const t = useTranslations('howToExchangePage');
  const viewport = { once: true, amount: 0.2 };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.intro}
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className={styles.copyBlock}>
              <h2 className={styles.title}>
                {t('processTitle', { fallback: 'Exchanging process' })}
              </h2>

              <p className={styles.description}>
                {t('processDescription', {
                  fallback:
                    'Making a crypto exchange is easy.\nYou just need to follow these simple steps:',
                })}
              </p>
            </div>

            <div className={styles.buttonWrap}>
              <Button variant="bitveraDark" type="link" url={SIGN_UP_URL}>
                {t('processCta', { fallback: 'Join Bitvera' })}
              </Button>
            </div>
          </motion.div>

          <motion.div
            className={styles.steps}
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {steps.map((step, index) => (
              <motion.article
                key={step.number}
                className={styles.stepCard}
                variants={fadeInUp}
                custom={index * 0.08}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                <span className={styles.stepBadge}>{step.number}</span>

                <h3 className={styles.stepTitle}>
                  {t(step.titleKey, { fallback: step.titleFallback })}
                </h3>

                <div className={styles.stepCopy}>
                  {step.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.key}
                      className={
                        paragraph.highlight
                          ? `${styles.stepBody} ${styles.stepBodyHighlight}`
                          : styles.stepBody
                      }
                    >
                      {t(paragraph.key, { fallback: paragraph.fallback })}
                    </p>
                  ))}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
