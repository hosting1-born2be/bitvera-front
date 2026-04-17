'use client';

import { useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { submitSupportForm } from '@/features/forms/api/submitForm';
import {
  type SupportFormSchema,
  createSupportFormSchema,
} from '@/features/forms/model/schemas';
import { Button } from '@/shared/ui/kit/button/Button';

import { FormPopup } from '../FormPopup/FormPopup';
import styles from './SupportForm.module.scss';

type SupportFieldName = Exclude<keyof SupportFormSchema, 'message' | 'recaptcha'>;

type SupportFieldConfig = {
  name: SupportFieldName;
  autoComplete: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  type?: 'email' | 'text';
  label: string;
  placeholder: string;
};

export const SupportForm = () => {
  const t = useTranslations('forms.supportForm');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const requiredMessage = t('errors.required', {
    fallback: 'This field is required.',
  });
  const emailInvalidMessage = t('errors.emailInvalid', {
    fallback: 'Please provide a valid email address.',
  });
  const fieldConfigs: readonly SupportFieldConfig[] = useMemo(
    () => [
      {
        name: 'name',
        autoComplete: 'name',
        label: t('fields.name.label', { fallback: 'Name:' }),
        placeholder: t('fields.name.placeholder', {
          fallback: 'Enter your full name',
        }),
      },
      {
        name: 'email',
        autoComplete: 'email',
        inputMode: 'email',
        type: 'email',
        label: t('fields.email.label', { fallback: 'Email:' }),
        placeholder: t('fields.email.placeholder', {
          fallback: 'Enter your email',
        }),
      },
    ],
    [t]
  );

  const schema = useMemo(
    () =>
      createSupportFormSchema((key, fallback) =>
        (
          {
            'errors.required': requiredMessage,
            'errors.emailInvalid': emailInvalidMessage,
          } as const
        )[key] ?? fallback
      ),
    [emailInvalidMessage, requiredMessage]
  );

  const form = useForm<SupportFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      recaptcha: '',
    },
  });

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
  };

  const onSubmit = async (data: SupportFormSchema) => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      await submitSupportForm(data);
      form.reset();
      setIsSuccessOpen(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className={styles.grid}>
          {fieldConfigs.map((field) => {
            const fieldError = form.formState.errors[field.name];

            return (
              <div
                key={field.name}
                className={`${styles.field} ${fieldError ? styles.fieldErrorState : ''}`}
              >
                <label className={styles.fieldShell} htmlFor={`support-${field.name}`}>
                  <span className={styles.fieldLabel}>
                    {field.label}
                  </span>
                  <input
                    id={`support-${field.name}`}
                    type={field.type ?? 'text'}
                    className={styles.fieldInput}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    inputMode={field.inputMode}
                    {...form.register(field.name)}
                  />
                </label>
                {fieldError ? <span className={styles.fieldError}>{fieldError.message}</span> : null}
              </div>
            );
          })}

          <div className={styles.field}>
            <label
              className={`${styles.fieldShell} ${styles.messageShell}`}
              htmlFor="support-message"
            >
              <span className={styles.fieldLabel}>
                {t('fields.message.label', { fallback: 'Message:' })}
              </span>
              <textarea
                id="support-message"
                className={styles.fieldTextarea}
                placeholder={t('fields.message.placeholder', {
                  fallback: 'Enter your message',
                })}
                rows={1}
                {...form.register('message')}
              />
            </label>
          </div>
        </div>

        {submitError ? <p className={styles.submitError}>{submitError}</p> : null}

        <div className={styles.actions}>
          <Button variant="bitveraForm" type="submit" disabled={isLoading}>
            {isLoading
              ? t('sending', { fallback: 'Sending...' })
              : t('submit', { fallback: 'Send' })}
          </Button>
        </div>
      </form>

      <FormPopup
        isOpen={isSuccessOpen}
        onClose={handleSuccessClose}
        ariaLabelledBy="support-success-title"
        panelClassName={styles.successPanel}
      >
        <button
          type="button"
          className={styles.successClose}
          onClick={handleSuccessClose}
          aria-label={t('popupAction', { fallback: 'Close' })}
        >
          {t('popupAction', { fallback: 'Close' })}
        </button>

        <div className={styles.successContent}>
          <h3 id="support-success-title" className={styles.successTitle}>
            {t('popupTitle', { fallback: 'Thank you!' })}
          </h3>

          <p className={styles.successMessage}>
            {t('popupMessage', {
              fallback:
                'Your request has been sent successfully! Our Bitvera team will review it and contact you asap!',
            })}
          </p>

          <div className={styles.successAction}>
            <Button variant="bitveraForm" type="button" onClick={handleSuccessClose}>
              {t('popupAction', { fallback: 'Close' })}
            </Button>
          </div>
        </div>
      </FormPopup>
    </>
  );
};
