export function Spinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" role="status" aria-label="Carregando..." />
    </div>
  );
}

export function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
      {onClose && (
        <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
          ✕
        </button>
      )}
    </div>
  );
}

export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 380 }}>
        <h3>Confirmar ação</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger"  onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}
