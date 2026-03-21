import { ChatTheme, getSelectedChatTheme } from "@/constants/themes";
import { create } from "zustand";
import { useCharacterProfileSidebar } from "./character-profile-sidebar-store";

// Chat data
interface Chat {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  title: string;
  guestId: string | null;
  characterId: string | null;
  character: Character | null;
  messages: Message[];
  themeId: string | null;
  backgroundUrl: string | null;
}

// Character data
interface Character {
  id: string;
  name: string;
  avatarUrl: string | null;
  description?: string;
  tagline: string;
  personality?: string;
  creator: CharacterCreator;
  voiceStyle: string | null;
  createdAt: Date;
  backgroundUrl: string | null;
  themeId: string | null;
}

// creator of character
interface CharacterCreator {
  id: string;
  name: string;
  username: string | null;
}

// Message data
interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  createdAt: Date;
  updatedAt: Date;
  content: string;
  chatId: string;
}

interface ChatbotState {
  // Chat state
  selectedChatId: () => string | null;

  // Active Chat Data
  activeChatData: Chat | null;
  setActiveChatData: (chat: Chat) => void;

  // active chat background url
  activeChatBackgroundUrl: string | null;
  setActiveChatBackgroundUrl: (url: string) => void;

  activeChatTheme: ChatTheme | null;
  setActiveChatTheme: (themeId: string | null) => void;

  // Message states
  messages: Message[];
  removeMessageById: (messageId: string) => void;
  removeLastMessage: () => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;

  // Loading messages states
  isMessagesLoading: boolean;
  messagesError: string | null;

  setIsMessagesLoading: (val: boolean) => void;
  setMessagesError: (err: string | null) => void;

  // ai response states
  isGeneratingResponse: boolean;
  generationError: string | null;

  setIsGeneratingResponse: (val: boolean) => void;
  setGenerationError: (err: string | null) => void;

  // to help reset current chat
  resetActiveChat: () => void;
}

export const useChatStore = create<ChatbotState>((set, get) => ({
  // to get current chat id;
  selectedChatId: () => {
    if (typeof window === "undefined") return null;

    const path = window.location.pathname; // e.g. "/chat/abc123"
    const segments = path.split("/"); // ["", "chat", "abc123"]

    if (segments[1] === "chat" && segments[2]) {
      return segments[2]; // return chat ID
    }

    return null; // not in /chat/[id] route
  },

  // messages state;
  messages: [],
  removeMessageById: (messageId) => {
    const updatedMessages = get().messages.filter((m) => {
      return m.id !== messageId;
    });

    set({
      messages: updatedMessages,
    });
  },
  removeLastMessage: () => {
    const messagesLength = get().messages.length;
    const updatedMessages = get().messages.slice(0, messagesLength - 1);

    set({
      messages: updatedMessages,
    });
  },
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => {
    const currentMessages = get().messages;
    set({ messages: [...currentMessages, message] });
  },

  // active chat
  activeChatData: null,
  setActiveChatData(chat) {
    document.title = `Chat with - ${chat.title}`;

    set({ activeChatData: null });
    set({ messages: chat.messages });
    set({ activeChatData: chat });
    set({
      activeChatBackgroundUrl:
        chat.backgroundUrl || chat.character?.backgroundUrl,
    });

    set({
      activeChatTheme: getSelectedChatTheme(
        chat.themeId || chat.character?.themeId
      ),
    });
  },

  // chat background
  activeChatBackgroundUrl: null,
  setActiveChatBackgroundUrl: (url) => {
    set({ activeChatBackgroundUrl: url });
  },

  // theme
  activeChatTheme: null,
  setActiveChatTheme(themeId) {
    set({
      activeChatTheme: getSelectedChatTheme(themeId),
    });
  },

  // ai response state loading, error handlers
  isGeneratingResponse: false,
  generationError: null,

  setIsGeneratingResponse: (val) => set({ isGeneratingResponse: val }),
  setGenerationError: (err) => set({ generationError: err }),

  // Loading messages state
  isMessagesLoading: false,
  messagesError: null,
  setIsMessagesLoading: (val) => set({ isMessagesLoading: val }),
  setMessagesError: (err) => set({ messagesError: err }),

  resetActiveChat: () => {
    document.title = "Charapia - ai";

    set({
      messages: [],
      selectedChatId: () => null,
      generationError: null,
      isMessagesLoading: false,
      activeChatData: null,
    });

    // Close character sidebar
    useCharacterProfileSidebar.getState().closeCharacterProfileSidebar();
  },
}));
