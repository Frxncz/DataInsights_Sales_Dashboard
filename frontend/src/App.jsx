import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import KpiCard from "./components/KpiCard";
import SalesBarChart from "./components/SalesBarChart";
import MonthlyLineChart from "./components/MonthlyLineChart";
import DealSizePieChart from "./components/DealSizePieChart";

function App() {
  const [salesData, setSalesData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dealSizeData, setDealSizeData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [avgSales, setAvgSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    // Total Sales & KPI
    const { data, error } = await supabase.from("sales").select("*");

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    setSalesData(rows);

    const salesTotal = rows.reduce((sum, item) => sum + (item.sales || 0), 0);
    setTotalSales(salesTotal.toFixed(2));
    setAvgSales(rows.length ? (salesTotal / rows.length).toFixed(2) : "0.00");
    setTotalOrders(rows.length);

    // Monthly Data
    const months = rows.reduce((acc, item) => {
      acc[item.month_id] = (acc[item.month_id] || 0) + item.sales;
      return acc;
    }, {});
    setMonthlyData(
      Object.entries(months).map(([month_id, monthly_sales]) => ({
        month_id,
        monthly_sales,
      })),
    );

    // Deal Size Data
    const deals = rows.reduce((acc, item) => {
      acc[item.dealsize] = (acc[item.dealsize] || 0) + 1;
      return acc;
    }, {});
    setDealSizeData(
      Object.entries(deals).map(([dealsize, count]) => ({ dealsize, count })),
    );
    setLoading(false);
  };

  // Sales per Product Line for Bar Chart
  const productLineData = salesData.reduce((acc, item) => {
    acc[item.productline] = (acc[item.productline] || 0) + item.sales;
    return acc;
  }, {});
  const productLineArray = Object.entries(productLineData).map(
    ([productline, total_sales]) => ({ productline, total_sales }),
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>DataInsights Sales Dashboard</h1>
      {loading && <p>Loading sales data...</p>}
      {error && <p style={{ color: "crimson" }}>Error loading data: {error}</p>}
      <div style={{ display: "flex", gap: "1rem" }}>
        <KpiCard title="Total Sales" value={totalSales} />
        <KpiCard title="Average Sales" value={avgSales} />
        <KpiCard title="Total Orders" value={totalOrders} />
      </div>

      <h2>Sales per Product Line</h2>
      <SalesBarChart data={productLineArray} />

      <h2>Monthly Sales Trend</h2>
      <MonthlyLineChart data={monthlyData} />

      <h2>Deal Size Distribution</h2>
      <DealSizePieChart data={dealSizeData} />
    </div>
  );
}

export default App;
