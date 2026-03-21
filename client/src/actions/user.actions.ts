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
    // Check if username already exists
    // if (data.username) {
    //   const existingUser = await prisma.user.findUnique({
    //     where: { username: data.username },
    //   });
    //   if (existingUser) {
    //     return { success: false, error: "Username already taken." };
    //   }
    // }

    // Check if wallet already exists
    const existingWallet = await prisma.user.findUnique({
      where: { walletAddress: data.walletAddress },
    });
    if (existingWallet) {
      return { success: false, error: "Wallet address already registered." };
    }

    const user = await prisma.user.create({
      data: {
        walletAddress: data.walletAddress,
        fullName: data.fullName,
        username: data.username,
        onboardingStep: 1, // Set to 1 to mark basic onboarding as complete
      },
    });

    // Automatically log them in
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
