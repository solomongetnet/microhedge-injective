// Enum Definitions
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum MessageRole {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
}

// Interface Definitions

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  sessions: Session[];
  accounts: Account[];
  role: Role;
  status: UserStatus;
  chats: Chat[];
  folder: Folder[];
  messageLikes: MessageLike[];
  createdAt: Date;
  updatedAt: Date;
}

export enum UserStatus {
  ACTIVE = "active", // user can fully access the app
  INACTIVE = "inactive", // user hasn’t used the app for a while
  SUSPENDED = "suspended", // temporarily banned or restricted
  BANNED = "banned", // permanently banned
  PENDING = "pending", // waiting for email verification or approval
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  user: User;
}

export interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  user: User;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Folder {
  id: string;
  title: string;
  chats: Chat[];
  theme: string;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  title: string;
  userId: string;
  user: User;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  folders: Folder[];
}

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  chatId?: string;
  chat?: Chat;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageLike {
  id: string;
  userId: string;
  user: User;
  messageId: string;
  message: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface Character {
  id: string;
  name: string;
  avatarUrl?: string;
  description: string;
  tagline: string;
  personality: string;
  prompt: string;
  voiceStyle?: string;
  visibility: CharacterVisibility;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export type CharacterVisibility = "PUBLIC" | "PRIVATE";
