import axios from 'axios';

class APIManager {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
      timeout: 30000,
    });
    
    this.setupInterceptors();
    this.offlineQueue = [];
    this.isOnline = navigator.onLine;
    this.setupOfflineHandling();
  }
  
  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use((config) => {
      const auth = this.getAuth();
      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
      config.withCredentials = true;
      return config;
    });
    
    // Response interceptor with retry logic
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;
        
        // Handle network errors
        if (!error.response) {
          if (!this.isOnline) {
            return this.handleOfflineRequest(original);
          }
          throw new Error('Network error. Please check your connection.');
        }
        
        // Handle 401 with token refresh
        if (error.response.status === 401 && !original._retry) {
          original._retry = true;
          try {
            const { data } = await this.api.post('/auth/refresh');
            if (data?.token) {
              this.saveAuth(data.token, data.user);
              original.headers.Authorization = `Bearer ${data.token}`;
              return this.api.request(original);
            }
          } catch {
            this.clearAuth();
            window.location.href = '/login';
          }
        }
        
        // Handle rate limiting
        if (error.response.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 1;
          await this.delay(retryAfter * 1000);
          return this.api.request(original);
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  setupOfflineHandling() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processOfflineQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  handleOfflineRequest(config) {
    return new Promise((resolve, reject) => {
      this.offlineQueue.push({ config, resolve, reject });
      
      // Try to serve from cache if it's a GET request
      if (config.method === 'get') {
        const cached = this.getFromCache(config.url);
        if (cached) {
          resolve({ data: cached, fromCache: true });
          return;
        }
      }
      
      reject(new Error('You are offline. Request queued for when connection returns.'));
    });
  }
  
  processOfflineQueue() {
    while (this.offlineQueue.length > 0) {
      const { config, resolve, reject } = this.offlineQueue.shift();
      this.api.request(config).then(resolve).catch(reject);
    }
  }
  
  // Enhanced request methods with caching
  async get(url, config = {}) {
    try {
      const response = await this.api.get(url, config);
      this.saveToCache(url, response.data);
      return response;
    } catch (error) {
      // Try cache on error
      const cached = this.getFromCache(url);
      if (cached) {
        return { data: cached, fromCache: true };
      }
      throw error;
    }
  }
  
  async post(url, data, config = {}) {
    return this.api.post(url, data, config);
  }
  
  async put(url, data, config = {}) {
    return this.api.put(url, data, config);
  }
  
  async delete(url, config = {}) {
    return this.api.delete(url, config);
  }
  
  // Cache management
  saveToCache(key, data) {
    try {
      const cache = JSON.parse(localStorage.getItem('api_cache') || '{}');
      cache[key] = { data, timestamp: Date.now() };
      localStorage.setItem('api_cache', JSON.stringify(cache));
    } catch (e) {
      console.warn('Cache save failed:', e);
    }
  }
  
  getFromCache(key) {
    try {
      const cache = JSON.parse(localStorage.getItem('api_cache') || '{}');
      const item = cache[key];
      if (item && Date.now() - item.timestamp < 300000) { // 5 minutes
        return item.data;
      }
    } catch (e) {
      console.warn('Cache read failed:', e);
    }
    return null;
  }
  
  // Auth helpers
  getAuth() {
    try {
      const data = localStorage.getItem('careerai_auth');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
  
  saveAuth(token, user) {
    const authData = { token, user, timestamp: Date.now() };
    localStorage.setItem('careerai_auth', JSON.stringify(authData));
  }
  
  clearAuth() {
    localStorage.removeItem('careerai_auth');
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new APIManager();