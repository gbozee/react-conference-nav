"use server";

import { createAdminClient } from "@/lib/appwrite";
import { AppwriteException, ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Add type for cookie store
type CookieStore = ReturnType<typeof cookies>;

export async function signUp(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = ID.unique(); // Generate a random password for the user

    const { accountClient, account, users } = await createAdminClient();

    try {
      // First check if email exists using proper Query syntax
      const existingUsers = await users.list([Query.equal("email", email)]);
      
      if (existingUsers.total > 0) {
        // If user exists, send them a login token instead
        const otpResponse = await sendOTP(email);
        return {
          success: true,
          userId: otpResponse.userId,
          email,
          message: "We've sent a login code to your email."
        };
      }

      // If email doesn't exist, create new user with random password
      const user = await users.create(ID.unique(), email, undefined, password);
      
      // Send OTP immediately after user creation
      const otpResponse = await sendOTP(email);
      return { 
        success: true, 
        userId: otpResponse.userId,
        email,
        message: "We've sent a verification code to your email."
      };
    } catch (error: any) {
      if (error instanceof AppwriteException) {
        return {
          success: false,
          error: error.message
        };
      }
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

    const { users } = await createAdminClient();

    try {
      // Check if user exists
      const existingUsers = await users.list([Query.equal("email", email)]);
      
      if (existingUsers.total === 0) {
        return {
          success: false,
          error: "No account found with this email address. Please sign up."
        };
      }

      // Send login token
      const otpResponse = await sendOTP(email);
      
      if (otpResponse.error) {
        return {
          success: false,
          error: otpResponse.error
        };
      }

      return {
        success: true,
        needsVerification: true,
        userId: otpResponse.userId,
        email,
        message: "We've sent a login code to your email."
      };
    } catch (error) {
      if (error instanceof AppwriteException) {
        return {
          success: false,
          error: error.message
        };
      }
      throw error;
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send login code"
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
    const cookieStore = await cookies();
    
    // Clear our session cookie
    cookieStore.set("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });

    try {
      // Try to delete Appwrite session, but don't fail if it doesn't work
      const { accountClient } = await createAdminClient();
      await accountClient.deleteSession("current");
    } catch (error) {
      // Log the error but don't fail the logout
      console.log("Failed to delete Appwrite session:", error);
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

const SESSION_ID = process.env.APP_SESSION_ID_NAME || "my-custom-session";

export async function createSession(
  userId: string,
  secret: string,
  sameSite?: "strict" | "lax" | "none"
) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);
    
    const cookieStore = await cookies();
    cookieStore.set(SESSION_ID, session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: sameSite || "strict",
      path: "/",
    });
    
    return { success: true, session };
  } catch (error) {
    console.error("Session creation error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create session" 
    };
  }
}

export async function sendOTP(email: string) {
  const { users, account } = await createAdminClient();
  try {
    // check if the user exists.
    const user = await users.list([Query.equal("email", email)]);
    if (user.total > 0) {
      try {
        // Use a valid format for userId that matches Appwrite's requirements
        const userId = ID.unique();
        const sessionToken = await account.createEmailToken(userId, email);
        return { 
          success: true,
          userId: sessionToken.userId, 
          email,
          error: null 
        };
      } catch (error) {
        console.error("Error creating email token:", error);
        if (error instanceof AppwriteException) {
          return { 
            success: false,
            error: error.message,
            userId: null 
          };
        }
        return { 
          success: false,
          error: "Failed to send login code",
          userId: null 
        };
      }
    }
    return { 
      success: false,
      error: "No account found with this email address",
      userId: null 
    };
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return { 
      success: false,
      error: "An unexpected error occurred",
      userId: null 
    };
  }
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
    const sessionResult = await createSession(userId, otp);
    
    if (!sessionResult.success || !sessionResult.session) {
      return {
        success: false,
        error: sessionResult.error || "Failed to create session"
      };
    }
    
    // If session creation is successful, set the session cookie
    const cookieStore = await cookies();
    cookieStore.set("sessionId", sessionResult.session.$id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    return { success: true, redirect: nextUrl };
  } catch (error) {
    console.error("ERROR:", error);
    if (error instanceof AppwriteException) {
      if (error.code === 401) {
        return { 
          success: false, 
          error: "Invalid login code. Please try again.",
          code: error.code 
        };
      }
      return { success: false, error: error.message, code: error.code };
    }
    return {
      success: false,
      error: "An unexpected error occurred during verification.",
    };
  }
}

export async function getAuthStatus() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId');
  return { isAuthenticated: !!sessionId };
}