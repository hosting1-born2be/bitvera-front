import { Metadata } from 'next';

import {
  HowToExchangeHeroSection,
  HowToExchangeProcessSection,
  HowToExchangeWalletSection,
} from './components';
import styles from './page.module.scss';


export const metadata: Metadata = {
  title: 'How to Exchange Cryptocurrency | Bitvera',
  description: 'Start exchanging BTC and ETH with Bitvera. Learn the step-by-step process, from registration and verification to wallet setup and secure transactions.',
  openGraph: {
    title: 'How to Exchange Cryptocurrency | Bitvera',
    description: 'Start exchanging BTC and ETH with Bitvera. Learn the step-by-step process, from registration and verification to wallet setup and secure transactions.',
    //images: 'https://bitvera.com/images/meta.png',
  },
};

export default function HowToExchangePage() {
  return (
    <div className={styles.page}>
      <HowToExchangeHeroSection />
      <HowToExchangeProcessSection />
      <HowToExchangeWalletSection />
    </div>
  );
}
