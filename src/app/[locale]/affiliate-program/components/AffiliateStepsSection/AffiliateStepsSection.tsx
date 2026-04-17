'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInLeft, fadeInUp } from '@/shared/lib/helpers/animations';

import styles from './AffiliateStepsSection.module.scss';

const steps = [
  {
    key: 'registration',
    number: '01',
    titleKey: 'stepOneTitle',
    titleFallback: 'Registration',
    bodyKey: 'stepOneBody',
    bodyFallback:
      'Please complete the application form provided below. Our Bitvera team will carefully assess your request. Upon pre-approval of your application, you will receive an affiliate service agreement and a list of KYB documents necessary to verify your business. Additionally, we will provide you with an individual referral link, an affiliate dashboard, and various marketing materials and guidelines to assist you in getting started.',
  },
  {
    key: 'verification',
    number: '02',
    titleKey: 'stepTwoTitle',
    titleFallback: 'Verification',
    bodyKey: 'stepTwoBody',
    bodyFallback:
      'Kindly submit a signed service agreement and the necessary documents to verify your business. Additionally, we request that you provide us with a comprehensive list of channels and resources for promoting our brand (such as websites, blogs, social influencers, networking platforms, etc.). Please include an example of promotional material featuring your referral link. Your submitted documents, channels, and materials will be carefully reviewed within 48 hours. We reserve the right to approve, disapprove, or suggest any necessary changes.',
  },
  {
    key: 'promotion',
    number: '03',
    titleKey: 'stepThreeTitle',
    titleFallback: 'Promotion',
    bodyKey: 'stepThreeBody',
    bodyFallback:
      'Start introducing new customers to Bitvera with a dedicated link. Our dedicated team can collaborate and create customised offerings for your audience. Our Compliance and Support team oversees the KYC verification process for each customer order. You just link to Bitvera in articles, create new content, or place ads on your website.',
  },
  {
    key: 'rewarded',
    number: '04',
    titleKey: 'stepFourTitle',
    titleFallback: 'Getting rewarded!',
    bodyKey: 'stepFourBody',
    bodyFallback:
      'By promoting Bitvera and using your referral link, you will earn a commission from each exchange transaction completed by verified customers who have registered through your efforts. The remuneration offered is highly appealing, and there is no limit to how much you can earn - the more customers you refer, the greater your potential earnings. You can conveniently monitor transaction volumes through your affiliate dashboard. Commissions are paid out every Monday unless you have any inquiries or corrections to be addressed, which you can communicate to our dedicated affiliate manager. Please note that only affiliates who have completed KYB verification can receive affiliate commissions.',
  },
] as const;

export const AffiliateStepsSection = () => {
  const t = useTranslations('affiliateProgramPage');
  const viewport = { once: true, amount: 0.15 };

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.h2
          className={styles.title}
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {t('stepsTitle', {
            fallback: '4 easy steps to start earning with Bitvera',
          })}
        </motion.h2>

        <div className={styles.grid}>
          {steps.map((step, index) => (
            <motion.article
              key={step.key}
              className={`${styles.card} ${styles[step.key]}`}
              variants={fadeInUp}
              custom={index * 0.08}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className={styles.badge}>{step.number}</span>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>
                  {t(step.titleKey, { fallback: step.titleFallback })}
                </h3>

                <p className={styles.cardBody}>
                  {t(step.bodyKey, { fallback: step.bodyFallback })}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
