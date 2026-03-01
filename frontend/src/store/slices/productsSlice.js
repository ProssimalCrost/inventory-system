import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

// ── Thunks ───────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await productService.findAll(); }
    catch (e) { return rejectWithValue(e.message); }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (data, { rejectWithValue }) => {
    try { return await productService.create(data); }
    catch (e) { return rejectWithValue(e.message); }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }, { rejectWithValue }) => {
    try { return await productService.update(id, data); }
    catch (e) { return rejectWithValue(e.message); }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try { await productService.remove(id); return id; }
    catch (e) { return rejectWithValue(e.message); }
  }
);

export const addRawMaterial = createAsyncThunk(
  'products/addRawMaterial',
  async ({ productId, assoc }, { rejectWithValue }) => {
    try { return await productService.addRawMaterial(productId, assoc); }
    catch (e) { return rejectWithValue(e.message); }
  }
);

export const removeRawMaterial = createAsyncThunk(
  'products/removeRawMaterial',
  async ({ productId, rawMaterialId }, { rejectWithValue }) => {
    try {
      await productService.removeRawMaterial(productId, rawMaterialId);
      return { productId, rawMaterialId };
    } catch (e) { return rejectWithValue(e.message); }
  }
);

// ── Slice ─────────────────────────────────────────────────────

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items:    [],
    loading:  false,
    error:    null,
    selected: null,
  },
  reducers: {
    selectProduct: (state, action) => { state.selected = action.payload; },
    clearError:    (state)         => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending  = (state)         => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchProducts.pending,  pending)
      .addCase(fetchProducts.rejected, rejected)
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items   = payload;
      })
      .addCase(createProduct.pending,  pending)
      .addCase(createProduct.rejected, rejected)
      .addCase(createProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items.push(payload);
      })
      .addCase(updateProduct.pending,  pending)
      .addCase(updateProduct.rejected, rejected)
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.items.findIndex(p => p.id === payload.id);
        if (idx !== -1) state.items[idx] = payload;
        if (state.selected?.id === payload.id) state.selected = payload;
      })
      .addCase(deleteProduct.pending,  pending)
      .addCase(deleteProduct.rejected, rejected)
      .addCase(deleteProduct.fulfilled, (state, { payload: id }) => {
        state.loading = false;
        state.items   = state.items.filter(p => p.id !== id);
        if (state.selected?.id === id) state.selected = null;
      })
      .addCase(addRawMaterial.fulfilled, (state, { payload }) => {
        const idx = state.items.findIndex(p => p.id === payload.id);
        if (idx !== -1) state.items[idx] = payload;
        if (state.selected?.id === payload.id) state.selected = payload;
      })
      .addCase(removeRawMaterial.fulfilled, (state, { payload: { productId, rawMaterialId } }) => {
        const product = state.items.find(p => p.id === productId);
        if (product) {
          product.rawMaterials = product.rawMaterials.filter(
            rm => rm.rawMaterialId !== rawMaterialId
          );
        }
        if (state.selected?.id === productId && state.selected.rawMaterials) {
          state.selected.rawMaterials = state.selected.rawMaterials.filter(
            rm => rm.rawMaterialId !== rawMaterialId
          );
        }
      });
  },
});

export const { selectProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;
