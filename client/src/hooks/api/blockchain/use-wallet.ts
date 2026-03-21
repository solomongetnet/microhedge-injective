import { verifyWalletAction, logoutAction } from "@/actions/auth.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useVerifyWalletMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (address: string) => verifyWalletAction(address),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["user_profile"] });
      }
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutAction(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
