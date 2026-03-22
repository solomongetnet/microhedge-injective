"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

const SESSION_COOKIE = "CrediX_wallet_session";

export async function onboardUserAction(data: {
  walletAddress: string;
  fullName: string;
  username: string;
}) {
  try {
    // Check if wallet already exists
    const existingWallet = await prisma.user.findUnique({
      where: { walletAddress: data.walletAddress },
    });

    let user;
    if (existingWallet) {
      // Update existing user if found
      user = await prisma.user.update({
        where: { walletAddress: data.walletAddress },
        data: {
          fullName: data.fullName,
          username: data.username,
          onboardingStep: 1, // Mark basic onboarding as complete
        },
      });
    } else {
      // Create new user if not found
      user = await prisma.user.create({
        data: {
          walletAddress: data.walletAddress,
          fullName: data.fullName,
          username: data.username,
          onboardingStep: 1,
        },
      });
    }

    // Automatically log them in or refresh session
    (await cookies()).set(SESSION_COOKIE, data.walletAddress, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, user };
  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return { success: false, error: error.message || "Failed to onboard user" };
  }
}

export async function updateUserProfileAction(data: {
  name?: string;
  email?: string;
  upworkUrl?: string;
  portfolioUrl?: string;
}) {
  try {
    const session = (await cookies()).get(SESSION_COOKIE);
    if (!session || !session.value) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await prisma.user.update({
      where: { walletAddress: session.value },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email || null }),
        ...(data.upworkUrl !== undefined && {
          upworkUrl: data.upworkUrl || null,
        }),
        ...(data.portfolioUrl !== undefined && {
          portfolioUrl: data.portfolioUrl || null,
        }),
      },
    });

    return { success: true, user };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
}

export async function checkFaucetClaimedAction(walletAddress: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      select: { faucetClaimed: true },
    });

    return { success: true, claimed: user?.faucetClaimed || false };
  } catch (error: any) {
    console.error("Check Faucet Error:", error);
    return { success: false, error: "Failed to check faucet status" };
  }
}

export async function markFaucetClaimedAction(walletAddress: string) {
  try {
    // Upsert user to ensure they exist on claim
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: { faucetClaimed: true },
      create: {
        walletAddress,
        fullName: "User", // Default as required
        username: `user_${Math.random().toString(36).substring(2, 8)}`,
        faucetClaimed: true,
        onboardingStep: 0,
      },
    });

    // Also set session cookie if not present to facilitate smooth onboarding
    const session = (await cookies()).get(SESSION_COOKIE);
    if (!session) {
      (await cookies()).set(SESSION_COOKIE, walletAddress, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return { success: true, user };
  } catch (error: any) {
    console.error("Mark Faucet Claimed Error:", error);
    return { success: false, error: "Failed to update faucet status" };
  }
}

export async function getUserProfileAction() {
  try {
    const session = (await cookies()).get(SESSION_COOKIE);
    if (!session || !session.value) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: session.value },
      include: {},
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" };
  }
}
