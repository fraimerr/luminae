"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, ReactNode } from "react";
import { APIUser } from "@luminae/types";
import { getData } from "~/lib/api/getData";

const API_URL = "http://localhost:5000/v1";

interface AuthContextType {
  user: APIUser | undefined;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getData<APIUser>("/users/@me"),
  });

  const login = () => {
    window.location.href = `${API_URL}/auth/login`;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/v1/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
