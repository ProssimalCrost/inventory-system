import { describe, it, expect } from 'vitest';
import reducer, {
  selectProduct, clearError, fetchProducts, createProduct, deleteProduct,
} from '../store/slices/productsSlice';

const initialState = { items: [], loading: false, error: null, selected: null };

describe('productsSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '@@init' })).toEqual(initialState);
  });

  it('selectProduct sets selected', () => {
    const product = { id: 1, name: 'P1', value: 10 };
    const state   = reducer(initialState, selectProduct(product));
    expect(state.selected).toEqual(product);
  });

  it('clearError resets error', () => {
    const state = reducer({ ...initialState, error: 'Oops' }, clearError());
    expect(state.error).toBeNull();
  });

  it('fetchProducts.pending sets loading', () => {
    const state = reducer(initialState, { type: fetchProducts.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchProducts.fulfilled populates items', () => {
    const items = [{ id: 1, name: 'P1' }];
    const state = reducer(initialState, { type: fetchProducts.fulfilled.type, payload: items });
    expect(state.items).toEqual(items);
    expect(state.loading).toBe(false);
  });

  it('fetchProducts.rejected sets error', () => {
    const state = reducer(initialState, { type: fetchProducts.rejected.type, payload: 'Falhou' });
    expect(state.error).toBe('Falhou');
    expect(state.loading).toBe(false);
  });

  it('createProduct.fulfilled appends item', () => {
    const newP  = { id: 2, name: 'P2', value: 50 };
    const state = reducer(
      { ...initialState, items: [{ id: 1, name: 'P1' }] },
      { type: createProduct.fulfilled.type, payload: newP }
    );
    expect(state.items).toHaveLength(2);
    expect(state.items[1]).toEqual(newP);
  });

  it('deleteProduct.fulfilled removes item', () => {
    const state = reducer(
      { ...initialState, items: [{ id: 1 }, { id: 2 }], selected: { id: 1 } },
      { type: deleteProduct.fulfilled.type, payload: 1 }
    );
    expect(state.items).toHaveLength(1);
    expect(state.selected).toBeNull();
  });
});
