import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SUPPORTED_CURRENCIES = ['BTC', 'ETH', 'AUD', 'USD', 'EUR'] as const;

type Currency = (typeof SUPPORTED_CURRENCIES)[number];

type CoinbaseExchangeRatesResponse = {
  data?: {
    currency?: string;
    rates?: Record<string, string>;
  };
};

const COINBASE_EXCHANGE_RATES_URL = 'https://api.coinbase.com/v2/exchange-rates';

const parseRate = (value: string | undefined, { invert = false } = {}) => {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return invert ? 1 / parsedValue : parsedValue;
};

const getRates = async (baseCurrency: Currency) => {
  const response = await fetch(`${COINBASE_EXCHANGE_RATES_URL}?currency=${baseCurrency}`, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Coinbase rates request failed with status ${response.status}`);
  }

  return (await response.json()) as CoinbaseExchangeRatesResponse;
};

export async function GET() {
  try {
    const usdResponse = await getRates('USD');

    const ratesToUsd = SUPPORTED_CURRENCIES.reduce<Partial<Record<Currency, number>>>(
      (accumulator, currency) => {
        accumulator[currency] =
          currency === 'USD'
            ? 1
            : parseRate(usdResponse.data?.rates?.[currency], { invert: true }) ?? undefined;

        return accumulator;
      },
      {},
    );

    const hasAllSupportedRates = SUPPORTED_CURRENCIES.every(
      (currency) => typeof ratesToUsd[currency] === 'number',
    );

    if (!hasAllSupportedRates) {
      throw new Error('Unable to resolve supported exchange rates from Coinbase response.');
    }

    return NextResponse.json(
      {
        ratesToUsd,
        source: 'coinbase',
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown exchange rate error';

    console.error('Exchange rate request failed:', message);

    return NextResponse.json(
      {
        message: 'Failed to load exchange rates.',
        error: message,
      },
      { status: 500 },
    );
  }
}
