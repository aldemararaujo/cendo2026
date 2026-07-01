// Nome do cache para controle de versao do aplicativo offline
const CACHE_NAME = "cendovascular-cache-v1";

// Arquivos essenciais que serao armazenados em cache para acesso offline
const ASSETS_TO_CACHE = [
  "index.html",
  "manifest.json"
];

// Evento de instalacao do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Arquivos armazenados em cache com sucesso para suporte offline");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Evento de ativacao do Service Worker, limpando caches antigos do dispositivo
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Removendo cache antigo do sistema:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Evento de busca de recursos (Fetch), priorizando o cache offline se necessario
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna a versao em cache se existir, caso contrario busca na rede de internet
      return cachedResponse || fetch(event.request).catch(() => {
        // Caso a conexao falhe inteiramente, redireciona para a pagina inicial em cache
        if (event.request.mode === "navigate") {
          return caches.match("index.html");
        }
      });
    })
  );
});
```
eof

Este arquivo é responsável por gerenciar todo o ciclo de vida offline do aplicativo do congresso, garantindo que a programação permaneça acessível aos participantes a qualquer momento.