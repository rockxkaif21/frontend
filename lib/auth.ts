import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "./mockApi";

export type Role = "manager" | "store-keeper";

export type Session = {
  email: string;
  role: Role;
  name: string;
};

type AuthContextValue = {
  session: Session | null;
  login: (payload: { email: string; password: string }) => Promise<Session>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const SESSION_KEY = "slooze-session";

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

  const login = async ({ email, password }: { email: string; password: string }) => {
    const nextSession = await loginRequest({ email, password });
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession;
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
