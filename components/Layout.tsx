import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useAuth } from "../lib/auth";
import { ThemeToggle } from "./ThemeToggle";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { session, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <p className="text-lg font-semibold">Slooze Commodities</p>
            <p className="muted">Commodities Management Console</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {session ? (
              <button type="button" className="button" onClick={handleLogout}>
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </header>
      {session ? (
        <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="container flex flex-wrap items-center gap-4 py-3">
            {session.role === "manager" ? (
              <Link className="text-sm font-medium text-slate-700 hover:text-primary-600 dark:text-slate-200" href="/dashboard">
                Dashboard
              </Link>
            ) : null}
            <Link className="text-sm font-medium text-slate-700 hover:text-primary-600 dark:text-slate-200" href="/products">
              Products
            </Link>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
              Role: {session.role === "manager" ? "Manager" : "Store Keeper"}
            </span>
          </div>
        </nav>
      ) : null}
      <main className="container py-8">{children}</main>
    </div>
  );
};
