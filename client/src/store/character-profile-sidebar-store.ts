import { create } from "zustand";

interface CharacterProfileSidebarState {
  isCharacterProfileSidebarOpen: boolean;
  openCharacterProfileSidebar: () => void;
  closeCharacterProfileSidebar: () => void;
  toggleCharacterProfileSidebar: () => void;
}

export const useCharacterProfileSidebar = create<CharacterProfileSidebarState>(
  (set) => ({
    isCharacterProfileSidebarOpen: false,
    openCharacterProfileSidebar: () => set({ isCharacterProfileSidebarOpen: true }),
    closeCharacterProfileSidebar: () => set({ isCharacterProfileSidebarOpen: false }),
    toggleCharacterProfileSidebar: () => set((state) => ({ isCharacterProfileSidebarOpen: !state.isCharacterProfileSidebarOpen })),
  })
  
);
