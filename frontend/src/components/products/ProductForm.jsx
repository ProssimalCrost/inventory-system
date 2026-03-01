import { useState, useEffect } from 'react';

const EMPTY = { name: '', value: '' };

export default function ProductForm({ initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(initial ? { name: initial.name, value: initial.value } : EMPTY);
  }, [initial]);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    onSave({ name: form.name.trim(), value: parseFloat(form.value) });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{initial ? 'Editar Produto' : 'Novo Produto'}</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="p-name">Nome *</label>
            <input id="p-name" name="name" value={form.name} onChange={onChange}
                   placeholder="Ex: Produto Alpha" required maxLength={200} />
          </div>
          <div className="form-group">
            <label htmlFor="p-value">Valor (R$) *</label>
            <input id="p-value" name="value" type="number" step="0.01" min="0"
                   value={form.value} onChange={onChange} placeholder="0.00" required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
