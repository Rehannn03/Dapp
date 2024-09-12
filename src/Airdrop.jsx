import React, { useEffect, useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token';

function Airdrop() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [tokens, setTokens] = useState([]); // State to store token balances
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const handlePayment = async () => {
    const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
    const hash = await connection.requestAirdrop(publicKey, lamports);
    Bal(); 
  };

  const Bal = useCallback(async () => {
    if (publicKey) {
      try {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance);

        const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });
        const tokenBalances = tokenAccounts.value.map((tokenAccount) => {
          const accountData = AccountLayout.decode(tokenAccount.account.data);
          const tokenBalance = Number(BigInt(accountData.amount)) / 1e9;
          return {
            mint: new PublicKey(accountData.mint).toString(), // Token mint address
            balance: tokenBalance,
          };
        });

        setTokens(tokenBalances);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }
  }, [publicKey, connection]);

  useEffect(() => {
    if (publicKey) {
      Bal();
    }
    else{
      setTokens([])
    }
  }, [publicKey, Bal]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-lg max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Airdrop Tokens</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter amount"
      />
      <button
        onClick={handlePayment}
        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Airdrop
      </button>
      <BalanceDisplay publicKey={publicKey} balance={balance} LAMPORTS_PER_SOL={LAMPORTS_PER_SOL} />
      <TokenList tokens={tokens} />
    </div>
  );
}

const BalanceDisplay = ({ publicKey, balance, LAMPORTS_PER_SOL }) => {
  return (
    <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md mt-2">
      <p className="text-lg font-semibold text-gray-800">
        {publicKey ? `Balance: ${balance / LAMPORTS_PER_SOL} SOL` : ""}
      </p>
    </div>
  );
};

const TokenList = ({ tokens }) => {
  return (
    <div className="mt-4 w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Your Tokens</h3>
      <ul className="space-y-2">
        {tokens.map((token, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md shadow-sm">
            <span className="font-medium text-gray-700">
              {`${token.mint.slice(0, 4)}...${token.mint.slice(-4)}`}
            </span>
            <span className="font-semibold text-gray-900">{token.balance} Tokens</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Airdrop;
