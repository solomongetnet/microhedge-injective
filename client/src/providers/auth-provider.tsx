"use client";

import { useEffect, ReactNode } from "react";
import { useAccount } from "wagmi";
import { useVerifyWalletMutation, useLogoutMutation } from "@/hooks/api/blockchain/use-wallet";
import { getSessionWallet } from "@/actions/auth.actions";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { mutate: verifyWallet } = useVerifyWalletMutation();
  const { mutate: logout } = useLogoutMutation();

  useEffect(() => {
    const syncAuth = async () => {
      const sessionWallet = await getSessionWallet();
      
      if (isConnected && address) {
        // If connected in wallet but no session or session doesn't match, verify
        if (!sessionWallet || sessionWallet.toLowerCase() !== address.toLowerCase()) {
          verifyWallet(address);
        }
      } else if (!isConnected && sessionWallet) {
        // If not connected in wallet but session exists, logout
        logout();
      }
    };

    syncAuth();
  }, [isConnected, address, verifyWallet, logout]);

  return <>{children}</>;
}
