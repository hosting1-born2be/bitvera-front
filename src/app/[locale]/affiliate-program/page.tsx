import { Metadata } from 'next';

import {
  AffiliateCtaSection,
  AffiliateFormSection,
  AffiliateHeroSection,
  AffiliateStepsSection,
} from './components';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Affiliate Program | Bitvera',
  description:
    'Join the Bitvera affiliate program, invite new clients, and earn commissions from completed exchange transactions.',
  openGraph: {
    title: 'Affiliate Program | Bitvera',
    description:
      'Join the Bitvera affiliate program, invite new clients, and earn commissions from completed exchange transactions.',
  },
};

export default function AffiliateProgramPage() {
  return (
    <div className={styles.page}>
      <AffiliateHeroSection />
      <AffiliateStepsSection />
      <AffiliateFormSection />
      <AffiliateCtaSection />
    </div>
  );
}
