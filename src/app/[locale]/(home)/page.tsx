import {
  BenefitsSection,
  HeroSection,
  InstantExchangeSection,
  SafetyFaqSection,
  SecuritySection,
  StartExchangeSection,
  TrustSection,
  WelcomeSection,
} from "./components";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <HeroSection />

      <section className={styles.infoGroup}>
        <div className="container">
          <div className={styles.infoGroupInner}>
            <WelcomeSection />

            <div className={styles.infoGrid}>
              <SecuritySection />
              <TrustSection />
            </div>
          </div>
        </div>
      </section>

      <StartExchangeSection />
      <InstantExchangeSection />
      <BenefitsSection />
      <SafetyFaqSection />
    </div>
  );
}
