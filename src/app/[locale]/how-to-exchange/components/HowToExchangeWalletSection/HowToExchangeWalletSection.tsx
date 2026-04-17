'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInLeft, fadeInUp } from '@/shared/lib/helpers/animations';

import styles from './HowToExchangeWalletSection.module.scss';

const walletCards = [
  {
    key: 'ethereum',
    image: '/images/how-to-exchange/bitvera/ethereum-coin.svg',
    altKey: 'walletEthereumAlt',
    altFallback: 'Ethereum wallet icon',
  },
  {
    key: 'bitcoin',
    image: '/images/how-to-exchange/bitvera/bitcoin-coin.png',
    altKey: 'walletBitcoinAlt',
    altFallback: 'Bitcoin wallet icon',
  },
] as const;

export const HowToExchangeWalletSection = () => {
  const t = useTranslations('howToExchangePage');
  const viewport = { once: true, amount: 0.2 };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.copy}
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <h2 className={styles.title}>
              {t('walletTitle', { fallback: 'Wallet' })}
            </h2>

            <p className={styles.description}>
              {t('walletDescription', {
                fallback:
                  "We don't store any cryptocurrencies or fiat currency.\nWe are only a crypto exchange.\nWe recommend (but do not insist) to open wallets on the sites below:",
              })}
            </p>
          </motion.div>

          <div className={styles.cards}>
            {walletCards.map((wallet, index) => (
              <motion.article
                key={wallet.key}
                className={styles.card}
                variants={fadeInUp}
                custom={index * 0.08}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                {wallet.key === 'bitcoin' ? (
                  <div className={styles.bitcoinShell}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={wallet.image}
                      alt={t(wallet.altKey, { fallback: wallet.altFallback })}
                      className={styles.bitcoinIcon}
                    />
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={wallet.image}
                    alt={t(wallet.altKey, { fallback: wallet.altFallback })}
                    className={styles.coinIcon}
                  />
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
