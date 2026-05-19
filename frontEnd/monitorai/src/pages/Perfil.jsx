import { useEffect, useState } from "react";
import api from "../services/api";
import "./Perfil.css";

function Perfil(){

  const [perfil,setPerfil] = useState(null);

  useEffect(() => {

    api.get("/usuarios/me/perfil")
      .then(res => {
        setPerfil(res.data)
      })
      .catch(err => {
        console.log(err)
      })

  },[])

  if(!perfil){
    return (
      <div className="perfil-loading">
        Carregando perfil...
      </div>
    )
  }

  return(

    <div className="perfil-page">

      <div className="perfil-hero">

        <div className="perfil-avatar">
          {perfil.username.charAt(0).toUpperCase()}
        </div>

        <div className="perfil-info">

          <h1>{perfil.username}</h1>

          <span className="perfil-role">
            {perfil.role}
          </span>

          <p>📧 {perfil.email}</p>
          <p>🆔 RA: {perfil.ra}</p>

        </div>

      </div>

      <div className="salvos-section">

        <h2>📚 Materiais Salvos</h2>

        <div className="salvos-grid">

          {perfil.materiaisSalvos?.length > 0 ? (

            perfil.materiaisSalvos.map(material => (

              <div
                key={material.id}
                className="salvo-card"
              >

                <h3>{material.titulo}</h3>

                <button className="btn-material">
                  Abrir Material
                </button>

              </div>

            ))

          ) : (

            <div className="empty-card">
              Nenhum material salvo ainda.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Perfil;