"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";

// Replace with your deployed contract address & ABI
const ORACLE_CONTRACT_ADDRESS = "0x9B889026FF03b18C4fe1958a668a4A83Cafd3E92";
const ORACLE_CONTRACT_ABI = [
  "function updatePrice(string calldata commodity, uint256 price) external",
  "function getPrice(string calldata commodity) external view returns (uint256)",
];

export default function UpdatePriceForm() {
  const { register, handleSubmit, reset } = useForm();
  const [txStatus, setTxStatus] = useState("");

  const onSubmit = async (data: any) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const oracleContract = new ethers.Contract(
        ORACLE_CONTRACT_ADDRESS,
        ORACLE_CONTRACT_ABI,
        signer,
      );

      const priceInCents = ethers.parseUnits(data.price.toString(), 2); // store in cents
      setTxStatus("Waiting for confirmation...");

      const tx = await oracleContract.updatePrice(data.commodity, data.price);
      setTxStatus("Transaction sent, waiting for confirmation...");
      await tx.wait();

      setTxStatus(`Price updated successfully for ${data.commodity}!`);
      reset();
    } catch (err: any) {
      console.error(err);
      setTxStatus("Transaction failed: " + err.message);
    }
  };

  return (
    <div className="p-6 border rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Update Commodity Price</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Commodity</label>
          <input
            {...register("commodity", { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Price (USD cents)</label>
          <input
            type="number"
            {...register("price", { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Update Price
        </button>
      </form>
      {txStatus && <p className="mt-4">{txStatus}</p>}
    </div>
  );
}
