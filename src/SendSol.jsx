import { useConnection,useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL,PublicKey,SystemProgram,Transaction } from "@solana/web3.js";
import { useState } from "react";



function SendSol(){
    const wallet=useWallet()
    const {connection}=useConnection()
    const from=wallet.publicKey
    const[to,setTo]=useState('')
    const[amount,setAmount]=useState('')
    const handleSend=async()=>{
        const transaction=new Transaction()
        transaction.add(SystemProgram.transfer({
            fromPubkey:from,
            toPubkey:new PublicKey(to),
            lamports:amount*LAMPORTS_PER_SOL
        }))

        const success=await wallet.sendTransaction(transaction,connection)

        
        if(success){
          setTo('')
          setAmount('')          
        }
        alert(`Sent ${amount} to ${to}`)
    }
    return(
        <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Send SOL</h2>
      
      <div className="w-full mb-4">
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
          Recipient Wallet Address
        </label>
        <input
          type="text"
          id="recipient"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter recipient's wallet address"
        />
      </div>
      
      <div className="w-full mb-6">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount (SOL)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount to send"
        />
      </div>

      <button
        onClick={handleSend}
        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        Send SOL
      </button>
    </div>
    )
}

export default SendSol