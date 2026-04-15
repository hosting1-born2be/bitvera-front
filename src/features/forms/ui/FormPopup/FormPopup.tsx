"use client";

import styles from "./FormPopup.module.scss";

type FormPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Optional id for the dialog title (accessibility) */
  ariaLabelledBy?: string;
  /** Optional class to override the default panel styling */
  panelClassName?: string;
};

export const FormPopup = ({
  isOpen,
  onClose,
  children,
  ariaLabelledBy,
  panelClassName,
}: FormPopupProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
    >
      <div
        className={panelClassName ?? styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
