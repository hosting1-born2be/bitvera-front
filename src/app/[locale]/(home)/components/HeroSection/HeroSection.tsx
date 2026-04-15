'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { SIGN_UP_URL } from '@/shared/lib/constants/constants';
import { fadeInLeft, fadeInRight } from '@/shared/lib/helpers/animations';
import { Button } from '@/shared/ui/kit/button/Button';

import styles from './HeroSection.module.scss';

type Token = 'BTC' | 'ETH';
type MenuField = 'spend' | 'receive' | null;

type TokenConfig = {
  symbol: Token;
  icon: string;
};

type ExchangeRates = {
  btcToEth: number;
  ethToBtc: number;
};

const TOKENS: readonly TokenConfig[] = [
  { symbol: 'BTC', icon: '/images/home/bitvera/btc-icon.svg' },
  { symbol: 'ETH', icon: '/images/home/bitvera/eth-icon.svg' },
] as const;

const INITIAL_RATES: ExchangeRates = {
  btcToEth: 30.922510454674196,
  ethToBtc: 1 / 30.922510454674196,
};
const INITIAL_SPEND_AMOUNT = '60,021';
const EXCHANGE_RATES_REFRESH_INTERVAL = 60_000;

const getOppositeToken = (token: Token): Token => (token === 'BTC' ? 'ETH' : 'BTC');

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

const convertAmount = (amount: number, spendToken: Token, rates: ExchangeRates) => {
  if (spendToken === 'BTC') {
    return amount * rates.btcToEth;
  }

  return amount * rates.ethToBtc;
};

export const HeroSection = () => {
  const t = useTranslations('homePage');
  const viewport = { once: true, amount: 0.2 };
  const [spendToken, setSpendToken] = useState<Token>('BTC');
  const [spendAmount, setSpendAmount] = useState(INITIAL_SPEND_AMOUNT);
  const [openMenu, setOpenMenu] = useState<MenuField>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(INITIAL_RATES);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const receiveToken = getOppositeToken(spendToken);
  const parsedSpendAmount = parseAmount(spendAmount);
  const receiveAmount = useMemo(
    () => formatAmount(convertAmount(parsedSpendAmount, spendToken, exchangeRates)),
    [exchangeRates, parsedSpendAmount, spendToken],
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

        const payload = (await response.json()) as Partial<ExchangeRates>;

        if (
          !isMounted ||
          typeof payload.btcToEth !== 'number' ||
          typeof payload.ethToBtc !== 'number'
        ) {
          return;
        }

        setExchangeRates({
          btcToEth: payload.btcToEth,
          ethToBtc: payload.ethToBtc,
        });
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

  const handleTokenSelect = (field: Exclude<MenuField, null>, nextToken: Token) => {
    if (field === 'spend') {
      if (nextToken === spendToken) {
        setOpenMenu(null);
        return;
      }

      setSpendAmount(receiveAmount);
      setSpendToken(nextToken);
      setOpenMenu(null);
      return;
    }

    if (nextToken === receiveToken) {
      setOpenMenu(null);
      return;
    }

    setSpendAmount(receiveAmount);
    setSpendToken(getOppositeToken(nextToken));
    setOpenMenu(null);
  };

  const converterRows = [
    {
      key: 'spend',
      label: t('converterSpendLabel', { fallback: 'You spend' }),
      value: spendAmount,
      token: spendToken,
      editable: true,
    },
    {
      key: 'receive',
      label: t('converterReceiveLabel', { fallback: 'You get' }),
      value: receiveAmount,
      token: receiveToken,
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
                {t('heroSubtitle', { fallback: 'Sign up and exchange BTC & ETH!' })}
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
                  {t('converterTitle', { fallback: 'Exchange BTC & ETH' })}
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
                            aria-label={`${item.label} ${item.token}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={TOKENS.find((token) => token.symbol === item.token)?.icon}
                              alt=""
                              aria-hidden="true"
                              className={styles.tokenIcon}
                            />
                            <span className={styles.tokenText}>{item.token}</span>
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
                              {TOKENS.map((token) => (
                                <button
                                  key={token.symbol}
                                  type="button"
                                  className={styles.tokenMenuItem}
                                  data-active={token.symbol === item.token}
                                  onClick={() => handleTokenSelect(item.key, token.symbol)}
                                  role="menuitemradio"
                                  aria-checked={token.symbol === item.token}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={token.icon}
                                    alt=""
                                    aria-hidden="true"
                                    className={styles.tokenIcon}
                                  />
                                  <span className={styles.tokenText}>{token.symbol}</span>
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
