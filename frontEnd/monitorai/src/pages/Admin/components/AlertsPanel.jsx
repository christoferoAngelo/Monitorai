import React from 'react';

function AlertsPanel({ alertas = [] }) {
  const defaultAlerts = [
    { type: 'warning', message: '5 relatórios pendentes' },
    { type: 'danger', message: '3 monitorias inativas' },
    { type: 'info', message: 'Sistema online' },
  ];

  const list = alertas.length > 0 ? alertas : defaultAlerts;

  return (
    <div className="alerts-panel">
      <h3>Alertas</h3>
      {list.map((alert, index) => (
        <div key={index} className={`alert-item ${alert.type}`}>
          {alert.message}
        </div>
      ))}
    </div>
  );
}

export default AlertsPanel; 