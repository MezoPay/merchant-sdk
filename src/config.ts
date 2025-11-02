import { createConfig, http, type Chain } from 'wagmi';
import { getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { MezoPayConfig } from './types';

export const MEZO_TESTNET: Chain = {
  id: 31611,
  name: 'Mezo Testnet',
  nativeCurrency: {
    name: 'Mezo',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.test.mezo.org'],
    },
    public: {
      http: ['https://rpc.test.mezo.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MezoScan',
      url: 'https://explorer.test.mezo.org',
    },
  },
  testnet: true,
};

export const MEZO_MAINNET: Chain = {
  id: 31612,
  name: 'Mezo Mainnet',
  nativeCurrency: {
    name: 'Mezo',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-http.mezo.boar.network'],
    },
    public: {
      http: ['https://rpc-http.mezo.boar.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MezoScan',
      url: 'https://explorer.mezo.org/',
    },
  },
  testnet: false,
};

// MUSD Token Addresses
export const MUSD_ADDRESSES = {
  [MEZO_TESTNET.id]: '0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503' as const,
  [MEZO_MAINNET.id]: '0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503' as const, // Update with mainnet address
} as const;

export function createMezoPayConfig(config: MezoPayConfig) {
  const chainId = config.chainId ?? MEZO_TESTNET.id;
  const chain = chainId === MEZO_MAINNET.id ? MEZO_MAINNET : MEZO_TESTNET;
  const appName = config.appName ?? 'MezoPay Merchant';

  const { wallets } = getDefaultWallets({
    appName,
    projectId: config.projectId,
  });

  const connectors = connectorsForWallets(wallets, {
    projectId: config.projectId,
    appName,
  });

  const wagmiConfig = createConfig({
    chains: [chain],
    transports: {
      [chain.id]: config.rpcUrl ? http(config.rpcUrl) : http(),
    },
    connectors,
  });

  return {
    wagmiConfig,
    chain,
    chainId,
    musdAddress: MUSD_ADDRESSES[chainId as keyof typeof MUSD_ADDRESSES] ?? MUSD_ADDRESSES[MEZO_TESTNET.id],
  };
}