
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('az900-store').then(function(cache) {
      return cache.addAll([
        '/Learn_azure900-pwa/index.html',
        '/Learn_azure900-pwa/test.html',
        '/Learn_azure900-pwa/learn.html',
        '/Learn_azure900-pwa/progress.html',
        '/Learn_azure900-pwa/test.js',
        '/Learn_azure900-pwa/learn.js',
        '/Learn_azure900-pwa/progress.js',
        '/Learn_azure900-pwa/questions.json',
        '/Learn_azure900-pwa/manifest.json',
        '/Learn_azure900-pwa/icon.png',
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
