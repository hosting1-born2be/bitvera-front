import { Metadata } from 'next';

import {
  AboutHeroSection,
  AboutMissionSection,
  AboutProfessionalsSection,
} from './components';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'About Crypto Exchange | Bitvera',
  description: 'Meet Bitvera crypto exchange for BTC and ETH. Learn how we built a fast, secure, and user-friendly platform for seamless transactions.',
  openGraph: {
    title: 'About Crypto Exchange | Bitvera',
    description: 'Meet Bitvera crypto exchange for BTC and ETH. Learn how we built a fast, secure, and user-friendly platform for seamless transactions.',
    //images: 'https://bitvera.com/images/meta.png',
  },
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <AboutHeroSection />
      <AboutMissionSection />
      <AboutProfessionalsSection />
    </div>
  );
}
