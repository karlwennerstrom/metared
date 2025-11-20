import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Public API
export const publicAPI = {
  buscarPerfiles: (params) => api.get('/perfiles', { params }),
  obtenerFacets: () => api.get('/perfiles/facets'),
  obtenerPerfil: (codigo) => api.get(`/perfiles/${codigo}`),
  descargarPDF: (codigo) => api.get(`/perfiles/${codigo}/pdf`, { responseType: 'blob' })
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me')
};

// Admin API
export const adminAPI = {
  // Perfiles
  listarTodosPerfiles: (params) => api.get('/admin/perfiles', { params }),
  crearPerfil: (data) => api.post('/admin/perfiles', data),
  actualizarPerfil: (id, data) => api.put(`/admin/perfiles/${id}`, data),
  eliminarPerfil: (id) => api.delete(`/admin/perfiles/${id}`),
  togglePublicado: (id) => api.patch(`/admin/perfiles/${id}/toggle-publicado`),

  // Usuarios
  listarUsuarios: () => api.get('/admin/usuarios'),
  crearUsuario: (data) => api.post('/admin/usuarios', data),
  actualizarUsuario: (id, data) => api.put(`/admin/usuarios/${id}`, data),
  eliminarUsuario: (id) => api.delete(`/admin/usuarios/${id}`)
};

export default api;
