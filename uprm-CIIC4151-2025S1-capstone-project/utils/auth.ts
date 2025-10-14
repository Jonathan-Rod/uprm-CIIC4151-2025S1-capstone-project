// This file will store and handle the tokens created from the jwt_helper file.

// This file securely stores and handles the tokens created from the jwt_helper file.

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "userToken";

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

const ROLE_KEY = "userRole";

export const saveRole = async (role: "admin" | "civilian") => {
  if (Platform.OS === "web") {
    localStorage.setItem(ROLE_KEY, role);
  } else {
    await SecureStore.setItemAsync(ROLE_KEY, role);
  }
};

export const getRole = async (): Promise<"admin" | "civilian"> => {
  try {
    if (Platform.OS === "web") {
      const role = localStorage.getItem(ROLE_KEY);
      if (role) {
        return role as "admin" | "civilian";
      } else {
        return "civilian";
      }
    } else {
      const role = await SecureStore.getItemAsync(ROLE_KEY);
      if (role) {
        return role as "admin" | "civilian";
      } else {
        return "civilian";
      }
    }
  } catch (error) {
    console.error("Error retrieving role:", error);
    return "civilian";
  }
};

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

