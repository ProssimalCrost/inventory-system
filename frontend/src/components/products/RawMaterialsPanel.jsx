import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRawMaterial, removeRawMaterial } from '../../store/slices/productsSlice';
import { Alert } from '../shared';

export default function RawMaterialsPanel({ product }) {
  const dispatch    = useDispatch();
  const allRMs      = useSelector(s => s.rawMaterials.items);
  const [rmId, setRmId]  = useState('');
  const [qty, setQty]    = useState('');
  const [err, setErr]    = useState('');

  const usedIds = new Set((product.rawMaterials || []).map(r => r.rawMaterialId));
  const available = allRMs.filter(r => !usedIds.has(r.id));

  const onAdd = async (e) => {
    e.preventDefault();
    if (!rmId || !qty) return;
    const res = await dispatch(addRawMaterial({
      productId: product.id,
      assoc: { rawMaterialId: Number(rmId), requiredQuantity: parseFloat(qty) },
    }));
    if (addRawMaterial.rejected.match(res)) { setErr(res.payload); return; }
    setRmId(''); setQty(''); setErr('');
  };

  const onRemove = (rawMaterialId) => {
    dispatch(removeRawMaterial({ productId: product.id, rawMaterialId }));
  };

  return (
    <div className="rm-panel">
      <h4>Matérias-Primas Utilizadas</h4>
      <Alert message={err} onClose={() => setErr('')} />

      {(product.rawMaterials || []).length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '.88rem' }}>Nenhuma associação cadastrada.</p>
      ) : (
        product.rawMaterials.map(rm => (
          <div key={rm.rawMaterialId} className="rm-list-item">
            <span><strong>{rm.rawMaterialName}</strong></span>
            <span>{rm.requiredQuantity} un. necessárias</span>
            <button className="btn btn-danger btn-sm" onClick={() => onRemove(rm.rawMaterialId)}>
              Remover
            </button>
          </div>
        ))
      )}

      {available.length > 0 && (
        <form onSubmit={onAdd} style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '.75rem' }}>
          <select value={rmId} onChange={e => setRmId(e.target.value)}
                  style={{ flex: '2', minWidth: '150px', padding: '.5rem', borderRadius: 'var(--radius)',
                           border: '1.5px solid var(--border)', fontSize: '.88rem' }} required>
            <option value="">Selecionar matéria-prima…</option>
            {available.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <input type="number" step="0.001" min="0.001" value={qty} onChange={e => setQty(e.target.value)}
                 placeholder="Qtd necessária" required
                 style={{ flex: '1', minWidth: '120px', padding: '.5rem', borderRadius: 'var(--radius)',
                          border: '1.5px solid var(--border)', fontSize: '.88rem' }} />
          <button type="submit" className="btn btn-success btn-sm">+ Associar</button>
        </form>
      )}
    </div>
  );
}
