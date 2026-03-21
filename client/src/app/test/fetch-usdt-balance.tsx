"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";

const CONTRACT_ADDRESS = "0xC3DC2Fa056EAc162C42960d458a0c37C6D06122e";

const abi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export default function Balance() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address, // prevents error when address undefined
    },
  });

  if (!isConnected) return <p>Connect wallet</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching balance</p>;

  return (
    <div>
      <p>
        Balance:{" "}
        {data ? formatUnits(data as bigint, 18) : "0"} fUSDT
      </p>
    </div>
  );
}