import {
  getUserProfileAction,
  onboardUserAction,
  updateUserProfileAction,
  checkFaucetClaimedAction,
  markFaucetClaimedAction,
} from "@/actions/user.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCheckFaucetClaimedQuery = (walletAddress: string | undefined) => {
  return useQuery({
    queryKey: ["faucet_claimed", walletAddress],
    queryFn: () => checkFaucetClaimedAction(walletAddress!),
    enabled: !!walletAddress,
  });
};

export const useMarkFaucetClaimedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (walletAddress: string) => markFaucetClaimedAction(walletAddress),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["faucet_claimed"] });
        queryClient.invalidateQueries({ queryKey: ["user_profile"] });
      }
    },
  });
};

export const useOnboardUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      walletAddress: string;
      fullName: string;
      username: string;
    }) => onboardUserAction(data),
    onSuccess: ({ success, error }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["user_profile"] });
      }
    },
  });
};

export const useGetUserProfileQuery = () => {
  return useQuery({
    queryKey: ["user_profile"],
    queryFn: () => getUserProfileAction(),
  });
};

export const useUpdateUserProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      email?: string;
      upworkUrl?: string;
      portfolioUrl?: string;
    }) => updateUserProfileAction(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["user_profile"] });
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
};
