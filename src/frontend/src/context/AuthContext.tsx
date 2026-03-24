import { createContext, useContext, useState } from "react";
import type React from "react";

const SESSION_KEY = "allertrack_user";

interface AuthContextValue {
  user: string | null;
  justLoggedIn: boolean;
  clearJustLoggedIn: () => void;
  login: (username: string, password: string) => boolean;
  loginAsUser: (name: "Charles" | "Daisy") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(() => {
    return sessionStorage.getItem(SESSION_KEY);
  });
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  function loginAsUser(name: "Charles" | "Daisy") {
    sessionStorage.setItem(SESSION_KEY, name);
    setUser(name);
    setJustLoggedIn(true);
  }

  function login(username: string, password: string): boolean {
    const lower = username.trim().toLowerCase();
    const validName =
      lower === "charles" || lower === "chagwa"
        ? "Charles"
        : lower === "daisy" || lower === "daigoc"
          ? "Daisy"
          : null;
    if (validName && password === "ultimate 1") {
      loginAsUser(validName);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
    setJustLoggedIn(false);
  }

  function clearJustLoggedIn() {
    setJustLoggedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        justLoggedIn,
        clearJustLoggedIn,
        login,
        loginAsUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
