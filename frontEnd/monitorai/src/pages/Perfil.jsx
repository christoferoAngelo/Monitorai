import { useEffect, useState } from "react";
import api from "../services/api";
import "./Perfil.css";
import "./MaterialCard.css";
import {
  FaHeart,
  FaRegBookmark,
  FaComment,
  FaPaperPlane
} from "react-icons/fa";

function Perfil(){

  const [perfil,setPerfil] = useState(null);
  const [curtidos, setCurtidos] = useState([]);

  const [modalComentarios, setModalComentarios] = useState(false);
  const [materialSelecionado, setMaterialSelecionado] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");

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

  const abrirComentarios = async (materialId) => {

  try {

    const res = await api.get(
      `/comentarios/material/${materialId}`
    );

    console.log(res.data);

    setComentarios(res.data);

    setMaterialSelecionado(materialId);

    setModalComentarios(true);

    
  } catch(err) {
    
    console.error(
      "Erro ao carregar comentários",
      err
    );
    
  }
  
};

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

  const enviarComentario = async () => {

  if(!novoComentario.trim()) return;

  try {

    await api.post(
      "/comentarios",
      {
        texto: novoComentario,
        materialId: materialSelecionado
      }
    );

    const res = await api.get(
      `/comentarios/material/${materialSelecionado}`
    );

    setComentarios(res.data);

    setNovoComentario("");

  } catch(err) {

    console.error(
      "Erro ao comentar",
      err
    );

  }

};

  const excluirComentario = async (comentarioId) => {

  try {

    await api.delete(
      `/comentarios/${comentarioId}`
    );

    setComentarios(prev =>
      prev.filter(
        comentario =>
          comentario.id !== comentarioId
      )
    );

  } catch(err) {

    console.error(
      "Erro ao excluir comentário",
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
            onClick={() =>
            abrirComentarios(material.id)
            }
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

  {modalComentarios && (

  <div
    className="modal-overlay"
    onClick={() =>
      setModalComentarios(false)
    }
  >

    <div
      className="modal-comentarios"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <div className="modal-header">

      <h2>Comentários</h2>

      <button
    className="btn-fechar-modal"
    onClick={() =>
      setModalComentarios(false)
    }
  >
    ✕
  </button>

      </div>

      <div className="comentarios-lista">

        {comentarios.map(comentario => (

  <div
    key={comentario.id}
    className="comentario-item"
  >

    <div className="comentario-header">

      <strong>
        {comentario.username}
      </strong>

      {comentario.username === perfil.username && (

        <button
          className="btn-excluir-comentario"
          onClick={() => {
            if(window.confirm(
              "Tem certeza que deseja excluir este comentário?"
            )) {
              excluirComentario(comentario.id);
            }
          }} 
        >
          ✕
        </button>

      )}

    </div>

    <p>
      {comentario.texto}
    </p>

  </div>

))}

      </div>

      <div className="comentario-input-area">

        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={novoComentario}
          onChange={(e) =>
            setNovoComentario(
              e.target.value
            )
          }
        />

        <button onClick={enviarComentario}>
        <FaPaperPlane />
        </button>

      </div>

    </div>

  </div>

)}

</div>

      </div>

    </div>
    
  );
}

export default Perfil;