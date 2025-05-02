import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AxiosInstance } from 'axios';
import React, { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

const ApiContext = createContext<AxiosInstance | null>(null);

export const ApiProvider = ({
  api,
  client,
  children
}: PropsWithChildren<{
  api: AxiosInstance;
  client: QueryClient;
}>) => {
  return (
    <QueryClientProvider client={client}>
      <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
    </QueryClientProvider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  return context;
};
