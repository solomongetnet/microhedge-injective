"use client";

import { ReactNode, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { FUSDT_CONTRACT_ADDRESS } from "@/lib/contracts";
import { parseAbi, formatUnits } from "viem";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WalletLoginButton } from "@/components/WalletLoginButton";
import { Wallet, Coins } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MockUSDTAbi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
]);

export function WalletPopup({
  children,
  align = "end",
}: {
  children: ReactNode;
  align?: "center" | "start" | "end";
}) {
  const { address, chainId } = useAccount();

  const {
    data: balanceData,
    isLoading,
    isError,
  } = useReadContract({
    address:
      "0xC3DC2Fa056EAc162C42960d458a0c37C6D06122e" || FUSDT_CONTRACT_ADDRESS,
    abi: MockUSDTAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    console.log("WalletPopup Debug -> Address:", address);
    console.log("WalletPopup Debug -> Network ChainId:", chainId);
    console.log("WalletPopup Debug -> Fetched Balance (raw):", balanceData);
  }, [address, chainId, balanceData]);

  const formattedBalance =
    balanceData !== undefined
      ? Number(formatUnits(balanceData as bigint, 18)).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )
      : "0.00";

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80" align={align}>
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              Wallet & Balance
            </h4>
            <p className="text-sm text-muted-foreground">
              Manage your connected wallet and view your balances.
            </p>
          </div>

          <div className="p-3 bg-secondary/50 rounded-lg flex items-center justify-between border border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">
                MockUSDT
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : isError ? (
              <span className="text-sm font-semibold text-destructive">
                Error
              </span>
            ) : (
              <span className="text-sm font-semibold text-foreground">
                {formattedBalance}
              </span>
            )}
          </div>

          <div className="border-t border-border pt-4">
            <WalletLoginButton className="w-full justify-center">
              Connected wallet
            </WalletLoginButton>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
