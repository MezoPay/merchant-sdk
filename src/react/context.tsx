'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { MezoPaySDK } from '../core';
import { createMezoPayConfig } from '../config';
import type { MezoPayConfig, Address } from '../types';

interface MezoPayContextValue {
  sdk: MezoPaySDK;
  musdAddress: Address;
  config: MezoPayConfig;
}

const MezoPayContext = createContext<MezoPayContextValue | null>(null);

// Initialize React Query client
const queryClient = new QueryClient();

interface MezoPayProviderProps {
  config: MezoPayConfig;
  children: React.ReactNode;
}

/**
 * MezoPay Provider component
 * Wraps your app to provide wallet connection and payment functionality
 */
export function MezoPayProvider({ config, children }: MezoPayProviderProps) {
  const { wagmiConfig, musdAddress } = useMemo(() => {
    const configResult = createMezoPayConfig(config);
    return {
      wagmiConfig: configResult.wagmiConfig,
      musdAddress: configResult.musdAddress as Address,
    };
  }, [config]);

  const sdk = useMemo(() => new MezoPaySDK(config), [config]);

  const value = useMemo<MezoPayContextValue>(
    () => ({
      sdk,
      musdAddress,
      config,
    }),
    [sdk, musdAddress, config]
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={wagmiConfig.chains[0]}>
          <MezoPayContext.Provider value={value}>{children}</MezoPayContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

/**
 * Hook to access MezoPay context
 */
export function useMezoPayContext() {
  const context = useContext(MezoPayContext);
  if (!context) {
    throw new Error('useMezoPayContext must be used within MezoPayProvider');
  }
  return context;
}