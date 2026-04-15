import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type CoinbaseExchangeRatesResponse = {
  data?: {
    currency?: string;
    rates?: Record<string, string>;
  };
};

const COINBASE_EXCHANGE_RATES_URL = 'https://api.coinbase.com/v2/exchange-rates';

const parseRate = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

const getRates = async (baseCurrency: 'BTC' | 'ETH') => {
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
    const [btcResponse, ethResponse] = await Promise.all([getRates('BTC'), getRates('ETH')]);

    const btcToEth = parseRate(btcResponse.data?.rates?.ETH);
    const ethToBtc = parseRate(ethResponse.data?.rates?.BTC);

    const normalizedBtcToEth =
      btcToEth ?? (ethToBtc ? 1 / ethToBtc : null);
    const normalizedEthToBtc =
      ethToBtc ?? (btcToEth ? 1 / btcToEth : null);

    if (!normalizedBtcToEth || !normalizedEthToBtc) {
      throw new Error('Unable to resolve BTC/ETH exchange rates from Coinbase response.');
    }

    return NextResponse.json(
      {
        btcToEth: normalizedBtcToEth,
        ethToBtc: normalizedEthToBtc,
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
