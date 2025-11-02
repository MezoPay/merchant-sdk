# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of @mezopay/merchant-sdk
- Core SDK class (`MezoPaySDK`) for framework-agnostic usage
- React Provider component (`MezoPayProvider`) for wallet connection
- React hooks: `useWallet`, `usePayment`, `useBalance`, `useQRCode`
- React components: `PaymentButton`, `QRCodeGenerator`, `WalletButton`, `BalanceDisplay`
- QR code generation and parsing
- Balance checking functionality
- Full TypeScript support
- Documentation and examples

### Features
- Easy wallet integration with RainbowKit
- Simple payment processing with one-line buttons
- QR code generation for mobile payments
- Balance checking
- Type-safe API with full TypeScript support