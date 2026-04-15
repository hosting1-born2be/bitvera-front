import {
  ApproachSection,
  ClosingSection,
  HeroSection,
  PlansSection,
  ServicesSection,
  SolutionsSection,
  WhySection,
  WorkSection,
} from "./components";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <HeroSection />

      <section className={styles.infoGroup}>
        <div className="container">
          <div className={styles.infoGroupInner}>
            <SolutionsSection />

            <div className={styles.infoGrid}>
              <ServicesSection />
              <ApproachSection />
            </div>
          </div>
        </div>
      </section>

      <ClosingSection />
      <PlansSection />
      <WorkSection />
      <WhySection />
    </div>
  );
}
