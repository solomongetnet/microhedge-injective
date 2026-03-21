"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { 
  HEDGE_CONTRACT_ADDRESS, 
  FUSDT_CONTRACT_ADDRESS, 
  hedgeAbi, 
  mockUsdtAbi 
} from "@/lib/contracts";

export default function CreateHedge() {
  const [commodity, setCommodity] = useState("COFFEE");
  const [amount, setAmount] = useState("1");
  const [strikePrice, setStrikePrice] = useState("250");
  const [expireOption, setExpireOption] = useState("1");
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [txHash, setTxHash] = useState("");

  const handleCreateHedge = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setTxHash("");
      setStatus("Initializing...");

      if (!window.ethereum) throw new Error("MetaMask is not installed");

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      setStatus("Connecting wallet...");
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const hedgeContract = new ethers.Contract(HEDGE_CONTRACT_ADDRESS, hedgeAbi, signer);
      const usdtContract = new ethers.Contract(FUSDT_CONTRACT_ADDRESS, mockUsdtAbi, signer);

      const amountWei = ethers.parseUnits(amount.toString(), 18);
      const strikePriceWei = ethers.parseUnits(strikePrice.toString(), 18);
      const totalValueWei = (amountWei * strikePriceWei) / BigInt(1e18);

      // Step 1: Approve USDT
      setStatus("Approving USDT (Check MetaMask)...");
      const approveTx = await usdtContract.approve(HEDGE_CONTRACT_ADDRESS, totalValueWei);
      setStatus("Waiting for approval confirmation...");
      await approveTx.wait();

      // Step 2: Create Hedge
      setStatus("Creating Hedge (Check MetaMask)...");
      const createTx = await hedgeContract.createHedge(
        commodity,
        amountWei,
        strikePriceWei,
        BigInt(expireOption)
      );
      setStatus("Confirming transaction on-chain...");
      const receipt = await createTx.wait();

      setSuccess("Hedge successfully created on-chain!");
      setTxHash(createTx.hash);
      setStatus("");
    } catch (err: any) {
      console.error(err);
      setError(err.reason || err.message || "Failed to create hedge");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4 border mt-10">
      <h2 className="text-2xl font-bold text-gray-800">Create New On-Chain Hedge</h2>
      <p className="text-sm text-gray-500 font-mono break-all">Contract: {HEDGE_CONTRACT_ADDRESS}</p>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Commodity</label>
        <input
          type="text"
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g. COFFEE, MAIZE"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Amount (Units)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Strike Price (USDT per Unit)</label>
        <input
          type="number"
          value={strikePrice}
          onChange={(e) => setStrikePrice(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Expire Option</label>
        <select
          value={expireOption}
          onChange={(e) => setExpireOption(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="1">7 Days</option>
          <option value="2">14 Days</option>
          <option value="3">30 Days</option>
          <option value="4">60 Days</option>
        </select>
      </div>

      <button
        onClick={handleCreateHedge}
        disabled={loading}
        className={`w-full py-3 rounded-md text-white font-bold transition-colors ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? status || "Processing..." : "Create Hedge"}
      </button>

      {status && loading && (
        <p className="text-center text-sm font-semibold text-blue-600 animate-pulse">{status}</p>
      )}

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
          <strong>Success!</strong> {success}
          {txHash && (
            <div className="mt-1">
              <a 
                href={`https://moonbase.moonscan.io/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline text-green-800"
              >
                View on Explorer
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
