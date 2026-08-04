// Service Worker cENDOVASCULAR v2.19 — 04/08/2026
// Nome do cache versionado para substituir imediatamente a cópia anterior.
const CACHE_NAME = "cendovascular-cache-v2.19-2026-08-04";

const ASSETS_TO_CACHE = [
  "index.html",
  "manifest.json"
];

// Instala a nova versão buscando os arquivos diretamente da rede.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(
        ASSETS_TO_CACHE.map((asset) =>
          fetch(new Request(asset, { cache: "reload" }))
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Falha ao atualizar o cache: ${asset}`);
              }
              return cache.put(asset, response);
            })
        )
      ))
      .then(() => self.skipWaiting())
  );
});

// Remove caches antigos e passa a controlar as páginas abertas.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : undefined)
      ))
      .then(() => self.clients.claim())
  );
});

// Mantém o funcionamento offline, priorizando os arquivos da versão atual.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("index.html");
        }
      });
    })
  );
});
