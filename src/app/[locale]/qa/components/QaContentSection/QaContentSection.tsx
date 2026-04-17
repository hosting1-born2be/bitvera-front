'use client';

import { useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInLeft, fadeInRight, fadeInUp } from '@/shared/lib/helpers/animations';

import styles from './QaContentSection.module.scss';

type QaItem = {
  answer: string;
  question: string;
};

type QaCategory = {
  id: string;
  items: readonly QaItem[];
  title: string;
};



const scrollOffset = 140;

export const QaContentSection = () => {
  const t = useTranslations('qaPage');
  const viewport = { once: true, amount: 0.12 };

  const qaCategories: readonly QaCategory[] = [
    {
      id: 'payment-methods',
      title: t('categories.paymentMethods.title', { fallback: 'Payment Methods' }),
      items: [
        {
          question: t('categories.paymentMethods.items.wireTransfer.question', { fallback: 'Can I pay with a wire transfer?' }),
          answer: t('categories.paymentMethods.items.wireTransfer.answer', { fallback: 'Yes, you can purchase digital currency through a bank wire transfer.' }),
        },
      ],
    },
    {
      id: 'supported-cryptocurrencies',
      title: t('categories.supportedCryptocurrencies.title', { fallback: 'Supported Cryptocurrencies' }),
      items: [
        {
          question: t('categories.supportedCryptocurrencies.items.supported.question', { fallback: 'What cryptocurrencies are supported on Bitvera?' }),
          answer: t('categories.supportedCryptocurrencies.items.supported.answer', { fallback: 'Currently, we support Bitcoin and Ethereum only.' }),
        },
      ],
    },
    {
      id: 'wallets-and-verification',
      title: t('categories.walletsAndVerification.title', { fallback: 'Wallets and Transaction Verification' }),
      items: [
        {
          question: t('categories.walletsAndVerification.items.wallet.question', { fallback: 'From where can I obtain a Bitcoin or Ethereum wallet?' }),
          answer: t('categories.walletsAndVerification.items.wallet.answer', { fallback: 'Bitvera does not provide wallets. We are here to send coins to the wallet you choose.' }),
        },
        {
          question: t('categories.walletsAndVerification.items.transaction.question', { fallback: 'How can I ensure the coins were sent to my chosen wallet?' }),
          answer: t('categories.walletsAndVerification.items.transaction.answer', { fallback: 'You can verify the transaction records by checking http://blockchain.info/address/YOURADDRESS. It will display the coins sent to or from your wallet address.' }),
        },
      ],
    },
    {
      id: 'selling-and-rate',
      title: t('categories.sellingAndRate.title', { fallback: 'Selling Crypto and Exchange Rate' }),
      items: [
        {
          question: t('categories.sellingAndRate.items.sell.question', { fallback: 'Is it possible to sell cryptocurrency through Bitvera?' }),
          answer: t('categories.sellingAndRate.items.sell.answer', { fallback: 'Yes, it is. You can sell Bitcoin and Ethereum through Bitvera and receive FIAT currency directly into your bank profile.' }),
        },
        {
          question: t('categories.sellingAndRate.items.factors.question', { fallback: 'What factors determine the exchange rate?' }),
          answer: t('categories.sellingAndRate.items.factors.answer', { fallback: 'Bitvera aims to execute transactions at or close to the prevailing market exchange rate, determined by liquidity providers such as kraken.com Cryptocurrency Exchange.' }),
        },
        {
          question: t('categories.sellingAndRate.items.when.question', { fallback: 'At what point is the exchange rate determined?' }),
          answer: t('categories.sellingAndRate.items.when.answer', { fallback: 'The exchange rate is determined once we receive the payment and process the order.' }),
        },
      ],
    },
    {
      id: 'delivery-and-verification',
      title: t('categories.deliveryAndVerification.title', { fallback: 'Delivery and Verification Process' }),
      items: [  
        {
          question: t('categories.deliveryAndVerification.items.delivery.question', { fallback: 'Do I receive the cryptocurrency immediately after making the payment?' }),
          answer: t('categories.deliveryAndVerification.items.delivery.answer', { fallback: "No, you don't. The crypto is sent to your wallet only after completing a full KYC verification and upon approval and confirmation of your payment and wallet address." }),
        },
        {
          question: t('categories.deliveryAndVerification.items.id.question', { fallback: 'Is it possible to buy crypto without uploading my ID?' }),
          answer: t('categories.deliveryAndVerification.items.id.answer', { fallback: "No, it isn't. You must upload your verification documents to purchase crypto." }),
        },
      ],
    },
    {
      id: 'kyc-and-personal-information',
      title: t('categories.kycAndPersonalInformation.title', { fallback: 'KYC and Personal Information' }),
      items: [
        {
          question: t('categories.kycAndPersonalInformation.items.kycDocument.question', { fallback: 'What is the purpose of signing the KYC document?' }),
          answer: t('categories.kycAndPersonalInformation.items.kycDocument.answer', { fallback: 'KYC (Know Your Customer) is a legal requirement for buying a certain amount of cryptocurrency. We strictly adhere to regulatory rules and request KYC for every purchase.' }),
        },
        {
          question: t('categories.kycAndPersonalInformation.items.personalInformation.question', { fallback: 'Why is it necessary to provide my personal information and documents?' }),
          answer: t('categories.kycAndPersonalInformation.items.personalInformation.answer', { fallback: 'To comply with Regulatory Guidance and ensure the highest security and privacy standards, we require the completion of a successful “Know Your Client” procedure. This helps protect your profile, prevent fraud, and maintain a secure financial service.' }),
        },
        {
          question: t('categories.kycAndPersonalInformation.items.cardDetails.question', { fallback: 'Are my credit card details stored in the Bitvera system?' }),
          answer: t('categories.kycAndPersonalInformation.items.cardDetails.answer', { fallback: 'Your credit/debit card details are not saved in our system.' }),
        },
      ],
    },
    {
      id: 'order-and-support',
      title: t('categories.orderAndSupport.title', { fallback: 'Order and Support' }),
      items: [
        {
          question: t('categories.orderAndSupport.items.timeframe.question', { fallback: 'What is the expected timeframe for the cryptocurrency to be delivered to my wallet?' }),
          answer: t('categories.orderAndSupport.items.timeframe.answer', { fallback: 'We make commercially reasonable efforts to settle exchange orders as soon as possible, typically within five days after submitting a transaction order and completing full KYC verification.' }),
        },
        {
          question: t('categories.orderAndSupport.items.cancel.question', { fallback: 'Is there an option to cancel my order?' }),
          answer: t('categories.orderAndSupport.items.cancel.answer', { fallback: 'Orders can only be cancelled before Bitvera executes the exchange transaction. Please get in touch with our support at [EMAIL] for assistance.' }),
        },
        {
          question: t('categories.orderAndSupport.items.supportHours.question', { fallback: 'What are the working hours of your support team?' }),
          answer: t('categories.orderAndSupport.items.supportHours.answer', { fallback: 'Our dedicated customer support is ready to assist you Monday to Friday from 10:00 to 2:00 and Saturday and Sunday from 10:00 to 18:00 (UTC/GMT +2:00).' }),
        },
      ],
    },
  ] as const;

  const [activeCategoryId, setActiveCategoryId] = useState(qaCategories[0].id);


  useEffect(() => {
    const sections = qaCategories
      .map((category) => document.getElementById(category.id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveCategoryId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleCategoryClick = (id: string) => {
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveCategoryId(id);
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionInner}>
          <motion.nav
            className={styles.nav}
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            aria-label={t('navigationLabel', { fallback: 'Q&A Categories' })}
          >
            {qaCategories.map((category) => {
              const isActive = category.id === activeCategoryId;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={`${styles.navButton} ${isActive ? styles.navButtonActive : ''}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span>{category.title}</span>
                </button>
              );
            })}
          </motion.nav>

          <div className={styles.content}>
            {qaCategories.map((category, categoryIndex) => (
              <motion.article
                key={category.id}
                id={category.id}
                className={styles.category}
                variants={fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                custom={categoryIndex * 0.04}
              >
                <div className={styles.categoryBadge}>
                  <span>{category.title}</span>
                </div>

                <div className={styles.categoryItems}>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className={styles.item}>
                      <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        custom={itemIndex * 0.05}
                      >
                        <h2 className={styles.question}>{item.question}</h2>
                        <p className={styles.answer} dangerouslySetInnerHTML={{ __html: item.answer }} />
                      </motion.div>

                      {itemIndex !== category.items.length - 1 ? (
                        <div className={styles.divider} aria-hidden="true" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
