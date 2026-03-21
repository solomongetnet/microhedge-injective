"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const SESSION_COOKIE = "CrediX_wallet_session";

export async function verifyWalletAction(walletAddress: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (user) {
      // User exists, create session
      (await cookies()).set(SESSION_COOKIE, walletAddress, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return { success: true, authenticated: true, needsOnboarding: false };
    }

    // User does not exist, needs onboarding
    return { success: true, authenticated: false, needsOnboarding: true };
  } catch (error) {
    console.error("verifyWalletAction error:", error);
    return { success: false, error: "Failed to verify wallet" };
  }
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  return { success: true };
}

export async function getSessionWallet() {
  const session = (await cookies()).get(SESSION_COOKIE);
  return session?.value || null;
}
