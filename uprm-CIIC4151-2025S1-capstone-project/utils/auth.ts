import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Storage keys
const CREDENTIALS_KEY = "userCredentials";

// Interfaces
export interface UserCredentials {
  userId: number;
  email: string;
  password: string;
}

// Credential Management
export const getStoredCredentials =
  async (): Promise<UserCredentials | null> => {
    try {
      const raw =
        Platform.OS === "web"
          ? localStorage.getItem(CREDENTIALS_KEY)
          : await SecureStore.getItemAsync(CREDENTIALS_KEY);

      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error("Error retrieving credentials:", error);
      return null;
    }
  };

export const saveCredentials = async (
  userId: number,
  email: string,
  password: string
): Promise<void> => {
  try {
    const credentials: UserCredentials = { userId, email, password };
    const serialized = JSON.stringify(credentials);

    if (Platform.OS === "web") {
      localStorage.setItem(CREDENTIALS_KEY, serialized);
    } else {
      await SecureStore.setItemAsync(CREDENTIALS_KEY, serialized);
    }

    console.log("Credentials saved successfully for user:", email);
  } catch (error) {
    console.error("Error saving credentials:", error);
    throw error;
  }
};

export const clearCredentials = async (): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(CREDENTIALS_KEY);
    } else {
      await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
    }
    console.log("Credentials cleared successfully");
  } catch (error) {
    console.error("Error clearing credentials:", error);
    throw error;
  }
};

// Complete logout - clear everything
// Make sure your completeLogout function exists
export const completeLogout = async (): Promise<void> => {
  try {
    await clearCredentials();
    console.log("Logout completed successfully");
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

// Get user ID directly (convenience function)
export const getUserId = async (): Promise<number | null> => {
  try {
    const credentials = await getStoredCredentials();
    return credentials?.userId || null;
  } catch (error) {
    console.error("Error retrieving user ID:", error);
    return null;
  }
};

// Get user email directly (convenience function)
export const getUserEmail = async (): Promise<string | null> => {
  try {
    const credentials = await getStoredCredentials();
    return credentials?.email || null;
  } catch (error) {
    console.error("Error retrieving user email:", error);
    return null;
  }
};

// Validation helpers
export const hasStoredCredentials = async (): Promise<boolean> => {
  const credentials = await getStoredCredentials();
  return !!(credentials?.email && credentials?.password && credentials?.userId);
};

export const isValidCredentials = (
  credentials: UserCredentials | null
): boolean => {
  return !!(credentials?.email && credentials?.password && credentials?.userId);
};

// Check if user is logged in
export const isUserLoggedIn = async (): Promise<boolean> => {
  return await hasStoredCredentials();
};

// Update user credentials (useful for profile updates)
export const updateUserCredentials = async (
  updates: Partial<Omit<UserCredentials, "userId">>
): Promise<void> => {
  try {
    const currentCredentials = await getStoredCredentials();
    if (!currentCredentials) {
      throw new Error("No credentials found to update");
    }

    const updatedCredentials: UserCredentials = {
      ...currentCredentials,
      ...updates,
    };

    await saveCredentials(
      updatedCredentials.userId,
      updatedCredentials.email,
      updatedCredentials.password
    );

    console.log("Credentials updated successfully");
  } catch (error) {
    console.error("Error updating credentials:", error);
    throw error;
  }
};
