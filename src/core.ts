import { createPublicClient, http, type Address, parseUnits, formatUnits } from 'viem';
import { createMezoPayConfig, MUSD_ADDRESSES } from './config';
import { ERC20_ABI, MUSD_DECIMALS } from './constants';
import { generatePaymentURI, parsePaymentURI } from './utils';
import type { MezoPayConfig, PaymentRequest, QRCodeData, Balance } from './types';

/**
 * Core MezoPay SDK class
 * Framework-agnostic payment processing
 */
export class MezoPaySDK {
  private config: MezoPayConfig;
  private musdAddress: Address;
  private publicClient: ReturnType<typeof createPublicClient>;

  constructor(config: MezoPayConfig) {
    if (!config.projectId) {
      throw new Error('WalletConnect projectId is required');
    }

    this.config = config;
    const { chain, musdAddress } = createMezoPayConfig(config);
    this.musdAddress = musdAddress as Address;

    // Create public client for read operations
    this.publicClient = createPublicClient({
      chain,
      transport: config.rpcUrl ? http(config.rpcUrl) : http(),
    });
  }

  /**
   * Generate QR code data for payment request
   */
  generateQRCode(request: PaymentRequest): QRCodeData {
    const uri = generatePaymentURI({
      uri: '',
      to: request.to,
      amount: request.amount,
      memo: request.memo,
      orderId: request.orderId,
    });

    return {
      uri,
      to: request.to,
      amount: request.amount,
      memo: request.memo,
      orderId: request.orderId,
    };
  }

  /**
   * Parse QR code URI
   */
  parseQRCode(uri: string): QRCodeData | null {
    return parsePaymentURI(uri);
  }

  /**
   * Get MUSD balance for an address
   */
  async getBalance(address: Address): Promise<Balance> {
    try {
      const balance = await this.publicClient.readContract({
        address: this.musdAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      });

      const formatted = formatUnits(balance as bigint, MUSD_DECIMALS);

      return {
        formatted,
        value: balance as bigint,
        symbol: 'MUSD',
        decimals: MUSD_DECIMALS,
      };
    } catch (error) {
      throw new Error(`Failed to fetch balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Format amount string to BigInt (wei)
   */
  parseAmount(amount: string): bigint {
    return parseUnits(amount, MUSD_DECIMALS);
  }

  /**
   * Format BigInt (wei) to amount string
   */
  formatAmount(value: bigint): string {
    return formatUnits(value, MUSD_DECIMALS);
  }

  /**
   * Get MUSD token address for current chain
   */
  getMusdAddress(): Address {
    return this.musdAddress;
  }

  /**
   * Get current chain ID
   */
  getChainId(): number {
    return this.config.chainId ?? 31611; // Mezo Testnet default
  }
}