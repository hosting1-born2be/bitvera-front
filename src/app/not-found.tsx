import { NextIntlClientProvider } from 'next-intl';

import { NotFoundPage } from '@/features/not-found/ui/NotFoundPage/NotFoundPage';

import { Footer, Header } from '@/shared/ui/components';

import enMessages from '../../messages/en.json';

const NotFound = () => {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <NotFoundPage />
    </NextIntlClientProvider>
  );
};

export default NotFound;
