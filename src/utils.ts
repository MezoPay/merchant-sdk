import { parseUnits, formatUnits, type Address } from 'viem';
import type { QRCodeData } from './types';

/**
 * Parse amount string to BigInt (wei)
 */
export function parseAmount(amount: string, decimals: number = 18): bigint {
  return parseUnits(amount, decimals);
}

/**
 * Format BigInt (wei) to amount string
 */
export function formatAmount(value: bigint, decimals: number = 18): string {
  return formatUnits(value, decimals);
}

/**
 * Generate payment URI for QR code
 */
export function generatePaymentURI(data: QRCodeData): string {
  const params = new URLSearchParams({
    to: data.to,
    amount: data.amount,
  });

  if (data.memo) {
    params.set('memo', data.memo);
  }

  if (data.orderId) {
    params.set('orderId', data.orderId);
  }

  return `musd:pay?${params.toString()}`;
}

/**
 * Parse payment URI
 */
export function parsePaymentURI(uri: string): QRCodeData | null {
  try {
    if (uri.startsWith('musd:pay?')) {
      const queryString = uri.replace('musd:pay?', '');
      const params = new URLSearchParams(queryString);

      const to = params.get('to');
      const amount = params.get('amount');

      if (!to || !amount) {
        return null;
      }

      return {
        uri,
        to: to as Address,
        amount,
        memo: params.get('memo') || undefined,
        orderId: params.get('orderId') || undefined,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}