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
      return { success: true, authenticated: true, user };
    }

    // User does not exist, create a new one automatically
    const randomString = Math.random().toString(36).substring(2, 8);
    const newUser = await prisma.user.create({
      data: {
        walletAddress,
        fullName: "User", // Default fullName as required by schema
        username: `user_${randomString}`,
        onboardingStep: 1,
      },
    });

    // Create session for new user
    (await cookies()).set(SESSION_COOKIE, walletAddress, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, authenticated: true, user: newUser };
  } catch (error) {
    console.error("verifyWalletAction error:", error);
    return { success: false, error: "Failed to verify or create user" };
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
