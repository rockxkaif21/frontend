import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "manager" | "store-keeper";

export type Session = {
  email: string;
  role: Role;
  name: string;
};

type AuthContextValue = {
  session: Session | null;
  login: (payload: { email: string; password: string }) => Session;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_KEY = "slooze-session";

const buildSession = (email: string): Session => {
  const normalized = email.trim().toLowerCase();
  const role: Role = normalized.includes("manager") ? "manager" : "store-keeper";
  return {
    email: normalized,
    role,
    name: role === "manager" ? "Ayo Manager" : "Sade Store Keeper"
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        setSession(JSON.parse(raw) as Session);
      } catch {
        window.localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = ({ email }: { email: string; password: string }) => {
    const newSession = buildSession(email);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
    return newSession;
  };

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      login,
      logout,
      isLoading
    }),
    [session, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
