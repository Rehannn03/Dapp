import React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import Airdrop from "./Airdrop";
// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import SendSol from "./SendSol";

function App() {
  return (
    <>
      <ConnectionProvider endpoint={`${import.meta.env.VITE_RPC_URL}`}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6">
              <WalletMultiButton className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <WalletDisconnectButton className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <Airdrop />
            <SendSol/>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
