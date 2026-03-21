import "@nomicfoundation/hardhat-toolbox"; // includes ethers, waffle, and mocha
import { defineConfig } from "hardhat/config";
import "dotenv/config";

export default defineConfig({
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    injectiveTestnet: {
      url: process.env.INJECTIVE_API_KEY || "https://sentry.tm.injective.network:443",
      chainId: 888, // Injective testnet/mainnet: double-check if this is mainnet or testnet
      accounts: [process.env.INJECTIVE_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"],
    },
  },
});