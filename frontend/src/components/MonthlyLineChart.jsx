import React from 'react'
import { Line } from 'react-chartjs-2'

const MonthlyLineChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => `Month ${d.month_id}`),
    datasets: [{
      label: 'Monthly Sales',
      data: data.map((d) => d.monthly_sales),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.16)',
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5,
      tension: 0.35,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Revenue: $${Number(ctx.raw).toLocaleString('en-US')}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${Number(value).toLocaleString('en-US')}`,
        },
      },
    },
  }

  return <Line data={chartData} options={options} />
}

export default MonthlyLineChart