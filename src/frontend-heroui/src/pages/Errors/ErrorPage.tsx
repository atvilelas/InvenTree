import type { ErrorResponse } from '@lib/types/Auth';

import { t } from '@lingui/core/macro';
import { useEffect, useState } from 'react';
import { useRouteError } from 'react-router-dom';

import { GenericError } from './GenericError';

export const ErrorPage = () => {
  const error = useRouteError() as ErrorResponse;
  const [title, setTitle] = useState(t`Error`);

  useEffect(() => {
    if (error?.statusText) {
      setTitle(t`Error: ${error.statusText}`);
    }
  }, [error]);

  return (
    <GenericError message={t`An unexpected error has occurred`} title={title} />
  );
};
