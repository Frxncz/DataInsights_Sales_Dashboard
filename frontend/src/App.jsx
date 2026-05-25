import React, { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured, supabaseSalesTable } from "./supabaseClient";
import KpiCard from "./components/KpiCard";
import SalesBarChart from "./components/SalesBarChart";
import MonthlyLineChart from "./components/MonthlyLineChart";
import DealSizePieChart from "./components/DealSizePieChart";
import { groqConfigured, generateGroqText } from "./ai/groq";
import "./App.css";

const parseNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;

  const normalized = value.replace(/[$,\s]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickFirst = (row, keys) => {
  for (const key of keys) {
    if (row && Object.prototype.hasOwnProperty.call(row, key)) return row[key];
  }
  return undefined;
};

const getRowRevenue = (row) => {
  const salesValue = parseNumber(pickFirst(row, ["sales", "SALES", "Sales", "total_sales", "TOTAL_SALES"]));

  // Heuristic: normalized/z-score sales often sit in a small range like -5..5.
  // If sales looks normalized, fall back to `priceeach * quantityordered` when available.
  if (Math.abs(salesValue) >= 10) return salesValue;

  const priceEach = parseNumber(
    pickFirst(row, ["priceeach", "PRICEEACH", "PriceEach", "price_each"]),
  );
  const quantity = parseNumber(
    pickFirst(row, ["quantityordered", "QUANTITYORDERED", "QuantityOrdered", "quantity_ordered"]),
  );
  const computed = priceEach && quantity ? priceEach * quantity : salesValue;
  return Number.isFinite(computed) ? computed : 0;
};

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
  const [selectedProductLine, setSelectedProductLine] = useState("All");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      setError(
        "Missing Supabase config. Create frontend/.env from frontend/.env.example and set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY).",
      );
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabaseConfigured || !supabase) {
      setLoading(false);
      setError(
        "Missing Supabase config. Create frontend/.env from frontend/.env.example and set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY).",
      );
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from(supabaseSalesTable)
      .select("*");

    if (queryError) {
      setError(queryError.message);
      setLoading(false);
      return;
    }

    setSalesData(data ?? []);
    setLoading(false);
  };

  const productLineOptions = useMemo(() => {
    const values = new Set();
    for (const row of salesData) {
      const v =
        pickFirst(row, [
          "productline",
          "PRODUCTLINE",
          "ProductLine",
          "product_line",
        ]) || "";
      if (String(v).trim()) values.add(String(v));
    }
    return ["All", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [salesData]);

  const filteredSalesData = useMemo(() => {
    if (selectedProductLine === "All") return salesData;
    return salesData.filter((row) => {
      const v =
        pickFirst(row, [
          "productline",
          "PRODUCTLINE",
          "ProductLine",
          "product_line",
        ]) || "";
      return String(v) === selectedProductLine;
    });
  }, [salesData, selectedProductLine]);

  const totalSales = useMemo(
    () => filteredSalesData.reduce((sum, item) => sum + getRowRevenue(item), 0),
    [filteredSalesData],
  );

  const avgSales = useMemo(
    () =>
      filteredSalesData.length ? totalSales / filteredSalesData.length : 0,
    [filteredSalesData, totalSales],
  );

  const monthlyData = useMemo(() => {
    const months = filteredSalesData.reduce((acc, item) => {
      const key = parseNumber(
        pickFirst(item, ["month_id", "MONTH_ID", "MonthId", "month"]),
      );
      if (!Number.isFinite(key)) return acc;
      acc[key] = (acc[key] || 0) + getRowRevenue(item);
      return acc;
    }, {});

    return Object.entries(months)
      .map(([month_id, monthly_sales]) => ({
        month_id: Number(month_id),
        monthly_sales,
      }))
      .sort((a, b) => a.month_id - b.month_id);
  }, [filteredSalesData]);

  const dealSizeData = useMemo(() => {
    const deals = filteredSalesData.reduce((acc, item) => {
      const key =
        pickFirst(item, ["dealsize", "DEALSIZE", "DealSize", "deal_size"]) ||
        "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(deals).map(([dealsize, count]) => ({
      dealsize,
      count,
    }));
  }, [filteredSalesData]);

  const productLineArray = useMemo(() => {
    const productLineData = filteredSalesData.reduce((acc, item) => {
      const key =
        pickFirst(item, ["productline", "PRODUCTLINE", "ProductLine", "product_line"]) ||
        "Unspecified";
      acc[key] = (acc[key] || 0) + getRowRevenue(item);
      return acc;
    }, {});

    return Object.entries(productLineData)
      .map(([productline, total_sales]) => ({ productline, total_sales }))
      .sort((a, b) => b.total_sales - a.total_sales);
  }, [filteredSalesData]);

  const topProductLine = productLineArray[0];

  const handleGenerateInsight = async () => {
    setAiLoading(true);
    setAiError("");
    setAiAnswer("");

    try {
      const topProductLines = productLineArray.slice(0, 5).map((row) => ({
        productline: row.productline,
        revenue: Math.round(row.total_sales),
      }));

      const monthlyTrend = monthlyData.slice(0, 12).map((row) => ({
        month_id: row.month_id,
        revenue: Math.round(row.monthly_sales),
      }));

      const dealMix = dealSizeData
        .slice()
        .sort((a, b) => b.count - a.count)
        .map((row) => ({ dealsize: row.dealsize, count: row.count }));

      const context = {
        table: supabaseSalesTable,
        rows: filteredSalesData.length,
        filter: { productline: selectedProductLine },
        kpis: {
          totalRevenue: Math.round(totalSales),
          averageOrderValue: Math.round(avgSales),
          totalOrders: filteredSalesData.length,
        },
        topProductLines,
        monthlyTrend,
        dealMix,
      };

      const prompt = `You are a business analyst for a sales dashboard.
Use ONLY the JSON data below as your context; do not invent extra facts.
Return:
1) 4-6 bullet insights grounded in the data
2) 2 actionable recommendations
3) A 1-sentence executive summary

JSON:
${JSON.stringify(context, null, 2)}

User question (optional):
${aiQuestion || "(none)"}`;

      const text = await generateGroqText({ prompt });
      setAiAnswer(text);
    } catch (err) {
      setAiError(err?.message || "AI request failed.");
    } finally {
      setAiLoading(false);
    }
  };

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
        {!loading && !error && salesData.length === 0 && (
          <p className="dashboard-status error">
            No rows returned from Supabase. Confirm the table has data and that
            Row Level Security policies allow SELECT for your key.
          </p>
        )}

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>Product line:</span>
            <select
              value={selectedProductLine}
              onChange={(e) => setSelectedProductLine(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(15, 23, 42, 0.15)",
                background: "white",
              }}
              aria-label="Filter by product line"
            >
              {productLineOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "All" ? "All product lines" : option}
                </option>
              ))}
            </select>
          </label>
          <p className="dashboard-subtitle" style={{ margin: 0 }}>
            Showing {filteredSalesData.length} / {salesData.length} rows
          </p>
        </div>

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
            value={numberFormatter.format(filteredSalesData.length)}
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

        <section className="chart-grid" aria-label="AI insights">
          <article className="chart-panel span-2">
            <div className="panel-head">
              <h2>AI Insights</h2>
              <p>
                Generate a natural-language summary based on your live dataset
                from Supabase.
              </p>
            </div>

            {!groqConfigured && (
              <p className="dashboard-status error">
                Missing AI config. Set <code>VITE_GROQ_API_KEY</code> in{" "}
                <code>frontend/.env</code> to enable AI insights.
              </p>
            )}

            <div style={{ display: "grid", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Ask a question (optional)</span>
                <input
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="e.g., Which product lines should we prioritize next quarter?"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(15, 23, 42, 0.15)",
                  }}
                />
              </label>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button
                  className="refresh-button"
                  type="button"
                  onClick={handleGenerateInsight}
                  disabled={!groqConfigured || aiLoading || loading || !!error}
                  title={
                    !groqConfigured
                      ? "Set VITE_GROQ_API_KEY in frontend/.env"
                      : undefined
                  }
                >
                  {aiLoading ? "Generating..." : "Generate Insight"}
                </button>

                {aiError && (
                  <p className="dashboard-status error" style={{ margin: 0 }}>
                    {aiError}
                  </p>
                )}
              </div>

              {aiAnswer && (
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    padding: 16,
                    borderRadius: 16,
                    background: "rgba(15, 23, 42, 0.04)",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {aiAnswer}
                </pre>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default App;
