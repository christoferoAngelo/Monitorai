// src/components/GlobalSearch/UsuarioContext.jsx
import { createContext, useContext, useState } from 'react';

const UsuarioContext = createContext({});

export function UsuarioProvider({ children }) {
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const abrirEdicaoUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setUsuarioEditando(null);
  };

  return (
    <UsuarioContext.Provider value={{
      usuarioEditando,
      modalOpen,
      abrirEdicaoUsuario,
      fecharModal
    }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuario deve ser usado dentro de um UsuarioProvider');
  }
  return context;
};