// This file will store and handle the tokens created from the jwt_helper file.

// This file securely stores and handles the tokens created from the jwt_helper file.

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "userToken";
const ADMIN_KEY = "isAdmin";

// Save token securely
export const saveToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Get token securely
export const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// Delete token securely
export const deleteToken = async (): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error deleting token:", error);
  }
};

// Save admin flag securely
export const saveAdminFlag = async (isAdmin: boolean): Promise<void> => {
  try {
    const value = JSON.stringify(isAdmin);
    if (Platform.OS === "web") {
      localStorage.setItem(ADMIN_KEY, value);
    } else {
      await SecureStore.setItemAsync(ADMIN_KEY, value);
    }
  } catch (error) {
    console.error("Error saving admin flag:", error);
  }
};

// Get admin flag securely
export const getAdminFlag = async (): Promise<boolean> => {
  try {
    const raw = Platform.OS === "web"
      ? localStorage.getItem(ADMIN_KEY)
      : await SecureStore.getItemAsync(ADMIN_KEY);

    return raw === "true";
  } catch (error) {
    console.error("Error retrieving admin flag:", error);
    return false;
  }
};

