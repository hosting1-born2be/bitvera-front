import {
  HowToExchangeHeroSection,
  HowToExchangeProcessSection,
  HowToExchangeWalletSection,
} from './components';
import styles from './page.module.scss';

export default function HowToExchangePage() {
  return (
    <div className={styles.page}>
      <HowToExchangeHeroSection />
      <HowToExchangeProcessSection />
      <HowToExchangeWalletSection />
    </div>
  );
}
