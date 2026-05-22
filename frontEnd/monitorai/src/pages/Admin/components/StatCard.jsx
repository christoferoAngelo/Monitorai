import React from 'react';

function StatCard({ title, value, subtitle, variant = 'blue' }) {
  return (
    <div className={`stat-card ${variant}`}>
      <h3>{title}</h3>
      <strong>{value}</strong>
      <span>{subtitle}</span>
    </div>
  );
}

export default StatCard;