import React from "react";

const KpiCard = ({ title, value, helper }) => {
  return (
    <article className="kpi-card">
      <p className="kpi-title">{title}</p>
      <p className="kpi-value">{value}</p>
      <p className="kpi-helper">{helper}</p>
    </article>
  );
};

export default KpiCard;
