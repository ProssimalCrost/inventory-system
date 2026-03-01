import api from './api';

const BASE = '/products';

export const productService = {
  findAll:          ()              => api.get(BASE).then(r => r.data),
  findById:         (id)            => api.get(`${BASE}/${id}`).then(r => r.data),
  create:           (data)          => api.post(BASE, data).then(r => r.data),
  update:           (id, data)      => api.put(`${BASE}/${id}`, data).then(r => r.data),
  remove:           (id)            => api.delete(`${BASE}/${id}`),
  addRawMaterial:   (id, assoc)     => api.post(`${BASE}/${id}/raw-materials`, assoc).then(r => r.data),
  removeRawMaterial:(id, rmId)      => api.delete(`${BASE}/${id}/raw-materials/${rmId}`),
};
