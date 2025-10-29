const CACHE_NAME = 'careerai-v1';
const STATIC_CACHE = 'careerai-static-v1';
const API_CACHE = 'careerai-api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/brand.png'
];

const API_ENDPOINTS = [
  '/api/user/dashboard',
  '/api/resume/list',
  '/api/health'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE)
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Handle static assets
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'image') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
});

// API request handler - network first, cache fallback
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful GET requests
    if (request.method === 'GET' && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Add header to indicate cached response
      const response = cachedResponse.clone();
      response.headers.set('X-Served-By', 'ServiceWorker');
      return response;
    }
    
    // Return offline response for critical endpoints
    if (request.url.includes('/user/dashboard')) {
      return new Response(JSON.stringify({
        resumesCount: 0,
        averageATSScore: 0,
        lastAnalysisDate: null,
        offline: true
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (request.url.includes('/resume/list')) {
      return new Response(JSON.stringify({
        resumes: [],
        offline: true
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// Static request handler - cache first, network fallback
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // For navigation requests, return cached index.html
    if (request.destination === 'document') {
      const indexResponse = await cache.match('/index.html');
      if (indexResponse) {
        return indexResponse;
      }
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Process queued offline actions
  const cache = await caches.open(API_CACHE);
  const offlineActions = await getOfflineActions();
  
  for (const action of offlineActions) {
    try {
      await fetch(action.url, action.options);
      removeOfflineAction(action.id);
    } catch (error) {
      console.log('Background sync failed for action:', action.id);
    }
  }
}

// Helper functions for offline action queue
function getOfflineActions() {
  return new Promise((resolve) => {
    // In a real implementation, you'd retrieve from IndexedDB
    resolve([]);
  });
}

function removeOfflineAction(id) {
  // In a real implementation, you'd remove from IndexedDB
  console.log('Removing offline action:', id);
}