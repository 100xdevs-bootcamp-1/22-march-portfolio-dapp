import { useEffect, useState } from 'react';
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export function App() {
  const endpoint = "https://mainnet.helius-rpc.com/?api-key=a8661a58-c8d1-40c5-bf82-01a1ab5e5922" // slight security issue

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <Topbar />          
            <Portfolio />    
            <Send />
          </WalletModalProvider>
      </WalletProvider>
  </ConnectionProvider>
  );
}


function Send() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  return <div>
    <input id="address" type="text" placeholder='Wallet address' />
    <input id="amount" type="text" placeholder='Amount' />

    <button onClick={async () => {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: publicKey!,
            toPubkey: new PublicKey(document.getElementById("address")!.value),
            lamports: document.getElementById("amount").value * 1000_000_000
        })
      );
    
      await sendTransaction(transaction, connection);

    }}>Send SOL</button>
  </div>
}

function Topbar() {
  const { publicKey } = useWallet();

  return <div style={{display: "flex", justifyContent: "flex-end"}}>
    {!publicKey && <WalletMultiButton />}
    {publicKey && <WalletDisconnectButton />}
  </div>
}

function Portfolio() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<null | number>(null)

  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey)
        .then(b => setBalance(b));
    }
  }, [publicKey]);

  return <div>
    Address - {publicKey?.toString()} <br />
    SOL Balance - {balance / 1000_000_000}
  </div>
}

export default App;

