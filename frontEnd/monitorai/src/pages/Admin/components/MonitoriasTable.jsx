import React from 'react';

function MonitoriasTable({ monitorias, onEdit, onNova, searchTerm, onSearchChange }) {
  const renderText = (value) => {
    if (!value) return '—';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value.username || value.usuario || 'Desconhecido';
    }
    return String(value);
  };

  return (
    <div className="monitorias-panel">
      <div className="panel-header">
        <h2>Monitorias Recentes</h2>
        <button className="primary-btn" onClick={onNova}>
          + Nova Monitoria
        </button>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="search-bar" style={{ marginBottom: '16px' }}>
        <input 
          type="text" 
          placeholder="Buscar monitoria..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '14px'
          }}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Monitor</th>
            <th>Sala</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {(!monitorias || monitorias.length === 0) ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                Nenhuma monitoria encontrada.
              </td>
            </tr>
          ) : (
            monitorias.map((m) => (
              <tr key={m.id}>
                <td>{renderText(m.disciplina)}</td>
                <td>{renderText(m.monitor)}</td>
                <td>{m.sala || '—'}</td>
                <td>
                  <span className={`status ${m.ativa ? 'active' : 'inactive'}`}>
                    {m.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td>
                  <button 
                    className="table-btn" 
                    onClick={() => onEdit && onEdit(m)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MonitoriasTable;