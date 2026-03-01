import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuggestions } from '../store/slices/productionSlice';
import { Spinner, Alert } from '../components/shared';

export default function ProductionPage() {
  const dispatch = useDispatch();
  const { suggestions, totalValue, loading, error } = useSelector(s => s.production);

  useEffect(() => { dispatch(fetchSuggestions()); }, [dispatch]);

  const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div>
      <div className="page-header">
        <h1>Sugestão de Produção</h1>
        <p>Produtos que podem ser produzidos com o estoque atual, priorizados pelo maior valor</p>
      </div>

      {loading && <Spinner />}
      {!loading && error && <Alert message={error} />}

      {!loading && !error && (
        <>
          <div className="production-summary" data-cy="production-summary">
            <div>
              <div className="label">Valor Total Estimado da Produção</div>
              <div className="value">{fmt(totalValue)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label">Produtos sugeridos</div>
              <div className="value">{suggestions.length}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Produtos a Produzir</h2>
              <button className="btn btn-outline" onClick={() => dispatch(fetchSuggestions())}>
                ↻ Atualizar
              </button>
            </div>

            {suggestions.length === 0 ? (
              <div className="empty-state">
                <strong>Sem sugestões no momento</strong>
                <p>O estoque atual não permite produzir nenhum produto completo.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Prioridade</th>
                      <th>Produto</th>
                      <th>Valor Unit.</th>
                      <th>Qtd. Possível</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suggestions.map((s, i) => (
                      <tr key={s.productId} data-cy="suggestion-row">
                        <td>
                          <span className="badge badge-blue">#{i + 1}</span>
                        </td>
                        <td><strong>{s.productName}</strong></td>
                        <td>{fmt(s.productValue)}</td>
                        <td>
                          <span className="badge badge-green">{s.producibleQuantity} un.</span>
                        </td>
                        <td><strong>{fmt(s.subtotal)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
