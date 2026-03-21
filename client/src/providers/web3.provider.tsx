"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, injective, injectiveTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// RainbowKit + Wagmi config
const config = getDefaultConfig({
  appName: "MicroHedge",
  projectId: "YOUR_PROJECT_ID", // Replace with actual WalletConnect project ID
  chains: [mainnet, polygon, optimism, arbitrum, base, injective, injectiveTestnet],
  // removed ssr: true — must be client-only to avoid Vercel build errors
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}