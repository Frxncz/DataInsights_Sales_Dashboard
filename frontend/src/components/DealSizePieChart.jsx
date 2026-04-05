import React from 'react'
import { Pie } from 'react-chartjs-2'

const DealSizePieChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.dealsize),
    datasets: [{
      label: 'Deal Size',
      data: data.map(d => d.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)'
      ]
    }]
  }

  return <Pie data={chartData} />
}

export default DealSizePieChart