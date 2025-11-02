# @mezopay/merchant-sdk

Official MezoPay Merchant SDK for accepting MUSD payments on your website. Easy integration with React components and hooks for seamless payment processing.

> **Note:** This is a standalone package that will be published to npm separately from the main MezoPay application.

## Features

- ?? **Easy Wallet Integration** - Built on RainbowKit and Wagmi
- ?? **Simple Payment Processing** - One-line payment buttons
- ?? **QR Code Generation** - Generate payment QR codes for customers
- ? **TypeScript First** - Full TypeScript support with type safety
- ?? **React Components** - Ready-to-use components out of the box
- ?? **Framework Agnostic** - Core SDK works without React
- ?? **Balance Checking** - Check MUSD balances easily

## Installation

```bash
bun add @mezopay/merchant-sdk
# or
npm install @mezopay/merchant-sdk
# or
yarn add @mezopay/merchant-sdk
```

### Peer Dependencies

Make sure you have React installed:

```bash
bun add react react-dom
```

For QR code generation (optional):

```bash
bun add react-qr-code
```

## Quick Start

### 1. Wrap your app with MezoPayProvider

```tsx
import { MezoPayProvider } from '@mezopay/merchant-sdk';

function App() {
  return (
    <MezoPayProvider
      config={{
        projectId: 'your-walletconnect-project-id', // Get from https://cloud.walletconnect.com/
        appName: 'My Store',
        merchantAddress: '0x...', // Your merchant address (optional)
      }}
    >
      {/* Your app */}
    </MezoPayProvider>
  );
}
```

### 2. Use the Payment Button

```tsx
import { PaymentButton } from '@mezopay/merchant-sdk';

function Checkout() {
  return (
    <PaymentButton
      request={{
        amount: '100.5',
        to: '0x1234...', // Your merchant address
        memo: 'Order #12345',
        orderId: '12345',
      }}
      callbacks={{
        onSuccess: (txHash, orderId) => {
          console.log('Payment successful!', txHash);
          // Update order status, send confirmation email, etc.
        },
        onError: (error, orderId) => {
          console.error('Payment failed:', error);
          // Show error message to user
        },
      }}
    />
  );
}
```

## Components

### PaymentButton

A ready-to-use button for processing MUSD payments.

```tsx
import { PaymentButton } from '@mezopay/merchant-sdk';

<PaymentButton
  request={{
    amount: '50',
    to: '0x...',
    memo: 'Product purchase',
  }}
  label="Pay with MUSD"
  callbacks={{
    onSuccess: (txHash) => console.log('Success:', txHash),
    onError: (error) => console.error('Error:', error),
  }}
/>
```

### QRCodeGenerator

Generate QR codes for payment requests.

```tsx
import { QRCodeGenerator } from '@mezopay/merchant-sdk';

<QRCodeGenerator
  request={{
    amount: '100',
    to: '0x...',
    memo: 'Payment for services',
  }}
  size={256}
  showDetails={true}
/>
```

### WalletButton

Connect/disconnect wallet button.

```tsx
import { WalletButton } from '@mezopay/merchant-sdk';

<WalletButton />
```

### BalanceDisplay

Display user's MUSD balance.

```tsx
import { BalanceDisplay } from '@mezopay/merchant-sdk';

<BalanceDisplay />
```

## Hooks

### useWallet()

Get wallet connection status.

```tsx
import { useWallet } from '@mezopay/merchant-sdk';

function MyComponent() {
  const { address, isConnected, isConnecting } = useWallet();

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  return <div>Connected: {address}</div>;
}
```

### usePayment()

Process MUSD payments.

```tsx
import { usePayment } from '@mezopay/merchant-sdk';

function CustomPayment() {
  const { processPayment, isPending, isConfirmed, hash } = usePayment();

  const handlePay = async () => {
    try {
      await processPayment({
        amount: '100',
        to: '0x...',
        memo: 'Custom payment',
      });
      console.log('Payment sent!');
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <button onClick={handlePay} disabled={isPending}>
      {isPending ? 'Processing...' : 'Pay'}
    </button>
  );
}
```

### useBalance()

Get MUSD balance.

```tsx
import { useBalance } from '@mezopay/merchant-sdk';

function Balance() {
  const { balance, formatted, isLoading } = useBalance();

  if (isLoading) return <div>Loading...</div>;

  return <div>Balance: {formatted} MUSD</div>;
}
```

### useQRCode()

Generate and parse payment QR codes.

```tsx
import { useQRCode } from '@mezopay/merchant-sdk';

function QRExample() {
  const { generate, parse } = useQRCode();

  const qrData = generate({
    amount: '100',
    to: '0x...',
    memo: 'Payment',
  });

  // qrData.uri can be used with QR code library
  return <div>URI: {qrData.uri}</div>;
}
```

## Core SDK (Framework Agnostic)

If you're not using React, you can use the core SDK directly:

```typescript
import { MezoPaySDK } from '@mezopay/merchant-sdk';

const sdk = new MezoPaySDK({
  projectId: 'your-project-id',
  chainId: 31611, // Mezo Testnet
});

// Generate QR code
const qrData = sdk.generateQRCode({
  amount: '100',
  to: '0x...',
  memo: 'Payment',
});

// Get balance
const balance = await sdk.getBalance('0x...');
console.log(balance.formatted); // "100.5"

// Parse QR code
const parsed = sdk.parseQRCode('musd:pay?to=0x...&amount=100');
```

## Configuration

### MezoPayConfig

```typescript
interface MezoPayConfig {
  /** WalletConnect Project ID (required) */
  projectId: string;
  /** App name for wallet connection */
  appName?: string;
  /** Merchant's wallet address to receive payments */
  merchantAddress?: Address;
  /** Chain ID (default: 31611 for Mezo Testnet) */
  chainId?: number;
  /** Custom RPC URL (optional) */
  rpcUrl?: string;
}
```

### Chain IDs

- **Mezo Testnet**: `31611` (default)
- **Mezo Mainnet**: `31612`

## Payment Request Format

```typescript
interface PaymentRequest {
  /** Amount in MUSD (as string, e.g., "100.5") */
  amount: string;
  /** Recipient address (merchant address) */
  to: Address;
  /** Optional memo/description */
  memo?: string;
  /** Optional order ID or transaction reference */
  orderId?: string;
}
```

## QR Code Format

The SDK generates QR codes in the following format:

```
musd:pay?to=<address>&amount=<amount>&memo=<memo>&orderId=<orderId>
```

Example:
```
musd:pay?to=0x1234...&amount=100.5&memo=Order%20%2312345&orderId=12345
```

## Examples

### E-commerce Checkout

```tsx
import { PaymentButton, useWallet } from '@mezopay/merchant-sdk';

function Checkout({ orderId, total }) {
  const { isConnected } = useWallet();
  const merchantAddress = '0x...'; // Your merchant address

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total: {total} MUSD</p>
      {isConnected ? (
        <PaymentButton
          request={{
            amount: total,
            to: merchantAddress,
            orderId,
            memo: `Order ${orderId}`,
          }}
          callbacks={{
            onSuccess: (txHash) => {
              // Redirect to success page
              window.location.href = `/success?tx=${txHash}`;
            },
            onError: (error) => {
              alert(`Payment failed: ${error.message}`);
            },
          }}
        />
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
}
```

### Invoice with QR Code

```tsx
import { QRCodeGenerator, PaymentButton } from '@mezopay/merchant-sdk';

function Invoice({ invoice }) {
  return (
    <div>
      <h2>Invoice #{invoice.id}</h2>
      <p>Amount: {invoice.amount} MUSD</p>
      
      {/* Show QR code for mobile scanning */}
      <QRCodeGenerator
        request={{
          amount: invoice.amount,
          to: invoice.merchantAddress,
          memo: `Invoice ${invoice.id}`,
          orderId: invoice.id,
        }}
      />
      
      {/* Or direct payment button */}
      <PaymentButton
        request={{
          amount: invoice.amount,
          to: invoice.merchantAddress,
          memo: `Invoice ${invoice.id}`,
          orderId: invoice.id,
        }}
      />
    </div>
  );
}
```

## TypeScript

The SDK is fully typed. Import types as needed:

```typescript
import type {
  MezoPayConfig,
  PaymentRequest,
  PaymentStatus,
  PaymentCallback,
  QRCodeData,
  Balance,
} from '@mezopay/merchant-sdk';
```

## Troubleshooting

### Wallet not connecting

1. Make sure you have a valid WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Check that your `projectId` is correctly set in the config
3. Ensure your app is running on HTTPS (or localhost for development)

### Payment failing

1. Check that the user has sufficient MUSD balance
2. Verify the recipient address is correct
3. Ensure the user has approved the transaction in their wallet
4. Check network connectivity

### QR Code not showing

If QR code shows placeholder instead of actual QR code:
- Install `react-qr-code`: `bun add react-qr-code`
- The SDK will automatically use it when available

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Development mode with watch
bun run dev

# Type check
bun run type-check
```

## Publishing

This package is designed to be published to npm as `@mezopay/merchant-sdk`.

```bash
# Build before publishing
bun run build

# Publish (when ready)
npm publish --access public
```

## License

MIT

## Support

For issues and questions, please visit [GitHub Issues](https://github.com/mezopay/merchant-sdk/issues) or contact support.

---

Made with ?? by MezoPay