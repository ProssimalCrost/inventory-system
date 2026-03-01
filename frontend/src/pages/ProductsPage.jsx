import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts, createProduct, updateProduct, deleteProduct,
  selectProduct, clearError,
} from '../store/slices/productsSlice';
import { fetchRawMaterials } from '../store/slices/rawMaterialsSlice';
import ProductForm from '../components/products/ProductForm';
import RawMaterialsPanel from '../components/products/RawMaterialsPanel';
import { Spinner, Alert, ConfirmDialog } from '../components/shared';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items, loading, error, selected } = useSelector(s => s.products);

  const [showForm,    setShowForm]    = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [deleting,    setDeleting]    = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const openCreate = () => { setEditing(null); setShowForm(true); };
  const openEdit   = (p) => { setEditing(p);   setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditing(null); };

  const onSave = async (data) => {
    const action = editing
      ? updateProduct({ id: editing.id, data })
      : createProduct(data);
    const res = await dispatch(action);
    if (!action.rejected?.match?.(res)) closeForm();
  };

  const onDelete = async () => {
    await dispatch(deleteProduct(deleting.id));
    setDeleting(null);
  };

  const onSelect = (p) => {
    dispatch(selectProduct(selected?.id === p.id ? null : p));
  };

  return (
    <div>
      <div className="page-header">
        <h1>Produtos</h1>
        <p>Gerencie os produtos fabricados e suas matérias-primas</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Lista de Produtos</h2>
          <button className="btn btn-primary" onClick={openCreate} data-cy="btn-new-product">
            + Novo Produto
          </button>
        </div>

        <Alert message={error} onClose={() => dispatch(clearError())} />

        {loading && <Spinner />}

        {!loading && items.length === 0 && (
          <div className="empty-state">
            <strong>Nenhum produto cadastrado</strong>
            <p>Clique em "Novo Produto" para começar.</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Valor</th>
                  <th>Insumos</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <>
                    <tr key={p.id} data-cy="product-row"
                        style={{ cursor: 'pointer', background: selected?.id === p.id ? '#eff6ff' : '' }}
                        onClick={() => onSelect(p)}>
                      <td>{p.id}</td>
                      <td><strong>{p.name}</strong></td>
                      <td>{fmt(p.value)}</td>
                      <td>
                        <span className="badge badge-blue">
                          {p.rawMaterials?.length || 0} insumo(s)
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                                data-cy="btn-edit-product">
                          Editar
                        </button>{' '}
                        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); setDeleting(p); }}
                                data-cy="btn-delete-product">
                          Excluir
                        </button>
                      </td>
                    </tr>
                    {selected?.id === p.id && (
                      <tr key={`panel-${p.id}`}>
                        <td colSpan={5} style={{ padding: '0 1rem 1rem' }}>
                          <RawMaterialsPanel product={selected} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm initial={editing} onSave={onSave} onClose={closeForm} loading={loading} />
      )}

      {deleting && (
        <ConfirmDialog
          message={`Deseja excluir o produto "${deleting.name}"?`}
          onConfirm={onDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
