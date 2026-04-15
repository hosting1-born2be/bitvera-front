'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { submitRequestForm } from '@/features/forms/api/submitForm';
import { type RequestFormSchema, requestFormSchema } from '@/features/forms/model/schemas';

import { PlusSmallIcon } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/kit/button/Button';

import { FormPopup } from '../FormPopup/FormPopup';
import styles from './RequestPopup.module.scss';

type RequestPopupProps = {
  service: string;
  isOpen: boolean;
  onClose: () => void;
  onReturnHome?: () => void;
};

export const RequestPopup = ({ service, isOpen, onClose, onReturnHome }: RequestPopupProps) => {
  const t = useTranslations('forms');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RequestFormSchema>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      website: '',
      message: '',
      recaptcha: '',
    },
  });

  const handleClose = () => {
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
    form.reset();
    onReturnHome?.();
    onClose();
  };

  const onSubmit = async (data: RequestFormSchema) => {
    setError(null);
    setIsLoading(true);

    try {
      await submitRequestForm(data, service);
      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (
    name: keyof Pick<
      RequestFormSchema,
      'firstName' | 'lastName' | 'email' | 'phone' | 'website' | 'message'
    >,
    label: string,
    placeholder: string,
    type: 'text' | 'email' | 'tel' = 'text'
  ) => {
    const fieldError = form.formState.errors[name];

    return (
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor={`request-${name}`}>
          {label}
        </label>
        <input
          id={`request-${name}`}
          type={type}
          className={styles.fieldInput}
          placeholder={placeholder}
          {...form.register(name)}
        />
        <span className={styles.fieldLine} aria-hidden="true" />
        {fieldError ? <span className={styles.fieldError}>{fieldError.message}</span> : null}
      </div>
    );
  };

  return (
    <FormPopup
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabelledBy="request-popup-title"
      panelClassName={styles.panel}
    >
      <div className={`${styles.shell} ${isSuccess ? styles.successShell : ''}`}>
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
          aria-label={t('close', { fallback: 'Close' })}
        >
          <span>{t('close', { fallback: 'Close' })}</span>
          <span className={styles.closeIcon} aria-hidden="true" />
        </button>

        {isSuccess ? (
          <div className={styles.successLayout}>
            <div className={styles.successContent}>
              <h2 id="request-popup-title" className={styles.successTitle}>
                {t('requestForm.successTitle', { fallback: 'Thank you!' })}
              </h2>
              <p className={styles.successDescription}>
                {t('requestForm.successMessage1', {
                  fallback:
                    'Your request has been received successfully. Our team will review your details and contact you shortly to discuss the next steps.',
                })}
              </p>
            </div>

            <div className={styles.successVisual} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/forms/request-popup/success-globe-desktop.svg"
                alt=""
                className={styles.successImageDesktop}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/forms/request-popup/success-globe-mobile.svg"
                alt=""
                className={styles.successImageMobile}
              />
            </div>
          </div>
        ) : (
          <div className={styles.formLayout}>
            <div className={styles.summary}>
              <h2 id="request-popup-title" className={styles.title}>
                {service}
              </h2>

              <div className={styles.submitDesktop}>
                <Button
                  variant="filled"
                  type="button"
                  onClick={() => void form.handleSubmit(onSubmit)()}
                  disabled={isLoading}
                >
                  <span className={styles.submitContent}>
                    <span>
                      {isLoading
                        ? t('loading', { fallback: 'Sending…' })
                        : t('submit', { fallback: 'Submit' })}
                    </span>
                    <PlusSmallIcon className={styles.submitIcon} aria-hidden="true" />
                  </span>
                </Button>
              </div>
            </div>

            <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className={styles.formGrid}>
                {renderField(
                  'firstName',
                  t('firstName', { fallback: 'First Name:' }),
                  t('firstNamePlaceholder', { fallback: 'Enter your first name' })
                )}
                {renderField(
                  'lastName',
                  t('lastName', { fallback: 'Last Name:' }),
                  t('lastNamePlaceholder', { fallback: 'Enter your last name' })
                )}
                {renderField(
                  'email',
                  t('email', { fallback: 'Email:' }),
                  t('emailPlaceholder', { fallback: 'Enter your email' }),
                  'email'
                )}
                {renderField(
                  'phone',
                  t('phone', { fallback: 'Phone:' }),
                  t('phonePlaceholder', { fallback: 'Enter your phone number' }),
                  'tel'
                )}
                {renderField(
                  'website',
                  t('website', { fallback: 'Your Website:' }),
                  t('websitePlaceholder', { fallback: 'Enter your website' })
                )}
                {renderField(
                  'message',
                  t('message', { fallback: 'Message:' }),
                  t('messagePlaceholder', { fallback: 'Enter your message' })
                )}
              </div>

              {error ? <p className={styles.submitError}>{error}</p> : null}

              <div className={styles.submitMobile}>
                <Button variant="filled" type="submit" disabled={isLoading}>
                  <span className={styles.submitContent}>
                    <span>
                      {isLoading
                        ? t('loading', { fallback: 'Sending…' })
                        : t('submit', { fallback: 'Submit' })}
                    </span>
                    <PlusSmallIcon className={styles.submitIcon} aria-hidden="true" />
                  </span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </FormPopup>
  );
};
