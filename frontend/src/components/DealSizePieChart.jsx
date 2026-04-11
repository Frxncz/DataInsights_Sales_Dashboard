import React from "react";
import { Pie } from "react-chartjs-2";

const DealSizePieChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.dealsize),
    datasets: [
      {
        label: "Deal Size",
        data: data.map((d) => d.count),
        backgroundColor: [
          "#0ea5e9",
          "#2563eb",
          "#14b8a6",
          "#38bdf8",
          "#60a5fa",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.label}: ${Number(ctx.raw).toLocaleString("en-US")} orders`,
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default DealSizePieChart;
