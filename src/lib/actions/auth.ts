"use server";

import { createAdminClient } from "@/lib/appwrite";
import { AppwriteException, ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData, secret?: string) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { accountClient, account, users } = await createAdminClient();

    try {
      // First check if email exists using proper Query syntax
      const existingUsers = await users.list([
        Query.equal("email", email)
      ]);
      
      if (existingUsers.total > 0) {
        return {
          success: false,
          error: "An account with this email already exists. Please sign in instead.",
          existingUser: true,
        };
      }

      // If email doesn't exist, create new user
      const user = await users.create(ID.unique(), email, undefined, password);
      if (secret) {
        // Create a session to send verification email
        await createSession(user.$id, secret);
        redirect(`/`);
      }
      const otpResponse = await sendOTP(email);
      return { success: true, userId: otpResponse.userId };
    } catch (error: any) {
      // Keep this catch block for other potential errors
      throw error;
    }
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign up",
    };
  }
}

export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { accountClient } = await createAdminClient();

    // Create session
    const session = await accountClient.createSession(email, password);

    // Check if email is verified
    const account = await accountClient.get();
    if (!account.emailVerification) {
      // Send verification email if not verified
      await accountClient.createVerification(
        `${process.env.NEXT_PUBLIC_APP_URL}/verify`
      );

      // Delete the session since email isn't verified
      await accountClient.deleteSession("current");

      return {
        success: false,
        needsVerification: true,
        error:
          "Please verify your email address. A new verification email has been sent.",
      };
    }

    // Store session in cookies
    const cookieStore = cookies();
    cookieStore.set("sessionId", session.$id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, data: session };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to login",
    };
  }
}

export async function verifyEmail(secret: string, userId: string) {
  try {
    const { accountClient } = await createAdminClient();
    await accountClient.updateVerification(userId, secret);
    return { success: true };
  } catch (error) {
    console.error("Verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify email",
    };
  }
}

export async function logout() {
  try {
    const { accountClient } = await createAdminClient();
    await accountClient.deleteSession("current");

    const cookieStore = cookies();
    const cookiesList = cookieStore.getAll();
    const sessionCookie = cookiesList.find(
      (cookie) => cookie.name === "sessionId"
    );
    if (sessionCookie) {
      cookiesList.splice(cookiesList.indexOf(sessionCookie), 1);
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to logout",
    };
  }
}

const SESSION_ID =
  process.env.APP_SESSION_ID_NAME || "my-custom-session";

export async function createSession(
  userId: string,
  secret: string,
  sameSite?: "strict" | "lax" | "none"
) {
  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);
  cookies().set(SESSION_ID, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: sameSite || "strict",
    secure: true,
  });
  return session;
}

export async function sendOTP(email: string) {
  const { users, account } = await createAdminClient();
  // check if the user exists.
  const user = await users.list([Query.equal("email", email)]);
  if (user.total > 0) {
    const sessionToken = await account.createEmailToken(ID.unique(), email);
    return { userId: sessionToken.userId, error: null };
  }
  return { error: "User does not exist", userId: null };
}

export async function verifySignUpOTP(
  {
    userId,
    otp,
  }: {
    userId: string;
    otp: string;
  },
  nextUrl = "/"
) {
  try {
    await createSession(userId, otp);
    redirect(nextUrl);
  } catch (error) {
    console.error("ERROR:", error);
    if (error instanceof AppwriteException) {
      return { success: false, error: error.message, code: error.code };
    } else
      return {
        success: false,
        error: "An unexpected error occurred during OTP verification.",
      };
  }
}