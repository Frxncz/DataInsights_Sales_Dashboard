import React from "react";
import { Bar } from "react-chartjs-2";

const SalesBarChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.productline),
    datasets: [
      {
        label: "Total Sales",
        data: data.map((d) => d.total_sales),
        backgroundColor: "#0ea5e9",
        borderRadius: 6,
        maxBarThickness: 42,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `Revenue: $${Number(ctx.raw).toLocaleString("en-US")}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: (value) => `$${Number(value).toLocaleString("en-US")}`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default SalesBarChart;
