// O escopo dos service workers é definido pelo diretório onde o arquivo se encontra
var cacheName = 'tutorial-PWA';
// Definindo arquivos que serão cacheados
var filesToCache = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

// Quando realizar a instalação do service-worker
self.addEventListener('install', function(e){
  console.log('[ServiceWorker] Install');
  /* waitUntil()informa ao navegador que o trabalho está em andamento até que a promessa 
    seja resolvida e ele não deve encerrar o trabalhador de serviço se desejar que o trabalho seja concluído */
  e.waitUntil(
    // Abrindo o cache passando o nome por parâmetro e esperando uma promisse
    caches.open(cacheName)
      .then(function(cache){
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(filesToCache); // O método addAll () da interface Cache usa uma matriz de URLs
      })
  )
})

/* Este código garante que o service worker atualize seu cache sempre 
que qualquer um dos arquivos do shell do aplicativo mudar. */
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList){
      return Promise.all(keyList.map(function(key){
        if(key !== cacheName){
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }))
    })
  )
  return self.clients.claim();
});

self.addEventListener("fetch", function(e){
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    // O caches.match() avalia a solicitação da Web que acionou o evento de busca e verifica se ele está disponível no cache
    caches.match(e.request).then(function(response){
      return response || fetch(e.request);
    })
  )
})


/* Quando a caixa Update on Reload no painel Service Worker do DevTools está ativada, 
  o service worker é forçosamente atualizado toda vez que a página recarrega.
*/