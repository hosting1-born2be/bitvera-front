'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { SIGN_UP_URL } from '@/shared/lib/constants/constants';
import { fadeInLeft, fadeInRight } from '@/shared/lib/helpers/animations';
import { Button } from '@/shared/ui/kit/button/Button';

import styles from './HeroSection.module.scss';

const CURRENCIES = [
  { symbol: 'BTC', icon: '/images/home/bitvera/btc-icon.svg' },
  { symbol: 'ETH', icon: '/images/home/bitvera/eth-icon.svg' },
  { symbol: 'AUD', icon: '/images/home/bitvera/aud-icon.svg' },
  { symbol: 'USD', icon: '/images/home/bitvera/usd-icon.svg' },
  { symbol: 'EUR', icon: '/images/home/bitvera/eur-icon.svg' },
] as const;

type Currency = (typeof CURRENCIES)[number]['symbol'];
type MenuField = 'spend' | 'receive' | null;

type ExchangeRates = Record<Currency, number>;

const INITIAL_RATES: ExchangeRates = {
  BTC: 65019.73,
  ETH: 2102.2,
  AUD: 0.651,
  USD: 1,
  EUR: 1.087,
};
const INITIAL_SPEND_AMOUNT = '60,021';
const EXCHANGE_RATES_REFRESH_INTERVAL = 60_000;

const sanitizeAmount = (value: string) => {
  const normalized = value.replace(/\./g, ',').replace(/[^\d,]/g, '');
  const [integerPart = '', ...fractionParts] = normalized.split(',');
  const fractionPart = fractionParts.join('').slice(0, 3);

  if (!integerPart && !fractionPart) {
    return '';
  }

  return fractionPart ? `${integerPart || '0'},${fractionPart}` : integerPart;
};

const parseAmount = (value: string) => {
  if (!value) {
    return 0;
  }

  return Number(value.replace(',', '.')) || 0;
};

const formatAmount = (value: number) => {
  return value.toFixed(3).replace('.', ',');
};

const convertAmount = (
  amount: number,
  spendCurrency: Currency,
  receiveCurrency: Currency,
  ratesToUsd: ExchangeRates,
) => {
  const spendRate = ratesToUsd[spendCurrency];
  const receiveRate = ratesToUsd[receiveCurrency];

  if (!spendRate || !receiveRate) {
    return 0;
  }

  return (amount * spendRate) / receiveRate;
};

export const HeroSection = () => {
  const t = useTranslations('homePage');
  const viewport = { once: true, amount: 0.2 };
  const [spendCurrency, setSpendCurrency] = useState<Currency>('BTC');
  const [receiveCurrency, setReceiveCurrency] = useState<Currency>('ETH');
  const [spendAmount, setSpendAmount] = useState(INITIAL_SPEND_AMOUNT);
  const [openMenu, setOpenMenu] = useState<MenuField>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(INITIAL_RATES);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const parsedSpendAmount = parseAmount(spendAmount);
  const receiveAmount = useMemo(
    () => formatAmount(convertAmount(parsedSpendAmount, spendCurrency, receiveCurrency, exchangeRates)),
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

        const payload = (await response.json()) as { ratesToUsd?: Partial<ExchangeRates> };
        const nextRates = payload.ratesToUsd;

        if (
          !isMounted ||
          !nextRates ||
          CURRENCIES.some((currency) => typeof nextRates[currency.symbol] !== 'number')
        ) {
          return;
        }

        setExchangeRates(nextRates as ExchangeRates);
      } catch (error) {
        console.error('Failed to refresh hero exchange rates:', error);
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
      label: t('converterSpendLabel', { fallback: 'You spend' }),
      value: spendAmount,
      currency: spendCurrency,
      editable: true,
    },
    {
      key: 'receive',
      label: t('converterReceiveLabel', { fallback: 'You get' }),
      value: receiveAmount,
      currency: receiveCurrency,
      editable: false,
    },
  ] as const;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionInner}>
          <div className={styles.heroLayout}>
            <motion.div
              className={styles.heroContent}
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <h1 className={styles.heroTitle}>
                {t('heroTitle', { fallback: 'Cryptocurrency has never been that simple' })}
              </h1>

              <p className={styles.heroSubtitle}>
                {t('heroSubtitle', { fallback: 'Sign up and exchange BTC, ETH, AUD, USD & EUR!' })}
              </p>

              <div className={styles.buttonWrap}>
                <Button variant="filled" url={SIGN_UP_URL} type="link">
                  {t('heroPrimaryCta', { fallback: 'Get Started' })}
                </Button>
              </div>
            </motion.div>

            <motion.div
              className={styles.exchangeCard}
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <div className={styles.exchangeCardHeader}>
                <h2 className={styles.exchangeTitle}>
                  {t('converterTitle', { fallback: 'Exchange BTC, ETH, AUD, USD & EUR' })}
                </h2>
                <p className={styles.exchangeDescription}>
                  {t('converterDescription', {
                    fallback: 'Make an exchange with an incredible speed',
                  })}
                </p>
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
                              src={CURRENCIES.find((currency) => currency.symbol === item.currency)?.icon}
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
      </div>
    </section>
  );
};
