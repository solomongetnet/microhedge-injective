"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const WalletLoginButton = ({
  redirectOnAuth = false,
  className,
  children,
}: {
  redirectOnAuth?: boolean;
  className?: string;
  children?: React.ReactNode;
}) => {
  const router = useRouter();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {!connected ? (
              <Button onClick={openConnectModal} type="button" className={className}>
                {children || "Connect Wallet"}
              </Button>
            ) : chain.unsupported ? (
              <Button onClick={openChainModal} type="button" className={className}>
                Wrong network
              </Button>
            ) : redirectOnAuth ? (
              <Button
                onClick={() => router.push("/dashboard/markets")}
                type="button"
                className={className}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button onClick={openAccountModal} type="button" className={className}>
                {account.displayName}
              </Button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};