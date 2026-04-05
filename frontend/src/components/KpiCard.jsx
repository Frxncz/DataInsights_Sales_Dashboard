import React from 'react'

const KpiCard = ({ title, value }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', borderRadius: '8px', flex: 1 }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  )
}

export default KpiCard