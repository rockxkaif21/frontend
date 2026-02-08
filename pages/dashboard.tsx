import { useRouter } from "next/router";
import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../lib/auth";

const DashboardPage = () => {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
    if (!isLoading && session?.role !== "manager") {
      router.replace("/products");
    }
  }, [isLoading, session, router]);

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card space-y-2">
          <p className="text-sm font-semibold text-slate-500">Total Commodities</p>
          <p className="text-3xl font-semibold">1,284</p>
          <p className="muted">+6.4% vs last week</p>
        </div>
        <div className="card space-y-2">
          <p className="text-sm font-semibold text-slate-500">Low Stock Alerts</p>
          <p className="text-3xl font-semibold">18</p>
          <p className="muted">Critical items across 3 depots</p>
        </div>
        <div className="card space-y-2">
          <p className="text-sm font-semibold text-slate-500">Orders Fulfilled</p>
          <p className="text-3xl font-semibold">92%</p>
          <p className="muted">On-time delivery target 90%</p>
        </div>
      </div>
      <section className="card mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Operational Insights</h2>
            <p className="muted">Highlights across procurement, storage, and delivery.</p>
          </div>
          <span className="badge">Manager-only view</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-sm font-semibold">Top Categories</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Raw Produce</span>
                <span className="font-semibold">42%</span>
              </li>
              <li className="flex justify-between">
                <span>Frozen</span>
                <span className="font-semibold">26%</span>
              </li>
              <li className="flex justify-between">
                <span>Oil & Condiments</span>
                <span className="font-semibold">18%</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-sm font-semibold">Upcoming Tasks</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Review Lagos depot restock plan.</li>
              <li>Approve supplier quotes for Q3.</li>
              <li>Validate cold chain reports.</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DashboardPage;
