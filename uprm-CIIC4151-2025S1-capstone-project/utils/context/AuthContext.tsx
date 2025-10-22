// jwt helper file will generate the tokens
// auth.ts (in utils folder) will securly store these tokens
// AuthContext.tsx will fetch these tokens and fetch the user info to set the global state.

import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { saveToken, getToken, deleteToken } from "@/utils/auth"; // Removed saveRole/getRole since admin is now boolean

// Updated User type to match backend schema
type User = {
  id: number;
  email: string;
  admin: boolean; // true for admin, false for civilian
};

// Auth context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: User, token?: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from stored token on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://192.168.4.49:5000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const userData: User = await response.json();
          setUser(userData);
        } else {
          await deleteToken(); // token invalid
        }
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login
  const login = async (userData: User, token?: string) => {
    setUser(userData);
    if (token) {
      await saveToken(token);
    }
  };

  // Logout
  const logout = async () => {
    setUser(null);
    await deleteToken();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
