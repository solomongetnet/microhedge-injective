import { create } from "zustand"

interface NotificationStore {
  isNotificationsOpen: boolean
  setNotificationsOpen: (open: boolean) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  isNotificationsOpen: false,
  setNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
}))
