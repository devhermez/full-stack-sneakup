// src/context/AuthContext.tsx
import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/User"; // adjust the path if your types live elsewhere

type AuthContextValue = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  authReady: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

type AuthProviderProps = { children: ReactNode };

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("user");
        if (raw) setUser(JSON.parse(raw) as User);
      }
    } finally {
      setAuthReady(true);
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;