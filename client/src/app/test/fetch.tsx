"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Replace with your deployed contract address & ABI
const ORACLE_CONTRACT_ADDRESS = "0x9B889026FF03b18C4fe1958a668a4A83Cafd3E92";
const ORACLE_CONTRACT_ABI = [
  "function getAllPrices() view returns (string[] memory, uint256[] memory)"
];

export default function CommodityList() {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllCommodities = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.ethereum) throw new Error("MetaMask is not installed");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        ORACLE_CONTRACT_ADDRESS,
        ORACLE_CONTRACT_ABI,
        provider
      );

      const [commodityNames, commodityPrices] = await contract.getAllPrices();

      // Combine names and prices safely (BigInt → Number)
      const list = commodityNames.map((name, index) => ({
        name,
        price: Number(commodityPrices[index]) / 100 // Convert from cents to USD
      }));

      setCommodities(list);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCommodities();
  }, []);

  if (loading) return <p>Loading commodities...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>All Commodities & Prices (USD)</h2>
      <ul>
        {commodities.map((c, idx) => (
          <li key={idx}>
            {c.name}: ${c.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}