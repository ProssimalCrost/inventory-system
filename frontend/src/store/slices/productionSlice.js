import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productionService } from '../../services/rawMaterialService';

export const fetchSuggestions = createAsyncThunk('production/fetchSuggestions',
  async (_, { rejectWithValue }) => {
    try { return await productionService.getSuggestions(); }
    catch (e) { return rejectWithValue(e.message); }
  }
);

const productionSlice = createSlice({
  name: 'production',
  initialState: { suggestions: [], totalValue: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending,  (s)    => { s.loading = true;  s.error = null; })
      .addCase(fetchSuggestions.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchSuggestions.fulfilled,(s, { payload }) => {
        s.loading     = false;
        s.suggestions = payload.suggestions;
        s.totalValue  = payload.totalValue;
      });
  },
});

export default productionSlice.reducer;
