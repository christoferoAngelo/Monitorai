import { useEffect, useState } from "react";
import api from "../services/api";
import "./Perfil.css";
import "./MaterialCard.css";
import {
  FaHeart,
  FaRegBookmark,
  FaComment
} from "react-icons/fa";

function Perfil(){

  const [perfil,setPerfil] = useState(null);
  const [curtidos, setCurtidos] = useState([]);

  useEffect(() => {

    
    api.get("/usuarios/me/perfil")
      .then(res => {
        setPerfil(res.data)
      })
      .catch(err => {
        console.log(err)
      })

    api.get("/usuarios/me/curtidos")
    .then(res => {

      setCurtidos(
        res.data.map(material => material.id)
      );

    });  

  },[])


  if(!perfil){
    return (
      <div className="perfil-loading">
        Carregando perfil...
      </div>
    )
  }

  const toggleCurtida = async(materialId) => {

  try {

    const res = await api.post(
      `/materiais/${materialId}/curtir`
    );

    if(res.data.curtido){

      setCurtidos(prev =>
        [...prev, materialId]
      );

    }else{

      setCurtidos(prev =>
        prev.filter(id => id !== materialId)
      );

    }

    setPerfil(prev => ({
      ...prev,

      materiaisSalvos:
        prev.materiaisSalvos.map(material =>

          material.id === materialId
            ? {
                ...material,
                totalCurtidas: res.data.curtidas
              }
            : material

        )
    }));

  } catch(err){

    console.error(
      "Erro ao curtir:",
      err
    );

  }
};

  const removerSalvo = async (materialId) => {

  try {

    await api.delete(
      `/materiais/${materialId}/salvar`
    );

    setPerfil(prev => ({
      ...prev,
      materiaisSalvos:
        prev.materiaisSalvos.filter(
          material => material.id !== materialId
        )
    }));

  } catch (err) {

    console.error(
      "Erro ao remover salvo:",
      err
    );

  }
  
};

console.log("CURTIDOS:", curtidos);
  return(

    <div className="perfil-page">

      <div className="perfil-hero">

        <div className="perfil-avatar">
          {perfil.username?.charAt(0)?.toUpperCase() || "U"}
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

  {perfil.materiaisSalvos?.map(material => (


    <div
      key={material.id}
      className="material-card"
    >

      <div className="material-card-header">

        <div className="material-tipo-badge">
          {material.tipo}
        </div>

      </div>

      <h4>{material.titulo}</h4>

      <p>{material.conteudo}</p>

      <div className="material-footer">

        <div className="material-actions">

          <button
  className={`icon-btn like-btn ${
    curtidos.includes(material.id)
      ? "active"
      : ""
  }`}
  onClick={() => toggleCurtida(material.id)}
>
  <FaHeart />

  <span className="like-count">
    {material.totalCurtidas || 0}
  </span>
</button>

          <button
            className="icon-btn bookmark-btn active"
            onClick={() => removerSalvo(material.id)}
          >
            <FaRegBookmark />
          </button>

          <button
            className="icon-btn"
          >
            <FaComment />
          </button>

        </div>

        <a
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-acessar-material"
        >
          Acessar Material 🔗
        </a>

      </div>

    </div>

  ))}

</div>

      </div>

    </div>
  );
}

export default Perfil;