import React from 'react'
import { Bar } from 'react-chartjs-2'

const SalesBarChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.productline),
    datasets: [{
      label: 'Total Sales',
      data: data.map(d => d.total_sales),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  }

  return <Bar data={chartData} />
}

export default SalesBarChart