import React from 'react';

function QuickActions({ onAction }) {
  // Mapeamento das ações com os ícones correspondentes da pasta public
  const actions = [
    { label: 'Novo Usuário', key: 'Novo Usuário', icon: '/icone_mais.png' },
    { label: 'Nova Monitoria', key: 'Nova Monitoria', icon: '/icone_monitorias.png' },
    { label: 'Novo Relatório', key: 'Novo Relatório', icon: '/icone_relatorios.png' },
    { label: 'Grade Curricular', key: 'Grade Curricular', icon: '/icone_grade.png' }, 
  ];

  return (
    <div className="quick-panel">
      <h3>Ações Rápidas</h3>
      {actions.map((action, index) => (
        <button 
          key={index} 
          onClick={() => onAction && onAction(action.key)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer', 
          }}
        >
          <img src={action.icon} alt={action.label} width="18" height="18" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default QuickActions;