import { Metadata } from 'next';

import { ContactUsSupportSection } from './components';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Contact Us | Bitvera',
  description:
    'Contact Bitvera support if you have any technical questions. Send your details and our team will get back to you as soon as possible.',
  openGraph: {
    title: 'Contact Us | Bitvera',
    description:
      'Contact Bitvera support if you have any technical questions. Send your details and our team will get back to you as soon as possible.',
  },
};

export default function ContactUsPage() {
  return (
    <div className={styles.page}>
      <ContactUsSupportSection />
    </div>
  );
}
