'use client';

import { useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { submitAffiliateForm } from '@/features/forms/api/submitForm';
import {
  type AffiliateFormSchema,
  createAffiliateFormSchema,
} from '@/features/forms/model/schemas';

import { Button } from '@/shared/ui/kit/button/Button';

import { FormPopup } from '../FormPopup/FormPopup';
import styles from './AffiliateForm.module.scss';

type AffiliateFieldConfig = {
  name: Exclude<keyof AffiliateFormSchema, 'recaptcha'>;
  autoComplete: string;
  label: string;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  type?: 'email' | 'password' | 'text' | 'url';
};

export const AffiliateForm = () => {
  const t = useTranslations('forms.affiliateForm');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const requiredMessage = t('errors.required', {
    fallback: 'This field is required.',
  });
  const emailInvalidMessage = t('errors.emailInvalid', {
    fallback: 'Please provide a valid email address.',
  });
  const websiteInvalidMessage = t('errors.websiteInvalid', {
    fallback: 'Please provide a valid website address.',
  });
  const fieldConfigs: readonly AffiliateFieldConfig[] = useMemo(
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
        name: 'username',
        autoComplete: 'username',
        label: t('fields.username.label', { fallback: 'Username:' }),
        placeholder: t('fields.username.placeholder', {
          fallback: 'Enter your username',
        }),
      },
      {
        name: 'companyName',
        autoComplete: 'organization',
        label: t('fields.companyName.label', { fallback: 'Company name:' }),
        placeholder: t('fields.companyName.placeholder', {
          fallback: 'Enter your company name',
        }),
      },
      {
        name: 'companyCountry',
        autoComplete: 'country-name',
        label: t('fields.companyCountry.label', {
          fallback: 'Company country:',
        }),
        placeholder: t('fields.companyCountry.placeholder', {
          fallback: 'Enter your company country',
        }),
      },
      {
        name: 'website',
        autoComplete: 'url',
        label: t('fields.website.label', { fallback: 'Website:' }),
        placeholder: t('fields.website.placeholder', {
          fallback: 'Enter your website',
        }),
        inputMode: 'url',
        type: 'url',
      },
      {
        name: 'geoOfCustomers',
        autoComplete: 'off',
        label: t('fields.geoOfCustomers.label', {
          fallback: 'GEO of customers:',
        }),
        placeholder: t('fields.geoOfCustomers.placeholder', {
          fallback: 'Enter your GEO of customers',
        }),
      },
      {
        name: 'email',
        autoComplete: 'email',
        label: t('fields.email.label', { fallback: 'Email:' }),
        placeholder: t('fields.email.placeholder', {
          fallback: 'Enter your email',
        }),
        inputMode: 'email',
        type: 'email',
      },
      {
        name: 'password',
        autoComplete: 'new-password',
        label: t('fields.password.label', { fallback: 'Password:' }),
        placeholder: t('fields.password.placeholder', {
          fallback: 'Enter your password',
        }),
        type: 'password',
      },
      {
        name: 'positionInCompany',
        autoComplete: 'organization-title',
        label: t('fields.positionInCompany.label', {
          fallback: 'Your position in the company:',
        }),
        placeholder: t('fields.positionInCompany.placeholder', {
          fallback: 'Enter your position in the company',
        }),
      },
      {
        name: 'businessActivity',
        autoComplete: 'off',
        label: t('fields.businessActivity.label', {
          fallback: 'Your business activity:',
        }),
        placeholder: t('fields.businessActivity.placeholder', {
          fallback: 'Enter your business activity',
        }),
      },
      {
        name: 'yearsOnMarket',
        autoComplete: 'off',
        label: t('fields.yearsOnMarket.label', {
          fallback: 'Years on the market:',
        }),
        placeholder: t('fields.yearsOnMarket.placeholder', {
          fallback: 'Enter your company years on the market',
        }),
      },
      {
        name: 'plannedVolume',
        autoComplete: 'off',
        label: t('fields.plannedVolume.label', {
          fallback: 'The planned amount of customers or volume:',
        }),
        placeholder: t('fields.plannedVolume.placeholder', {
          fallback: 'Enter your planned amount of volume',
        }),
      },
    ],
    [t]
  );

  const schema = useMemo(
    () =>
      createAffiliateFormSchema((key, fallback) =>
        (
          {
            'errors.required': requiredMessage,
            'errors.emailInvalid': emailInvalidMessage,
            'errors.websiteInvalid': websiteInvalidMessage,
          } as const
        )[key] ?? fallback
      ),
    [emailInvalidMessage, requiredMessage, websiteInvalidMessage]
  );

  const form = useForm<AffiliateFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      website: '',
      password: '',
      companyName: '',
      companyCountry: '',
      geoOfCustomers: '',
      positionInCompany: '',
      businessActivity: '',
      yearsOnMarket: '',
      plannedVolume: '',
      recaptcha: '',
    },
  });

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
  };

  const onSubmit = async (data: AffiliateFormSchema) => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      await submitAffiliateForm(data);
      form.reset();
      setIsSuccessOpen(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = ({
    name,
    autoComplete,
    label,
    placeholder,
    inputMode,
    type = 'text',
  }: AffiliateFieldConfig) => {
    const fieldError = form.formState.errors[name];

    return (
      <div
        key={name}
        className={`${styles.field} ${fieldError ? styles.fieldErrorState : ''}`}
      >
        <label className={styles.fieldShell} htmlFor={`affiliate-${name}`}>
          <span className={styles.fieldLabel}>{label}</span>
          <input
            id={`affiliate-${name}`}
            type={type}
            className={styles.fieldInput}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            {...form.register(name)}
          />
        </label>
        {fieldError ? <span className={styles.fieldError}>{fieldError.message}</span> : null}
      </div>
    );
  };

  return (
    <>
      <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className={styles.grid}>{fieldConfigs.map(renderField)}</div>

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
        ariaLabelledBy="affiliate-success-title"
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
          <h3 id="affiliate-success-title" className={styles.successTitle}>
            {t('popupTitle', { fallback: 'Thank you!' })}
          </h3>

          <p className={styles.successMessage}>
            {t('popupMessage', {
              fallback:
                'Your request has been sent successfully. Our Bitvera team will review it and contact you asap.',
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
