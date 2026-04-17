export const CURRENCIES = [
  { symbol: 'BTC', icon: '/images/home/bitvera/btc-icon.svg' },
  { symbol: 'ETH', icon: '/images/home/bitvera/eth-icon.svg' },
  { symbol: 'AUD', icon: '/images/home/bitvera/aud-icon.svg' },
  { symbol: 'USD', icon: '/images/home/bitvera/usd-icon.svg' },
  { symbol: 'EUR', icon: '/images/home/bitvera/eur-icon.svg' },
] as const;

export type Currency = (typeof CURRENCIES)[number]['symbol'];

export type ExchangeRates = Record<Currency, number>;

export const INITIAL_RATES: ExchangeRates = {
  BTC: 65019.73,
  ETH: 2102.2,
  AUD: 0.651,
  USD: 1,
  EUR: 1.087,
};

export const INITIAL_SPEND_AMOUNT = '60,021';
export const EXCHANGE_RATES_REFRESH_INTERVAL = 60_000;

export const sanitizeAmount = (value: string) => {
  const normalized = value.replace(/\./g, ',').replace(/[^\d,]/g, '');
  const [integerPart = '', ...fractionParts] = normalized.split(',');
  const fractionPart = fractionParts.join('').slice(0, 3);

  if (!integerPart && !fractionPart) {
    return '';
  }

  return fractionPart ? `${integerPart || '0'},${fractionPart}` : integerPart;
};

export const parseAmount = (value: string) => {
  if (!value) {
    return 0;
  }

  return Number(value.replace(',', '.')) || 0;
};

export const formatAmount = (value: number) => {
  return value.toFixed(3).replace('.', ',');
};

export const convertAmount = (
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

export const hasValidExchangeRates = (
  rates: Partial<ExchangeRates> | undefined,
): rates is ExchangeRates => {
  if (!rates) {
    return false;
  }

  return CURRENCIES.every((currency) => typeof rates[currency.symbol] === 'number');
};
