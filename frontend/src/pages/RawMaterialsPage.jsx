import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRawMaterials, createRawMaterial, updateRawMaterial, deleteRawMaterial,
  clearRawMaterialError,
} from '../store/slices/rawMaterialsSlice';
import { Spinner, Alert, ConfirmDialog } from '../components/shared';

const EMPTY = { name: '', stockQuantity: '' };

function RawMaterialForm({ initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(EMPTY);
  useEffect(() => setForm(initial ? { name: initial.name, stockQuantity: initial.stockQuantity } : EMPTY), [initial]);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    onSave({ name: form.name.trim(), stockQuantity: parseFloat(form.stockQuantity) });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{initial ? 'Editar Matéria-Prima' : 'Nova Matéria-Prima'}</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="rm-name">Nome *</label>
            <input id="rm-name" name="name" value={form.name} onChange={onChange}
                   placeholder="Ex: Aço Inox" required maxLength={200} />
          </div>
          <div className="form-group">
            <label htmlFor="rm-stock">Quantidade em Estoque *</label>
            <input id="rm-stock" name="stockQuantity" type="number" step="0.001" min="0"
                   value={form.stockQuantity} onChange={onChange} placeholder="0.000" required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit"  className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RawMaterialsPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(s => s.rawMaterials);

  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { dispatch(fetchRawMaterials()); }, [dispatch]);

  const openCreate = () => { setEditing(null); setShowForm(true); };
  const openEdit   = (r) => { setEditing(r);   setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditing(null); };

  const onSave = async (data) => {
    const action = editing ? updateRawMaterial({ id: editing.id, data }) : createRawMaterial(data);
    const res = await dispatch(action);
    if (!updateRawMaterial.rejected.match(res) && !createRawMaterial.rejected.match(res)) closeForm();
  };

  const onDelete = async () => {
    const res = await dispatch(deleteRawMaterial(deleting.id));
    if (!deleteRawMaterial.rejected.match(res)) setDeleting(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Matérias-Primas</h1>
        <p>Gerencie os insumos disponíveis no estoque</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Lista de Matérias-Primas</h2>
          <button className="btn btn-primary" onClick={openCreate} data-cy="btn-new-raw-material">
            + Nova Matéria-Prima
          </button>
        </div>

        <Alert message={error} onClose={() => dispatch(clearRawMaterialError())} />
        {loading && <Spinner />}

        {!loading && items.length === 0 && (
          <div className="empty-state">
            <strong>Nenhuma matéria-prima cadastrada</strong>
            <p>Clique em "Nova Matéria-Prima" para começar.</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Estoque</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map(r => (
                  <tr key={r.id} data-cy="raw-material-row">
                    <td>{r.id}</td>
                    <td><strong>{r.name}</strong></td>
                    <td>
                      <span className={`badge ${Number(r.stockQuantity) > 0 ? 'badge-green' : 'badge-blue'}`}>
                        {Number(r.stockQuantity).toLocaleString('pt-BR', { minimumFractionDigits: 3 })} un.
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)} data-cy="btn-edit-rm">Editar</button>{' '}
                      <button className="btn btn-danger btn-sm"  onClick={() => setDeleting(r)} data-cy="btn-delete-rm">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && <RawMaterialForm initial={editing} onSave={onSave} onClose={closeForm} loading={loading} />}

      {deleting && (
        <ConfirmDialog
          message={`Deseja excluir "${deleting.name}"? Não será possível excluir se estiver vinculada a produtos.`}
          onConfirm={onDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
