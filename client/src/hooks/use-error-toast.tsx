"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useModalStore } from "@/store/ui-store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ToastProps {
  router: AppRouterInstance;
  loginCallBack: string | undefined;
  setUpgradeModalOpen: any;
}
// --- 1. Toast config map ---
const TOAST_CONFIGS = {
  LOGIN_REQUIRED: {
    title: "You must be logged in",
    message: "Please login or create your new account!",
    actionText: "Login now",
    actionCallback: ({ router, loginCallBack }: ToastProps) => {
      if (loginCallBack) router.push(`/auth?callback=${loginCallBack}`);
      else router.push("/auth");
    },
  },
  PLAN_LIMIT: {
    title: "Plan Limit Reached",
    message: "You’ve reached your plan’s limit. Upgrade to continue.",
    actionText: "Upgrade Plan",
    actionCallback: ({ setUpgradeModalOpen }: ToastProps) =>
      setUpgradeModalOpen(true),
  },
  PLUS_REQUIRED: {
    title: "Charapia+ Required",
    message: "This feature is only available for Charapia+ users.",
    actionText: "Upgrade Plan",
    actionCallback: ({ setUpgradeModalOpen }: ToastProps) =>
      setUpgradeModalOpen(true),
  },
} as const;

type ToastConfigMap = typeof TOAST_CONFIGS;
type ErrorCode = keyof ToastConfigMap;

type ErrorInput<T extends ErrorCode = ErrorCode> = {
  code: T;
  message?: string;
  title?: string;
  loginCallBack?: string;
};

// --- 2. Hook ---
export function useErrorToast() {
  const router = useRouter();
  const { setUpgradeModalOpen } = useModalStore();

  const showErrorToast = useCallback(
    <T extends ErrorCode>(error: ErrorInput<T>) => {
      const config = TOAST_CONFIGS[error.code];

      const toastId = error.code.toLowerCase();

      toast(error.message || config.message, {
        id: toastId,
        duration: 10_000,
        cancel: true,
        position: "top-center",
        className:
          "!w-[90%] sm:!w-[400px] lg:!w-[500px] !max-w-none !flex !justify-between !z-[9999]",
        descriptionClassName: "text-black",
        action: (
          <button
            onClick={() => {
              toast.dismiss(toastId);
              config.actionCallback({
                router,
                loginCallBack: error.loginCallBack,
                setUpgradeModalOpen: setUpgradeModalOpen,
              });
            }}
            className="cursor-pointer bg-black text-white rounded-full h-[40px] min-w-fit text-sm px-4 py-1 hover:opacity-90 transition !z-[9999]"
          >
            {config.actionText}
          </button>
        ),
      });
    },
    [router]
  );

  return { showErrorToast };
}
