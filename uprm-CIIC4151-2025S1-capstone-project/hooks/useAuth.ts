// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { getStoredCredentials } from "@/utils/auth";

export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  suspended?: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const credentials = await getStoredCredentials();
        if (credentials) {
          setUser({
            id: credentials.userId,
            email: credentials.email,
            isAdmin: credentials.admin || false,
            suspended: credentials.suspended || false,
          });
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
};
