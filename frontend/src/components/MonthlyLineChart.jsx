import React from 'react'
import { Line } from 'react-chartjs-2'

const MonthlyLineChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.month_id),
    datasets: [{
      label: 'Monthly Sales',
      data: data.map(d => d.monthly_sales),
      borderColor: 'rgba(54, 162, 235, 0.8)',
      fill: false,
    }]
  }

  return <Line data={chartData} />
}

export default MonthlyLineChart