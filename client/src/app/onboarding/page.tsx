"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useOnboardUserMutation } from "@/hooks/api/use-user";
import { Loader2 } from "lucide-react";
import mockUsdtAbi from "@/../contracts/mock-usdt.api.json";
import { FUSDT_CONTRACT_ADDRESS } from "@/lib/contracts";

export default function OnboardingPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { writeContractAsync } = useWriteContract();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // If wallet isn't connected, we shouldn't really be here, but we can handle it gently
  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4">Wallet Not Connected</h2>
        <Button onClick={() => router.push("/login")}>Go Back to Login</Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutateAsync: onboardUser } = useOnboardUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let canProceed = false;

      try {
        await writeContractAsync({
          address: FUSDT_CONTRACT_ADDRESS,
          abi: mockUsdtAbi,
          functionName: "faucet",
        });
        toast.success("Successfully claimed 100 Test USDT!");
        canProceed = true;
      } catch (faucetError: any) {
        console.error("Faucet error:", faucetError);
        const errorMessage = faucetError?.message || "";
        if (errorMessage.includes("Already claimed") || errorMessage.includes("already claimed")) {
          toast.info("You already claimed your test USDT.");
          canProceed = true;
        } else if (errorMessage.includes("User rejected") || errorMessage.includes("denied")) {
          toast.error("You must claim the test token to complete registration.");
        } else {
          toast.error("Failed to claim test tokens. Please try again.");
        }
      }

      if (!canProceed) {
        setIsLoading(false);
        return;
      }

      const result = await onboardUser({
        walletAddress: address,
        ...formData,
      });

      if (result.success) {
        toast.success("Profile created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Failed to create profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card border border-border p-8 rounded-lg">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-foreground">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Tell us a bit about yourself to start building your CrediX score.
          </p>
          <div className="mt-4 p-2 bg-primary/10 rounded-md text-xs text-primary max-w-xs mx-auto truncate">
            Connected: {address}
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Full Name *
              </label>
              <Input
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Username *
              </label>
              <Input
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe123"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Register and Claim 100 Test USDT"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
