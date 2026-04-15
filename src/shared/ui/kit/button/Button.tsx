import { useLocale } from "next-intl";

import { cn } from "@/shared/lib/helpers/styles";

import styles from "./Button.module.scss";

import { Link } from "@/i18n/navigation";

export const Button = ({
  children,
  variant,
  url,
  type,
  service,
  onClick,
  disabled,
  target,
}: {
  children: React.ReactNode;
  variant: "filled" | "bordered";
  url?: string;
  type: "button" | "submit" | "link";
  service?: string;
  onClick?: () => void;
  disabled?: boolean;
  target?: string;
}) => {
  const locale = useLocale();
  const localeClass = locale === "en" ? "en" : locale === "de" ? "de" : "it";
  const buttonUrl = service ? `/service-request-form?service=${service}` : url;

  return type === "link" ? (
    <Link
      href={buttonUrl ?? ""}
      className={cn(styles.button, styles[variant], styles.link, styles[localeClass])}
      target={target}
    >
      {children}
    </Link>
  ) : (
    <button
      type={type}
      className={cn(styles.button, styles[variant], styles[localeClass])}
      onClick={onClick ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
