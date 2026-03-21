// app/fund/page.jsx
"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function FundPage() {
  const [contractAddress, setContractAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  // tCTC token address on Creditcoin Testnet
  const tCTCAddress = "0x8207918C95DBC4451e34c7aB9d89eEb2C699E999";

  // ERC-20 ABI minimal for transfer
  const ERC20_ABI = [
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
  ];

  async function fundContract() {
    try {
      if (!window.ethereum) {
        setStatus("MetaMask not detected");
        return;
      }

      if (!ethers.isAddress(contractAddress)) {
        setStatus("Invalid contract address");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const tCTCContract = new ethers.Contract(tCTCAddress, ERC20_ABI, signer);

      // Convert amount to 18 decimals
      const amountWei = ethers.parseUnits(amount, 18);

      setStatus("Sending transaction...");

      const tx = await tCTCContract.transfer(contractAddress, amountWei);
      setStatus(`Transaction sent: ${tx.hash}`);

      await tx.wait();
      setStatus(`Success! Funded ${amount} tCTC to ${contractAddress}`);
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <div
      style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      <h1>Fund GFCPLoan Contract</h1>

      <label>Contract Address:</label>
      <input
        type="text"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        placeholder="0x..."
        style={{ width: "100%", padding: 8, margin: "0.5rem 0" }}
      />

      <label>Amount (tCTC):</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="e.g., 3"
        style={{ width: "100%", padding: 8, margin: "0.5rem 0" }}
      />

      <button
        onClick={fundContract}
        style={{
          padding: "0.7rem 1.2rem",
          marginTop: "1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Fund Contract
      </button>

      {status && (
        <p style={{ marginTop: "1rem", wordBreak: "break-word" }}>{status}</p>
      )}
    </div>
  );
}
