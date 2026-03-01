import api from './api';

export const rawMaterialService = {
  findAll:  ()         => api.get('/raw-materials').then(r => r.data),
  findById: (id)       => api.get(`/raw-materials/${id}`).then(r => r.data),
  create:   (data)     => api.post('/raw-materials', data).then(r => r.data),
  update:   (id, data) => api.put(`/raw-materials/${id}`, data).then(r => r.data),
  remove:   (id)       => api.delete(`/raw-materials/${id}`),
};

export const productionService = {
  getSuggestions: () => api.get('/production/suggestions').then(r => r.data),
};
