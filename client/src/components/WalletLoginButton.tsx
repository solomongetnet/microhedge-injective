"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useVerifyWalletMutation } from "@/hooks/api/blockchain/use-wallet";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

let globalIsVerifying = false;
let globalVerifiedAddress: string | null = null;

export const WalletLoginButton = ({ 
  redirectOnAuth = false,
  className,
  children 
}: { 
  redirectOnAuth?: boolean;
  className?: string;
  children?: React.ReactNode;
}) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const { mutateAsync: verifyWallet } = useVerifyWalletMutation();

  useEffect(() => {
    let mounted = true;

    const handleWalletConnection = async () => {
      if (isConnected && address && !isVerifying) {
        // If this exact address was already verified in this session, skip.
        if (globalVerifiedAddress === address) return;
        
        // If another component instance is currently verifying, let it handle the logic and UI side-effects.
        if (globalIsVerifying) return;

        globalIsVerifying = true;
        setIsVerifying(true);
        try {
          const result = await verifyWallet(address);
          globalVerifiedAddress = address;

          if (result.success) {
            if (result.needsOnboarding) {
              // Redirect to onboarding if they are a new user
              toast("Wallet connected. Let's finish your profile!");
              router.push("/onboarding");
            } else if (result.authenticated && redirectOnAuth) {
              // Redirect to dashboard if returning user
              toast.success("Welcome back!");
              router.push("/dashboard");
            }
          } else {
            toast.error(result.error || "Verification failed");
            globalVerifiedAddress = null;
            disconnect();
          }
        } catch (error) {
          console.error("Connection error:", error);
          toast.error("Failed to verify wallet");
          globalVerifiedAddress = null;
          disconnect();
        } finally {
          globalIsVerifying = false;
          if (mounted) {
            setIsVerifying(false);
          }
        }
      } else if (!isConnected && !address) {
        // Reset state on disconnect so a user can re-verify if they connect again
        globalVerifiedAddress = null;
      }
    };

    handleWalletConnection();

    return () => {
      mounted = false;
    };
  }, [isConnected, address, disconnect, router, redirectOnAuth, verifyWallet, isVerifying]);

  return (
    <div className="flex items-center gap-2">
      {children ? (
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
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button onClick={openConnectModal} type="button" className={className}>
                        {children}
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button onClick={openChainModal} type="button" className={className}>
                        Wrong network
                      </Button>
                    );
                  }

                  return (
                    <Button onClick={openAccountModal} type="button" className={className}>
                      {account.displayName}
                    </Button>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      ) : (
        <ConnectButton />
      )}
      {isVerifying && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
    </div>
  );
};
