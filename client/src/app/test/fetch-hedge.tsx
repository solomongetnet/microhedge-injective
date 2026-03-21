// "use client";

// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { HEDGE_CONTRACT_ADDRESS } from "@/lib/contracts";

// // Replace with your deployed HedgeContract address & ABI
// const _HEDGE_CONTRACT_ADDRESS = HEDGE_CONTRACT_ADDRESS
// const HEDGE_CONTRACT_ABI = [
//   "function getUserPositions(address user) view returns (uint256[] memory)",
//   "function positions(uint256) view returns (address owner, string commodity, uint256 amount, uint256 strikePrice, uint256 expireAt, uint256 lockedValue, bool closed)"
// ];

// export default function UserHedges() {
//   const [hedges, setHedges] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchUserHedges = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       if (!window.ethereum) throw new Error("MetaMask is not installed");

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();

//       const contract = new ethers.Contract(HEDGE_CONTRACT_ADDRESS, HEDGE_CONTRACT_ABI, provider);

//       // Get position IDs for the user
//       const positionIds = await contract.getUserPositions(userAddress);

//       const hedgeList = [];

//       for (let id of positionIds) {
//         const pos = await contract.positions(id);
//         hedgeList.push({
//           id: id.toString(),
//           commodity: pos.commodity,
//           amount: Number(ethers.formatUnits(pos.amount, 18)),
//           strikePrice: Number(ethers.formatUnits(pos.strikePrice, 18)),
//           expireAt: new Date(Number(pos.expireAt) * 1000).toLocaleString(),
//           lockedValue: Number(ethers.formatUnits(pos.lockedValue, 18)),
//           closed: pos.closed
//         });
//       }

//       setHedges(hedgeList);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "Failed to fetch hedge positions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserHedges();
//   }, []);

//   if (loading) return <p>Loading your hedge positions...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (hedges.length === 0) return <p>No hedge positions found.</p>;

//   return (
//     <div>
//       <h2>Your Hedge Positions</h2>
//       <ul>
//         {hedges.map((h) => (
//           <li key={h.id}>
//             <strong>{h.commodity}</strong> - Amount: {h.amount}, Strike Price: ${h.strikePrice}, Locked: ${h.lockedValue}, Expires: {h.expireAt}, Status: {h.closed ? "Closed" : "Open"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }