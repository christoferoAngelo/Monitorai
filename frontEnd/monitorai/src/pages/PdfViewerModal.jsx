import './PdfViewerModal.css'; // Você precisará criar este CSS abaixo

export default function PdfViewerModal({ url, onClose }) {
  if (!url) return null;

  return (
    <div className="pdf-modal-overlay" onClick={onClose}>
      <div className="pdf-modal-content" onClick={e => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <h3>Visualização de Edital</h3>
          <button onClick={onClose}>Fechar ✕</button>
        </div>
        <div className="pdf-viewer-container">
          {/* O embed permite visualizar o PDF incorporado */}
          <embed src={url} type="application/pdf" width="100%" height="100%" />
        </div>
      </div>
    </div>
  );
}