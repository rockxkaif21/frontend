import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../lib/auth";

const LoginPage = () => {
  const { login, session, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && session) {
      router.replace(session.role === "manager" ? "/dashboard" : "/products");
    }
  }, [isLoading, session, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const nextSession = login({ email, password });
    router.push(nextSession.role === "manager" ? "/dashboard" : "/products");
  };

  return (
    <Layout>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="card">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="muted mt-2">
            Sign in with your work email. Accounts containing “manager” are treated as Manager roles in this demo.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                className="input mt-2"
                type="email"
                placeholder="manager@slooze.xyz"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                className="input mt-2"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {error ? <p className="text-sm font-medium text-rose-500">{error}</p> : null}
            <button className="button w-full" type="submit">
              Login
            </button>
          </form>
        </section>
        <aside className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Sample Accounts</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <span className="badge">Manager</span>
                <p className="mt-1 font-medium">manager@slooze.xyz</p>
              </li>
              <li>
                <span className="badge">Store Keeper</span>
                <p className="mt-1 font-medium">keeper@slooze.xyz</p>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700">
            <p className="font-semibold text-slate-600 dark:text-slate-200">Auth Assumptions</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>POST /auth/login is mocked locally in the UI.</li>
              <li>Session data is stored in localStorage.</li>
              <li>Role-based UI is applied to routing and menus.</li>
            </ul>
          </div>
        </aside>
      </div>
    </Layout>
  );
};

export default LoginPage;
