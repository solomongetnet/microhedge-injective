import {
  getUserProfileAction,
  onboardUserAction,
  updateUserProfileAction,
} from "@/actions/user.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
