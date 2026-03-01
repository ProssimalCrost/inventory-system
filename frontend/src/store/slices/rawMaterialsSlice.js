import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { rawMaterialService } from '../../services/rawMaterialService';

export const fetchRawMaterials = createAsyncThunk('rawMaterials/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await rawMaterialService.findAll(); }
    catch (e) { return rejectWithValue(e.message); }
  }
);
export const createRawMaterial = createAsyncThunk('rawMaterials/create',
  async (data, { rejectWithValue }) => {
    try { return await rawMaterialService.create(data); }
    catch (e) { return rejectWithValue(e.message); }
  }
);
export const updateRawMaterial = createAsyncThunk('rawMaterials/update',
  async ({ id, data }, { rejectWithValue }) => {
    try { return await rawMaterialService.update(id, data); }
    catch (e) { return rejectWithValue(e.message); }
  }
);
export const deleteRawMaterial = createAsyncThunk('rawMaterials/delete',
  async (id, { rejectWithValue }) => {
    try { await rawMaterialService.remove(id); return id; }
    catch (e) { return rejectWithValue(e.message); }
  }
);

const rawMaterialsSlice = createSlice({
  name: 'rawMaterials',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending  = (s)    => { s.loading = true;  s.error = null; };
    const rejected = (s, a) => { s.loading = false; s.error = a.payload; };
    builder
      .addCase(fetchRawMaterials.pending,   pending)
      .addCase(fetchRawMaterials.rejected,  rejected)
      .addCase(fetchRawMaterials.fulfilled, (s, { payload }) => { s.loading = false; s.items = payload; })
      .addCase(createRawMaterial.pending,   pending)
      .addCase(createRawMaterial.rejected,  rejected)
      .addCase(createRawMaterial.fulfilled, (s, { payload }) => { s.loading = false; s.items.push(payload); })
      .addCase(updateRawMaterial.pending,   pending)
      .addCase(updateRawMaterial.rejected,  rejected)
      .addCase(updateRawMaterial.fulfilled, (s, { payload }) => {
        s.loading = false;
        const idx = s.items.findIndex(r => r.id === payload.id);
        if (idx !== -1) s.items[idx] = payload;
      })
      .addCase(deleteRawMaterial.pending,   pending)
      .addCase(deleteRawMaterial.rejected,  rejected)
      .addCase(deleteRawMaterial.fulfilled, (s, { payload: id }) => {
        s.loading = false;
        s.items   = s.items.filter(r => r.id !== id);
      });
  },
});

export const { clearError: clearRawMaterialError } = rawMaterialsSlice.actions;
export default rawMaterialsSlice.reducer;
