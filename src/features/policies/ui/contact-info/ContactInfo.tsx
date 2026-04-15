"use client";

import { Link } from "@/i18n/navigation";


import { WEBSITE_EMAIL, WEBSITE_PHONE } from "@/shared/lib/constants/constants";
import { EmailIcon, PhoneIcon, WebIcon } from "@/shared/ui/icons";

import st from "./ContactInfo.module.scss";

export const ContactInfo = () => {

  return (
    <section className={st.layout}>
      <span className={st.item}>
        <EmailIcon />
        <p>
          <Link href={`mailto:${WEBSITE_EMAIL}`}>{WEBSITE_EMAIL}</Link>
        </p>
      </span>
      {WEBSITE_PHONE && (
        <span className={st.item}>
          <PhoneIcon />
          <p>
            <Link href={`tel:${WEBSITE_PHONE}`}>{WEBSITE_PHONE}</Link>
          </p>
        </span>
      )}
      <span className={st.item}>
        <WebIcon />
        <p>
          <Link href="https://estanora.com/contact">
            www.estanora.com/contact
          </Link>
        </p>
      </span>
    </section>
  );
};
