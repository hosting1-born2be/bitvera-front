'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { SIGN_UP_URL } from '@/shared/lib/constants/constants';
import { fadeInLeft, fadeInRight } from '@/shared/lib/helpers/animations';
import {
  convertAmount,
  CURRENCIES,
  type Currency,
  EXCHANGE_RATES_REFRESH_INTERVAL,
  type ExchangeRates,
  formatAmount,
  hasValidExchangeRates,
  INITIAL_RATES,
  INITIAL_SPEND_AMOUNT,
  parseAmount,
  sanitizeAmount,
} from '@/shared/lib/helpers/exchangeConverter';
import { Button } from '@/shared/ui/kit/button/Button';

import styles from './AboutHeroSection.module.scss';

type MenuField = 'spend' | 'receive' | null;

export const AboutHeroSection = () => {
  const t = useTranslations('aboutPage');
  const viewport = { once: true, amount: 0.2 };
  const [spendCurrency, setSpendCurrency] = useState<Currency>('BTC');
  const [receiveCurrency, setReceiveCurrency] = useState<Currency>('USD');
  const [spendAmount, setSpendAmount] = useState(INITIAL_SPEND_AMOUNT);
  const [openMenu, setOpenMenu] = useState<MenuField>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(INITIAL_RATES);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const parsedSpendAmount = parseAmount(spendAmount);
  const receiveAmount = useMemo(
    () =>
      formatAmount(convertAmount(parsedSpendAmount, spendCurrency, receiveCurrency, exchangeRates)),
    [exchangeRates, parsedSpendAmount, receiveCurrency, spendCurrency],
  );

  useEffect(() => {
    let isMounted = true;

    const loadExchangeRates = async () => {
      try {
        const response = await fetch('/api/exchange-rates', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Exchange rates request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as {
          ratesToUsd?: Partial<ExchangeRates>;
        };

        if (!isMounted || !hasValidExchangeRates(payload.ratesToUsd)) {
          return;
        }

        setExchangeRates(payload.ratesToUsd);
      } catch (error) {
        console.error('Failed to refresh about exchange rates:', error);
      }
    };

    void loadExchangeRates();

    const intervalId = window.setInterval(loadExchangeRates, EXCHANGE_RATES_REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!openMenu) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openMenu]);

  const handleSpendAmountChange = (value: string) => {
    setSpendAmount(sanitizeAmount(value));
  };

  const handleSpendAmountBlur = () => {
    if (!spendAmount) {
      return;
    }

    setSpendAmount(formatAmount(parseAmount(spendAmount)));
  };

  const swapCurrencies = () => {
    setSpendAmount(receiveAmount);
    setSpendCurrency(receiveCurrency);
    setReceiveCurrency(spendCurrency);
  };

  const handleCurrencySelect = (field: Exclude<MenuField, null>, nextCurrency: Currency) => {
    if (field === 'spend') {
      if (nextCurrency === spendCurrency) {
        setOpenMenu(null);
        return;
      }

      if (nextCurrency === receiveCurrency) {
        swapCurrencies();
        setOpenMenu(null);
        return;
      }

      setSpendCurrency(nextCurrency);
      setOpenMenu(null);
      return;
    }

    if (nextCurrency === receiveCurrency) {
      setOpenMenu(null);
      return;
    }

    if (nextCurrency === spendCurrency) {
      swapCurrencies();
      setOpenMenu(null);
      return;
    }

    setReceiveCurrency(nextCurrency);
    setOpenMenu(null);
  };

  const converterRows = [
    {
      key: 'spend',
      label: t('cardSpendLabel', { fallback: 'You spend' }),
      value: spendAmount,
      currency: spendCurrency,
      editable: true,
    },
    {
      key: 'receive',
      label: t('cardReceiveLabel', { fallback: 'You get' }),
      value: receiveAmount,
      currency: receiveCurrency,
      editable: false,
    },
  ] as const;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.heroLayout}>
          <motion.div
            className={styles.heroContent}
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <h1 className={styles.heroTitle}>
              {t('heroTitle', { fallback: "We're glad you're here" })}
            </h1>

            <p className={styles.heroSubtitle}>
              {t('heroSubtitle', {
                fallback:
                  'Our Bitvera family was founded with a great purpose: to provide our customers with a new level of cryptocurrency exchanging experience.',
              })}
            </p>
          </motion.div>

          <motion.div
            className={styles.promoCard}
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className={styles.promoPanel}>
              <div className={styles.promoCopy}>
                <h2 className={styles.promoTitle}>
                  {t('cardTitle', {
                    fallback: 'Cryptocurrency has never been that simple',
                  })}
                </h2>

                <p className={styles.promoDescription}>
                  {t('cardDescription', {
                    fallback: 'Sign up and exchange BTC & ETH!',
                  })}
                </p>
              </div>

              <div className={styles.promoButtonWrap}>
                <Button variant="bitveraLight" url={SIGN_UP_URL} type="link">
                  {t('cardCta', { fallback: 'Get Started' })}
                </Button>
              </div>
            </div>

            <div className={styles.exchangeForm}>
              <div className={styles.exchangeFormInner} ref={dropdownRef}>
                {converterRows.map((item) => (
                  <div key={item.key} className={styles.exchangeField}>
                    <span className={styles.fieldLabel}>{item.label}</span>

                    <div className={styles.fieldRow}>
                      {item.editable ? (
                        <input
                          type="text"
                          inputMode="decimal"
                          value={item.value}
                          onChange={(event) => handleSpendAmountChange(event.target.value)}
                          onBlur={handleSpendAmountBlur}
                          className={styles.fieldInput}
                          aria-label={item.label}
                        />
                      ) : (
                        <output className={styles.fieldValue}>{item.value}</output>
                      )}

                      <div className={styles.tokenSelect}>
                        <button
                          type="button"
                          className={styles.tokenPill}
                          onClick={() =>
                            setOpenMenu((currentValue) =>
                              currentValue === item.key ? null : item.key,
                            )
                          }
                          aria-haspopup="menu"
                          aria-expanded={openMenu === item.key}
                          aria-label={`${item.label} ${item.currency}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              CURRENCIES.find((currency) => currency.symbol === item.currency)?.icon
                            }
                            alt=""
                            aria-hidden="true"
                            className={styles.tokenIcon}
                          />
                          <span className={styles.tokenText}>{item.currency}</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/images/home/bitvera/caret-down.svg"
                            alt=""
                            aria-hidden="true"
                            className={styles.caretIcon}
                          />
                        </button>

                        {openMenu === item.key ? (
                          <div className={styles.tokenMenu} role="menu">
                            {CURRENCIES.map((currency) => (
                              <button
                                key={currency.symbol}
                                type="button"
                                className={styles.tokenMenuItem}
                                data-active={currency.symbol === item.currency}
                                onClick={() => handleCurrencySelect(item.key, currency.symbol)}
                                role="menuitemradio"
                                aria-checked={currency.symbol === item.currency}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={currency.icon}
                                  alt=""
                                  aria-hidden="true"
                                  className={styles.tokenIcon}
                                />
                                <span className={styles.tokenText}>{currency.symbol}</span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
