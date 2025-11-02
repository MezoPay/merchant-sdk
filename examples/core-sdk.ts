/**
 * Core SDK Example (Framework Agnostic)
 * 
 * This example shows how to use the SDK without React
 */

import { MezoPaySDK } from '@mezopay/merchant-sdk';

// Initialize SDK
const sdk = new MezoPaySDK({
  projectId: 'your-walletconnect-project-id', // Get from https://cloud.walletconnect.com/
  appName: 'My App',
  chainId: 31611, // Mezo Testnet
});

// Generate QR code for payment
const qrData = sdk.generateQRCode({
  amount: '100.5',
  to: '0x1234567890123456789012345678901234567890',
  memo: 'Payment for services',
  orderId: 'ORDER-123',
});

console.log('QR Code URI:', qrData.uri);
// Output: musd:pay?to=0x1234...&amount=100.5&memo=Payment%20for%20services&orderId=ORDER-123

// Parse QR code
const parsed = sdk.parseQRCode(qrData.uri);
console.log('Parsed QR:', parsed);

// Get balance
async function checkBalance() {
  try {
    const balance = await sdk.getBalance('0x1234567890123456789012345678901234567890');
    console.log('Balance:', balance.formatted, balance.symbol);
  } catch (error) {
    console.error('Failed to get balance:', error);
  }
}

checkBalance();

// Format amounts
const amountInWei = sdk.parseAmount('100.5'); // Convert to wei
const amountFormatted = sdk.formatAmount(amountInWei); // Convert back to string
console.log('Amount in wei:', amountInWei);
console.log('Amount formatted:', amountFormatted);