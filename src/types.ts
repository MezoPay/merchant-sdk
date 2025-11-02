import { Address } from 'viem';

export interface MezoPayConfig {
  /**
   * WalletConnect Project ID
   * Get one at https://cloud.walletconnect.com/
   */
  projectId: string;
  /**
   * App name for wallet connection
   */
  appName?: string;
  /**
   * Merchant's wallet address to receive payments
   */
  merchantAddress?: Address;
  /**
   * Chain ID (default: 31611 for Mezo Testnet)
   */
  chainId?: number;
  /**
   * Custom RPC URL (optional)
   */
  rpcUrl?: string;
}

export interface PaymentRequest {
  /**
   * Amount in MUSD (as a string, e.g., "100.5")
   */
  amount: string;
  /**
   * Recipient address (merchant address)
   */
  to: Address;
  /**
   * Optional memo/description for the payment
   */
  memo?: string;
  /**
   * Optional order ID or transaction reference
   */
  orderId?: string;
}

export interface PaymentStatus {
  status: 'pending' | 'processing' | 'confirmed' | 'failed';
  transactionHash?: string;
  error?: string;
  message?: string;
}

export interface PaymentCallback {
  onSuccess?: (txHash: string, orderId?: string) => void;
  onError?: (error: Error | string, orderId?: string) => void;
  onPending?: (txHash: string, orderId?: string) => void;
}

export interface QRCodeData {
  /**
   * Payment URI in format: musd:pay?to=<address>&amount=<amount>&memo=<memo>
   */
  uri: string;
  /**
   * Merchant address
   */
  to: Address;
  /**
   * Amount in MUSD
   */
  amount: string;
  /**
   * Optional memo
   */
  memo?: string;
  /**
   * Optional order ID
   */
  orderId?: string;
}

export interface Balance {
  /**
   * Formatted balance (e.g., "100.5")
   */
  formatted: string;
  /**
   * Raw balance in wei
   */
  value: bigint;
  /**
   * Token symbol (MUSD)
   */
  symbol: string;
  /**
   * Token decimals (18)
   */
  decimals: number;
}

export interface WalletConnection {
  /**
   * Connected wallet address
   */
  address: Address | undefined;
  /**
   * Whether wallet is connected
   */
  isConnected: boolean;
  /**
   * Whether connection is in progress
   */
  isConnecting: boolean;
  /**
   * Connection error, if any
   */
  error: Error | null;
}