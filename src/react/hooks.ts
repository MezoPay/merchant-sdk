'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { ERC20_ABI, MUSD_DECIMALS } from '../constants';
import { useMezoPayContext } from './context';
import type { Address, WriteContractReturnType } from 'viem';
import type { PaymentRequest, PaymentStatus, PaymentCallback, Balance } from '../types';

/**
 * Hook to get wallet connection status
 */
export function useWallet() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();

  return {
    address: address as Address | undefined,
    isConnected,
    isConnecting,
    isDisconnected,
  };
}

/**
 * Hook to get MUSD balance for connected wallet
 */
export function useBalance() {
  const { address, isConnected } = useAccount();
  const { musdAddress } = useMezoPayContext();

  const { data: balance, isLoading, error } = useReadContract({
    address: musdAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  if (!isConnected || !address) {
    return {
      balance: null,
      formatted: '0',
      isLoading,
      error: error as Error | null,
    };
  }

  if (!balance) {
    return {
      balance: null,
      formatted: '0',
      isLoading,
      error: error as Error | null,
    };
  }

  const balanceBigInt = balance as bigint;
  const formatted = formatUnits(balanceBigInt, MUSD_DECIMALS);
  const formattedString = Number(formatted).toFixed(4);

  return {
    balance: balance as bigint,
    formatted: formattedString,
    isLoading,
    error: error as Error | null,
  };
}

/**
 * Hook to process MUSD payments
 */
export function usePayment() {
  const { musdAddress } = useMezoPayContext();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: hasFailed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const processPayment = async (
    request: PaymentRequest,
    callbacks?: PaymentCallback
  ): Promise<WriteContractReturnType> => {
    try {
      if (!request.to || !request.amount) {
        throw new Error('Recipient address and amount are required');
      }

      const value = parseUnits(request.amount, MUSD_DECIMALS);

      const result = await writeContract({
        address: musdAddress,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [request.to, value],
      });

      // Call onPending callback
      if (callbacks?.onPending && result) {
        callbacks.onPending(typeof result === 'string' ? result : result.hash, request.orderId);
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      callbacks?.onError?.(error, request.orderId);
      throw error;
    }
  };

  // Trigger success/error callbacks when transaction is confirmed
  if (isConfirmed && hash && !hasFailed) {
    // Transaction confirmed successfully
    const status: PaymentStatus = {
      status: 'confirmed',
      transactionHash: hash,
    };
  }

  if (hasFailed && receiptError) {
    // Transaction failed
    const status: PaymentStatus = {
      status: 'failed',
      error: receiptError.message,
    };
  }

  return {
    processPayment,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || (receiptError as Error | null),
    status: (() => {
      if (isPending || isConfirming) return 'processing';
      if (isConfirmed) return 'confirmed';
      if (hasFailed) return 'failed';
      return 'pending';
    })() as PaymentStatus['status'],
  };
}

/**
 * Hook to generate QR code for payment request
 */
export function useQRCode() {
  const { sdk } = useMezoPayContext();

  const generate = (request: PaymentRequest) => {
    return sdk.generateQRCode(request);
  };

  const parse = (uri: string) => {
    return sdk.parseQRCode(uri);
  };

  return {
    generate,
    parse,
  };
}