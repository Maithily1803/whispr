const CACHE_NAME = "voice-assistant-v1";
const PRECACHE_URLS = [


    '/', 
  '/manifest.json',
  '/wasm/whisper.wasm',
  '/wasm/libmain.js',
  '/workers/whisper.worker.js',
];

// INSTALL: Precache required assets
self.addEventListener("install", (event) => {
  console.log("[SW] Install");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching assets:", PRECACHE_URLS);
      return cache.addAll(PRECACHE_URLS);
    })
  );

  self.skipWaiting(); // Activate SW immediately
});

// ACTIVATE: Remove old cache versions
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// FETCH: Serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  // Skip OpenAI calls (never cached)
  if (request.url.includes("api.openai.com")) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Cache future requests
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch((err) => {
          console.warn("[SW] Offline or not cached:", request.url);
          return;
        });
    })
  );
});

// Optional: Listen for skipWaiting
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
