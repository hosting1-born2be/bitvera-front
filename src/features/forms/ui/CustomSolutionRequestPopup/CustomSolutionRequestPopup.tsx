'use client';

import { useTranslations } from 'next-intl';

import { CustomSolutionRequestForm } from '../CustomSolutionRequestForm/CustomSolutionRequestForm';
import { FormPopup } from '../FormPopup/FormPopup';
import styles from './CustomSolutionRequestPopup.module.scss';

type CustomSolutionRequestPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CustomSolutionRequestPopup = ({
  isOpen,
  onClose,
}: CustomSolutionRequestPopupProps) => {
  const t = useTranslations('forms');

  return (
    <FormPopup
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="custom-solution-popup-title"
      panelClassName={styles.panel}
    >
      <div className={styles.shell}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('close', { fallback: 'Close' })}
        >
          <span>{t('close', { fallback: 'Close' })}</span>
          <span className={styles.closeIcon} aria-hidden="true" />
        </button>

        <CustomSolutionRequestForm
          variant="popup"
          titleId="custom-solution-popup-title"
          onSuccessAction={onClose}
          successActionLabel={t('customSolutionForm.closeAction', { fallback: 'Close' })}
        />
      </div>
    </FormPopup>
  );
};
