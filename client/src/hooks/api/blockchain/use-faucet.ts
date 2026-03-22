import { useReadContract } from "wagmi";
import { FUSDT_CONTRACT_ADDRESS, mockUsdtAbi } from "@/lib/contracts";

/**
 * Hook to read the on-chain faucet status for a given wallet address.
 * Uses hasClaimed(address) from the MockUSDT contract.
 */
export const useFaucetStatus = (address: `0x${string}` | undefined) => {
  return useReadContract({
    address: FUSDT_CONTRACT_ADDRESS as `0x${string}`,
    abi: mockUsdtAbi,
    functionName: "hasClaimed",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
};
