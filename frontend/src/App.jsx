import React, { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured } from "./supabaseClient";
import KpiCard from "./components/KpiCard";
import SalesBarChart from "./components/SalesBarChart";
import MonthlyLineChart from "./components/MonthlyLineChart";
import DealSizePieChart from "./components/DealSizePieChart";
import "./App.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

function App() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      setError(
        "Missing Supabase config. Create frontend/.env from frontend/.env.example and set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY.",
      );
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabaseConfigured || !supabase) {
      setLoading(false);
      setError(
        "Missing Supabase config. Create frontend/.env from frontend/.env.example and set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY.",
      );
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("sales")
      .select("*");

    if (queryError) {
      setError(queryError.message);
      setLoading(false);
      return;
    }

    setSalesData(data ?? []);
    setLoading(false);
  };

  const totalSales = useMemo(
    () => salesData.reduce((sum, item) => sum + Number(item.sales || 0), 0),
    [salesData],
  );

  const avgSales = useMemo(
    () => (salesData.length ? totalSales / salesData.length : 0),
    [salesData, totalSales],
  );

  const monthlyData = useMemo(() => {
    const months = salesData.reduce((acc, item) => {
      const key = Number(item.month_id);
      acc[key] = (acc[key] || 0) + Number(item.sales || 0);
      return acc;
    }, {});

    return Object.entries(months)
      .map(([month_id, monthly_sales]) => ({
        month_id: Number(month_id),
        monthly_sales,
      }))
      .sort((a, b) => a.month_id - b.month_id);
  }, [salesData]);

  const dealSizeData = useMemo(() => {
    const deals = salesData.reduce((acc, item) => {
      const key = item.dealsize || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(deals).map(([dealsize, count]) => ({
      dealsize,
      count,
    }));
  }, [salesData]);

  const productLineArray = useMemo(() => {
    const productLineData = salesData.reduce((acc, item) => {
      const key = item.productline || "Unspecified";
      acc[key] = (acc[key] || 0) + Number(item.sales || 0);
      return acc;
    }, {});

    return Object.entries(productLineData)
      .map(([productline, total_sales]) => ({ productline, total_sales }))
      .sort((a, b) => b.total_sales - a.total_sales);
  }, [salesData]);

  const topProductLine = productLineArray[0];

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">DataInsights</p>
            <h1>Sales Performance Dashboard</h1>
            <p className="dashboard-subtitle">
              Track revenue, orders, and sales mix in one place.
            </p>
          </div>
          <button
            className="refresh-button"
            onClick={fetchData}
            type="button"
            disabled={!supabaseConfigured || loading}
            title={
              !supabaseConfigured
                ? "Set Supabase env vars in frontend/.env to enable data refresh"
                : undefined
            }
          >
            Refresh Data
          </button>
        </header>

        {loading && <p className="dashboard-status">Loading sales data...</p>}
        {error && (
          <p className="dashboard-status error">Error loading data: {error}</p>
        )}

        <section className="kpi-grid" aria-label="Sales KPI summary">
          <KpiCard
            title="Total Revenue"
            value={currencyFormatter.format(totalSales)}
            helper="Overall sales volume"
          />
          <KpiCard
            title="Average Order Value"
            value={currencyFormatter.format(avgSales)}
            helper="Revenue per transaction"
          />
          <KpiCard
            title="Total Orders"
            value={numberFormatter.format(salesData.length)}
            helper="Completed orders"
          />
          <KpiCard
            title="Top Product Line"
            value={topProductLine?.productline || "N/A"}
            helper={
              topProductLine
                ? `${currencyFormatter.format(topProductLine.total_sales)} in sales`
                : "No available sales data"
            }
          />
        </section>

        <section className="chart-grid" aria-label="Sales charts">
          <article className="chart-panel span-2">
            <div className="panel-head">
              <h2>Revenue by Product Line</h2>
              <p>Identify which categories drive total revenue.</p>
            </div>
            <div className="chart-canvas-wrap chart-canvas-wrap-wide">
              <SalesBarChart data={productLineArray} />
            </div>
          </article>

          <article className="chart-panel">
            <div className="panel-head">
              <h2>Monthly Sales Trend</h2>
              <p>View sales direction month over month.</p>
            </div>
            <div className="chart-canvas-wrap">
              <MonthlyLineChart data={monthlyData} />
            </div>
          </article>

          <article className="chart-panel">
            <div className="panel-head">
              <h2>Deal Size Distribution</h2>
              <p>Understand order mix by deal category.</p>
            </div>
            <div className="chart-canvas-wrap">
              <DealSizePieChart data={dealSizeData} />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default App;
