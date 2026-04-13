const CACHE_NAME = 'caixa-ssvp-v300BB';
const urlsToCache = [
  './',
  './index.html',
  './caixa.html',
  './contador.html',
  './contador-parcial.html',
  './css/base.css',
  './css/layout.css',
  './css/contador.css',
  './css/contador-parcial.css',
  './js/script.js',
  './js/contador.js',
  './js/contador-parcial.js',
  './assets/icons/favicon.ico',
  './assets/icons/logo-ssvp-global.png',
  './assets/icons/logo-ssvp-transparente-st_192x192.png',
  './assets/icons/logo-ssvp-transparente-st.png',
  './manifest.json'
];

// Instalação do Service Worker e Cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Estratégia de busca: Tenta a rede, se falhar, usa o cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(response => {
        return response || caches.match('./index.html'); // Fallback para a home se tudo falhar
      });
    })
  );
});