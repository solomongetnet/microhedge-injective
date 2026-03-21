export const chatThemes: ChatTheme[] = [
  {
    id: "1",
    name: "Gray",
    userColorHex: "#6B7280",
    aiColorHex: "#374151",
    userTextColorHex: "#FFFFFF",
    aiTextColorHex: "#FFFFFF",
    isDefault: true,
  },
  {
    id: "2",
    name: "Light Red",
    userColorHex: "#F87171",
    aiColorHex: "#DC2626",
    userTextColorHex: "#000000",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
  {
    id: "3",
    name: "Red",
    userColorHex: "#EF4444",
    aiColorHex: "#B91C1C",
    userTextColorHex: "#FFFFFF",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
  {
    id: "4",
    name: "Orange",
    userColorHex: "#F97316",
    aiColorHex: "#C2410C",
    userTextColorHex: "#FFFFFF",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
  {
    id: "5",
    name: "Amber",
    userColorHex: "#FBBF24",
    aiColorHex: "#D97706",
    userTextColorHex: "#000000",
    aiTextColorHex: "#000000",
    isDefault: false,
  },
  {
    id: "6",
    name: "Yellow",
    userColorHex: "#FACC15",
    aiColorHex: "#CA8A04",
    userTextColorHex: "#000000",
    aiTextColorHex: "#000000",
    isDefault: false,
  },
  {
    id: "7",
    name: "Green",
    userColorHex: "#22C55E",
    aiColorHex: "#15803D",
    userTextColorHex: "#FFFFFF",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
  {
    id: "8",
    name: "Emerald",
    userColorHex: "#10B981",
    aiColorHex: "#047857",
    userTextColorHex: "#FFFFFF",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
  {
    id: "9",
    name: "Teal",
    userColorHex: "#14B8A6",
    aiColorHex: "#0F766E",
    userTextColorHex: "#FFFFFF",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
  {
    id: "10",
    name: "Blue",
    userColorHex: "#3B82F6",
    aiColorHex: "#1D4ED8",
    userTextColorHex: "#FFFFFF",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
  {
    id: "11",
    name: "Indigo",
    userColorHex: "#6366F1",
    aiColorHex: "#4338CA",
    userTextColorHex: "#FFFFFF",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
  {
    id: "12",
    name: "Purple",
    userColorHex: "#A855F7",
    aiColorHex: "#7C3AED",
    userTextColorHex: "#FFFFFF",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
  {
    id: "13",
    name: "White",
    userColorHex: "#FFFFFF",
    aiColorHex: "#E5E7EB",
    userTextColorHex: "#000000",
    aiTextColorHex: "#000000",
    isDefault: false,
  },
  {
    id: "14",
    name: "Light Gray",
    userColorHex: "#9CA3AF",
    aiColorHex: "#4B5563",
    userTextColorHex: "#000000",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
  {
    id: "15",
    name: "Dark",
    userColorHex: "#1F2937",
    aiColorHex: "#000000",
    userTextColorHex: "#FFFFFF",
    aiTextColorHex: "#FFFFFF",
    isDefault: false,
  },
];

// Database-ready theme structure
export interface ChatTheme {
  id: string;
  name: string;
  userColorHex: string;
  aiColorHex: string;
  userTextColorHex: string;
  aiTextColorHex: string;
  isDefault?: boolean; // Optional field to mark a theme as default
}

export const getSelectedChatTheme = (
  
  selectedThemeId: string | null | undefined
): ChatTheme => {
  const theme = chatThemes.find((t) => t.id === selectedThemeId?.toString());
  return theme ?? chatThemes.find((t) => t.isDefault)!;
};
