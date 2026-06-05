import { useState, useEffect } from 'react';
import api from '../../../services/api';
import axios from 'axios';
import "./AdminEditais.css";

export default function AdminEditaisModal({ edital, onClose, onSuccess }) {
  // Estados do formulário
  const [tipo, setTipo] = useState('VAGAS');
  const [numeroEdital, setNumeroEdital] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');
  const [status, setStatus] = useState('ATIVO');
  const [arquivo, setArquivo] = useState(null);
  const [arquivoNome, setArquivoNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState([]);

  const CLOUD_NAME = "dk7bgyams";
  const UPLOAD_PRESET = "ml_unsigned";

  useEffect(() => {
    if (edital) {
      setTipo(edital.tipo || 'VAGAS');
      setNumeroEdital(edital.numeroEdital || '');
      setTitulo(edital.titulo || '');
      setDescricao(edital.descricao || '');
      setPeriodoInicio(edital.periodoInicio || '');
      setPeriodoFim(edital.periodoFim || '');
      setStatus(edital.status || 'ATIVO');
      setArquivoNome(edital.nomeArquivo || '');
    }
  }, [edital]);

  const fazerUploadCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const resposta = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    let urlPdf = resposta.data.secure_url;
    if (!urlPdf.toLowerCase().endsWith('.pdf')) {
      urlPdf = urlPdf.substring(0, urlPdf.lastIndexOf('.')) + '.pdf';
    }
    return urlPdf;
  };

  function handleArquivo(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Apenas arquivos PDF são permitidos');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('O arquivo deve ser menor que 10MB');
        return;
      }
      setArquivo(file);
      setArquivoNome(file.name);
    }
  }

  const validarFormulario = () => {
    const erros = [];
const hoje = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    // 1. Se tipo for VAGAS, precisa ter pelo menos uma data
    if (tipo === 'VAGAS') {
      if (!periodoInicio && !periodoFim) {
        erros.push('Para vagas, informe pelo menos uma data (início ou fim)');
      }
      // 2. Data início não pode ser no passado (só hoje e futuras)

if (periodoInicio && periodoInicio < hoje) {
    erros.push('A data de início não pode ser no passado');
}

// 3. Data fim não pode ser menor que hoje (só hoje e futuras)
if (periodoFim && periodoFim < hoje) {
    erros.push('A data de fim não pode ser no passado');
}
      
      // 4. Data início não pode ser maior que data fim
      if (periodoInicio && periodoFim) {
        if (periodoInicio > periodoFim) {
          erros.push('A data de início não pode ser maior que a data de fim');
        }
      }
    }

    // 5. Se tipo for RESULTADO, o arquivo PDF é obrigatório
    if (tipo === 'RESULTADO' && !arquivo && !edital?.urlPdf) {
      erros.push('Para resultado, é obrigatório anexar o PDF de classificação');
    }

    // 6. Título não pode ter menos de 5 caracteres
    if (titulo && titulo.length < 5) {
      erros.push('O título deve ter pelo menos 5 caracteres');
    }

    // 7. Número do edital é obrigatório
    if (!numeroEdital || numeroEdital.trim() === '') {
      erros.push('O número do edital é obrigatório');
    }

    return erros;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErros([]);

    const errosEncontrados = validarFormulario();
    if (errosEncontrados.length > 0) {
      setErros(errosEncontrados);
      setLoading(false);
      return;
    }

    try {
      let urlPdf = null;
      if (arquivo) {
        urlPdf = await fazerUploadCloudinary(arquivo);
      }

      const data = {
        titulo,
        descricao,
        tipo,
        numeroEdital,
        periodoInicio,
        periodoFim,
        status,
        urlPdf: urlPdf || null,
        nomeArquivo: arquivo ? arquivo.name : null,
        tipoArquivo: arquivo ? arquivo.type : null,
        tamanhoArquivo: arquivo ? arquivo.size : null
      };

      if (edital) {
        await api.put(`/editais/${edital.id}`, data);
      } else {
        await api.post('/editais', data);
      }

      onSuccess();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar edital');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{edital ? 'Editar Edital' : 'Novo Edital'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tipo */}
          <div className="field">
            <label>Tipo de Publicação</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)} required>
              <option value="VAGAS">📝 Vagas (período de inscrições)</option>
              <option value="RESULTADO">🏆 Resultado (classificação)</option>
            </select>
          </div>

          {/* Número do Edital */}
          <div className="field">
            <label>Número do Edital</label>
            <input 
              type="text" 
              value={numeroEdital} 
              onChange={e => setNumeroEdital(e.target.value)} 
              placeholder="Ex: 227/2025"
              required 
            />
          </div>

          {/* Título */}
          <div className="field">
            <label>Título</label>
            <input 
              type="text" 
              value={titulo} 
              onChange={e => setTitulo(e.target.value)} 
              placeholder="Ex: Processo Seletivo para o Programa de Monitoria"
              required 
            />
          </div>

          {/* Descrição */}
          <div className="field">
            <label>Descrição</label>
            <textarea 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)} 
              placeholder="Descrição do edital..."
              rows={3}
            />
          </div>

          {/* Campos específicos para VAGAS */}
          {tipo === 'VAGAS' && (
            <div className="form-row">
              <div className="field">
                <label>Período Início</label>
                <input 
                  type="date" 
                  value={periodoInicio} 
                  onChange={e => setPeriodoInicio(e.target.value)} 
                />
              </div>
              <div className="field">
                <label>Período Fim</label>
                <input 
                  type="date" 
                  value={periodoFim} 
                  onChange={e => setPeriodoFim(e.target.value)} 
                />
              </div>
            </div>
          )}

          {/* Campo de arquivo PDF */}
          <div className="field">
            <label>
              Anexo PDF {tipo === 'RESULTADO' ? '(Obrigatório)' : '(Opcional)'}
            </label>
            <div className="file-input">
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleArquivo}
                id="arquivo-pdf"
              />
              <label htmlFor="arquivo-pdf" className="file-label">
                {arquivoNome ? (
                  <span className="file-selected">📄 {arquivoNome}</span>
                ) : (
                  <span>📁 Clique para selecionar o PDF</span>
                )}
              </label>
            </div>
            {arquivoNome && (
              <button 
                type="button" 
                className="btn-remove-file"
                onClick={() => { setArquivo(null); setArquivoNome(''); }}
              >
                ✕ Remover arquivo
              </button>
            )}
          </div>

          {/* Status (só para editar) */}
          {edital && (
            <div className="field">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="ATIVO">✅ Ativo</option>
                <option value="ENCERRADO">❌ Encerrado</option>
              </select>
            </div>
          )}

          {/* Erros aparecem antes dos botões */}
          {erros.length > 0 && (
            <div className="erros-container">
              {erros.map((erro, index) => (
                <p key={index} className="erro-item">{erro}</p>
              ))}
            </div>
          )}

          {/* Botões */}
          <div className="modal-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}