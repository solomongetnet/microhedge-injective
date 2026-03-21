import { create } from "zustand";

interface ModalStore {
  isUpgradeModalOpen: boolean;
  setUpgradeModalOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isUpgradeModalOpen: false,
  setUpgradeModalOpen: (open: boolean) => {
    // Update store state
    set({ isUpgradeModalOpen: open });

    // Add or remove hashtag in URL without reloading
    if (typeof window !== "undefined") {
      if (open) {
        if (!window.location.hash.includes("pricing")) {
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}#pricing`,
          );
        }
      } else {
        if (window.location.hash.includes("pricing")) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }
      }
    }
  },
}));

const CUSTOM_TOAST_CODES = ["GUEST_CHAT_LIMIT", "PLAN_LIMIT"] as const;

// …and let TypeScript infer the union automatically.
export type CustomToastCode = (typeof CUSTOM_TOAST_CODES)[number];

interface CustomToastState {
  code: CustomToastCode | null;
  description?: string;
  isCustomToastVisible: boolean;
  customMessage?: string | null;

  showCustomToast: (data: {
    code: CustomToastCode;
    customMessage?: string;
    description?: string;
  }) => void;
  hideCustomToast: () => void;
}

export const useCustomToastStore = create<CustomToastState>((set) => ({
  code: null,
  description: "",
  customMessage: undefined,
  isCustomToastVisible: false,

  showCustomToast: ({ code, customMessage, description }) =>
    set({
      code,
      customMessage: null,
      description,
      isCustomToastVisible: true,
    }),

  hideCustomToast: () =>
    set({
      code: null,
      customMessage: "",
      description: "",
      isCustomToastVisible: false,
    }),
}));
