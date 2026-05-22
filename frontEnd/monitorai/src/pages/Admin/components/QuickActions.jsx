import React from 'react';

function QuickActions({ onAction }) {
  const actions = [
    { label: '➕ Novo Usuário', key: 'Novo Usuário' },
    { label: '📚 Nova Monitoria', key: 'Nova Monitoria' },
    { label: '📄 Novo Relatório', key: 'Novo Relatório' },
    { label: '💰 Lançar Pagamento', key: 'Lançar Pagamento' },
  ];

  return (
    <div className="quick-panel">
      <h3>Ações Rápidas</h3>
      {actions.map((action, index) => (
        <button 
          key={index} 
          onClick={() => onAction && onAction(action.key)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default QuickActions;