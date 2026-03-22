"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, injective, injectiveTestnet as wagmiInjectiveTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { defineChain } from "viem";

// Custom Injective Testnet (inEVM) configuration
// This is necessary because the default wagmi/chains injectiveTestnet
// might use Chain ID 888 (native), but MetaMask expects 1439 (EVM).
const injectiveEvmTestnet = defineChain({
  id: 1439,
  name: "Injective EVM Testnet",
  network: "injective-evm-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Injective",
    symbol: "INJ",
  },
  rpcUrls: {
    default: {
      http: ["https://k8s.testnet.json-rpc.injective.network"],
    },
    public: {
      http: ["https://k8s.testnet.json-rpc.injective.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Injective Explorer",
      url: "https://testnet.blockscout.injective.network",
    },
  },
  testnet: true,
});

// RainbowKit + Wagmi config
const config = getDefaultConfig({
  appName: "MicroHedge",
  projectId: "YOUR_PROJECT_ID", // Replace with actual WalletConnect project ID
  chains: [mainnet, polygon, optimism, arbitrum, base, injective, injectiveEvmTestnet],
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