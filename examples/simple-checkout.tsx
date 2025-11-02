/**
 * Simple Checkout Example
 * 
 * This example shows how to integrate MezoPay in a simple checkout flow
 */

import { MezoPayProvider, PaymentButton, WalletButton, useWallet } from '@mezopay/merchant-sdk';

// Your merchant address
const MERCHANT_ADDRESS = '0x1234567890123456789012345678901234567890' as const;

function CheckoutForm() {
  const { isConnected } = useWallet();
  const [amount, setAmount] = useState('100');

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Checkout</h2>
      
      {!isConnected && (
        <div style={{ marginBottom: '20px' }}>
          <p>Connect your wallet to proceed</p>
          <WalletButton />
        </div>
      )}

      {isConnected && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label>
              Amount (MUSD):
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ marginLeft: '10px', padding: '8px' }}
              />
            </label>
          </div>

          <PaymentButton
            request={{
              amount,
              to: MERCHANT_ADDRESS,
              memo: 'Product purchase',
            }}
            label="Pay with MUSD"
            callbacks={{
              onSuccess: (txHash) => {
                alert(`Payment successful! Transaction: ${txHash}`);
                // Redirect or update UI
              },
              onError: (error) => {
                alert(`Payment failed: ${error.message}`);
              },
            }}
          />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <MezoPayProvider
      config={{
        projectId: 'your-walletconnect-project-id', // Get from https://cloud.walletconnect.com/
        appName: 'My Store',
        merchantAddress: MERCHANT_ADDRESS,
      }}
    >
      <CheckoutForm />
    </MezoPayProvider>
  );
}

export default App;