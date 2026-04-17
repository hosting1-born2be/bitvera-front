import {
  AboutHeroSection,
  AboutMissionSection,
  AboutProfessionalsSection,
} from './components';
import styles from './page.module.scss';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <AboutHeroSection />
      <AboutMissionSection />
      <AboutProfessionalsSection />
    </div>
  );
}
