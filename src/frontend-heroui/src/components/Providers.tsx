import type { NavigateOptions } from 'react-router-dom';

import { HeroUIProvider } from '@heroui/system';
import { useHref, useNavigate } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { ToastProvider } from '@heroui/toast';

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export const Providers = ({ children }: PropsWithChildren<{}>) => {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  );
};
