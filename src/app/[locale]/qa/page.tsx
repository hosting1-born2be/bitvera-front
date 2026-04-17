import { Metadata } from "next";

import { QaContentSection, QaHeroSection } from "./components";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Crypto Exchange Questions and Answers | Bitvera",
  description:
    "Find answers about Bitvera crypto exchange. Learn about payments, BTC and ETH transactions, wallets, KYC verification, and support.",
  openGraph: {
    title: "Crypto Exchange Questions and Answers | Bitvera",
    description:
      "Find answers about Bitvera crypto exchange. Learn about payments, BTC and ETH transactions, wallets, KYC verification, and support.",
  },
};

export default function QaPage() {
  return (
    <div className={styles.page}>
      <QaHeroSection />
      <QaContentSection />
    </div>
  );
}
