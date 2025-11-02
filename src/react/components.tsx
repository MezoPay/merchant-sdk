'use client';

import React, { useState, useCallback } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePayment, useWallet, useQRCode, useBalance } from './hooks';
import type { PaymentRequest, PaymentCallback } from '../types';

// QR Code component (users need to install react-qr-code or similar)
let QRCodeSVG: any = null;
try {
  QRCodeSVG = require('react-qr-code').QRCodeSVG;
} catch {
  // QR code library not installed, component will show placeholder
}

/**
 * Payment Button Component
 * Easy-to-use button for processing MUSD payments
 */
export interface PaymentButtonProps {
  /** Payment request details */
  request: PaymentRequest;
  /** Optional callbacks */
  callbacks?: PaymentCallback;
  /** Button label */
  label?: string;
  /** Button styling className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom button content */
  children?: React.ReactNode;
}

export function PaymentButton({
  request,
  callbacks,
  label = 'Pay with MUSD',
  className = '',
  disabled = false,
  children,
}: PaymentButtonProps) {
  const { processPayment, isPending, isConfirming, status } = usePayment();
  const { isConnected } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleClick = useCallback(async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setError(null);
      await processPayment(request, callbacks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      callbacks?.onError?.(err instanceof Error ? err : new Error(errorMessage), request.orderId);
    }
  }, [isConnected, processPayment, request, callbacks]);

  const isProcessing = isPending || isConfirming;
  const isDisabled = disabled || !isConnected || isProcessing;

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={className || 'mezo-pay-button'}
        style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.6 : 1,
          fontWeight: 600,
        }}
      >
        {isProcessing ? (
          <span>Processing...</span>
        ) : children ? (
          children
        ) : (
          <span>{label}</span>
        )}
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>{error}</div>
      )}
    </div>
  );
}

/**
 * QR Code Generator Component
 * Generates QR code for payment requests
 */
export interface QRCodeGeneratorProps {
  /** Payment request details */
  request: PaymentRequest;
  /** QR code size */
  size?: number;
  /** Show payment details */
  showDetails?: boolean;
  /** Custom styling */
  className?: string;
}

export function QRCodeGenerator({
  request,
  size = 256,
  showDetails = true,
  className = '',
}: QRCodeGeneratorProps) {
  const { generate } = useQRCode();
  const qrData = generate(request);

  return (
    <div className={className} style={{ textAlign: 'center' }}>
      {QRCodeSVG ? (
        <QRCodeSVG value={qrData.uri} size={size} style={{ maxWidth: '100%', height: 'auto' }} />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            border: '2px dashed #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <p>Install react-qr-code</p>
            <p style={{ fontSize: '12px', wordBreak: 'break-all', marginTop: '8px' }}>
              {qrData.uri}
            </p>
          </div>
        </div>
      )}
      {showDetails && (
        <div style={{ marginTop: '16px', fontSize: '14px' }}>
          <p>
            <strong>Amount:</strong> {qrData.amount} MUSD
          </p>
          {qrData.memo && (
            <p>
              <strong>Memo:</strong> {qrData.memo}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Wallet Connect Button
 * Simple wrapper around RainbowKit's ConnectButton
 */
export function WalletButton() {
  return <ConnectButton />;
}

/**
 * Balance Display Component
 */
export interface BalanceDisplayProps {
  /** Show loading state */
  showLoading?: boolean;
  /** Custom styling */
  className?: string;
}

export function BalanceDisplay({ showLoading = true, className = '' }: BalanceDisplayProps) {
  const { balance, formatted, isLoading } = useBalance();
  const { address, isConnected } = useWallet();

  if (!isConnected) {
    return <div className={className}>Connect wallet to view balance</div>;
  }

  if (isLoading && showLoading) {
    return <div className={className}>Loading balance...</div>;
  }

  return (
    <div className={className}>
      <strong>{formatted}</strong> MUSD
    </div>
  );
}