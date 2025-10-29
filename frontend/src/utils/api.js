import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('careerai_auth');
  if (authData) {
    try {
      const { token } = JSON.parse(authData);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      localStorage.removeItem('careerai_auth');
    }
  }
  config.withCredentials = true;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const original = error.config;
    
    // Handle network errors gracefully
    if (!error.response) {
      console.warn('Network error:', error.message);
      return Promise.reject(new Error('Network connection failed. Please check your internet connection.'));
    }
    
    if (status === 401 && !original._retry) {
      original._retry = true;
      
      // Only try refresh if we have auth data
      const authData = localStorage.getItem('careerai_auth');
      if (authData) {
        try {
          const { data } = await api.post('/auth/refresh', {});
          if (data?.token) {
            const auth = JSON.parse(authData);
            auth.token = data.token;
            localStorage.setItem('careerai_auth', JSON.stringify(auth));
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${data.token}`;
            return api.request(original);
          }
        } catch (refreshError) {
          console.warn('Token refresh failed:', refreshError.message);
          localStorage.removeItem('careerai_auth');
          // Only redirect to login if on protected routes
          const protectedRoutes = ['/dashboard', '/builder', '/analysis', '/settings', '/history', '/trends'];
          const currentPath = window.location.pathname;
          if (protectedRoutes.some(route => currentPath.startsWith(route))) {
            window.location.href = '/login';
          }
        }
      } else {
        // No auth data, only redirect protected routes to login
        const protectedRoutes = ['/dashboard', '/builder', '/analysis', '/settings', '/history', '/trends'];
        const currentPath = window.location.pathname;
        if (protectedRoutes.some(route => currentPath.startsWith(route))) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;